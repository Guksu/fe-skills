#!/usr/bin/env node
/**
 * 스킬 구조 검증 게이트 — plugin/skills 전체를 검사한다.
 * 실패 시 exit 1 (검증자 게이트의 종료 코드 판정용).
 *  - SKILL.md 존재, frontmatter name = 디렉토리명
 *  - description 존재·길이(80~300자)·3인칭(에이전트 명령문 금지)
 *  - 본문이 참조하는 assets/·references/ 경로 실재
 *  - 데모 레지스트리(demo/src/demos/index.ts)에 slug 등록
 *  - 공유 코어 복사본 동기: 첫 줄에 `@shared-core {파일} origin: {스킬}` 헤더가 있는 assets 파일은 원본과 내용이 같아야 한다
 *  - README.md·README.en.md 배지 숫자(fe-ui/fe-system 스킬 수, 테스트 수)가 실제와 일치
 *  - 공통 지침 파일: AGENTS.md 존재, CLAUDE.md가 @AGENTS.md를 가져옴, .agents/skills/add-skill이 있고 .claude/skills/add-skill이 같은 곳을 가리킴
 */
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { createHash } from 'node:crypto'

const hash = (text) => createHash('sha256').update(text).digest('hex')

const root = new URL('..', import.meta.url).pathname
const registry = readFileSync(join(root, 'demo/src/demos/index.ts'), 'utf8')
const errors = []
const skillCounts = {}

// UI 스킬은 데모 레지스트리 등록까지, 시스템 스킬(문서+문답)은 구조만 검사한다
const plugins = [
  { dir: join(root, 'plugins/ui/skills'), requiresDemo: true },
  { dir: join(root, 'plugins/system/skills'), requiresDemo: false },
]

for (const { dir: skillsDir, requiresDemo } of plugins) {
  if (!existsSync(skillsDir)) continue
  for (const name of readdirSync(skillsDir).sort()) {
    const dir = join(skillsDir, name)
    if (!statSync(dir).isDirectory()) continue
    skillCounts[skillsDir] = (skillCounts[skillsDir] ?? 0) + 1
    const skillPath = join(dir, 'SKILL.md')
    if (!existsSync(skillPath)) {
      errors.push(`${name}: SKILL.md 없음`)
      continue
    }
    const md = readFileSync(skillPath, 'utf8')
    const fm = md.match(/^---\n([\s\S]*?)\n---/)
    if (!fm) {
      errors.push(`${name}: frontmatter 없음`)
      continue
    }
    const fmName = fm[1].match(/^name:\s*(\S+)/m)?.[1]
    if (fmName !== name) errors.push(`${name}: frontmatter name(${fmName})이 디렉토리명과 다름`)
    const desc = fm[1].match(/^description:\s*(.+)$/m)?.[1] ?? ''
    if (desc.length < 80 || desc.length > 300) errors.push(`${name}: description 길이 ${desc.length}자 (80~300자 필요)`)
    if (/반드시 이 스킬을 사용할 것|이 스킬을 사용/.test(desc)) errors.push(`${name}: description에 에이전트 명령문("이 스킬을 사용할 것")이 있음 — 3인칭으로 무엇을·언제만 적는다`)
    for (const [, ref] of md.matchAll(/`((?:assets|references)\/[\w./-]+)`/g)) {
      if (!existsSync(join(dir, ref))) errors.push(`${name}: 참조 파일 없음 — ${ref}`)
    }
    if (requiresDemo && !registry.includes(`slug: '${name}'`)) errors.push(`${name}: 데모 레지스트리에 미등록`)

    // 공유 코어 복사본 — 원본(origin 스킬의 같은 파일명)과 해시가 다르면 드리프트
    const assetsDir = join(dir, 'assets')
    if (!existsSync(assetsDir)) continue
    for (const file of readdirSync(assetsDir)) {
      const text = readFileSync(join(assetsDir, file), 'utf8')
      const header = text.split('\n')[0].match(/@shared-core\s+(\S+)\s+origin:\s+([\w-]+)/)
      if (!header) continue
      const [, sharedFile, origin] = header
      if (origin === name) continue
      const originPath = join(skillsDir, origin, 'assets', sharedFile)
      if (!existsSync(originPath)) {
        errors.push(`${name}: 공유 코어 원본 없음 — ${origin}/assets/${sharedFile}`)
        continue
      }
      if (hash(text) !== hash(readFileSync(originPath, 'utf8'))) {
        errors.push(`${name}: assets/${file}이 원본 ${origin}/assets/${sharedFile}과 다름 — 원본을 다시 복사하라`)
      }
    }
  }
}

// README 배지 — 숫자가 실제와 어긋나면 문서가 거짓말을 한다. 테스트 수는 vitest가 남긴 마지막 결과 없이도 셀 수 있게 it( 호출 수로 센다
// 영어판(README.en.md)이 있으면 같은 숫자여야 한다 — 두 문서가 다른 숫자를 말하면 하나는 거짓말이다
const readmes = ['README.md', 'README.en.md'].filter((name) => existsSync(join(root, name))).map((name) => ({ name, text: readFileSync(join(root, name), 'utf8') }))
const expectBadge = ({ label, actual }) => {
  for (const { name, text } of readmes) {
    const shown = Number(text.match(new RegExp(`${label}-(\\d+)%20`))?.[1] ?? NaN)
    if (shown !== actual) errors.push(`${name} 배지 ${label}: ${shown}로 표기, 실제 ${actual} — 배지를 갱신하라`)
  }
}
expectBadge({ label: 'fe--ui', actual: skillCounts[join(root, 'plugins/ui/skills')] ?? 0 })
expectBadge({ label: 'fe--system', actual: skillCounts[join(root, 'plugins/system/skills')] ?? 0 })
const testsDir = join(root, 'demo/src/tests')
const testCount = readdirSync(testsDir)
  .filter((file) => /\.test\.tsx?$/.test(file))
  .reduce((sum, file) => sum + (readFileSync(join(testsDir, file), 'utf8').match(/^\s*it\(/gm) ?? []).length, 0)
expectBadge({ label: 'tests', actual: testCount })

// 공통 지침 — 다른 에이전트(Codex·Cursor·Gemini CLI·Copilot)와 Claude가 같은 규칙·같은 add-skill 절차를 읽어야 한다.
// 링크가 끊기거나 CLAUDE.md가 가져오기를 빼먹으면 한쪽만 다른 규칙을 보게 되므로 기계적으로 검사한다
const agentsPath = join(root, 'AGENTS.md')
if (!existsSync(agentsPath)) errors.push('AGENTS.md 없음 — 공통 작업 지침의 단일 출처다')
const claudeMd = existsSync(join(root, 'CLAUDE.md')) ? readFileSync(join(root, 'CLAUDE.md'), 'utf8') : ''
if (!/^@AGENTS\.md\s*$/m.test(claudeMd)) errors.push('CLAUDE.md가 @AGENTS.md를 가져오지 않음 — 첫 줄에 @AGENTS.md')
const addSkillShared = join(root, '.agents/skills/add-skill/SKILL.md')
if (!existsSync(addSkillShared)) errors.push('.agents/skills/add-skill/SKILL.md 없음 — 스킬 추가 절차는 .agents/에 둔다')
const addSkillClaude = join(root, '.claude/skills/add-skill/SKILL.md')
if (!existsSync(addSkillClaude) || (existsSync(addSkillShared) && hash(readFileSync(addSkillClaude, 'utf8')) !== hash(readFileSync(addSkillShared, 'utf8')))) {
  errors.push('.claude/skills/add-skill이 .agents/skills/add-skill과 다름 — 심볼릭 링크(ln -s ../../.agents/skills/add-skill)여야 한다')
}

if (errors.length > 0) {
  console.error(`스킬 구조 검증 실패 ${errors.length}건:`)
  errors.forEach((error) => console.error(`  - ${error}`))
  process.exit(1)
}
console.log('스킬 구조 검증 통과')
