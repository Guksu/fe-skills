#!/usr/bin/env node
/**
 * 선택 평가(selection eval) — 에이전트가 맞는 것을 고르는지 두 단계로 기계적으로 검사한다.
 *
 * 1. 진입 스킬 트리거 — "UI 요청에는 suta가 걸리고, UI가 아닌 요청에는 걸리지 않는가".
 *    에이전트는 시작 시 설치된 스킬의 description만 보고 어떤 스킬을 읽을지 고른다. suta의 description을
 *    사용자가 함께 설치했을 법한 다른 스킬 설명(decoys)과 섞어 순위를 매긴다.
 * 2. 패턴 선택 — suta 안의 패턴 카탈로그에서 "이 요청에 이 패턴이 골라지는가".
 *    카탈로그는 각 PATTERN.md의 description에서 만들어지므로, description이 이웃 패턴과 구별돼야 한다.
 *
 * LLM을 부르지 않고 단어 겹침(IDF 가중)으로 순위를 매긴다(scripts/lib/selection.ts). 실제 모델의 선택과 같지는
 * 않지만, "트리거 표현이 description에 없다"와 "두 description이 구별되지 않는다"는 흔한 결함은 확실히 드러낸다.
 *
 * 평가 파일:
 *   evals/trigger.json — { "skill": "suta", "should": [...8개 이상], "shouldNot": [...6개 이상],
 *                          "decoys": [{ "name": "…", "description": "…" }, ...] }
 *   evals/selection/{pattern}.json — { "skill": "bottom-sheet",
 *                                      "should": ["바텀시트로 옵션 고르게 해줘", ...],   // 이 패턴이 1위여야 하는 요청 (3개 이상)
 *                                      "shouldNot": ["가운데 뜨는 확인 모달 만들어줘", ...] } // 1위면 안 되는 요청 (3개 이상)
 *
 * 실행: node scripts/evalSelection.mjs [--verbose] [--margins] [pattern ...]
 *   --margins  패턴 should 질의 중 2위와 점수 차가 가장 작은 10개를 보여준다 — description이 흔들리기 쉬운 곳
 *   pattern을 주면 그 패턴의 평가만 돌린다(트리거 평가는 건너뛴다)
 * 실패 시 exit 1 (검증자 게이트·CI용).
 */
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { TRIGGER_STOPWORDS, createRanker } from './lib/selection.ts'

const root = new URL('..', import.meta.url).pathname
const args = process.argv.slice(2)
const verbose = args.includes('--verbose')
const showMargins = args.includes('--margins')
const margins = []
const only = new Set(args.filter((a) => !a.startsWith('--')))
const errors = []
let passed = 0
let total = 0

const readDescription = (path) => readFileSync(path, 'utf8').match(/^description:\s*(.+)$/m)?.[1] ?? ''
const tiedTopOf = (ranked) => ranked.filter((r) => r.score === ranked[0].score).map((r) => r.name)
const top3 = (ranked) => ranked.slice(0, 3).map((r) => `${r.name}:${r.score.toFixed(1)}`).join(', ')

// ---- 1. 진입 스킬 트리거 평가 ----
const triggerPath = join(root, 'evals', 'trigger.json')
if (only.size === 0) {
  if (!existsSync(triggerPath)) errors.push('evals/trigger.json 없음 — 진입 스킬이 UI 요청에 걸리는지 평가해야 한다')
  else {
    const spec = JSON.parse(readFileSync(triggerPath, 'utf8'))
    const skillPath = join(root, 'skills', spec.skill ?? '', 'SKILL.md')
    if (!existsSync(skillPath)) errors.push(`evals/trigger.json: skills/${spec.skill}/SKILL.md 없음`)
    else {
      if (!Array.isArray(spec.should) || spec.should.length < 8) errors.push('trigger: should 질의 8개 이상 필요')
      if (!Array.isArray(spec.shouldNot) || spec.shouldNot.length < 6) errors.push('trigger: shouldNot 질의 6개 이상 필요')
      if (!Array.isArray(spec.decoys) || spec.decoys.length < 6) errors.push('trigger: decoys(다른 스킬 설명) 6개 이상 필요')
      const target = spec.skill
      const rankTrigger = createRanker({
        docs: [{ name: target, description: readDescription(skillPath) }, ...(spec.decoys ?? [])],
        stopwords: TRIGGER_STOPWORDS,
      })
      for (const query of spec.should ?? []) {
        total += 1
        const ranked = rankTrigger(query)
        const mine = ranked.find((r) => r.name === target)
        const tiedTop = tiedTopOf(ranked)
        if (mine.score > 0 && tiedTop.length === 1 && tiedTop[0] === target) passed += 1
        else errors.push(`trigger should "${query}" → 1위 ${tiedTop.join('/')} (${ranked[0].score.toFixed(1)}), ${target} ${mine.score.toFixed(1)}`)
        if (verbose) console.log(`  trigger should "${query}" → ${top3(ranked)}`)
      }
      // UI가 아닌 요청 — suta가 0점이거나 1위가 아니면 통과. 모두 0점인 동점은 아무 스킬도 걸리지 않은 것이라 통과다
      for (const query of spec.shouldNot ?? []) {
        total += 1
        const ranked = rankTrigger(query)
        const mine = ranked.find((r) => r.name === target)
        if (mine.score === 0 || !tiedTopOf(ranked).includes(target)) passed += 1
        else errors.push(`trigger shouldNot "${query}" → ${target}이(가) 1위 (${mine.score.toFixed(1)})`)
        if (verbose) console.log(`  trigger shouldNot "${query}" → ${top3(ranked)}`)
      }
    }
  }
}

// ---- 2. 패턴 선택 평가 ----
const patternsDir = join(root, 'skills', 'suta', 'patterns')
const patterns = readdirSync(patternsDir)
  .sort()
  .flatMap((name) => {
    const docPath = join(patternsDir, name, 'PATTERN.md')
    return statSync(join(patternsDir, name)).isDirectory() && existsSync(docPath) ? [{ name, description: readDescription(docPath) }] : []
  })
const rank = createRanker({ docs: patterns })

const evalDir = join(root, 'evals', 'selection')
const evalFiles = existsSync(evalDir) ? readdirSync(evalDir).filter((f) => f.endsWith('.json')) : []
const covered = new Set()

for (const file of evalFiles.sort()) {
  const spec = JSON.parse(readFileSync(join(evalDir, file), 'utf8'))
  const target = spec.skill
  covered.add(target)
  if (only.size > 0 && !only.has(target)) continue
  if (!patterns.some((p) => p.name === target)) {
    errors.push(`${file}: 패턴 ${target} 없음`)
    continue
  }
  if (!Array.isArray(spec.should) || spec.should.length < 3) errors.push(`${target}: should 질의 3개 이상 필요`)
  if (!Array.isArray(spec.shouldNot) || spec.shouldNot.length < 3) errors.push(`${target}: shouldNot 질의 3개 이상 필요`)

  for (const query of spec.should ?? []) {
    total += 1
    const ranked = rank(query)
    const top = ranked[0]
    const mine = ranked.find((r) => r.name === target)
    const tiedTop = tiedTopOf(ranked)
    if (mine.score > 0 && tiedTop.includes(target) && tiedTop.length === 1) {
      passed += 1
      const second = ranked.find((r) => r.name !== target)
      margins.push({ target, query, margin: mine.score - (second?.score ?? 0), second: second?.name })
    } else errors.push(`${target} should "${query}" → 1위 ${tiedTop.join('/')} (${top.score.toFixed(1)}), ${target} ${mine.score.toFixed(1)}`)
    if (verbose) console.log(`  ${target} should "${query}" → ${top3(ranked)}`)
  }
  for (const query of spec.shouldNot ?? []) {
    total += 1
    const ranked = rank(query)
    const top = ranked[0]
    if (!tiedTopOf(ranked).includes(target)) passed += 1
    else errors.push(`${target} shouldNot "${query}" → ${target}이(가) 1위 (${top.score.toFixed(1)}), 2위 ${ranked.find((r) => r.name !== target)?.name}`)
    if (verbose) console.log(`  ${target} shouldNot "${query}" → ${top3(ranked)}`)
  }
}

// 평가 파일이 없는 패턴 — 패턴을 추가하면 평가도 같이 추가해야 한다
if (only.size === 0) for (const p of patterns) if (!covered.has(p.name)) errors.push(`${p.name}: evals/selection/${p.name}.json 없음`)

if (showMargins) {
  console.log('2위와 점수 차가 가장 작은 should 질의 10개:')
  margins.sort((a, b) => a.margin - b.margin).slice(0, 10).forEach((m) => console.log(`  ${m.margin.toFixed(1).padStart(5)}  ${m.target} "${m.query}" (2위 ${m.second})`))
}

if (errors.length > 0) {
  console.error(`선택 평가 실패 ${errors.length}건 (통과 ${passed}/${total}):`)
  errors.forEach((e) => console.error(`  - ${e}`))
  process.exit(1)
}
console.log(`선택 평가 통과 ${passed}/${total} (트리거 + 패턴 ${patterns.length}개)`)
