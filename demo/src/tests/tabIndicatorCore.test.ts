import { moveTabIndicator } from '@skills/tab-indicator/assets/moveTabIndicator'

const makeTab = ({ left, width }: { left: number; width: number }) => {
  const el = document.createElement('button')
  Object.defineProperty(el, 'offsetLeft', { value: left })
  Object.defineProperty(el, 'offsetWidth', { value: width })
  return el
}

describe('moveTabIndicator — 활성 탭 위치로 인디케이터 이동', () => {
  let indicator: HTMLElement

  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['requestAnimationFrame', 'cancelAnimationFrame'] })
    indicator = document.createElement('span')
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('타깃 탭의 offsetLeft·offsetWidth를 translateX·scaleX로 옮긴다 (GPU 속성만)', () => {
    moveTabIndicator({ indicator, target: makeTab({ left: 120, width: 80 }) })
    expect(indicator.style.transform).toBe('translateX(120px) scaleX(80)')
  })

  it('immediate면 transition을 껐다가 다음 프레임에 복원한다 (첫 배치가 슬라이드로 보이지 않게)', () => {
    moveTabIndicator({ indicator, target: makeTab({ left: 40, width: 60 }), immediate: true })
    expect(indicator.style.transition).toBe('none')
    expect(indicator.style.transform).toBe('translateX(40px) scaleX(60)')
    vi.advanceTimersByTime(50)
    expect(indicator.style.transition).toBe('')
  })

  it('immediate가 아니면 transition을 건드리지 않는다', () => {
    moveTabIndicator({ indicator, target: makeTab({ left: 0, width: 50 }) })
    expect(indicator.style.transition).toBe('')
  })
})
