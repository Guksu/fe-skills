import { auditMotion, formatFindings, summarize } from '@skills/motion-audit/assets/auditMotion'

const rules = (findings: ReturnType<typeof auditMotion>) => findings.map((f) => f.rule)

describe('auditMotion — CSS 규칙', () => {
  it('레이아웃 속성 transition을 error로 잡고 줄 번호와 대안 스킬을 준다', () => {
    const text = `.box {\n  color: red;\n  transition: height 300ms ease, opacity 300ms;\n}\n@media (prefers-reduced-motion: reduce) { .box { transition: none; } }`
    const findings = auditMotion([{ file: 'a.css', text }])
    expect(rules(findings)).toEqual(['layout-animation'])
    expect(findings[0].line).toBe(3)
    expect(findings[0].severity).toBe('error')
    expect(findings[0].fix).toContain('accordion')
  })

  it('여러 줄 주석 뒤에서도 줄 번호가 맞는다', () => {
    const text = `/* 머리 주석\n * 둘째 줄\n * 셋째 줄 */\n.a {\n  color: red;\n  transition: top 200ms;\n}\n@media (prefers-reduced-motion: reduce) { .a { transition: none } }`
    const findings = auditMotion([{ file: 'm.css', text }])
    expect(findings.map((f) => [f.rule, f.line])).toEqual([['layout-animation', 6]])
  })

  it('transition: all 과 @keyframes 안의 width를 잡는다', () => {
    const text = `.a { transition: all 200ms; }\n@keyframes grow { from { width: 0 } to { width: 100px } }\n@media (prefers-reduced-motion: reduce) { .a { transition: none } }`
    const findings = auditMotion([{ file: 'b.css', text }])
    expect(rules(findings)).toEqual(['transition-all', 'layout-animation'])
    expect(findings[1].line).toBe(2)
  })

  it('움직임이 있는데 reduced-motion 블록이 없으면 error, 없는 파일은 조용하다', () => {
    const moving = auditMotion([{ file: 'c.css', text: `.x { transition: opacity 200ms; }` }])
    expect(rules(moving)).toEqual(['no-reduced-motion'])
    const still = auditMotion([{ file: 'd.css', text: `.x { color: red; }` }])
    expect(still).toEqual([])
  })

  it('시간 범위 — 60ms 미만·700ms 초과는 warn, reduced-motion 블록 안의 1ms는 제외', () => {
    const text = `.a { transition: opacity 30ms; }\n.b { transition: transform 900ms ease-out; }\n.c { transition: transform 250ms ease-out; }\n@media (prefers-reduced-motion: reduce) { .a { transition: opacity 1ms; } }`
    const findings = auditMotion([{ file: 'e.css', text }])
    expect(rules(findings)).toEqual(['duration-range', 'duration-range'])
    expect(findings.map((f) => f.line)).toEqual([1, 2])
  })

  it('이동에 linear, 퇴장 상태에 ease-in을 warn으로 잡는다', () => {
    const text = `.card { transition: transform 250ms linear; }\n.card[data-state='exiting'] { transition: opacity 200ms ease-in; }\n.bar { transition: width 1s linear; }\n@media (prefers-reduced-motion: reduce) { .card { transition: none } }`
    const findings = auditMotion([{ file: 'f.css', text }])
    expect(rules(findings)).toEqual(['linear-movement', 'ease-in-exit', 'layout-animation', 'duration-range'])
  })

  it('무한 반복과 상시 will-change를 warn으로 잡는다', () => {
    const text = `.spin { animation: spin 1s linear infinite; will-change: transform; }\n.btn:hover { will-change: transform; }\n@media (prefers-reduced-motion: reduce) { .btn { transition: none } }`
    const findings = auditMotion([{ file: 'g.css', text }])
    expect(rules(findings)).toEqual(['infinite-loop', 'will-change-global'])
  })
})

describe('auditMotion — 예외와 관용 표현', () => {
  it('motion-audit-ignore 주석이 있는 줄(또는 다음 줄)의 지적은 건너뛴다', () => {
    const text = `.thumb {\n  /* motion-audit-ignore: layout-animation — absolute라 자기만 레이아웃 */\n  transition: width 200ms ease-out;\n  will-change: transform; /* motion-audit-ignore: will-change-global — 계속 끌리는 요소 */\n}\n@media (prefers-reduced-motion: reduce) { .thumb { transition: none } }`
    expect(auditMotion([{ file: 'i.css', text }])).toEqual([])
  })

  it('0ms 전이·주석 속 단어·reduced-motion이 다루는 무한 반복은 지적하지 않는다', () => {
    const zero = auditMotion([{ file: 'j.css', text: `.t { transition: visibility 0s 200ms, opacity 200ms; }\n@media (prefers-reduced-motion: reduce) { .t { transition: none } }` }])
    expect(zero).toEqual([])
    const commentOnly = auditMotion([{ file: 'k.css', text: `/* transition을 두지 않는다 — rAF가 쓴다 */\n.bar { transform: scaleX(0); }` }])
    expect(commentOnly).toEqual([])
    const handled = auditMotion([{ file: 'l.css', text: `.spin { animation: spin 1s linear infinite; }\n@media (prefers-reduced-motion: reduce) { .spin { animation: none } }` }])
    expect(handled).toEqual([])
  })
})

describe('auditMotion — JS 규칙과 출력', () => {
  it('setInterval로 style을 갱신하거나 프레임 루프에서 style.left를 쓰면 잡는다', () => {
    const text = `setInterval(() => { el.style.opacity = String(o += 0.1) }, 16)\nconst tick = () => { el.style.left = x + 'px'; requestAnimationFrame(tick) }`
    const findings = auditMotion([{ file: 'h.ts', text }])
    expect(rules(findings)).toEqual(['js-interval-anim', 'layout-animation'])
  })

  it('요약과 file:line 형식 출력', () => {
    const findings = auditMotion([
      { file: 'z.css', text: `.a { transition: top 200ms; }` },
    ])
    const summary = summarize(findings)
    expect(summary).toEqual({ errors: 2, warnings: 0 })
    const out = formatFindings(findings)
    expect(out).toMatch(/^z\.css:1 \[error\] /m)
    expect(out).toContain('→')
  })

  it('깨끗한 파일은 결과가 없다 (fe-ui 스킬 CSS 스타일)', () => {
    const text = `.sheet {\n  --_duration: var(--sheet-duration, 350ms);\n  transition: transform var(--_duration) cubic-bezier(0.32, 0.72, 0, 1), opacity var(--_duration) ease;\n}\n@media (prefers-reduced-motion: reduce) {\n  .sheet { transition: opacity 120ms linear; transform: none; }\n}`
    expect(auditMotion([{ file: 'clean.css', text }])).toEqual([])
  })
})
