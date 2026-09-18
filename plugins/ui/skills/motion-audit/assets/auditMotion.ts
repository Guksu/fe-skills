/**
 * motion-audit 코어 — CSS·TSX·JS 소스 텍스트를 훑어 모션 규칙 위반을 `file:line`으로 찾는다 (의존성 0, DOM 없음).
 *
 * 왜 스크립트인가: "애니메이션이 괜찮은가"는 눈으로 보면 주관이 섞이지만, 아래 규칙들은 텍스트만으로
 * 결정적으로 판정된다. 에이전트가 파일을 하나씩 읽어 판단하는 것보다 빠르고 빠뜨리지 않는다.
 * 브라우저에서도 같은 함수를 쓴다(데모가 붙여 넣은 CSS를 즉시 검사).
 *
 * 규칙 (id — 심각도 — 무엇을 잡는가):
 *  layout-animation   error — transition/animation 대상이 width·height·top·left·margin·padding 등 레이아웃 속성
 *  transition-all     error — transition: all (의도치 않은 속성까지 움직이고, 레이아웃 속성이 섞인다)
 *  no-reduced-motion  error — 움직임이 있는 파일에 prefers-reduced-motion 블록이 없다
 *  duration-range     warn  — transition 시간이 60ms 미만(안 보임)이거나 700ms 초과(기다림). animation은 반복용이라 상한만 2000ms
 *  linear-movement    warn  — transform/translate 이동에 linear 이징 (기계적으로 보인다. 진행률·스피너에만)
 *  ease-in-exit       warn  — 퇴장/닫힘 상태(exiting·closing·leave·out·hide)에 ease-in (첫 순간이 늦어 굼뜨다)
 *  infinite-loop      warn  — 무한 반복 애니메이션. reduced-motion에서 멈추거나 느려지는지 확인
 *  js-interval-anim   warn  — setInterval로 style을 갱신 (프레임과 어긋난다. requestAnimationFrame 또는 CSS)
 *  will-change-global warn  — will-change가 상시 선언 (메모리를 잡아 둔다. 움직이기 직전에만)
 *
 * 의도적 예외: 그 줄(또는 바로 앞 줄)에 `motion-audit-ignore: {규칙} — {이유}` 주석을 두면 그 줄의 지적을 건너뛴다.
 * 예외에는 반드시 이유를 적는다 — 다음 사람이 규칙을 되살릴지 판단할 근거다.
 */

export type Severity = 'error' | 'warn'

export type Finding = {
  file: string
  line: number
  rule: string
  severity: Severity
  message: string
  /** 어떤 스킬·기법으로 고치는가 */
  fix: string
}

type Source = { file: string; text: string }

const LAYOUT_PROPS = ['width', 'height', 'top', 'left', 'right', 'bottom', 'margin', 'padding', 'border-width', 'font-size', 'line-height', 'inset', 'max-height', 'min-height', 'gap']
const LAYOUT_RE = new RegExp(`(^|[\\s,])(${LAYOUT_PROPS.map((p) => p.replace('-', '\\-')).join('|')})(?=\\s|$|,)`, 'i')
const MOTION_HINT = /transition|animation|@keyframes/i
const EXIT_STATE = /exit|closing|closed|leave|hide|hidden|out\b|dismiss|collaps/i

const isCss = (file: string) => /\.(css|scss|less|vue|svelte)$/i.test(file)
const isScript = (file: string) => /\.(tsx?|jsx?|mjs|cjs|vue|svelte)$/i.test(file)

/** `transition: transform 250ms ease, opacity 250ms` → 각 항목의 속성·시간·이징 */
const parseTransition = (value: string) =>
  value
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const tokens = part.split(/\s+/)
      const prop = tokens[0]
      const durations = tokens.filter((t) => /^[\d.]+m?s$/i.test(t)).map(toMs)
      const easing = tokens.find((t) => /^(linear|ease|ease-in|ease-out|ease-in-out|cubic-bezier|steps)/i.test(t)) ?? ''
      return { prop, durationMs: durations[0], easing }
    })

const toMs = (t: string) => (/ms$/i.test(t) ? parseFloat(t) : parseFloat(t) * 1000)

/** 선택자 블록 단위로 잘라 (선택자, 본문, 시작 줄). 글자 단위로 중괄호를 세므로 한 줄 블록도 잡는다.
 * @media·@supports는 선택자 앞에 붙여 표시하고, 그 안에 prefers-reduced-motion이 있으면 inReducedMotion */
const cssBlocks = (text: string) => {
  // 주석은 같은 길이의 공백으로 바꿔 줄 번호를 보존한다
  const src = blankComments(text)
  const blocks: Array<{ selector: string; body: string; line: number; inReducedMotion: boolean }> = []
  const stack: Array<{ selector: string; bodyStart: number; isGroup: boolean }> = []
  let selectorStart = 0
  for (let i = 0; i < src.length; i += 1) {
    const ch = src[i]
    if (ch === '{') {
      const selector = src.slice(selectorStart, i).trim()
      stack.push({ selector, bodyStart: i + 1, isGroup: /^@(media|supports|container|layer)/i.test(selector) })
      selectorStart = i + 1
    } else if (ch === '}') {
      const top = stack.pop()
      selectorStart = i + 1
      if (!top || top.isGroup) continue
      const groups = stack.filter((s) => s.isGroup).map((s) => s.selector)
      blocks.push({
        selector: [...groups, top.selector].join(' '),
        body: src.slice(top.bodyStart, i),
        line: lineOf(src, top.bodyStart),
        inReducedMotion: groups.some((g) => /prefers-reduced-motion\s*:\s*reduce/.test(g)),
      })
    } else if (ch === ';' && stack.length === 0) {
      selectorStart = i + 1 // 최상위 @import 같은 한 줄 규칙
    }
  }
  return blocks
}

const lineOf = (text: string, index: number) => text.slice(0, index).split('\n').length

/** 주석을 공백으로 지우되 줄바꿈은 남긴다 — 줄 번호가 어긋나면 file:line이 거짓말을 한다 */
const blankComments = (text: string) => text.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '))

export const auditMotion = (sources: Source[]): Finding[] => {
  const findings: Finding[] = []
  const push = (f: Omit<Finding, 'file'> & { file: string }) => findings.push(f)

  for (const { file, text } of sources) {
    if (isCss(file)) auditCss({ file, text, push })
    if (isScript(file)) auditScript({ file, text, push })
  }
  return findings.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line)
}

/** `motion-audit-ignore` 주석이 있는 줄과 그 다음 줄 — 이유를 적은 의도적 예외. 검사에서 뺀다 */
const ignoredLines = (text: string) => {
  const set = new Set<number>()
  text.split('\n').forEach((line, i) => {
    if (/motion-audit-ignore/.test(line)) {
      set.add(i + 1)
      set.add(i + 2)
    }
  })
  return set
}

const auditCss = ({ file, text, push: rawPush }: Source & { push: (f: Finding) => void }) => {
  const ignored = ignoredLines(text)
  const push = (f: Finding) => {
    if (!ignored.has(f.line)) rawPush(f)
  }
  // 주석 속 단어("transition을 두지 않는다")에 속지 않게 주석을 지운 본문으로 판단한다
  const code = blankComments(text)
  const hasMotion = MOTION_HINT.test(code)
  if (!hasMotion) return
  const blocks = cssBlocks(text)
  // reduced-motion 블록이 animation을 다루면(none·느리게) 무한 반복은 이미 처리된 것이다
  const reducedHandlesAnimation = blocks.some((b) => b.inReducedMotion && /animation/i.test(b.body))
  if (!/prefers-reduced-motion/.test(code)) {
    push({
      file,
      line: lineOf(code, code.search(MOTION_HINT)),
      rule: 'no-reduced-motion',
      severity: 'error',
      message: '움직임이 있는데 prefers-reduced-motion 블록이 없다',
      fix: '@media (prefers-reduced-motion: reduce) { … } 에서 이동·확대를 끄고 페이드만 남긴다 (모든 fe-ui 스킬 CSS 하단 블록 참고)',
    })
  }

  for (const block of blocks) {
    const decls = block.body.split(';').map((d) => d.trim()).filter(Boolean)
    let offset = 0
    for (const decl of decls) {
      const at = block.body.indexOf(decl, offset)
      offset = at + decl.length
      const line = block.line + block.body.slice(0, at).split('\n').length - 1
      const [rawProp, ...rest] = decl.split(':')
      const prop = rawProp.trim().toLowerCase()
      const value = rest.join(':').trim()
      if (!value) continue

      if (prop === 'transition' || prop === 'transition-property') {
        for (const item of parseTransition(value)) {
          if (item.prop === 'all') {
            push({ file, line, rule: 'transition-all', severity: 'error', message: 'transition: all — 어떤 속성이 움직일지 정하지 않았다', fix: 'transform·opacity 등 움직일 속성을 이름으로 나열한다' })
            continue
          }
          if (LAYOUT_RE.test(item.prop)) {
            push({ file, line, rule: 'layout-animation', severity: 'error', message: `${item.prop}를 transition — 매 프레임 레이아웃이 돈다`, fix: layoutFix(item.prop) })
          }
          // 0ms는 "전이 없음"의 관용 표현(visibility 지연 등)이라 범위 검사에서 뺀다
          if (item.durationMs != null && item.durationMs !== 0 && !block.inReducedMotion && (item.durationMs < 60 || item.durationMs > 700)) {
            push({ file, line, rule: 'duration-range', severity: 'warn', message: `transition ${item.durationMs}ms — 60~700ms 밖 (motion-principles: 100~420ms)`, fix: '작은 요소 150ms, 컴포넌트 250ms, 화면 크기 350ms, 페이지 420ms (motion-principles 토큰)' })
          }
          if (/^linear$/i.test(item.easing) && /transform|translate|scale|rotate/.test(item.prop)) {
            push({ file, line, rule: 'linear-movement', severity: 'warn', message: `${item.prop} 이동에 linear 이징 — 기계적으로 보인다`, fix: '들어오는 이동은 ease-out(cubic-bezier(0.22, 1, 0.36, 1)). linear는 진행률·스피너에만' })
          }
          if (/^ease-in$|cubic-bezier\(\s*0\.[4-9]/i.test(item.easing) && EXIT_STATE.test(block.selector) && !/ease-in-out/i.test(item.easing)) {
            push({ file, line, rule: 'ease-in-exit', severity: 'warn', message: '퇴장 상태에 ease-in — 첫 순간이 늦어 굼뜨게 느껴진다', fix: '퇴장도 ease-out, 시간은 진입의 3/4' })
          }
        }
      }

      if (prop === 'animation' || prop === 'animation-iteration-count') {
        if (/\binfinite\b/i.test(value) && !block.inReducedMotion && !reducedHandlesAnimation) {
          push({ file, line, rule: 'infinite-loop', severity: 'warn', message: '무한 반복 애니메이션', fix: 'reduced-motion에서 animation을 멈추거나 느린 페이드로 바꾼다 (skeleton 스킬의 맥동 완화 참고)' })
        }
        const dur = value.match(/(?:^|\s)([\d.]+m?s)(?=\s|$)/)?.[1]
        if (prop === 'animation' && dur && !block.inReducedMotion && toMs(dur) > 2000 && !/infinite/i.test(value)) {
          push({ file, line, rule: 'duration-range', severity: 'warn', message: `animation ${toMs(dur)}ms — 2초를 넘는 단발 애니메이션`, fix: '단발 연출은 700ms 안에. 길게 보여야 하면 사용자가 멈출 수 있게' })
        }
      }

      if (prop === 'will-change' && !/auto/i.test(value) && !/:hover|:active|:focus|\[data-/.test(block.selector)) {
        push({ file, line, rule: 'will-change-global', severity: 'warn', message: 'will-change 상시 선언 — GPU 레이어를 계속 잡아 둔다', fix: '움직이기 직전 상태(:hover·[data-state])에서만 선언하거나 제거' })
      }
    }
  }

  // @keyframes 안의 레이아웃 속성
  const kf = /@keyframes[^{]*\{([\s\S]*?)\}\s*\}/g
  let m: RegExpExecArray | null
  while ((m = kf.exec(text))) {
    const body = m[1]
    const inner = /([a-z-]+)\s*:/gi
    const reported = new Set<string>() // 같은 속성은 keyframes 블록당 한 번만
    let d: RegExpExecArray | null
    while ((d = inner.exec(body))) {
      const p = d[1].toLowerCase()
      if (LAYOUT_PROPS.includes(p) && !reported.has(p)) {
        reported.add(p)
        push({ file, line: lineOf(text, m.index + d.index), rule: 'layout-animation', severity: 'error', message: `@keyframes에서 ${p} 변경 — 매 프레임 레이아웃이 돈다`, fix: layoutFix(p) })
      }
    }
  }
}

const layoutFix = (prop: string) => {
  if (/height|max-height|min-height/.test(prop)) return '높이 변화는 grid-template-rows: 0fr→1fr (accordion 스킬) 또는 transform: scaleY'
  if (/width/.test(prop)) return '폭 변화는 transform: scaleX + transform-origin (tab-indicator 스킬)'
  if (/top|left|right|bottom|inset|margin/.test(prop)) return '위치 이동은 transform: translate (flip-list의 FLIP 기법)'
  if (/padding|gap/.test(prop)) return '간격 변화는 안쪽 요소의 transform으로'
  if (/font-size|line-height/.test(prop)) return '글자 크기는 transform: scale (floating-label 스킬)'
  return 'transform·opacity로 바꾼다'
}

const auditScript = ({ file, text, push }: Source & { push: (f: Finding) => void }) => {
  const interval = /setInterval\s*\(/g
  let m: RegExpExecArray | null
  while ((m = interval.exec(text))) {
    const window = text.slice(m.index, m.index + 400)
    if (/\.style\.|transform|opacity|scrollTop|scrollLeft/.test(window)) {
      push({ file, line: lineOf(text, m.index), rule: 'js-interval-anim', severity: 'warn', message: 'setInterval로 스타일을 갱신 — 프레임과 어긋나 끊긴다', fix: 'requestAnimationFrame 루프(count-up·spring-physics 코어) 또는 CSS transition' })
    }
  }
  // 인라인 스타일로 레이아웃 속성을 애니메이션(프레임 루프 안에서 top/left/width/height 갱신)
  const layoutWrite = /\.style\.(top|left|width|height|marginLeft|marginTop)\s*=/g
  while ((m = layoutWrite.exec(text))) {
    const before = text.slice(Math.max(0, m.index - 600), m.index)
    if (/requestAnimationFrame|setInterval|onUpdate|tick/.test(before)) {
      push({ file, line: lineOf(text, m.index), rule: 'layout-animation', severity: 'error', message: `프레임 루프에서 style.${m[1]} 갱신 — 매 프레임 레이아웃이 돈다`, fix: 'style.transform = translate()/scale()로 바꾼다' })
    }
  }
}

/** 결과를 `file:line rule message` 줄로 — 에이전트가 그대로 읽고 고칠 수 있는 형식 */
export const formatFindings = (findings: Finding[]) =>
  findings.map((f) => `${f.file}:${f.line} [${f.severity}] ${f.rule} — ${f.message}\n    → ${f.fix}`).join('\n')

export const summarize = (findings: Finding[]) => ({
  errors: findings.filter((f) => f.severity === 'error').length,
  warnings: findings.filter((f) => f.severity === 'warn').length,
})
