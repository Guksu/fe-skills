import { createSuggestSearch, type SuggestState } from '@skills/search-suggest/assets/createSuggestSearch'

describe('createSuggestSearch — 디바운스와 늦은 응답 차단', () => {
  let states: SuggestState<string>[]
  const cleanups: Array<() => void> = []

  beforeEach(() => {
    vi.useFakeTimers()
    states = []
  })
  afterEach(() => {
    cleanups.splice(0).forEach((cleanup) => cleanup())
    vi.useRealTimers()
  })

  const register = ({
    fetchSuggestions,
    debounceMs = 200,
    minLength,
  }: {
    fetchSuggestions: (args: { query: string; signal: AbortSignal }) => Promise<string[]>
    debounceMs?: number
    minLength?: number
  }) => {
    const controller = createSuggestSearch<string>({
      fetchSuggestions,
      debounceMs,
      minLength,
      onStateChange: (state) => states.push({ ...state }),
    })
    cleanups.push(controller.destroy)
    return controller
  }

  const advance = async (ms: number) => {
    await vi.advanceTimersByTimeAsync(ms)
  }

  it('입력이 멈춘 뒤에 한 번만 부른다 (글자마다 부르지 않는다)', async () => {
    const fetchSuggestions = vi.fn(async (args: { query: string; signal: AbortSignal }) => (args.query ? ['멸치국수'] : []))
    const controller = register({ fetchSuggestions })

    controller.setQuery('국')
    controller.setQuery('국수')
    controller.setQuery('국수집')
    await advance(199)
    expect(fetchSuggestions).not.toHaveBeenCalled()

    await advance(1)
    expect(fetchSuggestions).toHaveBeenCalledTimes(1)
    expect(fetchSuggestions.mock.calls[0][0].query).toBe('국수집')
    expect(controller.current().items).toEqual(['멸치국수'])
  })

  it('최소 길이에 못 미치면 아예 부르지 않고 목록을 비운다', async () => {
    const fetchSuggestions = vi.fn(async () => ['멸치국수'])
    const controller = register({ fetchSuggestions, minLength: 2 })

    controller.setQuery('국')
    await advance(500)

    expect(fetchSuggestions).not.toHaveBeenCalled()
    expect(controller.current().status).toBe('idle')
    expect(controller.current().items).toEqual([])
  })

  it('공백만 친 것은 검색으로 보지 않는다', async () => {
    const fetchSuggestions = vi.fn(async () => ['멸치국수'])
    const controller = register({ fetchSuggestions })

    controller.setQuery('   ')
    await advance(500)

    expect(fetchSuggestions).not.toHaveBeenCalled()
  })

  it('늦게 도착한 옛 응답이 최신 결과를 덮지 않는다', async () => {
    const resolvers: Array<(items: string[]) => void> = []
    const controller = register({
      debounceMs: 0,
      fetchSuggestions: () => new Promise<string[]>((resolve) => resolvers.push(resolve)),
    })

    controller.setQuery('국')
    await advance(0)
    controller.setQuery('국수')
    await advance(0)
    expect(resolvers).toHaveLength(2)

    resolvers[1](['국수 결과']) // 최신 응답이 먼저 도착
    await advance(0)
    resolvers[0](['국 결과']) // 옛 응답이 뒤늦게 도착
    await advance(0)

    expect(controller.current().items).toEqual(['국수 결과'])
  })

  it('새 검색이 시작되면 앞선 요청을 끊는다', async () => {
    const signals: AbortSignal[] = []
    const controller = register({
      debounceMs: 0,
      fetchSuggestions: ({ signal }) => {
        signals.push(signal)
        return new Promise<string[]>(() => {})
      },
    })

    controller.setQuery('국')
    await advance(0)
    controller.setQuery('국수')
    await advance(0)

    expect(signals[0].aborted).toBe(true)
    expect(signals[1].aborted).toBe(false)
  })

  it('우리가 끊은 요청의 예외는 실패로 보지 않는다', async () => {
    const controller = register({
      debounceMs: 0,
      fetchSuggestions: ({ signal }) =>
        new Promise<string[]>((_, reject) => {
          signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')))
        }),
    })

    controller.setQuery('국')
    await advance(0)
    controller.cancel()
    await advance(0)

    expect(states.some((state) => state.status === 'error')).toBe(false)
  })

  it('요청이 실패하면 error 상태가 되고 목록을 비운다', async () => {
    const controller = register({
      debounceMs: 0,
      fetchSuggestions: async () => {
        throw new Error('서버 오류')
      },
    })

    controller.setQuery('국수')
    await advance(0)

    expect(controller.current().status).toBe('error')
    expect(controller.current().items).toEqual([])
  })

  it('destroy 뒤에는 상태를 바꾸지 않는다', async () => {
    let resolveFetch: (items: string[]) => void = () => {}
    const controller = register({
      debounceMs: 0,
      fetchSuggestions: () => new Promise<string[]>((resolve) => (resolveFetch = resolve)),
    })

    controller.setQuery('국수')
    await advance(0)
    const before = states.length
    controller.destroy()
    resolveFetch(['늦은 결과'])
    await advance(0)

    expect(states).toHaveLength(before)
  })
})
