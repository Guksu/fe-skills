import { observeActiveSlide, scrollToSlide } from '@skills/carousel/assets/carouselCore'

type ObserverRecord = {
  callback: IntersectionObserverCallback
  options?: IntersectionObserverInit
  observed: Element[]
  disconnected: boolean
}
const observers: ObserverRecord[] = []

class MockIntersectionObserver implements IntersectionObserver {
  readonly root = null
  readonly rootMargin = ''
  readonly thresholds = []
  private record: ObserverRecord
  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
    this.record = { callback, options, observed: [], disconnected: false }
    observers.push(this.record)
  }
  observe = (el: Element) => this.record.observed.push(el)
  unobserve = () => {}
  disconnect = () => {
    this.record.disconnected = true
  }
  takeRecords = () => []
}

describe('carousel 코어 — 활성 슬라이드 추적과 이동', () => {
  let track: HTMLElement
  let slides: HTMLElement[]

  beforeEach(() => {
    observers.length = 0
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
    track = document.createElement('div')
    Object.defineProperty(track, 'scrollWidth', { value: 960, configurable: true })
    Object.defineProperty(track, 'clientWidth', { value: 320, configurable: true })
    slides = [0, 1, 2].map((i) => {
      const slide = document.createElement('div')
      Object.defineProperty(slide, 'offsetLeft', { value: i * 320 })
      Object.defineProperty(slide, 'offsetWidth', { value: 320 })
      track.appendChild(slide)
      return slide
    })
    document.body.appendChild(track)
  })
  afterEach(() => {
    vi.unstubAllGlobals()
    track.remove()
  })

  it('track의 자식들을 관찰하고, 과반 보이는 슬라이드의 인덱스를 알린다', () => {
    const seen: number[] = []
    observeActiveSlide({ track, onChange: (index) => seen.push(index) })
    expect(observers[0].observed).toHaveLength(3)
    observers[0].callback(
      [{ target: slides[1], isIntersecting: true } as unknown as IntersectionObserverEntry],
      {} as IntersectionObserver,
    )
    expect(seen).toEqual([1])
  })

  it('같은 인덱스 반복 통지는 걸러진다', () => {
    const seen: number[] = []
    observeActiveSlide({ track, onChange: (index) => seen.push(index) })
    const entry = [{ target: slides[2], isIntersecting: true } as unknown as IntersectionObserverEntry]
    observers[0].callback(entry, {} as IntersectionObserver)
    observers[0].callback(entry, {} as IntersectionObserver)
    expect(seen).toEqual([2])
  })

  it('cleanup이 옵저버를 해제한다', () => {
    const cleanup = observeActiveSlide({ track, onChange: () => {} })
    cleanup()
    expect(observers[0].disconnected).toBe(true)
  })

  it('scrollToSlide(auto)는 중앙 정렬 목표 좌표로 즉시 스크롤한다', () => {
    const calls: ScrollToOptions[] = []
    track.scrollTo = ((options: ScrollToOptions) => calls.push(options)) as typeof track.scrollTo
    scrollToSlide({ track, index: 2, behavior: 'auto' })
    expect(calls[0]).toMatchObject({ left: 640 })
  })

  it('scrollToSlide(smooth)는 rAF 보간으로 이동하고, 이동 중에는 스냅을 껐다가 복원한다', () => {
    vi.useFakeTimers({ toFake: ['requestAnimationFrame', 'cancelAnimationFrame', 'performance'] })
    scrollToSlide({ track, index: 2, behavior: 'smooth' })
    vi.advanceTimersByTime(50)
    expect(track.style.scrollSnapType).toBe('none')
    expect(track.scrollLeft).toBeGreaterThan(0)
    expect(track.scrollLeft).toBeLessThan(640)
    vi.advanceTimersByTime(600)
    expect(track.scrollLeft).toBe(640)
    expect(track.style.scrollSnapType).toBe('')
    vi.useRealTimers()
  })

  it('scrollToSlide는 범위 밖 인덱스를 무시한다', () => {
    const calls: ScrollToOptions[] = []
    track.scrollTo = ((options: ScrollToOptions) => calls.push(options)) as typeof track.scrollTo
    scrollToSlide({ track, index: 9 })
    scrollToSlide({ track, index: -1 })
    expect(calls).toHaveLength(0)
  })
})
