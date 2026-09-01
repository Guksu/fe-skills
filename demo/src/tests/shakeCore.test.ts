import { shake } from '@skills/form-shake-error/assets/shakeCore'

describe('shake — data-shake 부착·해제·재시작', () => {
  let el: HTMLElement
  beforeEach(() => {
    el = document.createElement('input')
    document.body.appendChild(el)
  })
  afterEach(() => el.remove())

  it('부르면 data-shake가 붙고 animationend에 떨어진다', () => {
    shake(el)
    expect(el).toHaveAttribute('data-shake')
    el.dispatchEvent(new Event('animationend'))
    expect(el).not.toHaveAttribute('data-shake')
  })

  it('흔들리는 중에 다시 부르면 속성을 뗐다 다시 붙여 재시작한다', () => {
    shake(el)
    const removeSpy = vi.spyOn(el, 'removeAttribute')
    shake(el)
    expect(removeSpy).toHaveBeenCalledWith('data-shake')
    expect(el).toHaveAttribute('data-shake')
  })

  it('재시작 뒤 animationend 한 번으로 깨끗이 해제된다 (리스너가 쌓여도 무해)', () => {
    shake(el)
    shake(el)
    el.dispatchEvent(new Event('animationend'))
    expect(el).not.toHaveAttribute('data-shake')
  })

  it('animationend가 오지 않아도 상한 시간이 지나면 해제된다 (모션을 줄이는 설정)', () => {
    vi.useFakeTimers()
    shake(el)
    expect(el).toHaveAttribute('data-shake')

    vi.advanceTimersByTime(600)
    expect(el).not.toHaveAttribute('data-shake')
    vi.useRealTimers()
  })

  it('다시 흔들면 앞선 상한이 새 흔들림을 지우지 못한다', () => {
    vi.useFakeTimers()
    shake(el)
    vi.advanceTimersByTime(500)
    shake(el) // 앞선 상한이 100ms 뒤에 터질 시점

    vi.advanceTimersByTime(100)
    expect(el).toHaveAttribute('data-shake')

    vi.advanceTimersByTime(500)
    expect(el).not.toHaveAttribute('data-shake')
    vi.useRealTimers()
  })
})
