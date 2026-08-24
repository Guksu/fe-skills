import { flyToTarget } from '@skills/cart-fly/assets/flyToTarget'

const withRect = ({ el, top, left, width = 80, height = 80 }: { el: HTMLElement; top: number; left: number; width?: number; height?: number }) => {
  el.getBoundingClientRect = () =>
    ({ top, left, width, height, right: left + width, bottom: top + height, x: left, y: top, toJSON: () => ({}) }) as DOMRect
  return el
}

describe('flyToTarget — 고스트가 출발지에서 목적지로 날아간다', () => {
  let source: HTMLElement
  let target: HTMLElement
  let arrived: number

  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'requestAnimationFrame', 'cancelAnimationFrame'] })
    source = withRect({ el: document.createElement('div'), top: 300, left: 100 })
    source.textContent = '🍜'
    target = withRect({ el: document.createElement('button'), top: 20, left: 500, width: 40, height: 40 })
    document.body.append(source, target)
    arrived = 0
  })
  afterEach(() => {
    vi.useRealTimers()
    document.querySelectorAll('.fly-ghost').forEach((ghost) => ghost.remove())
    source.remove()
    target.remove()
  })

  it('출발지 복제 고스트를 body에 띄우고, 프레임 뒤 목적지로 향하는 transform이 걸린다', () => {
    flyToTarget({ source, target, onArrive: () => (arrived += 1) })
    const ghost = document.querySelector('.fly-ghost') as HTMLElement
    expect(ghost).not.toBeNull()
    expect(ghost.textContent).toBe('🍜')
    expect(ghost.style.left).toBe('100px')
    expect(ghost.style.top).toBe('300px')
    vi.advanceTimersByTime(50)
    const inner = ghost.firstElementChild as HTMLElement
    expect(ghost.style.transform).toContain('translateX')
    expect(inner.style.transform).toContain('translateY')
  })

  it("기본 궤적(j자)은 가로 linear·세로 ease-in, arc: 'vertical-first'(r자)는 이징이 서로 바뀐다", () => {
    flyToTarget({ source, target })
    const jGhost = document.querySelector('.fly-ghost') as HTMLElement
    const jInner = jGhost.firstElementChild as HTMLElement
    expect(jGhost.style.transition).toContain('linear')
    expect(jInner.style.transition).toContain('cubic-bezier(0.55, 0, 1, 0.45)')
    jGhost.remove()

    flyToTarget({ source, target, arc: 'vertical-first' })
    const rGhost = document.querySelector('.fly-ghost') as HTMLElement
    const rInner = rGhost.firstElementChild as HTMLElement
    expect(rGhost.style.transition).toContain('cubic-bezier(0.55, 0, 1, 0.45)')
    expect(rInner.style.transition).toContain('transform 600ms linear')
  })

  it('안쪽 요소는 display: block이다 — 인라인 요소(span 등) 복제 시 transform이 무시되어 직선 비행이 되는 것을 막는다', () => {
    const inlineSource = withRect({ el: document.createElement('span'), top: 300, left: 100 })
    document.body.appendChild(inlineSource)
    flyToTarget({ source: inlineSource, target })
    const inner = document.querySelector('.fly-ghost')!.firstElementChild as HTMLElement
    expect(inner.style.display).toBe('block')
    inlineSource.remove()
  })

  it('안쪽(세로) 전환이 끝나면 고스트가 제거되고 onArrive가 불린다', () => {
    flyToTarget({ source, target, onArrive: () => (arrived += 1) })
    vi.advanceTimersByTime(50)
    const ghost = document.querySelector('.fly-ghost') as HTMLElement
    const inner = ghost.firstElementChild as HTMLElement
    inner.dispatchEvent(new Event('transitionend'))
    expect(arrived).toBe(1)
    expect(document.querySelector('.fly-ghost')).toBeNull()
  })

  it('transitionend가 유실돼도 타임아웃 폴백으로 정리된다', () => {
    flyToTarget({ source, target, durationMs: 400, onArrive: () => (arrived += 1) })
    vi.advanceTimersByTime(1000)
    expect(arrived).toBe(1)
    expect(document.querySelector('.fly-ghost')).toBeNull()
  })

  it('prefers-reduced-motion이면 고스트 없이 즉시 onArrive', () => {
    vi.stubGlobal('matchMedia', (query: string) => ({ matches: query.includes('prefers-reduced-motion') }))
    flyToTarget({ source, target, onArrive: () => (arrived += 1) })
    expect(document.querySelector('.fly-ghost')).toBeNull()
    expect(arrived).toBe(1)
    vi.unstubAllGlobals()
  })
})
