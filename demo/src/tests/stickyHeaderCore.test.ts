import { observeHeaderCollapse } from '@skills/sticky-header/assets/observeHeaderCollapse'

type ObserverRecord = {
  callback: IntersectionObserverCallback
  observed: Element[]
  disconnected: boolean
}
const observers: ObserverRecord[] = []

class MockIntersectionObserver implements IntersectionObserver {
  readonly root = null
  readonly rootMargin = ''
  readonly thresholds = []
  private record: ObserverRecord
  constructor(callback: IntersectionObserverCallback) {
    this.record = { callback, observed: [], disconnected: false }
    observers.push(this.record)
  }
  observe = (el: Element) => this.record.observed.push(el)
  unobserve = () => {}
  disconnect = () => {
    this.record.disconnected = true
  }
  takeRecords = () => []
}

const intersect = ({ el, isIntersecting }: { el: Element; isIntersecting: boolean }) => {
  observers[0].callback([{ target: el, isIntersecting } as IntersectionObserverEntry], {} as IntersectionObserver)
}

describe('observeHeaderCollapse — 센티널 이탈로 헤더 상태 전환', () => {
  let header: HTMLElement
  let sentinel: HTMLElement

  beforeEach(() => {
    observers.length = 0
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
    header = document.createElement('header')
    sentinel = document.createElement('div')
    document.body.append(header, sentinel)
  })
  afterEach(() => {
    vi.unstubAllGlobals()
    header.remove()
    sentinel.remove()
  })

  it('초기에는 data-collapsed=false이고 센티널을 관찰한다', () => {
    observeHeaderCollapse({ header, sentinel })
    expect(header.dataset.collapsed).toBe('false')
    expect(observers[0].observed).toContain(sentinel)
  })

  it('센티널이 뷰포트를 벗어나면 collapsed=true, 돌아오면 false', () => {
    const states: boolean[] = []
    observeHeaderCollapse({ header, sentinel, onChange: (collapsed) => states.push(collapsed) })
    intersect({ el: sentinel, isIntersecting: false })
    expect(header.dataset.collapsed).toBe('true')
    intersect({ el: sentinel, isIntersecting: true })
    expect(header.dataset.collapsed).toBe('false')
    expect(states).toEqual([true, false])
  })

  it('cleanup이 옵저버를 해제한다', () => {
    const cleanup = observeHeaderCollapse({ header, sentinel })
    cleanup()
    expect(observers[0].disconnected).toBe(true)
  })

  it('IntersectionObserver가 없으면 펼침 상태로 남는다 (기능 저하 폴백)', () => {
    vi.unstubAllGlobals()
    const original = globalThis.IntersectionObserver
    // @ts-expect-error 폴백 경로 테스트를 위한 의도적 제거
    delete globalThis.IntersectionObserver
    observeHeaderCollapse({ header, sentinel })
    expect(header.dataset.collapsed).toBe('false')
    globalThis.IntersectionObserver = original
  })
})
