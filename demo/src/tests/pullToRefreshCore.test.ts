import { createPullToRefresh } from '@skills/pull-to-refresh/assets/createPullToRefresh'

const pointer = ({ el, type, y }: { el: HTMLElement; type: string; y: number }) => {
  el.dispatchEvent(new MouseEvent(type, { bubbles: true, clientY: y, button: 0 }))
}

describe('createPullToRefresh — 당김 추적과 새로고침 판정', () => {
  let container: HTMLElement
  let content: HTMLElement
  let refreshCalls: Array<() => void>
  const cleanups: Array<() => void> = []

  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'requestAnimationFrame', 'cancelAnimationFrame', 'Date'] })
    container = document.createElement('div')
    content = document.createElement('div')
    container.appendChild(content)
    document.body.appendChild(container)
    Object.defineProperty(container, 'scrollTop', { value: 0, writable: true })
    refreshCalls = []
  })
  afterEach(() => {
    cleanups.splice(0).forEach((cleanup) => cleanup())
    vi.useRealTimers()
    container.remove()
  })

  const register = (options: { thresholdPx?: number } = {}) => {
    const cleanup = createPullToRefresh({
      container,
      content,
      onRefresh: (done) => refreshCalls.push(done),
      ...options,
    })
    cleanups.push(cleanup)
    return cleanup
  }

  it('최상단에서 아래로 당기면 저항이 걸린 translateY와 진행률 변수가 붙는다', () => {
    register()
    pointer({ el: container, type: 'pointerdown', y: 100 })
    pointer({ el: container, type: 'pointermove', y: 200 })
    const match = content.style.transform.match(/translateY\((\d+(?:\.\d+)?)px\)/)
    expect(match).not.toBeNull()
    const pulled = Number(match![1])
    expect(pulled).toBeGreaterThan(0)
    expect(pulled).toBeLessThan(100) // 저항 — 손가락 거리보다 덜 내려온다
    expect(Number(container.style.getPropertyValue('--pull-progress'))).toBeGreaterThan(0)
  })

  it('스크롤이 최상단이 아니면 당김을 시작하지 않는다', () => {
    register()
    ;(container as unknown as { scrollTop: number }).scrollTop = 120
    pointer({ el: container, type: 'pointerdown', y: 100 })
    pointer({ el: container, type: 'pointermove', y: 250 })
    expect(content.style.transform).toBe('')
  })

  it('임계 미달로 놓으면 새로고침 없이 제자리로 돌아간다', () => {
    register({ thresholdPx: 80 })
    pointer({ el: container, type: 'pointerdown', y: 100 })
    pointer({ el: container, type: 'pointermove', y: 140 })
    pointer({ el: container, type: 'pointerup', y: 140 })
    expect(refreshCalls).toHaveLength(0)
    expect(content.style.transform).toBe('')
  })

  it('임계를 넘겨 놓으면 onRefresh가 불리고, done()이 오면 제자리로 돌아간다', () => {
    register({ thresholdPx: 40 })
    pointer({ el: container, type: 'pointerdown', y: 100 })
    pointer({ el: container, type: 'pointermove', y: 300 })
    pointer({ el: container, type: 'pointerup', y: 300 })
    expect(refreshCalls).toHaveLength(1)
    expect(container.dataset.refreshing).toBe('true')
    expect(content.style.transform).not.toBe('')
    refreshCalls[0]()
    expect(container.dataset.refreshing).toBe('false')
    expect(content.style.transform).toBe('')
  })

  it('새로고침 진행 중에는 새 당김을 받지 않는다', () => {
    register({ thresholdPx: 40 })
    pointer({ el: container, type: 'pointerdown', y: 100 })
    pointer({ el: container, type: 'pointermove', y: 300 })
    pointer({ el: container, type: 'pointerup', y: 300 })
    const frozen = content.style.transform
    pointer({ el: container, type: 'pointerdown', y: 100 })
    pointer({ el: container, type: 'pointermove', y: 400 })
    expect(content.style.transform).toBe(frozen)
  })
})
