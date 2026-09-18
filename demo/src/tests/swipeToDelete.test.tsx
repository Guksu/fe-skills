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
      item.dispatchEvent(new Event('transitionend')) // propertyName 없음 — grid-template-rows가 아니면 무시
    })
    expect(onDelete).not.toHaveBeenCalled()
    act(() => {
      // jsdom에는 TransitionEvent가 없다 — propertyName만 얹은 일반 이벤트로 대신한다
      const heightEnd = new Event('transitionend')
      Object.defineProperty(heightEnd, 'propertyName', { value: 'grid-template-rows' })
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

describe('SwipeToDelete — 여러 액션 (actions prop)', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  const renderOrder = ({ onDelete = vi.fn() } = {}) => {
    const archive = vi.fn()
    const later = vi.fn()
    const remove = vi.fn()
    const utils = render(
      <SwipeToDelete
        onDelete={onDelete}
        actions={[
          { label: '보관', onClick: archive },
          { label: '나중에', onClick: later, tone: 'accent' },
          { label: '삭제', onClick: remove, tone: 'danger' },
        ]}
      >
        <div>잔치국수 2그릇</div>
      </SwipeToDelete>,
    )
    return { ...utils, archive, later, remove, onDelete }
  }

  it('액션 버튼을 순서대로 렌더하고 tone을 data-tone으로 노출하며 영역은 마지막 액션의 tone을 따른다', () => {
    const { container } = renderOrder()
    const buttons = container.querySelectorAll<HTMLButtonElement>('.swipe-action')
    expect([...buttons].map((button) => button.textContent)).toEqual(['보관', '나중에', '삭제'])
    expect([...buttons].map((button) => button.dataset.tone)).toEqual(['default', 'accent', 'danger'])
    expect(container.querySelector('.swipe-actions')).toHaveAttribute('data-tone', 'danger')
  })

  it('열림 폭은 actionWidth × 액션 수다 — 포커스로 열면 그만큼 밀린다', () => {
    const { container } = renderOrder()
    fireEvent.focus(screen.getByRole('button', { name: '보관' }))
    expect(container.querySelector('.swipe-item')).toHaveAttribute('data-open', 'true')
    expect(container.querySelector<HTMLElement>('.swipe-content')!.style.transform).toBe('translateX(-264px)')
  })

  it('마지막이 아닌 액션은 onClick만 부르고 행을 닫는다 — 접히지 않는다', () => {
    const { container, archive, onDelete } = renderOrder()
    const button = screen.getByRole('button', { name: '보관' })
    fireEvent.focus(button)
    fireEvent.click(button)
    expect(archive).toHaveBeenCalledTimes(1)
    expect(container.querySelector('.swipe-item')).toHaveAttribute('data-state', 'idle')
    expect(container.querySelector('.swipe-item')).toHaveAttribute('data-open', 'false')
    act(() => {
      vi.advanceTimersByTime(600)
    })
    expect(onDelete).not.toHaveBeenCalled()
  })

  it('마지막 액션은 끝까지 밀기(swipeOut)에 연결된다 — 접힌 뒤 onClick과 onDelete가 한 번씩 불린다', () => {
    const { container, remove, later, onDelete } = renderOrder()
    fireEvent.click(screen.getByRole('button', { name: '삭제' }))
    expect(container.querySelector<HTMLElement>('.swipe-content')!.style.transform).toBe('translateX(-100%)')
    expect(container.querySelector('.swipe-item')).toHaveAttribute('data-state', 'deleting')
    expect(remove).not.toHaveBeenCalled()
    act(() => {
      vi.advanceTimersByTime(600)
    })
    expect(remove).toHaveBeenCalledTimes(1)
    expect(onDelete).toHaveBeenCalledTimes(1)
    expect(later).not.toHaveBeenCalled()
  })

  it('actions 없이 actionLabel만 주면 기존처럼 버튼 하나(danger)만 렌더한다', () => {
    const { container } = render(
      <SwipeToDelete onDelete={() => {}} actionLabel="지우기">
        <div>비빔국수</div>
      </SwipeToDelete>,
    )
    const buttons = container.querySelectorAll<HTMLButtonElement>('.swipe-action')
    expect(buttons).toHaveLength(1)
    expect(buttons[0].textContent).toBe('지우기')
    expect(buttons[0].dataset.tone).toBe('danger')
  })
})
