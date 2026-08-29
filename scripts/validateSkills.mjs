#!/usr/bin/env node
/**
 * 스킬 구조 검증 게이트 — plugin/skills 전체를 검사한다.
 * 실패 시 exit 1 (검증자 게이트의 종료 코드 판정용).
 *  - SKILL.md 존재, frontmatter name = 디렉토리명
 *  - description 존재·길이(80~400자)
 *  - 본문이 참조하는 assets/·references/ 경로 실재
 *  - 데모 레지스트리(demo/src/demos/index.ts)에 slug 등록
 *  - 공유 코어 복사본 동기: 첫 줄에 `@shared-core {파일} origin: {스킬}` 헤더가 있는 assets 파일은 원본과 내용이 같아야 한다
 *  - README 배지 숫자(fe-ui/fe-system 스킬 수, 테스트 수)가 실제와 일치
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
    if (desc.length < 80 || desc.length > 400) errors.push(`${name}: description 길이 ${desc.length}자 (80~400자 필요)`)
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
const readme = readFileSync(join(root, 'README.md'), 'utf8')
const badge = (label) => Number(readme.match(new RegExp(`${label}-(\\d+)%20`))?.[1] ?? NaN)
const expectBadge = ({ label, actual }) => {
  const shown = badge(label)
  if (shown !== actual) errors.push(`README 배지 ${label}: ${shown}로 표기, 실제 ${actual} — README 배지를 갱신하라`)
}
expectBadge({ label: 'fe--ui', actual: skillCounts[join(root, 'plugins/ui/skills')] ?? 0 })
expectBadge({ label: 'fe--system', actual: skillCounts[join(root, 'plugins/system/skills')] ?? 0 })
const testsDir = join(root, 'demo/src/tests')
const testCount = readdirSync(testsDir)
  .filter((file) => /\.test\.tsx?$/.test(file))
  .reduce((sum, file) => sum + (readFileSync(join(testsDir, file), 'utf8').match(/^\s*it\(/gm) ?? []).length, 0)
expectBadge({ label: 'tests', actual: testCount })

if (errors.length > 0) {
  console.error(`스킬 구조 검증 실패 ${errors.length}건:`)
  errors.forEach((error) => console.error(`  - ${error}`))
  process.exit(1)
}
console.log('스킬 구조 검증 통과')
