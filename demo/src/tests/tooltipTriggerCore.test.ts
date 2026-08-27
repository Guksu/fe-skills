import { createTooltipTrigger } from '@skills/tooltip/assets/createTooltipTrigger'

const setup = ({ showDelayMs }: { showDelayMs?: number } = {}) => {
  const anchor = document.createElement('button')
  const tooltip = document.createElement('span')
  document.body.append(anchor, tooltip)
  const cleanup = createTooltipTrigger({ anchor, tooltip, showDelayMs })
  return { anchor, tooltip, cleanup }
}

describe('createTooltipTrigger — 호버 지연·포커스 즉시·Esc 닫기', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
    document.body.innerHTML = ''
  })

  it('생성 직후에는 닫힘 상태다', () => {
    const { tooltip } = setup()
    expect(tooltip.dataset.open).toBe('false')
  })

  it('마우스 진입 후 지연(기본 400ms)이 지나야 열린다 — 스치는 커서에 반응하지 않게', () => {
    const { anchor, tooltip } = setup()
    anchor.dispatchEvent(new MouseEvent('mouseenter'))
    vi.advanceTimersByTime(399)
    expect(tooltip.dataset.open).toBe('false')
    vi.advanceTimersByTime(1)
    expect(tooltip.dataset.open).toBe('true')
  })

  it('지연이 끝나기 전에 이탈하면 열리지 않는다', () => {
    const { anchor, tooltip } = setup()
    anchor.dispatchEvent(new MouseEvent('mouseenter'))
    vi.advanceTimersByTime(200)
    anchor.dispatchEvent(new MouseEvent('mouseleave'))
    vi.advanceTimersByTime(1000)
    expect(tooltip.dataset.open).toBe('false')
  })

  it('키보드 포커스는 지연 없이 즉시 연다', () => {
    const { anchor, tooltip } = setup()
    anchor.dispatchEvent(new FocusEvent('focusin'))
    expect(tooltip.dataset.open).toBe('true')
    anchor.dispatchEvent(new FocusEvent('focusout'))
    expect(tooltip.dataset.open).toBe('false')
  })

  it('showDelayMs 옵션으로 지연을 바꿀 수 있다', () => {
    const { anchor, tooltip } = setup({ showDelayMs: 100 })
    anchor.dispatchEvent(new MouseEvent('mouseenter'))
    vi.advanceTimersByTime(100)
    expect(tooltip.dataset.open).toBe('true')
  })

  it('열린 상태에서 Escape로 닫힌다', () => {
    const { anchor, tooltip } = setup()
    anchor.dispatchEvent(new FocusEvent('focusin'))
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    expect(tooltip.dataset.open).toBe('false')
  })

  it('cleanup 후에는 어떤 이벤트에도 반응하지 않는다', () => {
    const { anchor, tooltip, cleanup } = setup()
    cleanup()
    anchor.dispatchEvent(new MouseEvent('mouseenter'))
    vi.advanceTimersByTime(1000)
    anchor.dispatchEvent(new FocusEvent('focusin'))
    expect(tooltip.dataset.open).toBe('false')
  })
})
