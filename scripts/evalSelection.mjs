#!/usr/bin/env node
/**
 * 스킬 선택 평가(selection eval) — "이 요청에 이 스킬이 골라지는가"를 기계적으로 검사한다.
 *
 * 왜 필요한가: 에이전트는 시작 시 모든 스킬의 description만 보고 어떤 스킬을 읽을지 고른다.
 * description에 사용자 표현이 빠져 있거나 이웃 스킬과 겹치면 엉뚱한 스킬이 골라진다.
 * 이 스크립트는 LLM을 부르지 않고, description과 질의의 단어 겹침(IDF 가중)으로 순위를 매겨
 * 그 실수를 미리 잡는다. 실제 모델의 선택과 같지는 않지만, "트리거 표현이 description에 없다"와
 * "두 스킬의 description이 구별되지 않는다"는 두 가지 흔한 결함은 확실히 드러낸다.
 *
 * 평가 파일: evals/selection/{skill}.json
 *   { "skill": "bottom-sheet",
 *     "should":    ["바텀시트로 옵션 고르게 해줘", ...],   // 이 스킬이 1위여야 하는 요청 (3개 이상)
 *     "shouldNot": ["가운데 뜨는 확인 모달 만들어줘", ...] } // 이 스킬이 1위면 안 되는 요청 (3개 이상)
 *
 * 실행: node scripts/evalSelection.mjs [--verbose] [--margins] [skill ...]
 *   --margins  should 질의 중 2위와 점수 차가 가장 작은 10개를 보여준다 — description이 흔들리기 쉬운 곳
 * 실패 시 exit 1 (검증자 게이트·CI용).
 */
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs'
import { join } from 'node:path'

const root = new URL('..', import.meta.url).pathname
const args = process.argv.slice(2)
const verbose = args.includes('--verbose')
const showMargins = args.includes('--margins')
const margins = []
const only = new Set(args.filter((a) => !a.startsWith('--')))

// ---- 스킬 description 수집 ----
const skills = []
for (const plugin of ['ui', 'system']) {
  const dir = join(root, 'plugins', plugin, 'skills')
  if (!existsSync(dir)) continue
  for (const name of readdirSync(dir).sort()) {
    const skillPath = join(dir, name, 'SKILL.md')
    if (!statSync(join(dir, name)).isDirectory() || !existsSync(skillPath)) continue
    const md = readFileSync(skillPath, 'utf8')
    const desc = md.match(/^description:\s*(.+)$/m)?.[1] ?? ''
    skills.push({ name, plugin, description: desc })
  }
}

// ---- 특징 추출: 공백 단위 토큰(가중 3) + 한글 음절 2-gram(가중 1) ----
// 한글은 조사가 붙어 "바텀시트로"와 "바텀시트"가 다른 토큰이 되므로 2-gram으로 부분 일치를 잡는다.
// 영어는 소문자 + 끝의 s 제거로 단·복수를 합친다.
// 흔한 조사·어미 — 끝에 붙은 것만 한 번 뗀다(어간이 2글자 이상 남을 때만)
const PARTICLE = /(으로|에서|처럼|까지|부터|이랑|하고|들|을|를|이|가|은|는|로|에|의|도|만|과|와|요)$/

// 요청 문장에 늘 나오는 범용 표현 — 어떤 스킬을 고를지에 정보가 없으므로 점수에서 뺀다.
// (이게 없으면 description에 "만들어줘"를 넣은 스킬이 모든 "…만들어줘" 요청에서 공짜 점수를 얻는다)
const STOPWORDS = new Set([
  '만들어줘', '만들어', '만들기', '만들고', '넣어줘', '넣어', '해줘', '해주세요', '주세요', '해', '추가해줘', '추가', '구현', '구현해줘',
  '적용', '적용해줘', '싶어', '싶어요', '싶은데', '좀', '요청', '사용', '기능', '컴포넌트', '해서', '하게', '되게', '있게', '수', '것',
  'ui', 'component', 'add', 'make', 'create', 'implement', 'please', 'the', 'a', 'an', 'to', 'for', 'with',
])

export const features = (text) => {
  const out = new Map()
  const add = (key, weight) => out.set(key, Math.max(out.get(key) ?? 0, weight))
  const tokens = text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .split(' ')
    .filter(Boolean)
    .filter((token) => !STOPWORDS.has(token) && !STOPWORDS.has(token.replace(PARTICLE, '')))
  for (const token of tokens) {
    const norm = /^[a-z]+s$/.test(token) && token.length > 3 ? token.slice(0, -1) : token
    add(`w:${norm}`, 3)
    if (/[ㄱ-힝]/.test(token) && token.length >= 2) {
      // 조사를 뗀 어간도 정확 토큰으로 넣는다 — "컴포넌트를"이 "컴포넌트"와 같은 단어로 잡히게
      const stem = token.replace(PARTICLE, '')
      if (stem !== token && stem.length >= 2) add(`w:${stem}`, 3)
      for (let i = 0; i < token.length - 1; i += 1) add(`b:${token.slice(i, i + 2)}`, 1)
    }
  }
  return out
}

// ---- IDF: 모든 description에 나오는 특징("구현", "요청")은 가중 0에 가깝게 ----
const docFeatures = skills.map((s) => features(s.description))
const df = new Map()
for (const f of docFeatures) for (const key of f.keys()) df.set(key, (df.get(key) ?? 0) + 1)
const N = skills.length
const idf = (key) => Math.log((N + 1) / ((df.get(key) ?? 0) + 1))

export const score = ({ query, description }) => {
  const q = features(query)
  const d = features(description)
  let sum = 0
  for (const [key, weight] of q) if (d.has(key)) sum += weight * idf(key)
  return sum
}

const rank = (query) =>
  skills
    .map((s, i) => ({ name: s.name, score: score({ query, description: skills[i].description }) }))
    .sort((a, b) => b.score - a.score)

// ---- 평가 실행 ----
const evalDir = join(root, 'evals', 'selection')
const errors = []
let passed = 0
let total = 0
const evalFiles = existsSync(evalDir) ? readdirSync(evalDir).filter((f) => f.endsWith('.json')) : []
const covered = new Set()

for (const file of evalFiles.sort()) {
  const spec = JSON.parse(readFileSync(join(evalDir, file), 'utf8'))
  const target = spec.skill
  covered.add(target)
  if (only.size > 0 && !only.has(target)) continue
  if (!skills.some((s) => s.name === target)) {
    errors.push(`${file}: 스킬 ${target} 없음`)
    continue
  }
  if (!Array.isArray(spec.should) || spec.should.length < 3) errors.push(`${target}: should 질의 3개 이상 필요`)
  if (!Array.isArray(spec.shouldNot) || spec.shouldNot.length < 3) errors.push(`${target}: shouldNot 질의 3개 이상 필요`)

  for (const query of spec.should ?? []) {
    total += 1
    const ranked = rank(query)
    const top = ranked[0]
    const mine = ranked.find((r) => r.name === target)
    const tiedTop = ranked.filter((r) => r.score === top.score).map((r) => r.name)
    if (mine.score > 0 && tiedTop.includes(target) && tiedTop.length === 1) {
      passed += 1
      const second = ranked.find((r) => r.name !== target)
      margins.push({ target, query, margin: mine.score - (second?.score ?? 0), second: second?.name })
    } else errors.push(`${target} should "${query}" → 1위 ${tiedTop.join('/')} (${top.score.toFixed(1)}), ${target} ${mine.score.toFixed(1)}`)
    if (verbose) console.log(`  ${target} should "${query}" → ${ranked.slice(0, 3).map((r) => `${r.name}:${r.score.toFixed(1)}`).join(', ')}`)
  }
  for (const query of spec.shouldNot ?? []) {
    total += 1
    const ranked = rank(query)
    const top = ranked[0]
    const tiedTop = ranked.filter((r) => r.score === top.score).map((r) => r.name)
    if (!tiedTop.includes(target)) passed += 1
    else errors.push(`${target} shouldNot "${query}" → ${target}이(가) 1위 (${top.score.toFixed(1)}), 2위 ${ranked.find((r) => r.name !== target)?.name}`)
    if (verbose) console.log(`  ${target} shouldNot "${query}" → ${ranked.slice(0, 3).map((r) => `${r.name}:${r.score.toFixed(1)}`).join(', ')}`)
  }
}

// 평가 파일이 없는 스킬 — 스킬을 추가하면 평가도 같이 추가해야 한다
if (only.size === 0) for (const s of skills) if (!covered.has(s.name)) errors.push(`${s.name}: evals/selection/${s.name}.json 없음`)

if (showMargins) {
  console.log('2위와 점수 차가 가장 작은 should 질의 10개:')
  margins.sort((a, b) => a.margin - b.margin).slice(0, 10).forEach((m) => console.log(`  ${m.margin.toFixed(1).padStart(5)}  ${m.target} "${m.query}" (2위 ${m.second})`))
}

if (errors.length > 0) {
  console.error(`스킬 선택 평가 실패 ${errors.length}건 (통과 ${passed}/${total}):`)
  errors.forEach((e) => console.error(`  - ${e}`))
  process.exit(1)
}
console.log(`스킬 선택 평가 통과 ${passed}/${total} (스킬 ${skills.length}개)`)
