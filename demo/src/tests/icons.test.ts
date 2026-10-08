import { ICONS, iconSvg } from '@skills/layout-principles/assets/icons'

describe('layout-principles 아이콘 한 벌', () => {
  it('모든 아이콘이 24 격자의 도형을 하나 이상 갖는다', () => {
    for (const [name, nodes] of Object.entries(ICONS)) {
      expect(nodes.length, name).toBeGreaterThan(0)
      for (const [tag, attrs] of nodes) expect(Object.keys(attrs).length, `${name} ${tag}`).toBeGreaterThan(0)
    }
  })

  it('커머스 앱의 하단 탭·머리·상품 행에 필요한 이름을 모두 갖는다', () => {
    const needed = ['home', 'category', 'search', 'heart', 'user', 'cart', 'bell', 'settings', 'chevron-left', 'chevron-right', 'close', 'plus', 'minus', 'star', 'share', 'trash']
    for (const name of needed) expect(ICONS).toHaveProperty(name)
  })

  it('뜻이 있으면 role="img"와 이름, 장식이면 aria-hidden — 채움은 fill만 바꾼다', () => {
    const labelled = iconSvg({ name: 'cart', label: '장바구니 "3"' })
    expect(labelled).toContain('role="img"')
    expect(labelled).toContain('aria-label="장바구니 &quot;3&quot;"')
    expect(labelled).toContain('fill="none"')
    const decorative = iconSvg({ name: 'heart', filled: true, size: 20 })
    expect(decorative).toContain('aria-hidden="true"')
    expect(decorative).toContain('fill="currentColor"')
    expect(decorative).toContain('width="20"')
    expect(decorative).toContain('stroke-width="1.75"')
  })
})
