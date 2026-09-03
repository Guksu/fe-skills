import { createHoldRepeat } from '@skills/quantity-stepper/assets/createHoldRepeat'

describe('createHoldRepeat — 길게 누르면 반복, 오래 누를수록 빨라짐', () => {
  let calls: number
  let controller: ReturnType<typeof createHoldRepeat>

  beforeEach(() => {
    vi.useFakeTimers()
    calls = 0
  })
  afterEach(() => {
    controller?.stop()
    vi.useRealTimers()
  })

  const register = (options: Partial<Parameters<typeof createHoldRepeat>[0]> = {}) => {
    controller = createHoldRepeat({ onRepeat: () => (calls += 1), ...options })
    return controller
  }

  it('지연 시간이 지나기 전에는 반복하지 않는다 (짧게 누른 것이 연타가 되지 않게)', () => {
    register({ delayMs: 400 }).start()

    vi.advanceTimersByTime(399)
    expect(calls).toBe(0)
  })

  it('지연이 지나면 반복이 시작된다', () => {
    register({ delayMs: 400, intervalMs: 160 }).start()

    vi.advanceTimersByTime(400)
    expect(calls).toBe(1)

    vi.advanceTimersByTime(160 * 0.82)
    expect(calls).toBe(2)
  })

  it('반복할수록 간격이 짧아진다', () => {
    register({ delayMs: 0, intervalMs: 100, acceleration: 0.5, minIntervalMs: 10 }).start()

    vi.advanceTimersByTime(0)
    expect(calls).toBe(1) // 첫 반복

    vi.advanceTimersByTime(50) // 100 * 0.5
    expect(calls).toBe(2)

    vi.advanceTimersByTime(25) // 50 * 0.5
    expect(calls).toBe(3)
  })

  it('간격에는 하한이 있다 — 무한히 빨라지지 않는다', () => {
    register({ delayMs: 0, intervalMs: 100, acceleration: 0.1, minIntervalMs: 40 }).start()

    vi.advanceTimersByTime(0)
    vi.advanceTimersByTime(40)
    vi.advanceTimersByTime(39)
    expect(calls).toBe(2) // 40ms보다 짧게는 오지 않는다

    vi.advanceTimersByTime(1)
    expect(calls).toBe(3)
  })

  it('떼면 멈춘다', () => {
    const held = register({ delayMs: 100 })
    held.start()
    held.stop()

    vi.advanceTimersByTime(5000)
    expect(calls).toBe(0)
    expect(held.isRunning()).toBe(false)
  })

  it('다시 누르면 간격이 처음 속도로 돌아간다', () => {
    const held = register({ delayMs: 0, intervalMs: 100, acceleration: 0.5, minIntervalMs: 10 })
    held.start()
    vi.advanceTimersByTime(0)
    vi.advanceTimersByTime(50)
    vi.advanceTimersByTime(25)
    expect(calls).toBe(3)

    held.stop()
    held.start()
    vi.advanceTimersByTime(0)
    expect(calls).toBe(4)
    vi.advanceTimersByTime(49) // 25ms가 아니라 100 * 0.5 = 50ms를 기다린다
    expect(calls).toBe(4)
    vi.advanceTimersByTime(1)
    expect(calls).toBe(5)
  })
})
