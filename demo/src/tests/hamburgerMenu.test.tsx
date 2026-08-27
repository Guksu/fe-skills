import { useState } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { HamburgerButton, Drawer } from '@skills/hamburger-menu/assets/HamburgerMenu'

const Harness = () => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <HamburgerButton open={open} onToggle={() => setOpen((prev) => !prev)} label="메뉴 열기" />
      <Drawer open={open} onClose={() => setOpen(false)}>
        <a href="#menu">면 메뉴</a>
      </Drawer>
    </>
  )
}

describe('HamburgerButton + Drawer — 토글·Esc·백드롭·스크롤 잠금', () => {
  afterEach(() => {
    document.body.style.overflow = ''
  })

  it('버튼 토글이 aria-expanded와 드로어 data-open을 함께 바꾼다', () => {
    render(<Harness />)
    const button = screen.getByRole('button', { name: '메뉴 열기' })
    expect(button).toHaveAttribute('aria-expanded', 'false')
    fireEvent.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('dialog')).toHaveAttribute('data-open', 'true')
    fireEvent.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'false')
  })

  it('Escape로 닫힌다', () => {
    render(<Harness />)
    fireEvent.click(screen.getByRole('button', { name: '메뉴 열기' }))
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(screen.getByRole('button', { name: '메뉴 열기' })).toHaveAttribute('aria-expanded', 'false')
  })

  it('백드롭 클릭으로 닫힌다', () => {
    const { container } = render(<Harness />)
    fireEvent.click(screen.getByRole('button', { name: '메뉴 열기' }))
    fireEvent.click(container.querySelector('.drawer-backdrop')!)
    expect(screen.getByRole('button', { name: '메뉴 열기' })).toHaveAttribute('aria-expanded', 'false')
  })

  it('열려 있는 동안 body 스크롤이 잠기고 닫으면 풀린다', () => {
    render(<Harness />)
    const button = screen.getByRole('button', { name: '메뉴 열기' })
    fireEvent.click(button)
    expect(document.body.style.overflow).toBe('hidden')
    fireEvent.click(button)
    expect(document.body.style.overflow).toBe('')
  })
})
