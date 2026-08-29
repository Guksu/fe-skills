import { createSwipeDismiss } from '@skills/swipe-dismiss-viewer/assets/createSwipeDismiss'

const pointer = ({ el, type, x, y, t }: { el: HTMLElement; type: string; x: number; y: number; t: number }) => {
  const event = new MouseEvent(type, { bubbles: true, clientX: x, clientY: y, button: 0 })
  Object.defineProperty(event, 'timeStamp', { value: t })
  Object.defineProperty(event, 'pointerId', { value: 1 })
  el.dispatchEvent(event)
}

describe('createSwipeDismiss — 추종·취소 복귀·닫기 판정·가장자리 무시', () => {
  let viewer: HTMLElement
  let image: HTMLElement
  let dismissed: number
  let destroy: () => void

  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['requestAnimationFrame', 'cancelAnimationFrame', 'performance', 'Date'] })
    viewer = document.createElement('div')
    image = document.createElement('img')
    viewer.appendChild(image)
    document.body.appendChild(viewer)
    dismissed = 0
    Object.defineProperty(window, 'innerWidth', { value: 400, configurable: true })
  })
  afterEach(() => {
    destroy?.()
    vi.useRealTimers()
    viewer.remove()
  })

  const bind = (options = {}) => {
    const controller = createSwipeDismiss({ viewer, image, onDismiss: () => (dismissed += 1), ...options })
    destroy = controller.destroy
    return controller
  }

  it('끌면 translate가 따라오고 배율·진행도가 거리에 비례한다', () => {
    const c = bind()
    pointer({ el: viewer, type: 'pointerdown', x: 200, y: 300, t: 0 })
    pointer({ el: viewer, type: 'pointermove', x: 210, y: 420, t: 16 }) // dy 120 → 진행도 0.5
    expect(c.frame.x).toBe(10)
    expect(c.frame.y).toBe(120)
    expect(c.frame.scale).toBeCloseTo(1 - 0.35 * 0.5)
    expect(viewer.style.getPropertyValue('--dismiss-progress')).toBe('0.5')
    expect(image.style.transform).toContain('translate(10px, 120px)')
  })

  it('임계 미만에서 놓으면 중앙으로 스프링 복귀하고 진행도가 0이 된다', () => {
    const c = bind()
    pointer({ el: viewer, type: 'pointerdown', x: 200, y: 300, t: 0 })
    pointer({ el: viewer, type: 'pointermove', x: 200, y: 360, t: 200 })
    pointer({ el: viewer, type: 'pointerup', x: 200, y: 360, t: 400 })
    vi.advanceTimersByTime(3000)
    expect(c.frame).toEqual({ x: 0, y: 0, scale: 1 })
    expect(Number(viewer.style.getPropertyValue('--dismiss-progress'))).toBe(0)
    expect(dismissed).toBe(0)
  })

  it('임계 거리를 넘겨 놓으면 복귀 애니메이션 뒤 onDismiss가 한 번 불린다', () => {
    bind()
    pointer({ el: viewer, type: 'pointerdown', x: 200, y: 300, t: 0 })
    pointer({ el: viewer, type: 'pointermove', x: 200, y: 460, t: 200 })
    pointer({ el: viewer, type: 'pointerup', x: 200, y: 460, t: 400 })
    expect(dismissed).toBe(0) // 아직 애니메이션 중
    vi.advanceTimersByTime(3000)
    expect(dismissed).toBe(1)
    expect(Number(viewer.style.getPropertyValue('--dismiss-progress'))).toBe(1)
  })

  it('짧게 끌어도 세게 튕기면 닫힌다', () => {
    bind()
    pointer({ el: viewer, type: 'pointerdown', x: 200, y: 300, t: 0 })
    pointer({ el: viewer, type: 'pointermove', x: 200, y: 320, t: 10 })
    pointer({ el: viewer, type: 'pointermove', x: 200, y: 340, t: 20 }) // 2000px/s
    pointer({ el: viewer, type: 'pointerup', x: 200, y: 340, t: 24 })
    vi.advanceTimersByTime(3000)
    expect(dismissed).toBe(1)
  })

  it('화면 가장자리에서 시작한 드래그는 무시한다 (브라우저 뒤로가기 제스처)', () => {
    const c = bind()
    pointer({ el: viewer, type: 'pointerdown', x: 5, y: 300, t: 0 })
    pointer({ el: viewer, type: 'pointermove', x: 100, y: 500, t: 16 })
    expect(c.frame).toEqual({ x: 0, y: 0, scale: 1 })
  })

  it('returnTo가 있으면 닫힐 때 썸네일 프레임으로 간다', () => {
    const thumb = document.createElement('img')
    thumb.getBoundingClientRect = () => ({ left: 0, top: 0, width: 100, height: 100 }) as DOMRect
    image.getBoundingClientRect = () => ({ left: 100, top: 200, width: 400, height: 400 }) as DOMRect
    const c = bind({ returnTo: () => thumb })
    c.close()
    vi.advanceTimersByTime(3000)
    expect(c.frame.scale).toBeCloseTo(0.25)
    expect(c.frame.x).toBeCloseTo(-250)
    expect(c.frame.y).toBeCloseTo(-350)
    expect(dismissed).toBe(1)
  })

  it('open()은 썸네일 프레임에서 출발해 중앙으로 정착한다', () => {
    const thumb = document.createElement('img')
    thumb.getBoundingClientRect = () => ({ left: 0, top: 0, width: 100, height: 100 }) as DOMRect
    image.getBoundingClientRect = () => ({ left: 100, top: 200, width: 400, height: 400 }) as DOMRect
    const c = bind({ returnTo: () => thumb })
    c.open()
    expect(c.frame.scale).toBeCloseTo(0.25)
    expect(viewer.style.getPropertyValue('--dismiss-progress')).toBe('1')
    vi.advanceTimersByTime(3000)
    expect(c.frame).toEqual({ x: 0, y: 0, scale: 1 })
  })

  it('닫힌 뒤에는 다시 끌어도 반응하지 않고 onDismiss도 중복되지 않는다', () => {
    const c = bind()
    c.close()
    vi.advanceTimersByTime(3000)
    c.close()
    pointer({ el: viewer, type: 'pointerdown', x: 200, y: 300, t: 5000 })
    pointer({ el: viewer, type: 'pointermove', x: 200, y: 400, t: 5016 })
    expect(dismissed).toBe(1)
  })
})
