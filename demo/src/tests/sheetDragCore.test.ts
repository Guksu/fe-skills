import { createSheetDrag } from '@skills/bottom-sheet/assets/createSheetDrag'

const pointer = ({ el, type, y }: { el: HTMLElement; type: string; y: number }) => {
  el.dispatchEvent(new MouseEvent(type, { bubbles: true, clientY: y, button: 0 }))
}

describe('createSheetDrag — 바텀시트 드래그 닫기 판정', () => {
  let sheet: HTMLElement
  let dismissed: number
  const cleanups: Array<() => void> = []

  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date', 'performance', 'requestAnimationFrame', 'cancelAnimationFrame'] })
    sheet = document.createElement('div')
    document.body.appendChild(sheet)
    dismissed = 0
  })
  afterEach(() => {
    // window 리스너를 반드시 해제한다 — 남으면 다음 테스트의 이벤트를 함께 받는다
    cleanups.splice(0).forEach((cleanup) => cleanup())
    vi.useRealTimers()
    sheet.remove()
  })

  const register = (options: { dismissThresholdPx?: number } = {}) => {
    const cleanup = createSheetDrag({ sheet, onDismiss: () => (dismissed += 1), ...options })
    cleanups.push(cleanup)
    return cleanup
  }

  it('드래그 중에는 transition을 끄고 손가락을 따라 translateY가 붙는다', () => {
    register()
    pointer({ el: sheet, type: 'pointerdown', y: 100 })
    pointer({ el: sheet, type: 'pointermove', y: 180 })
    expect(sheet.style.transition).toBe('none')
    expect(sheet.style.transform).toBe('translateY(80px)')
  })

  it('위로 끌면 0으로 클램프된다 (시트가 위로 딸려 올라가지 않음)', () => {
    register()
    pointer({ el: sheet, type: 'pointerdown', y: 100 })
    pointer({ el: sheet, type: 'pointermove', y: 40 })
    expect(sheet.style.transform).toBe('translateY(0px)')
  })

  it('임계 거리를 넘겨 놓으면 onDismiss가 불리고 다음 프레임에 인라인 transform이 정리된다', () => {
    register({ dismissThresholdPx: 120 })
    pointer({ el: sheet, type: 'pointerdown', y: 100 })
    pointer({ el: sheet, type: 'pointermove', y: 300 })
    pointer({ el: sheet, type: 'pointerup', y: 300 })
    expect(dismissed).toBe(1)
    expect(sheet.style.transition).toBe('')
    vi.advanceTimersByTime(50)
    expect(sheet.style.transform).toBe('')
  })

  it('임계 미달이면 스냅백 — onDismiss 없이 transform이 즉시 정리된다', () => {
    register({ dismissThresholdPx: 120 })
    pointer({ el: sheet, type: 'pointerdown', y: 100 })
    pointer({ el: sheet, type: 'pointermove', y: 150 })
    pointer({ el: sheet, type: 'pointerup', y: 150 })
    expect(dismissed).toBe(0)
    expect(sheet.style.transform).toBe('')
    expect(sheet.style.transition).toBe('')
  })

  it('거리가 짧아도 빠르게 던지면(velocity) 닫힌다', () => {
    register({ dismissThresholdPx: 500 })
    pointer({ el: sheet, type: 'pointerdown', y: 100 })
    vi.advanceTimersByTime(16)
    pointer({ el: sheet, type: 'pointermove', y: 140 })
    vi.advanceTimersByTime(16)
    pointer({ el: sheet, type: 'pointermove', y: 190 })
    pointer({ el: sheet, type: 'pointerup', y: 190 })
    expect(dismissed).toBe(1)
  })

  it('드래그 중에는 텍스트 선택(selectstart)이 막히고, 놓으면 풀린다', () => {
    register()
    pointer({ el: sheet, type: 'pointerdown', y: 100 })
    const during = new Event('selectstart', { cancelable: true })
    document.dispatchEvent(during)
    expect(during.defaultPrevented).toBe(true)
    pointer({ el: sheet, type: 'pointerup', y: 100 })
    const after = new Event('selectstart', { cancelable: true })
    document.dispatchEvent(after)
    expect(after.defaultPrevented).toBe(false)
  })

  it('cleanup 후에는 드래그가 무시된다', () => {
    const cleanup = register()
    cleanup()
    pointer({ el: sheet, type: 'pointerdown', y: 100 })
    pointer({ el: sheet, type: 'pointermove', y: 400 })
    pointer({ el: sheet, type: 'pointerup', y: 400 })
    expect(dismissed).toBe(0)
    expect(sheet.style.transform).toBe('')
  })
})
