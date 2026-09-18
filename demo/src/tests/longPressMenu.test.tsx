import { fireEvent, render, screen } from '@testing-library/react'
import { LongPressMenu } from '@skills/long-press-menu/assets/LongPressMenu'

const setup = () => {
  const onSelect = vi.fn()
  render(
    <LongPressMenu
      label="잔치국수 동작"
      items={[
        { label: '장바구니 담기', onSelect: () => onSelect('cart') },
        { label: '즐겨찾기', onSelect: () => onSelect('fav') },
        { label: '숨기기', onSelect: () => onSelect('hide'), destructive: true },
      ]}
    >
      <article>잔치국수</article>
    </LongPressMenu>,
  )
  return { onSelect, trigger: screen.getByText('잔치국수').parentElement as HTMLElement }
}

describe('LongPressMenu — 열림·포커스·닫힘', () => {
  it('열리면 menu 역할이 생기고 첫 항목에 포커스가 간다', () => {
    const { trigger } = setup()
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()

    fireEvent.contextMenu(trigger) // 우클릭 = 길게 누르기와 같은 경로
    expect(trigger).toHaveAttribute('data-open', 'true')
    expect(screen.getByRole('menu', { name: '잔치국수 동작' })).toBeInTheDocument()
    expect(document.activeElement).toBe(screen.getByRole('menuitem', { name: '장바구니 담기' }))
    expect(screen.getByRole('menuitem', { name: '숨기기' })).toHaveAttribute('data-destructive', 'true')
  })

  it('방향키로 순환하고 항목을 고르면 onSelect 후 닫힌다', () => {
    const { onSelect, trigger } = setup()
    fireEvent.contextMenu(trigger)
    const menu = screen.getByRole('menu')

    fireEvent.keyDown(menu, { key: 'ArrowUp' }) // 첫 항목에서 위로 → 마지막으로 감긴다
    expect(document.activeElement).toBe(screen.getByRole('menuitem', { name: '숨기기' }))
    fireEvent.keyDown(menu, { key: 'ArrowDown' })
    expect(document.activeElement).toBe(screen.getByRole('menuitem', { name: '장바구니 담기' }))

    fireEvent.click(screen.getByRole('menuitem', { name: '즐겨찾기' }))
    expect(onSelect).toHaveBeenCalledWith('fav')
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('Esc로 닫히고 포커스가 트리거로 돌아온다', () => {
    const { trigger } = setup()
    fireEvent.contextMenu(trigger)
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'Escape' })

    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    expect(trigger).toHaveAttribute('data-open', 'false')
    expect(document.activeElement).toBe(trigger)
  })
})
