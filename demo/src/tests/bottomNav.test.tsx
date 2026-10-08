import { fireEvent, render, screen } from '@testing-library/react'
import { BottomNav } from '@skills/bottom-nav/assets/BottomNav'

const items = [
  { href: '/', label: '홈', icon: <svg /> },
  { href: '/category', label: '카테고리', icon: <svg /> },
  { href: '/wish', label: '찜', icon: <svg />, badge: 12 },
  { href: '/my', label: '마이', icon: <svg />, badge: 'dot' as const },
]

describe('BottomNav — 하단 탭 바', () => {
  it('nav 랜드마크 안의 링크 목록이고, 현재 탭에 aria-current="page"가 붙는다', () => {
    render(<BottomNav items={items} path="/category/noodles" />)
    expect(screen.getByRole('navigation', { name: '주요 메뉴' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /카테고리/ })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: /홈/ })).not.toHaveAttribute('aria-current')
    expect(screen.getAllByRole('listitem')).toHaveLength(4)
  })

  it('개수 배지는 숫자를, 점은 말로 화면 낭독기에 알린다', () => {
    render(<BottomNav items={items} path="/" />)
    expect(screen.getByRole('link', { name: '찜 새 항목 12개' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '마이 새 소식 있음' })).toBeInTheDocument()
    expect(screen.getByText('12')).toHaveAttribute('aria-hidden', 'true')
  })

  it('다른 탭을 누르면 onNavigate가 주소를 받고, 지금 탭을 다시 누르면 onReselect가 불린다', () => {
    const onNavigate = vi.fn(({ event }: { event: { preventDefault: () => void } }) => event.preventDefault())
    const onReselect = vi.fn()
    render(<BottomNav items={items} path="/" onNavigate={onNavigate} onReselect={onReselect} />)
    fireEvent.click(screen.getByRole('link', { name: /카테고리/ }))
    expect(onNavigate).toHaveBeenCalledWith(expect.objectContaining({ href: '/category' }))
    fireEvent.click(screen.getByRole('link', { name: /홈/ }))
    expect(onReselect).toHaveBeenCalledWith('/')
    expect(onNavigate).toHaveBeenCalledTimes(1)
  })

  it('hidden이거나 입력칸에 초점이 있으면 숨기고 inert로 키보드 이동에서도 뺀다', () => {
    const { rerender, container } = render(
      <>
        <input aria-label="검색" />
        <BottomNav items={items} path="/" />
      </>,
    )
    const nav = container.querySelector('nav') as HTMLElement
    expect(nav).not.toHaveAttribute('data-hidden')
    fireEvent.focusIn(screen.getByLabelText('검색'))
    expect(nav).toHaveAttribute('data-hidden', 'true')
    expect(nav).toHaveAttribute('inert')
    fireEvent.focusOut(screen.getByLabelText('검색'))
    expect(nav).not.toHaveAttribute('data-hidden')
    rerender(
      <>
        <input aria-label="검색" />
        <BottomNav items={items} path="/products/janchi" hidden />
      </>,
    )
    expect(nav).toHaveAttribute('data-hidden', 'true')
  })
})
