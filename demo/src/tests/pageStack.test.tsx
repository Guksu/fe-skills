import { useRef } from 'react'
import { act, renderHook } from '@testing-library/react'
import { usePageStack } from '@skills/page-transition/assets/usePageStack'

/** jsdom에는 View Transitions가 없다 — 코어의 폴백 경로(전환 없이 즉시 교체)로 동작한다 */
describe('usePageStack — 화면 스택과 스크롤 기억', () => {
  beforeEach(() => {
    // jsdom은 window.scrollTo를 구현하지 않는다 — 스크롤 컨테이너를 주지 않은 경우의 경로
    vi.stubGlobal('scrollTo', vi.fn())
  })
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  const setup = () =>
    renderHook(() => {
      const scrollRef = useRef<HTMLElement | null>(null)
      const stack = usePageStack<string>({ initial: 'list', scrollRef })
      return { stack, scrollRef }
    })

  const attachScrollBox = (scrollRef: { current: HTMLElement | null }) => {
    const box = document.createElement('div')
    // jsdom은 실제로 스크롤하지 않으므로 scrollTop을 쓰고 읽는 것만 확인한다
    box.scrollTop = 0
    scrollRef.current = box
    return box
  }

  it('push하면 새 화면으로 들어가고 back하면 돌아온다', () => {
    const { result } = setup()

    expect(result.current.stack.current).toBe('list')
    expect(result.current.stack.canGoBack).toBe(false)

    act(() => result.current.stack.push('detail'))
    expect(result.current.stack.current).toBe('detail')
    expect(result.current.stack.depth).toBe(2)
    expect(result.current.stack.canGoBack).toBe(true)

    act(() => result.current.stack.back())
    expect(result.current.stack.current).toBe('list')
    expect(result.current.stack.depth).toBe(1)
  })

  it('첫 화면에서 back은 아무 일도 하지 않는다', () => {
    const { result } = setup()

    act(() => result.current.stack.back())
    expect(result.current.stack.current).toBe('list')
    expect(result.current.stack.depth).toBe(1)
  })

  it('들어갈 때 새 화면은 맨 위에서 시작한다', () => {
    const { result } = setup()
    const box = attachScrollBox(result.current.scrollRef)
    box.scrollTop = 420

    act(() => result.current.stack.push('detail'))

    expect(box.scrollTop).toBe(0)
  })

  it('돌아오면 목록에서 보던 위치로 복원된다', () => {
    const { result } = setup()
    const box = attachScrollBox(result.current.scrollRef)
    box.scrollTop = 420

    act(() => result.current.stack.push('detail'))
    box.scrollTop = 60 // 상세 화면에서 조금 내려 봄

    act(() => result.current.stack.back())

    expect(box.scrollTop).toBe(420)
  })

  it('여러 단계를 들어갔다 나와도 각 단계의 위치를 따로 기억한다', () => {
    const { result } = setup()
    const box = attachScrollBox(result.current.scrollRef)

    box.scrollTop = 300
    act(() => result.current.stack.push('detail'))
    box.scrollTop = 150
    act(() => result.current.stack.push('review'))

    act(() => result.current.stack.back())
    expect(box.scrollTop).toBe(150)

    act(() => result.current.stack.back())
    expect(box.scrollTop).toBe(300)
  })
})
