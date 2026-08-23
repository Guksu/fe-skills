import { createStoryProgress } from '@skills/story-progress/assets/createStoryProgress'

const scaleOf = (bar: HTMLElement) => bar.style.transform

describe('createStoryProgress — 구간 진행·일시정지·이동', () => {
  let bars: HTMLElement[]
  let completed: number

  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'requestAnimationFrame', 'cancelAnimationFrame', 'performance', 'Date'] })
    bars = [0, 1, 2].map(() => {
      const bar = document.createElement('span')
      document.body.appendChild(bar)
      return bar
    })
    completed = 0
  })
  afterEach(() => {
    vi.useRealTimers()
    bars.forEach((bar) => bar.remove())
  })

  const make = () =>
    createStoryProgress({ bars, durationMs: 1000, onComplete: () => (completed += 1) })

  it('start 후 현재 구간이 차오르고, 다 차면 다음 구간으로 넘어간다', () => {
    const story = make()
    story.start()
    vi.advanceTimersByTime(500)
    expect(scaleOf(bars[0])).toMatch(/scaleX\(0\.\d+\)/)
    vi.advanceTimersByTime(600)
    expect(scaleOf(bars[0])).toBe('scaleX(1)')
    expect(story.getIndex()).toBe(1)
  })

  it('pause는 진행을 멈추고 resume은 멈춘 지점부터 잇는다', () => {
    const story = make()
    story.start()
    vi.advanceTimersByTime(400)
    story.pause()
    const frozen = scaleOf(bars[0])
    vi.advanceTimersByTime(1000)
    expect(scaleOf(bars[0])).toBe(frozen)
    story.resume()
    vi.advanceTimersByTime(700)
    expect(story.getIndex()).toBe(1)
  })

  it('next/prev는 구간을 이동하며 지난 구간은 1, 미래 구간은 0으로 표시된다', () => {
    const story = make()
    story.start()
    story.next()
    expect(story.getIndex()).toBe(1)
    expect(scaleOf(bars[0])).toBe('scaleX(1)')
    story.prev()
    expect(story.getIndex()).toBe(0)
    expect(scaleOf(bars[1])).toBe('scaleX(0)')
  })

  it('마지막 구간이 끝나면 onComplete가 한 번 불린다', () => {
    const story = make()
    story.start()
    vi.advanceTimersByTime(3500)
    expect(completed).toBe(1)
  })

  it('stop 후에는 진행이 없다', () => {
    const story = make()
    story.start()
    story.stop()
    vi.advanceTimersByTime(2000)
    expect(story.getIndex()).toBe(0)
    expect(completed).toBe(0)
  })
})
