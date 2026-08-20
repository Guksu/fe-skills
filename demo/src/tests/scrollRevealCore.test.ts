import { revealOnScroll } from '@skills/scroll-reveal/assets/revealOnScroll'

type ObserverRecord = {
  callback: IntersectionObserverCallback
  options?: IntersectionObserverInit
  observed: Element[]
  unobserved: Element[]
  disconnected: boolean
}

const observers: ObserverRecord[] = []

class MockIntersectionObserver implements IntersectionObserver {
  readonly root = null
  readonly rootMargin = ''
  readonly thresholds = []
  private record: ObserverRecord

  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
    this.record = { callback, options, observed: [], unobserved: [], disconnected: false }
    observers.push(this.record)
  }
  observe = (el: Element) => {
    this.record.observed.push(el)
  }
  unobserve = (el: Element) => {
    this.record.unobserved.push(el)
  }
  disconnect = () => {
    this.record.disconnected = true
  }
  takeRecords = () => []
}

const intersect = ({ record, el, isIntersecting }: { record: ObserverRecord; el: Element; isIntersecting: boolean }) => {
  record.callback([{ target: el, isIntersecting } as IntersectionObserverEntry], {} as IntersectionObserver)
}

describe('revealOnScroll — 프레임워크 무관 뷰포트 공개 코어', () => {
  let el: HTMLElement

  beforeEach(() => {
    observers.length = 0
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
    el = document.createElement('div')
    document.body.appendChild(el)
  })
  afterEach(() => {
    vi.unstubAllGlobals()
    el.remove()
  })

  it('등록 즉시 data-revealed=false를 쓰고 옵저버에 등록한다', () => {
    revealOnScroll({ element: el })
    expect(el.dataset.revealed).toBe('false')
    expect(observers[0].observed).toContain(el)
  })

  it('threshold·rootMargin이 옵저버 옵션으로 전달된다', () => {
    revealOnScroll({ element: el, threshold: 0.5, rootMargin: '0px 0px -10% 0px' })
    expect(observers[0].options?.threshold).toBe(0.5)
    expect(observers[0].options?.rootMargin).toBe('0px 0px -10% 0px')
  })

  it('교차 시 data-revealed=true + onChange(true), 기본(once)은 관찰을 멈춘다', () => {
    const changes: boolean[] = []
    revealOnScroll({ element: el, onChange: (revealed) => changes.push(revealed) })
    intersect({ record: observers[0], el, isIntersecting: true })
    expect(el.dataset.revealed).toBe('true')
    expect(changes).toEqual([true])
    expect(observers[0].unobserved).toContain(el)
  })

  it('once=false면 벗어날 때 다시 감춘다', () => {
    revealOnScroll({ element: el, once: false })
    intersect({ record: observers[0], el, isIntersecting: true })
    intersect({ record: observers[0], el, isIntersecting: false })
    expect(el.dataset.revealed).toBe('false')
  })

  it('반환된 cleanup이 옵저버를 해제한다', () => {
    const cleanup = revealOnScroll({ element: el })
    cleanup()
    expect(observers[0].disconnected).toBe(true)
  })

  it('IntersectionObserver가 없으면 즉시 공개한다 (콘텐츠 실종 방지)', () => {
    vi.unstubAllGlobals()
    const original = globalThis.IntersectionObserver
    // @ts-expect-error 폴백 경로 테스트를 위한 의도적 제거
    delete globalThis.IntersectionObserver
    revealOnScroll({ element: el })
    expect(el.dataset.revealed).toBe('true')
    globalThis.IntersectionObserver = original
  })
})
