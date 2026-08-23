import { captureFlip } from '@skills/flip-list/assets/captureFlip'

const setRect = ({ el, top, left }: { el: HTMLElement; top: number; left: number }) => {
  el.getBoundingClientRect = () =>
    ({ top, left, width: 100, height: 40, right: left + 100, bottom: top + 40, x: left, y: top, toJSON: () => ({}) }) as DOMRect
}

describe('captureFlip — 재배치 전후 위치 차이를 transform으로 재생', () => {
  let container: HTMLElement
  let a: HTMLElement
  let b: HTMLElement

  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'requestAnimationFrame', 'cancelAnimationFrame'] })
    container = document.createElement('ul')
    a = document.createElement('li')
    a.dataset.flipId = 'a'
    b = document.createElement('li')
    b.dataset.flipId = 'b'
    container.append(a, b)
    document.body.appendChild(container)
    setRect({ el: a, top: 0, left: 0 })
    setRect({ el: b, top: 50, left: 0 })
  })
  afterEach(() => {
    vi.useRealTimers()
    container.remove()
  })

  it('이동한 요소는 이전 위치로 되돌린(invert) 뒤 프레임 뒤에 제자리로 전환한다', () => {
    const flip = captureFlip({ container })
    // 재배치: a와 b가 자리를 바꿈
    setRect({ el: a, top: 50, left: 0 })
    setRect({ el: b, top: 0, left: 0 })
    flip.play({ durationMs: 200 })
    expect(a.style.transform).toBe('translate(0px, -50px)')
    expect(b.style.transform).toBe('translate(0px, 50px)')
    expect(a.style.transition).toBe('none')
    vi.advanceTimersByTime(50)
    expect(a.style.transform).toBe('')
    expect(a.style.transition).toContain('200ms')
    a.dispatchEvent(new Event('transitionend'))
    expect(a.style.transition).toBe('')
  })

  it('움직이지 않은 요소는 건드리지 않는다', () => {
    const flip = captureFlip({ container })
    setRect({ el: b, top: 90, left: 0 })
    flip.play()
    expect(a.style.transform).toBe('')
    expect(b.style.transform).not.toBe('')
  })

  it('캡처 이후 새로 생긴 요소(data-flip-id 미등록)는 무시한다', () => {
    const flip = captureFlip({ container })
    const c = document.createElement('li')
    c.dataset.flipId = 'c'
    setRect({ el: c, top: 100, left: 0 })
    container.appendChild(c)
    flip.play()
    expect(c.style.transform).toBe('')
  })

  it('prefers-reduced-motion이면 재생하지 않는다', () => {
    vi.stubGlobal('matchMedia', (query: string) => ({ matches: query.includes('prefers-reduced-motion') }))
    const flip = captureFlip({ container })
    setRect({ el: a, top: 50, left: 0 })
    flip.play()
    expect(a.style.transform).toBe('')
    vi.unstubAllGlobals()
  })
})
