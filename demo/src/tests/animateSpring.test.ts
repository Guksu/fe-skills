import { animateSpring } from '@skills/spring-physics/assets/animateSpring'

describe('animateSpring — rAF 재생·재타게팅·중단', () => {
  beforeEach(() => vi.useFakeTimers({ toFake: ['requestAnimationFrame', 'cancelAnimationFrame', 'performance', 'Date'] }))
  afterEach(() => vi.useRealTimers())

  it('프레임마다 값을 주고 정착하면 onComplete를 부른다', () => {
    const values: number[] = []
    const onComplete = vi.fn()
    animateSpring({ from: 100, to: 0, onUpdate: (v) => values.push(v), onComplete })
    vi.advanceTimersByTime(3000)
    expect(values.length).toBeGreaterThan(10)
    expect(values.at(-1)).toBe(0)
    expect(onComplete).toHaveBeenCalledTimes(1)
  })

  it('retarget은 현재 위치·속도에서 새 목표로 출발한다 (점프 없음)', () => {
    const values: number[] = []
    const handle = animateSpring({ from: 100, to: 0, onUpdate: (v) => values.push(v) })
    vi.advanceTimersByTime(80)
    const before = handle.current()
    expect(before.value).toBeLessThan(100)
    expect(before.value).toBeGreaterThan(0)
    handle.retarget(200)
    vi.advanceTimersByTime(16)
    const first = values.at(-1)!
    expect(Math.abs(first - before.value)).toBeLessThan(15) // 이어서 움직인다
    vi.advanceTimersByTime(3000)
    expect(values.at(-1)).toBe(200)
  })

  it('stop 뒤에는 onUpdate가 더 오지 않는다', () => {
    const onUpdate = vi.fn()
    const handle = animateSpring({ from: 10, to: 0, onUpdate })
    vi.advanceTimersByTime(32)
    handle.stop()
    const calls = onUpdate.mock.calls.length
    vi.advanceTimersByTime(500)
    expect(onUpdate.mock.calls.length).toBe(calls)
  })

  it('정착한 핸들에 retarget하면 다시 살아난다', () => {
    const values: number[] = []
    const handle = animateSpring({ from: 1, to: 0, onUpdate: (v) => values.push(v) })
    vi.advanceTimersByTime(3000)
    const settled = values.length
    handle.retarget(50)
    vi.advanceTimersByTime(3000)
    expect(values.length).toBeGreaterThan(settled)
    expect(values.at(-1)).toBe(50)
  })
})
