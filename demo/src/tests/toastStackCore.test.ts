import { createToastStack } from '@skills/toast-stack/assets/createToastStack'

describe('createToastStack — 토스트 쌓기·자동 소멸·재배치', () => {
  let stack: ReturnType<typeof createToastStack>
  const originalOffsetHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetHeight')

  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'requestAnimationFrame', 'cancelAnimationFrame'] })
    // jsdom은 레이아웃이 없어 offsetHeight가 0이다 — 모든 토스트를 40px로 고정해 결정적으로 만든다
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', { value: 40, configurable: true })
    stack = createToastStack({ durationMs: 3000, gapPx: 10 })
  })
  afterEach(() => {
    stack.destroy()
    if (originalOffsetHeight) Object.defineProperty(HTMLElement.prototype, 'offsetHeight', originalOffsetHeight)
    vi.useRealTimers()
  })

  const toasts = () => [...document.querySelectorAll('.toast-item')] as HTMLElement[]

  it('show()는 폴라이트 라이브 영역에 토스트를 띄우고 entering→entered로 전환한다', () => {
    stack.show('저장되었습니다')
    const region = document.querySelector('.toast-region')!
    expect(region.getAttribute('aria-live')).toBe('polite')
    const toast = toasts()[0]
    expect(toast.textContent).toBe('저장되었습니다')
    expect(toast.dataset.state).toBe('entering')
    vi.advanceTimersByTime(50)
    expect(toast.dataset.state).toBe('entered')
  })

  it('새 토스트가 오면 기존 토스트가 높이+간격만큼 위로 밀린다', () => {
    stack.show('첫 번째')
    stack.show('두 번째')
    stack.show('세 번째')
    const [first, second, third] = toasts()
    expect(first.style.transform).toBe('translateY(-100px)') // (40+10)*2
    expect(second.style.transform).toBe('translateY(-50px)')
    expect(third.style.transform).toBe('translateY(0px)')
  })

  it('durationMs가 지나면 스스로 exiting을 거쳐 제거된다', () => {
    stack.show('사라질 토스트')
    vi.advanceTimersByTime(3100)
    const toast = toasts()[0]
    expect(toast.dataset.state).toBe('exiting')
    toast.dispatchEvent(new Event('transitionend'))
    expect(toasts()).toHaveLength(0)
  })

  it('maxVisible을 넘으면 가장 오래된 토스트부터 밀려난다', () => {
    const limited = createToastStack({ durationMs: 60000, maxVisible: 2 })
    limited.show('1')
    limited.show('2')
    limited.show('3')
    const states = [...document.querySelectorAll('.toast-item')].map((toast) => (toast as HTMLElement).dataset.state)
    expect(states.filter((state) => state === 'exiting')).toHaveLength(1)
    limited.destroy()
  })

  it('show()가 돌려준 dismiss로 조기 종료할 수 있다', () => {
    const dismiss = stack.show('수동 종료')
    dismiss()
    expect(toasts()[0].dataset.state).toBe('exiting')
  })

  it('destroy()는 영역 전체를 제거한다', () => {
    stack.show('아무거나')
    stack.destroy()
    expect(document.querySelector('.toast-region')).toBeNull()
  })
})
