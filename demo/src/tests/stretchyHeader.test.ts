import { createStretchyHeader } from '@skills/stretchy-header/assets/createStretchyHeader'

// jsdom에는 PointerEvent가 없다 — 코어는 clientX/Y·button만 읽으므로 MouseEvent로 대체한다
const pointer = ({ el, type, x = 0, y }: { el: EventTarget; type: string; x?: number; y: number }) => {
  el.dispatchEvent(new MouseEvent(type, { bubbles: true, clientX: x, clientY: y, button: 0 }))
}

describe('createStretchyHeader — 당김 제스처와 스크롤 패럴랙스', () => {
  let container: HTMLElement
  let image: HTMLElement
  let destroy: () => void

  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['requestAnimationFrame', 'cancelAnimationFrame'] })
    container = document.createElement('div')
    image = document.createElement('div')
    container.appendChild(image)
    document.body.appendChild(container)
    Object.defineProperty(container, 'scrollTop', { value: 0, writable: true })
    destroy = createStretchyHeader({ container, image, headerHeight: 240 })
  })
  afterEach(() => {
    destroy()
    vi.useRealTimers()
    container.remove()
  })

  it('맨 위에서 아래로 당기면 transform에 scale이 들어가고(위 가장자리 고정), 전환은 꺼진다', () => {
    pointer({ el: container, type: 'pointerdown', y: 100 })
    pointer({ el: container, type: 'pointermove', y: 220 })
    const match = image.style.transform.match(/scale\((\d+(?:\.\d+)?)\)/)
    expect(match).not.toBeNull()
    expect(Number(match![1])).toBeGreaterThan(1)
    expect(image.style.transform).toContain('translateY(0px)')
    expect(image.dataset.stretch).toBe('pulling')
  })

  it('놓으면 transform이 비워지고 CSS 전환으로 복귀한다(data-stretch=release)', () => {
    pointer({ el: container, type: 'pointerdown', y: 100 })
    pointer({ el: container, type: 'pointermove', y: 220 })
    pointer({ el: window, type: 'pointerup', y: 220 })
    expect(image.style.transform).toBe('')
    expect(image.dataset.stretch).toBe('release')
  })

  it('가로로 먼저 움직이면 당김을 포기하고, 스크롤 중(scrollTop>0)에는 당김을 시작하지 않는다', () => {
    pointer({ el: container, type: 'pointerdown', y: 100 })
    pointer({ el: container, type: 'pointermove', x: 40, y: 104 })
    pointer({ el: container, type: 'pointermove', x: 40, y: 200 })
    expect(image.style.transform).toBe('')
    ;(container as unknown as { scrollTop: number }).scrollTop = 80
    pointer({ el: container, type: 'pointerdown', y: 100 })
    pointer({ el: container, type: 'pointermove', y: 220 })
    expect(image.style.transform).not.toContain('scale')
  })

  it('스크롤하면 rAF 한 번에 패럴랙스(절반 속도 translateY·페이드)가 적용되고 destroy 후엔 멈춘다', () => {
    ;(container as unknown as { scrollTop: number }).scrollTop = 100
    container.dispatchEvent(new Event('scroll'))
    container.dispatchEvent(new Event('scroll')) // 같은 프레임의 중복 이벤트는 합쳐진다
    vi.advanceTimersToNextFrame()
    expect(image.style.transform).toBe('translateY(50px)')
    expect(Number(image.style.opacity)).toBeCloseTo(1 - 0.7 * (100 / 240))
    destroy()
    expect(image.style.transform).toBe('')
    ;(container as unknown as { scrollTop: number }).scrollTop = 200
    container.dispatchEvent(new Event('scroll'))
    vi.advanceTimersToNextFrame()
    expect(image.style.transform).toBe('')
  })

  it('iOS처럼 scrollTop이 음수면 native 늘어남 — 이미지를 그만큼 올려 붙이고 scale로 채운다', () => {
    ;(container as unknown as { scrollTop: number }).scrollTop = -60
    container.dispatchEvent(new Event('scroll'))
    vi.advanceTimersToNextFrame()
    expect(image.style.transform).toBe('translateY(-60px) scale(1.25)')
  })
})
