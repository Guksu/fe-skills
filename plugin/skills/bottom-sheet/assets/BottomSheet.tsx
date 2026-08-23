import { useEffect, useRef, type ReactNode } from 'react'
import { createSheetDrag } from './createSheetDrag'
import './bottom-sheet.css'

type BottomSheetProps = {
  open: boolean
  onClose: () => void
  children: ReactNode
  /** 이만큼 끌어내리면 닫힘 (기본 120px) */
  dismissThresholdPx?: number
  className?: string
}

/**
 * createSheetDrag 코어의 React 래퍼 — 백드롭·Esc·드래그 세 경로로 닫힌다.
 * 시트는 언마운트하지 않고 data-open으로 여닫아 닫힘 애니메이션을 CSS에 맡긴다.
 */
export const BottomSheet = ({ open, onClose, children, dismissThresholdPx, className }: BottomSheetProps) => {
  const sheetRef = useRef<HTMLElement | null>(null)
  // 최신 콜백을 ref로 들고 있어 인라인 함수를 넘겨도 리스너가 재등록되지 않는다
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(
    function lockBodyScroll() {
      if (!open) return
      const previous = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = previous
      }
    },
    [open],
  )

  useEffect(
    function closeOnEscape() {
      if (!open) return
      const handleKeydown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') onCloseRef.current()
      }
      window.addEventListener('keydown', handleKeydown)
      return () => window.removeEventListener('keydown', handleKeydown)
    },
    [open],
  )

  useEffect(
    function attachDragToDismiss() {
      const sheet = sheetRef.current
      if (!sheet) return
      return createSheetDrag({
        sheet,
        onDismiss: () => onCloseRef.current(),
        dismissThresholdPx,
      })
    },
    [dismissThresholdPx],
  )

  return (
    <>
      <div className="sheet-backdrop" data-open={open ? 'true' : 'false'} onClick={() => onCloseRef.current()} />
      <section
        ref={sheetRef}
        className={className ? `bottom-sheet ${className}` : 'bottom-sheet'}
        data-open={open ? 'true' : 'false'}
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
      >
        <div className="sheet-handle" aria-hidden="true" />
        {children}
      </section>
    </>
  )
}
