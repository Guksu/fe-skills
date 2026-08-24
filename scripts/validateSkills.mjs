#!/usr/bin/env node
/**
 * 스킬 구조 검증 게이트 — plugin/skills 전체를 검사한다.
 * 실패 시 exit 1 (검증자 게이트의 종료 코드 판정용).
 *  - SKILL.md 존재, frontmatter name = 디렉토리명
 *  - description 존재·길이(80~400자)
 *  - 본문이 참조하는 assets/·references/ 경로 실재
 *  - 데모 레지스트리(demo/src/demos/index.ts)에 slug 등록
 */
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs'
import { join } from 'node:path'

const root = new URL('..', import.meta.url).pathname
const registry = readFileSync(join(root, 'demo/src/demos/index.ts'), 'utf8')
const errors = []

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
  }
}

if (errors.length > 0) {
  console.error(`스킬 구조 검증 실패 ${errors.length}건:`)
  errors.forEach((error) => console.error(`  - ${error}`))
  process.exit(1)
}
console.log('스킬 구조 검증 통과')
