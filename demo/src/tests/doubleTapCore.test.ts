import { createDoubleTap } from '@skills/like-pop/assets/createDoubleTap'

const clickAt = ({ el, x, y }: { el: HTMLElement; x: number; y: number }) => {
  el.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: x, clientY: y }))
}

describe('createDoubleTap — 프레임워크 무관 더블탭 판정 코어', () => {
  let el: HTMLElement
  let taps: Array<{ x: number; y: number }>

  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date', 'performance'] })
    el = document.createElement('div')
    document.body.appendChild(el)
    taps = []
  })
  afterEach(() => {
    vi.useRealTimers()
    el.remove()
  })

  const register = (thresholdMs?: number) =>
    createDoubleTap({ element: el, thresholdMs, onDoubleTap: (point) => taps.push(point) })

  it('판정 시간 안의 두 번 클릭이면 좌표와 함께 발화한다', () => {
    register()
    clickAt({ el, x: 100, y: 50 })
    vi.advanceTimersByTime(200)
    clickAt({ el, x: 102, y: 52 })
    expect(taps).toHaveLength(1)
    expect(taps[0].x).toBeCloseTo(102)
    expect(taps[0].y).toBeCloseTo(52)
  })

  it('판정 시간을 넘긴 두 번째 클릭은 발화하지 않는다', () => {
    register(300)
    clickAt({ el, x: 10, y: 10 })
    vi.advanceTimersByTime(400)
    clickAt({ el, x: 10, y: 10 })
    expect(taps).toHaveLength(0)
  })

  it('두 지점이 멀면(스와이프·오조작) 발화하지 않는다', () => {
    register()
    clickAt({ el, x: 10, y: 10 })
    vi.advanceTimersByTime(100)
    clickAt({ el, x: 200, y: 10 })
    expect(taps).toHaveLength(0)
  })

  it('발화 후에는 카운트가 초기화된다 — 세 번째 클릭이 곧바로 재발화하지 않는다', () => {
    register()
    clickAt({ el, x: 5, y: 5 })
    vi.advanceTimersByTime(100)
    clickAt({ el, x: 5, y: 5 })
    vi.advanceTimersByTime(100)
    clickAt({ el, x: 5, y: 5 })
    expect(taps).toHaveLength(1)
  })

  it('cleanup 후에는 발화하지 않는다', () => {
    const cleanup = register()
    cleanup()
    clickAt({ el, x: 5, y: 5 })
    vi.advanceTimersByTime(100)
    clickAt({ el, x: 5, y: 5 })
    expect(taps).toHaveLength(0)
  })
})
