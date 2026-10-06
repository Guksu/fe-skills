#!/usr/bin/env node
/**
 * 패턴 카탈로그 생성 — 진입 스킬 skills/suta/SKILL.md의 catalog 블록(<!-- catalog:start --> … end)을 다시 쓴다.
 *
 * 정본: 각 skills/suta/patterns/{패턴}/PATTERN.md의 description + 데모 레지스트리(demo/src/demos/index.ts)의 카테고리·순서.
 * 표를 손으로 고치면 패턴을 추가할 때 뒤처진다 — 에이전트는 표에 없는 패턴을 고르지 못하므로 생성으로만 만든다.
 *
 * 실행: npm run catalog            블록을 다시 쓴다
 *       node scripts/buildCatalog.mjs --check   쓰지 않고 어긋났는지만 본다(어긋나면 exit 1)
 * validateSkills.mjs가 expectedSkillDocument()로 같은 계산을 해 동기 여부를 검사한다.
 */
import { readFileSync, readdirSync, existsSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseRegistry, renderCatalog, replaceBlock } from './lib/catalog.ts'

const root = fileURLToPath(new URL('..', import.meta.url))
export const skillDocPath = join(root, 'skills/suta/SKILL.md')
export const patternsDir = join(root, 'skills/suta/patterns')

// 패턴 폴더마다 PATTERN.md의 name(폴더명)·description
export const readPatterns = () =>
  readdirSync(patternsDir)
    .sort()
    .flatMap((name) => {
      const docPath = join(patternsDir, name, 'PATTERN.md')
      if (!statSync(join(patternsDir, name)).isDirectory() || !existsSync(docPath)) return []
      const description = readFileSync(docPath, 'utf8').match(/^description:\s*(.+)$/m)?.[1] ?? ''
      return [{ name, description }]
    })

export const expectedSkillDocument = () => {
  const { categories, entries } = parseRegistry(readFileSync(join(root, 'demo/src/demos/index.ts'), 'utf8'))
  const block = renderCatalog({ patterns: readPatterns(), categories, entries })
  return replaceBlock({ document: readFileSync(skillDocPath, 'utf8'), block })
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const current = readFileSync(skillDocPath, 'utf8')
  const expected = expectedSkillDocument()
  if (process.argv.includes('--check')) {
    if (current !== expected) {
      console.error('패턴 카탈로그가 PATTERN.md·데모 레지스트리와 어긋남 — npm run catalog로 다시 만든다')
      process.exit(1)
    }
    console.log('패턴 카탈로그 동기됨')
  } else if (current === expected) console.log('패턴 카탈로그 변경 없음')
  else {
    writeFileSync(skillDocPath, expected)
    console.log(`패턴 카탈로그 갱신: ${readPatterns().length}개 → skills/suta/SKILL.md`)
  }
}
