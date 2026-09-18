import { act, fireEvent, render, screen } from '@testing-library/react'
import { EdgeSwipeBackDemo } from '../demos/edge-swipe-back/EdgeSwipeBackDemo'

const pointer = ({ el, type, x, t }: { el: HTMLElement; type: string; x: number; t: number }) => {
  const event = new MouseEvent(type, { bubbles: true, clientX: x, clientY: 100, button: 0 })
  Object.defineProperty(event, 'timeStamp', { value: t })
  Object.defineProperty(event, 'pointerId', { value: 1 })
  act(() => {
    el.dispatchEvent(event)
  })
}

/** jsdom에는 View Transitions가 없다 — page-transition 코어의 폴백(즉시 교체)으로 push된다 */
describe('useEdgeSwipeBack — 데모 화면 스택과 결합', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['requestAnimationFrame', 'cancelAnimationFrame', 'performance', 'Date'] })
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('상세로 들어간 뒤 가장자리를 끌어 놓으면 스프링이 끝난 뒤 목록으로 pop되고 스타일이 걷힌다', () => {
    const { container } = render(<EdgeSwipeBackDemo />)
    fireEvent.click(screen.getByRole('button', { name: /잔치국수/ }))
    expect(screen.getByText('잔치국수', { selector: 'strong' })).toBeInTheDocument()

    const box = container.querySelector<HTMLElement>('.edge-swipe')!
    const current = container.querySelector<HTMLElement>('.edge-swipe-screen')!
    box.getBoundingClientRect = () => ({ left: 0, top: 0, width: 400, height: 500 }) as DOMRect

    pointer({ el: box, type: 'pointerdown', x: 10, t: 0 })
    pointer({ el: box, type: 'pointermove', x: 250, t: 300 }) // 0.6 ≥ 0.4
    expect(current.style.transform).toBe('translateX(240px)')
    pointer({ el: box, type: 'pointerup', x: 250, t: 320 })
    act(() => {
      vi.advanceTimersByTime(3000)
    })

    expect(screen.getByText('성수동 국수집', { selector: 'strong' })).toBeInTheDocument()
    expect(current.style.transform).toBe('')
    expect(screen.queryByRole('button', { name: '← 뒤로' })).not.toBeInTheDocument()
  })

  it('첫 화면(뒤로 갈 곳 없음)에서는 가장자리를 끌어도 움직이지 않는다', () => {
    const { container } = render(<EdgeSwipeBackDemo />)
    const box = container.querySelector<HTMLElement>('.edge-swipe')!
    const current = container.querySelector<HTMLElement>('.edge-swipe-screen')!
    box.getBoundingClientRect = () => ({ left: 0, top: 0, width: 400, height: 500 }) as DOMRect
    pointer({ el: box, type: 'pointerdown', x: 10, t: 0 })
    pointer({ el: box, type: 'pointermove', x: 200, t: 16 })
    expect(current.style.transform).toBe('')
  })
})
