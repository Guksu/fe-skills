/**
 * 프레임워크 무관 바텀시트 드래그 코어 (의존성 0).
 *
 * 포인터로 시트를 아래로 끌면 손가락을 따라오고, 놓는 순간
 * 거리(dismissThresholdPx) 또는 속도(dismissVelocity)로 닫기/스냅백을 판정한다.
 * 드래그 중에만 transition을 꺼서 손가락에 붙고, 놓으면 CSS transition이
 * 스냅백·닫힘 이동을 처리한다 — 애니메이션 정의는 CSS 몫(bottom-sheet.css).
 */

type CreateSheetDragOptions = {
  sheet: HTMLElement
  /** 드래그를 받을 요소 — 기본은 시트 전체. 내부 스크롤이 있으면 핸들만 지정한다 */
  handle?: HTMLElement
  onDismiss: () => void
  /** 이만큼 끌어내리면 닫힘 (기본 120px) */
  dismissThresholdPx?: number
  /** 놓는 순간 속도가 이 이상이면 거리와 무관하게 닫힘 (px/ms, 기본 0.5) */
  dismissVelocity?: number
}

export const createSheetDrag = ({
  sheet,
  handle = sheet,
  onDismiss,
  dismissThresholdPx = 120,
  dismissVelocity = 0.5,
}: CreateSheetDragOptions) => {
  let dragging = false
  let startY = 0
  let deltaY = 0
  let lastY = 0
  let lastTime = 0
  let velocity = 0

  // 드래그 중 시트 안 텍스트가 끌려 선택되는 부작용을 막는다
  const preventSelection = (event: Event) => event.preventDefault()

  const onPointerDown = (event: PointerEvent | MouseEvent) => {
    if ('button' in event && event.button !== 0) return
    dragging = true
    startY = event.clientY
    lastY = event.clientY
    lastTime = Date.now()
    velocity = 0
    deltaY = 0
    sheet.style.transition = 'none'
    document.addEventListener('selectstart', preventSelection)
    // 포인터가 요소 밖으로 나가도 move/up을 계속 받는다 (jsdom 등 미지원 환경 가드)
    if ('pointerId' in event && typeof handle.setPointerCapture === 'function') {
      handle.setPointerCapture(event.pointerId)
    }
  }

  const onPointerMove = (event: PointerEvent | MouseEvent) => {
    if (!dragging) return
    const now = Date.now()
    if (now > lastTime) velocity = (event.clientY - lastY) / (now - lastTime)
    lastY = event.clientY
    lastTime = now
    deltaY = Math.max(0, event.clientY - startY) // 위로는 끌려 올라가지 않는다
    sheet.style.transform = `translateY(${deltaY}px)`
  }

  const onPointerUp = () => {
    if (!dragging) return
    dragging = false
    document.removeEventListener('selectstart', preventSelection)
    sheet.style.transition = ''
    const shouldDismiss = deltaY >= dismissThresholdPx || velocity >= dismissVelocity
    if (shouldDismiss) {
      onDismiss()
      // data-open이 false로 바뀐 다음 프레임에 인라인 transform을 걷어야
      // 현재 위치에서 화면 밖까지 CSS transition으로 이어진다
      requestAnimationFrame(() => {
        sheet.style.transform = ''
      })
      return
    }
    sheet.style.transform = '' // 스냅백 — CSS transition이 제자리로 되돌린다
  }

  handle.addEventListener('pointerdown', onPointerDown)
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', onPointerUp)
  return () => {
    handle.removeEventListener('pointerdown', onPointerDown)
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('pointerup', onPointerUp)
    document.removeEventListener('selectstart', preventSelection)
  }
}
