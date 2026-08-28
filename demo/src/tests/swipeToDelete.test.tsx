import { render, screen, fireEvent, act } from '@testing-library/react'
import { SwipeToDelete } from '@skills/swipe-to-delete/assets/SwipeToDelete'

describe('SwipeToDelete — 버튼 삭제 → 접힘 → onDelete', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('삭제 버튼을 누르면 내용이 빠지고 행이 deleting 상태로 접힌 뒤 onDelete가 불린다', () => {
    const onDelete = vi.fn()
    const { container } = render(
      <SwipeToDelete onDelete={onDelete}>
        <div>멸치국수</div>
      </SwipeToDelete>,
    )
    const item = container.querySelector('.swipe-item')!
    fireEvent.click(screen.getByRole('button', { name: '삭제' }))
    expect(container.querySelector<HTMLElement>('.swipe-content')!.style.transform).toBe('translateX(-100%)')
    expect(item).toHaveAttribute('data-state', 'deleting')
    expect(onDelete).not.toHaveBeenCalled()
    act(() => {
      item.dispatchEvent(new Event('transitionend')) // propertyName 없음 — height가 아니면 무시
    })
    expect(onDelete).not.toHaveBeenCalled()
    act(() => {
      // jsdom에는 TransitionEvent가 없다 — propertyName만 얹은 일반 이벤트로 대신한다
      const heightEnd = new Event('transitionend')
      Object.defineProperty(heightEnd, 'propertyName', { value: 'height' })
      item.dispatchEvent(heightEnd)
    })
    expect(onDelete).toHaveBeenCalledTimes(1)
  })

  it('transitionend가 오지 않아도 폴백 타이머로 onDelete가 한 번만 불린다', () => {
    const onDelete = vi.fn()
    render(
      <SwipeToDelete onDelete={onDelete}>
        <div>비빔국수</div>
      </SwipeToDelete>,
    )
    fireEvent.click(screen.getByRole('button', { name: '삭제' }))
    act(() => {
      vi.advanceTimersByTime(600)
    })
    expect(onDelete).toHaveBeenCalledTimes(1)
  })

  it('삭제 버튼이 포커스를 받으면 행이 열려 버튼이 보인다 (키보드 경로)', () => {
    const { container } = render(
      <SwipeToDelete onDelete={() => {}}>
        <div>들깨칼국수</div>
      </SwipeToDelete>,
    )
    const button = screen.getByRole('button', { name: '삭제' })
    fireEvent.focus(button)
    expect(container.querySelector('.swipe-item')).toHaveAttribute('data-open', 'true')
    fireEvent.blur(button)
    expect(container.querySelector('.swipe-item')).toHaveAttribute('data-open', 'false')
  })
})
