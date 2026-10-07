/**
 * 패턴 카탈로그 — 진입 스킬(skills/suta/SKILL.md)의 패턴 목록 표를 만든다.
 *
 * 정본은 각 PATTERN.md의 description(무엇·언제)과 데모 레지스트리의 카테고리다. 표는 손으로 고치지 않고 이 함수로만 만든다
 * — 손으로 쓰면 패턴을 추가할 때 표가 뒤처지고, 에이전트는 표에 없는 패턴을 고르지 못한다.
 */
export const CATALOG_START = '<!-- catalog:start -->'
export const CATALOG_END = '<!-- catalog:end -->'

export type PatternMeta = { name: string; description: string }
export type RegistryEntry = { slug: string; category: string }

// 표 한 줄 요약 — description의 첫 문장. 첫 문장이 100자를 넘으면 줄표(—) 앞의 "무엇" 부분만 남긴다.
// 진입 스킬 본문은 UI 요청마다 통째로 읽히므로, 패턴 수만큼의 행이 짧아야 본문이 권장 크기(약 5,000토큰) 안에 든다
export const summarize = (description: string): string => {
  const sentence = description.match(/^(.+?다\.)(?=\s|$)/)?.[1] ?? description
  if (sentence.length <= 100 || !sentence.includes(' — ')) return sentence
  const head = sentence.split(' — ')[0]
  return head.endsWith('다') ? `${head}.` : head
}

// 데모 레지스트리(TS)를 실행하지 않고 텍스트로 읽는다 — CATEGORIES 순서와 항목별 slug·category
export const parseRegistry = (source: string): { categories: string[]; entries: RegistryEntry[] } => {
  const list = source.match(/export const CATEGORIES[^=]*=\s*\[([^\]]*)\]/)?.[1] ?? ''
  const categories = [...list.matchAll(/'([^']+)'/g)].map((match) => match[1])
  const entries = [...source.matchAll(/slug: '([^']+)'[\s\S]*?category: '([^']+)'/g)].map((match) => ({
    slug: match[1],
    category: match[2],
  }))
  return { categories, entries }
}

const escapeCell = (text: string) => text.replace(/\|/g, '\\|')

// 카테고리 순서대로 묶고, 카테고리 안에서는 레지스트리 순서(데모 사이드바와 같은 순서)를 따른다
export const renderCatalog = ({
  patterns,
  categories,
  entries,
}: {
  patterns: PatternMeta[]
  categories: string[]
  entries: RegistryEntry[]
}): string => {
  const unlisted = patterns.filter((pattern) => !entries.some((entry) => entry.slug === pattern.name)).map((pattern) => pattern.name)
  if (unlisted.length > 0) throw new Error(`데모 레지스트리에 없는 패턴: ${unlisted.join(', ')}`)

  const byName = new Map(patterns.map((pattern) => [pattern.name, pattern]))
  const sections = categories.flatMap((category) => {
    const rows = entries
      .filter((entry) => entry.category === category)
      .flatMap((entry) => {
        const pattern = byName.get(entry.slug)
        return pattern ? [`| [\`${entry.slug}\`](patterns/${entry.slug}/PATTERN.md) | ${escapeCell(summarize(pattern.description))} |`] : []
      })
    return rows.length === 0 ? [] : [`### ${category}`, '', '| 패턴 | 무엇을 하나 |', '|---|---|', ...rows, '']
  })
  return sections.join('\n').trimEnd()
}

// 표시 두 줄 사이만 바꾼다 — 같은 표로 다시 돌려도 결과가 같아야 검사(validate)가 "동기됨"을 판정할 수 있다
export const replaceBlock = ({ document, block }: { document: string; block: string }): string => {
  const start = document.indexOf(CATALOG_START)
  const end = document.indexOf(CATALOG_END)
  if (start === -1 || end === -1 || end < start) throw new Error(`표시(${CATALOG_START} … ${CATALOG_END})를 찾지 못했다`)
  return `${document.slice(0, start + CATALOG_START.length)}\n${block}\n${document.slice(end)}`
}
