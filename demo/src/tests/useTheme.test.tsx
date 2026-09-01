import { act, renderHook } from '@testing-library/react'
import { useTheme } from '@skills/theme-toggle/assets/useTheme'

type Listener = () => void

/** 기기 설정을 흉내 내는 matchMedia — 값을 바꾸면 등록된 청취자에게 알린다 */
const stubSystemTheme = (initialDark: boolean) => {
  const listeners: Listener[] = []
  let dark = initialDark
  vi.stubGlobal('matchMedia', (query: string) => ({
    // 실제 MediaQueryList처럼 읽을 때마다 현재 값을 준다 — 고정값이면 청취자가 옛 값을 본다
    get matches() {
      return query.includes('prefers-color-scheme: dark') ? dark : false
    },
    addEventListener: (_: string, listener: Listener) => listeners.push(listener),
    removeEventListener: () => {},
  }))
  return {
    set: (next: boolean) => {
      dark = next
      listeners.forEach((listener) => listener())
    },
  }
}

describe('useTheme — 선택 기억과 기기 설정 따라가기', () => {
  beforeEach(() => {
    localStorage.clear()
    delete document.documentElement.dataset.theme
  })
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('저장된 선택이 없으면 기기 설정을 따라간다', () => {
    stubSystemTheme(true)
    const { result } = renderHook(() => useTheme())

    expect(result.current.choice).toBe('system')
    expect(result.current.resolved).toBe('dark')
    expect(document.documentElement.dataset.theme).toBe('dark')
  })

  it('기기 설정이 바뀌면 따라간다 (system인 동안)', () => {
    const system = stubSystemTheme(false)
    const { result } = renderHook(() => useTheme())
    expect(result.current.resolved).toBe('light')

    act(() => system.set(true))
    expect(result.current.resolved).toBe('dark')
  })

  it('직접 고르면 기기 설정이 바뀌어도 그 선택을 지킨다', () => {
    const system = stubSystemTheme(false)
    const { result } = renderHook(() => useTheme())

    act(() => result.current.setTheme('dark'))
    expect(result.current.resolved).toBe('dark')

    act(() => system.set(false))
    expect(result.current.resolved).toBe('dark')
  })

  it('선택을 저장하고 다음에 그대로 되살린다', () => {
    stubSystemTheme(true)
    const first = renderHook(() => useTheme())
    act(() => first.result.current.setTheme('light'))
    expect(localStorage.getItem('theme')).toBe('light')

    first.unmount()
    const second = renderHook(() => useTheme())
    expect(second.result.current.choice).toBe('light')
    expect(second.result.current.resolved).toBe('light')
  })

  it('system으로 되돌리면 저장을 지운다 — 기기 설정을 다시 따라간다', () => {
    stubSystemTheme(true)
    const { result } = renderHook(() => useTheme())

    act(() => result.current.setTheme('light'))
    act(() => result.current.setTheme('system'))

    expect(localStorage.getItem('theme')).toBe(null)
    expect(result.current.resolved).toBe('dark')
  })

  it('toggle은 지금 적용된 테마의 반대로 간다', () => {
    stubSystemTheme(true)
    const { result } = renderHook(() => useTheme())

    act(() => result.current.toggle())
    expect(result.current.choice).toBe('light')
  })

  it('특정 요소만 대상으로 지정하면 그 요소에 data-theme를 쓴다', () => {
    stubSystemTheme(true)
    const card = document.createElement('div')
    document.body.appendChild(card)

    renderHook(() => useTheme({ targetRef: { current: card } }))

    expect(card.dataset.theme).toBe('dark')
    expect(document.documentElement.dataset.theme).toBeUndefined()
    card.remove()
  })

  it('저장이 막혀 있어도 동작한다 (프라이빗 모드)', () => {
    stubSystemTheme(false)
    const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError')
    })
    const { result } = renderHook(() => useTheme())

    act(() => result.current.setTheme('dark'))
    expect(result.current.resolved).toBe('dark')
    setItem.mockRestore()
  })
})
