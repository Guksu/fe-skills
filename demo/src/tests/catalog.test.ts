import { CATALOG_END, CATALOG_START, parseRegistry, renderCatalog, replaceBlock, summarize } from '../../../scripts/lib/catalog'

describe('catalog — 패턴 한 줄 요약', () => {
  it('description의 첫 문장을 쓴다', () => {
    expect(summarize('아코디언(accordion) 컴포넌트 — 눌러서 펼치고 접는 목록을 구현한다. "아코디언" 요청에 쓴다.')).toBe(
      '아코디언(accordion) 컴포넌트 — 눌러서 펼치고 접는 목록을 구현한다.',
    )
  })

  it('첫 문장이 100자를 넘으면 줄표(—) 앞의 "무엇" 부분만 남긴다', () => {
    const long = `스크롤에 반응하는 유리 GNB를 구현한다 — ${'가'.repeat(100)} 바뀐다. "유리 GNB" 요청에 쓴다.`
    expect(summarize(long)).toBe('스크롤에 반응하는 유리 GNB를 구현한다.')
  })

  it('문장 끝이 없으면 description 전체를 쓴다', () => {
    expect(summarize('끝맺지 않은 설명')).toBe('끝맺지 않은 설명')
  })
})

describe('catalog — 데모 레지스트리 읽기', () => {
  it('카테고리 순서와 항목별 slug·category를 레지스트리 텍스트에서 읽는다', () => {
    const source = [
      "export const CATEGORIES: DemoCategory[] = ['등장과 전환', '피드백']",
      'export const demos: DemoEntry[] = [',
      "  { slug: 'toast-stack', title: '토스트', category: '피드백' },",
      "  { slug: 'enter-exit', title: '진입', category: '등장과 전환' },",
      ']',
    ].join('\n')
    expect(parseRegistry(source)).toEqual({
      categories: ['등장과 전환', '피드백'],
      entries: [
        { slug: 'toast-stack', category: '피드백' },
        { slug: 'enter-exit', category: '등장과 전환' },
      ],
    })
  })
})

describe('catalog — 표 만들기', () => {
  const patterns = [
    { name: 'enter-exit', description: '진입과 퇴장을 구현한다. "등장" 요청에 쓴다.' },
    { name: 'toast-stack', description: '토스트 | 알림을 쌓는다. "토스트" 요청에 쓴다.' },
  ]
  const categories = ['등장과 전환', '로딩과 진행', '피드백']
  const entries = [
    { slug: 'toast-stack', category: '피드백' },
    { slug: 'enter-exit', category: '등장과 전환' },
  ]

  it('카테고리 순서대로 묶고, 빈 카테고리는 건너뛰며, 패턴 문서로 링크한다', () => {
    const table = renderCatalog({ patterns, categories, entries })
    expect(table.indexOf('### 등장과 전환')).toBeLessThan(table.indexOf('### 피드백'))
    expect(table).not.toContain('### 로딩과 진행')
    expect(table).toContain('| [`enter-exit`](patterns/enter-exit/PATTERN.md) | 진입과 퇴장을 구현한다. |')
  })

  it('표를 깨뜨리는 | 를 이스케이프한다', () => {
    expect(renderCatalog({ patterns, categories, entries })).toContain('토스트 \\| 알림을 쌓는다.')
  })

  it('데모 레지스트리에 없는 패턴은 오류로 알린다 — 표에 없으면 에이전트가 고르지 못한다', () => {
    const ghost = { name: 'ghost', description: '유령을 구현한다. 쓴다.' }
    expect(() => renderCatalog({ patterns: [...patterns, ghost], categories, entries })).toThrow('ghost')
  })
})

describe('catalog — 표시 블록 교체', () => {
  const document = `머리\n${CATALOG_START}\n옛 표\n${CATALOG_END}\n꼬리`

  it('표시 사이만 바꾸고, 같은 내용으로 다시 돌려도 결과가 같다', () => {
    const once = replaceBlock({ document, block: '새 표' })
    expect(once).toBe(`머리\n${CATALOG_START}\n새 표\n${CATALOG_END}\n꼬리`)
    expect(replaceBlock({ document: once, block: '새 표' })).toBe(once)
  })

  it('표시가 없으면 오류로 알린다', () => {
    expect(() => replaceBlock({ document: '표시 없음', block: 'x' })).toThrow()
  })
})
