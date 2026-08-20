import { createCountUp } from '@skills/count-up/assets/createCountUp'

const advance = (ms: number) => {
  vi.advanceTimersByTime(ms)
}

describe('createCountUp — 프레임워크 무관 숫자 보간 코어', () => {
  let el: HTMLElement

  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'requestAnimationFrame', 'cancelAnimationFrame', 'performance'] })
    el = document.createElement('span')
    document.body.appendChild(el)
  })
  afterEach(() => {
    vi.useRealTimers()
    el.remove()
  })

  it('start() 후 시간이 지나면 중간값을 거쳐 정확히 목표값으로 끝난다', () => {
    const counter = createCountUp({ element: el, to: 1000, durationMs: 400 })
    counter.start()
    advance(200)
    const mid = Number(el.textContent!.replace(/,/g, ''))
    expect(mid).toBeGreaterThan(0)
    expect(mid).toBeLessThan(1000)
    advance(400)
    expect(el.textContent).toBe('1,000')
  })

  it('기본 포맷은 정수 반올림 + 천 단위 구분표기다', () => {
    const counter = createCountUp({ element: el, to: 1234567, durationMs: 200 })
    counter.start()
    advance(300)
    expect(el.textContent).toBe('1,234,567')
  })

  it('값은 단조 증가한다 (감소 방향이면 단조 감소)', () => {
    const seen: number[] = []
    const counter = createCountUp({
      element: el,
      to: 500,
      durationMs: 300,
      onUpdate: (value) => seen.push(value),
    })
    counter.start()
    advance(500)
    const sorted = [...seen].sort((a, b) => a - b)
    expect(seen).toEqual(sorted)
    expect(seen.at(-1)).toBe(500)
  })

  it('from > to면 감소하며 목표값으로 끝난다', () => {
    const counter = createCountUp({ element: el, from: 900, to: 100, durationMs: 200 })
    counter.start()
    advance(300)
    expect(el.textContent).toBe('100')
  })

  it('커스텀 format이 적용된다', () => {
    const counter = createCountUp({
      element: el,
      to: 42,
      durationMs: 100,
      format: (value) => `${Math.round(value)}원`,
    })
    counter.start()
    advance(200)
    expect(el.textContent).toBe('42원')
  })

  it('stop()은 진행을 멈추고 이후 갱신이 없다', () => {
    const counter = createCountUp({ element: el, to: 1000, durationMs: 400 })
    counter.start()
    advance(100)
    counter.stop()
    const frozen = el.textContent
    advance(500)
    expect(el.textContent).toBe(frozen)
  })

  it('prefers-reduced-motion이면 애니메이션 없이 즉시 목표값을 쓴다', () => {
    vi.stubGlobal('matchMedia', (query: string) => ({ matches: query.includes('prefers-reduced-motion') }))
    const counter = createCountUp({ element: el, to: 777, durationMs: 400 })
    counter.start()
    expect(el.textContent).toBe('777')
    vi.unstubAllGlobals()
  })
})
