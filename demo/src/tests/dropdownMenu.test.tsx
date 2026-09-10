import { fireEvent, render, screen } from '@testing-library/react'
import { DropdownMenu, type MenuItem } from '@skills/dropdown-menu/assets/DropdownMenu'

const makeItems = (onSelect: (id: string) => void): MenuItem[] => [
  { id: 'rename', label: '이름 바꾸기', onSelect: () => onSelect('rename') },
  { id: 'share', label: '공유하기', onSelect: () => onSelect('share') },
  { id: 'archive', label: '보관하기', onSelect: () => onSelect('archive'), disabled: true },
  { id: 'delete', label: '삭제하기', onSelect: () => onSelect('delete'), danger: true },
]

describe('DropdownMenu — 로빙 포커스와 닫기 규칙', () => {
  const trigger = () => screen.getByRole('button', { name: '주문 관리' })
  const setup = () => {
    const onSelect = vi.fn()
    render(<DropdownMenu label="주문 관리" items={makeItems(onSelect)} />)
    return { onSelect }
  }

  it('닫혀 있을 때는 메뉴가 감춰지고 트리거가 메뉴를 가리킨다', () => {
    setup()

    expect(trigger()).toHaveAttribute('aria-haspopup', 'menu')
    expect(trigger()).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('menu')).not.toBeInTheDocument() // hidden이라 접근성 트리에서 빠진다
  })

  it('누르면 열리고 첫 항목으로 포커스가 옮겨 간다 (메뉴는 aria-activedescendant가 아니라 실제 포커스)', () => {
    setup()
    fireEvent.click(trigger())

    expect(trigger()).toHaveAttribute('aria-expanded', 'true')
    expect(document.activeElement).toBe(screen.getByRole('menuitem', { name: '이름 바꾸기' }))
  })

  it('위 방향키로 열면 마지막 항목부터 들어간다', () => {
    setup()
    fireEvent.keyDown(trigger(), { key: 'ArrowUp' })

    expect(document.activeElement).toBe(screen.getByRole('menuitem', { name: '삭제하기' }))
  })

  it('방향키로 옮기고 끝에서는 반대편으로 감긴다', () => {
    setup()
    fireEvent.click(trigger())
    const menu = screen.getByRole('menu')

    fireEvent.keyDown(menu, { key: 'ArrowDown' })
    expect(document.activeElement).toBe(screen.getByRole('menuitem', { name: '공유하기' }))

    fireEvent.keyDown(menu, { key: 'End' })
    expect(document.activeElement).toBe(screen.getByRole('menuitem', { name: '삭제하기' }))

    fireEvent.keyDown(menu, { key: 'ArrowDown' })
    expect(document.activeElement).toBe(screen.getByRole('menuitem', { name: '이름 바꾸기' }))
  })

  it('비활성 항목은 방향키가 건너뛴다', () => {
    setup()
    fireEvent.click(trigger())
    const menu = screen.getByRole('menu')

    fireEvent.keyDown(menu, { key: 'ArrowDown' })
    fireEvent.keyDown(menu, { key: 'ArrowDown' })
    // 공유하기 다음은 보관하기(비활성)가 아니라 삭제하기다
    expect(document.activeElement).toBe(screen.getByRole('menuitem', { name: '삭제하기' }))
  })

  it('첫 글자를 치면 그 항목으로 건너뛴다', () => {
    setup()
    fireEvent.click(trigger())

    fireEvent.keyDown(screen.getByRole('menu'), { key: '삭' })
    expect(document.activeElement).toBe(screen.getByRole('menuitem', { name: '삭제하기' }))
  })

  it('항목을 고르면 실행하고 닫으며 포커스를 트리거로 되돌린다', () => {
    const { onSelect } = setup()
    fireEvent.click(trigger())
    fireEvent.click(screen.getByRole('menuitem', { name: '공유하기' }))

    expect(onSelect).toHaveBeenCalledWith('share')
    expect(trigger()).toHaveAttribute('aria-expanded', 'false')
    expect(document.activeElement).toBe(trigger())
  })

  it('비활성 항목은 눌러도 실행되지 않는다', () => {
    const { onSelect } = setup()
    fireEvent.click(trigger())
    fireEvent.click(screen.getByRole('menuitem', { name: '보관하기' }))

    expect(onSelect).not.toHaveBeenCalled()
    expect(trigger()).toHaveAttribute('aria-expanded', 'true')
  })

  it('Escape로 닫으면 포커스가 트리거로 돌아온다', () => {
    setup()
    fireEvent.click(trigger())
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'Escape' })

    expect(trigger()).toHaveAttribute('aria-expanded', 'false')
    expect(document.activeElement).toBe(trigger())
  })

  it('바깥을 누르면 닫히되 포커스를 빼앗지 않는다 — 누른 곳을 누르려던 것이다', () => {
    setup()
    fireEvent.click(trigger())

    fireEvent.pointerDown(document.body)
    expect(trigger()).toHaveAttribute('aria-expanded', 'false')
    expect(document.activeElement).not.toBe(trigger())
  })

  it('Tab으로 빠져나가면 닫히되 포커스는 탭이 가는 곳에 맡긴다', () => {
    setup()
    fireEvent.click(trigger())
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'Tab' })

    expect(trigger()).toHaveAttribute('aria-expanded', 'false')
    expect(document.activeElement).not.toBe(trigger())
  })
})
