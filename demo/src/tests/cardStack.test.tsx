import { render, screen, fireEvent } from '@testing-library/react'
import { CardStack } from '@skills/card-stack/assets/CardStack'

const CARDS = [
  { id: 'points', render: () => <span>적립 카드</span> },
  { id: 'coupon', render: () => <span>만두 쿠폰</span> },
  { id: 'prepaid', render: () => <span>선불 카드</span> },
]

describe('CardStack — 카드 묶음 React 래퍼', () => {
  it('카드마다 버튼이고 그룹 라벨·초기 stacked 모드·transform 인라인이 찍힌다', () => {
    render(<CardStack cards={CARDS} label="국수집 지갑" cardHeight={160} />)
    const group = screen.getByRole('group', { name: '국수집 지갑' })
    expect(group).toHaveAttribute('data-mode', 'stacked')
    expect(group.style.minHeight).toBe(`${160 + 56 * 2}px`)
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(3)
    buttons.forEach((button) => expect(button).toHaveAttribute('aria-expanded', 'false'))
    expect(buttons[2].style.transform).toBe('translateY(112px) scale(1)')
    expect(buttons[0].style.getPropertyValue('--stack-index')).toBe('0')
  })

  it('카드를 누르면 펼쳐지고(fanned), 한 번 더 누르면 그 카드가 선택되어 aria-expanded가 켜진다', () => {
    const onStateChange = vi.fn()
    render(<CardStack cards={CARDS} onStateChange={onStateChange} />)
    const group = screen.getByRole('group')
    const coupon = screen.getByRole('button', { name: '만두 쿠폰' })

    fireEvent.click(coupon)
    expect(group).toHaveAttribute('data-mode', 'fanned')
    expect(group.style.minHeight).toBe(`${180 + 72 * 2}px`)

    fireEvent.click(coupon)
    expect(group).toHaveAttribute('data-mode', 'selected')
    expect(coupon).toHaveAttribute('aria-expanded', 'true')
    expect(coupon.style.transform).toBe('translateY(0px) scale(1)')
    expect(screen.getByRole('button', { name: '적립 카드' })).toHaveAttribute('aria-expanded', 'false')
    expect(onStateChange).toHaveBeenLastCalledWith({ mode: 'selected', selectedIndex: 1 })
  })

  it('Esc는 한 단계씩 되돌린다 (selected → fanned → stacked)', () => {
    render(<CardStack cards={CARDS} />)
    const group = screen.getByRole('group')
    const prepaid = screen.getByRole('button', { name: '선불 카드' })
    fireEvent.click(prepaid)
    fireEvent.click(prepaid)
    expect(group).toHaveAttribute('data-mode', 'selected')

    fireEvent.keyDown(window, { key: 'Escape' })
    expect(group).toHaveAttribute('data-mode', 'fanned')
    expect(prepaid).toHaveAttribute('aria-expanded', 'false')

    fireEvent.keyDown(window, { key: 'Escape' })
    expect(group).toHaveAttribute('data-mode', 'stacked')
  })
})
