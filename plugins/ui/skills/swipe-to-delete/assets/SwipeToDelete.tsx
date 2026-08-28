import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { createSwipeDelete } from './createSwipeDelete'
import './swipe-to-delete.css'

type SwipeToDeleteProps = {
  children: ReactNode
  /** 접힘 애니메이션이 끝난 뒤 호출 — 여기서 목록에서 항목을 제거한다 */
  onDelete: () => void
  /** 액션 버튼 문구·접근성 이름 (기본 '삭제') */
  actionLabel?: string
  /** 액션 영역 폭(px, 기본 88) — CSS 변수 --swipe-action-width와 함께 바뀐다 */
  actionWidth?: number
  className?: string
}

/** 접힘 transitionend가 오지 않는 환경(jsdom·transition 미지원)을 위한 상한 */
const COLLAPSE_FALLBACK_MS = 600

/**
 * 스와이프 삭제 행 — 제스처 판정은 createSwipeDelete가, 정착·접힘 모션은 CSS가 담당한다.
 * 삭제는 두 단계다: 내용이 왼쪽으로 빠진 뒤 행 높이를 측정값→0으로 접고, 끝나면 onDelete를 부른다.
 * 삭제 버튼은 항상 DOM에 있어 Tab으로 닿을 수 있다 — 포커스되면 행을 열어 버튼을 보여준다.
 */
export const SwipeToDelete = ({ children, onDelete, actionLabel = '삭제', actionWidth = 88, className }: SwipeToDeleteProps) => {
  const itemRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const controllerRef = useRef<ReturnType<typeof createSwipeDelete> | null>(null)
  const onDeleteRef = useRef(onDelete)
  onDeleteRef.current = onDelete
  const [open, setOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const collapse = () => {
    const item = itemRef.current
    if (!item) return
    // auto→0은 전이되지 않는다 — 현재 높이를 인라인으로 고정한 뒤 다음 프레임에 접는다
    item.style.height = `${item.offsetHeight}px`
    void item.offsetHeight
    setDeleting(true)

    let done = false
    const finish = () => {
      if (done) return
      done = true
      onDeleteRef.current()
    }
    item.addEventListener('transitionend', (event) => {
      if (event.propertyName === 'height') finish()
    })
    window.setTimeout(finish, COLLAPSE_FALLBACK_MS)
  }

  useEffect(
    function bindGesture() {
      const content = contentRef.current
      if (!content) return
      const controller = createSwipeDelete({
        content,
        actionWidth,
        onOpenChange: setOpen,
        onSwipeOut: collapse,
      })
      controllerRef.current = controller
      return controller.destroy
    },
    // collapse는 ref만 읽는 안정 함수라 의존성에 넣지 않는다
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [actionWidth],
  )

  const handleAction = () => controllerRef.current?.swipeOut()

  return (
    <div
      ref={itemRef}
      className={className ? `swipe-item ${className}` : 'swipe-item'}
      data-open={open ? 'true' : 'false'}
      data-state={deleting ? 'deleting' : 'idle'}
      style={{ '--swipe-action-width': `${actionWidth}px` } as CSSProperties}
    >
      <div ref={contentRef} className="swipe-content">
        {children}
        {/* 액션은 내용의 오른쪽 바깥에 붙어 함께 미끄러진다 — DOM에 항상 있어 Tab으로 닿는다 */}
        <div className="swipe-actions">
          <button
            type="button"
            className="swipe-action"
            onClick={handleAction}
            onFocus={() => controllerRef.current?.open()}
            onBlur={() => {
              if (!deleting) controllerRef.current?.close()
            }}
            tabIndex={deleting ? -1 : 0}
          >
            {actionLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
