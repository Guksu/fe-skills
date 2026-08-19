import { createPresence } from '@skills/enter-exit/assets/createPresence'

const flushFrames = () => {
  vi.advanceTimersByTime(50)
}

describe('createPresence — 프레임워크 무관 진입/퇴장 상태 머신', () => {
  let el: HTMLElement
  let states: Array<string | null>

  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'requestAnimationFrame', 'cancelAnimationFrame'] })
    el = document.createElement('div')
    document.body.appendChild(el)
    states = []
  })
  afterEach(() => {
    vi.useRealTimers()
    el.remove()
  })

  it('show()는 entering을 거쳐 프레임 뒤 entered가 되고 data-state를 직접 쓴다', () => {
    const presence = createPresence({ element: el, onChange: (state) => states.push(state) })
    presence.show()
    expect(el.dataset.state).toBe('entering')
    flushFrames()
    expect(el.dataset.state).toBe('entered')
    expect(states).toEqual(['entering', 'entered'])
  })

  it('hide()는 exiting 상태로 바꾸고 transitionend 후 null(onChange)로 종료한다', () => {
    const presence = createPresence({ element: el, onChange: (state) => states.push(state) })
    presence.show()
    flushFrames()
    presence.hide()
    expect(el.dataset.state).toBe('exiting')
    el.dispatchEvent(new Event('transitionend'))
    expect(states.at(-1)).toBeNull()
    expect(el.dataset.state).toBeUndefined()
  })

  it('transitionend가 없어도 timeoutMs 후 종료한다 (폴백)', () => {
    const presence = createPresence({ element: el, timeoutMs: 300, onChange: (state) => states.push(state) })
    presence.show()
    flushFrames()
    presence.hide()
    vi.advanceTimersByTime(300)
    expect(states.at(-1)).toBeNull()
  })

  it('exiting 중 show()를 부르면 종료 없이 재진입한다', () => {
    const presence = createPresence({ element: el, timeoutMs: 300, onChange: (state) => states.push(state) })
    presence.show()
    flushFrames()
    presence.hide()
    presence.show()
    flushFrames()
    expect(el.dataset.state).toBe('entered')
    vi.advanceTimersByTime(300)
    expect(states.at(-1)).toBe('entered')
  })

  it('숨겨진 상태에서 hide()는 아무 일도 하지 않는다', () => {
    const presence = createPresence({ element: el, onChange: (state) => states.push(state) })
    presence.hide()
    expect(states).toEqual([])
    expect(el.dataset.state).toBeUndefined()
  })

  it('destroy()는 타이머·리스너를 정리해 이후 상태 변화가 없다', () => {
    const presence = createPresence({ element: el, timeoutMs: 300, onChange: (state) => states.push(state) })
    presence.show()
    flushFrames()
    presence.hide()
    presence.destroy()
    const count = states.length
    el.dispatchEvent(new Event('transitionend'))
    vi.advanceTimersByTime(1000)
    expect(states.length).toBe(count)
  })
})
