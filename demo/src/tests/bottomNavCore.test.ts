import { badgeLabel, formatBadge, isCurrentTab, isEditable, shouldShowBottomNav, watchKeyboard } from '@skills/bottom-nav/assets/bottomNavCore'

describe('bottomNavCore — 현재 탭', () => {
  it('홈(/)은 정확히 같을 때만, 나머지는 하위 경로까지 현재 탭이다', () => {
    expect(isCurrentTab({ href: '/', path: '/' })).toBe(true)
    expect(isCurrentTab({ href: '/', path: '/category' })).toBe(false)
    expect(isCurrentTab({ href: '/category', path: '/category/noodles' })).toBe(true)
    expect(isCurrentTab({ href: '/category', path: '/categoryx' })).toBe(false)
    expect(isCurrentTab({ href: '/my', path: '/my/?tab=orders#top' })).toBe(true)
  })
})

describe('bottomNavCore — 탭 바를 보일 화면', () => {
  const tabs = ['/', '/category', '/wish', '/my']

  it('탭의 첫 화면에서만 보이고, 상세·장바구니·주문 같은 하위 화면에서는 숨는다', () => {
    expect(shouldShowBottomNav({ path: '/', tabs })).toBe(true)
    expect(shouldShowBottomNav({ path: '/my/', tabs })).toBe(true)
    expect(shouldShowBottomNav({ path: '/products/janchi', tabs })).toBe(false)
    expect(shouldShowBottomNav({ path: '/cart', tabs })).toBe(false)
    expect(shouldShowBottomNav({ path: '/my/settings', tabs })).toBe(false)
  })

  it('alsoOn에 적은 경로 아래(카테고리의 상품 목록 등)에서는 계속 보인다', () => {
    expect(shouldShowBottomNav({ path: '/category/noodles', tabs, alsoOn: ['/category'] })).toBe(true)
    expect(shouldShowBottomNav({ path: '/category/noodles/janchi', tabs, alsoOn: ['/category'] })).toBe(true)
  })
})

describe('bottomNavCore — 배지', () => {
  it('0·음수·없음은 그리지 않고, 99를 넘으면 99+, 점은 빈 글자', () => {
    expect(formatBadge(undefined)).toBeNull()
    expect(formatBadge(0)).toBeNull()
    expect(formatBadge(-2)).toBeNull()
    expect(formatBadge(7)).toBe('7')
    expect(formatBadge(120)).toBe('99+')
    expect(formatBadge('dot')).toBe('')
  })

  it('화면 낭독기용 문구는 개수와 새 소식을 말로 알린다', () => {
    expect(badgeLabel(3)).toBe('새 항목 3개')
    expect(badgeLabel(150)).toBe('새 항목 99개 이상')
    expect(badgeLabel('dot')).toBe('새 소식 있음')
    expect(badgeLabel(0)).toBeNull()
  })
})

describe('bottomNavCore — 키보드가 올라온 동안', () => {
  it('글자 입력칸만 편집 요소로 본다(체크·라디오·버튼은 아니다)', () => {
    const make = (html: string) => {
      const box = document.createElement('div')
      box.innerHTML = html
      return box.firstElementChild
    }
    expect(isEditable(make('<input type="search" />'))).toBe(true)
    expect(isEditable(make('<input />'))).toBe(true)
    expect(isEditable(make('<textarea></textarea>'))).toBe(true)
    expect(isEditable(make('<div contenteditable="true"></div>'))).toBe(true)
    expect(isEditable(make('<input type="checkbox" />'))).toBe(false)
    expect(isEditable(make('<button>담기</button>'))).toBe(false)
    expect(isEditable(null)).toBe(false)
  })

  it('입력칸에 초점이 들어오면 true, 빠지면 false를 알리고 정리 함수로 멈춘다', () => {
    document.body.innerHTML = '<input id="q" type="search" /><button id="b">검색</button>'
    const changes: boolean[] = []
    const stop = watchKeyboard({ onChange: (open) => changes.push(open) })
    const input = document.getElementById('q') as HTMLInputElement
    const button = document.getElementById('b') as HTMLButtonElement
    input.focus()
    button.focus()
    expect(changes).toEqual([true, false])
    stop()
    input.focus()
    expect(changes).toEqual([true, false])
  })
})
