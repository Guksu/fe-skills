import {
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  useState,
  type ReactElement,
} from 'react'

type PresenceState = 'entering' | 'entered' | 'exiting'

type PresenceProps = {
  /** true면 자식을 표시(진입 애니메이션), false면 퇴장 애니메이션 후 언마운트 */
  show: boolean
  /** transitionend/animationend가 오지 않을 때의 언마운트 폴백(ms). CSS duration보다 길게 잡는다 */
  timeoutMs?: number
  /** 단일 React 엘리먼트 — data-state 속성이 주입되므로 CSS는 [data-state]로 스타일링한다 */
  children: ReactElement
}

/**
 * 퇴장 애니메이션의 근본 문제를 푼다: React는 조건부 렌더링에서 즉시 언마운트하므로
 * CSS 퇴장 효과가 보일 틈이 없다. Presence는 show=false 후에도 자식을 exiting 상태로
 * 유지하다가, transition/animation 종료(또는 timeoutMs 폴백) 시점에 언마운트한다.
 *
 * 상태 흐름: (없음) → entering → entered → exiting → (없음)
 * CSS는 data-state 값에만 반응하면 된다 — 애니메이션 정의는 전적으로 CSS 몫(CSS 우선 원칙).
 */
export const Presence = ({ show, timeoutMs = 500, children }: PresenceProps) => {
  const [state, setState] = useState<PresenceState | null>(show ? 'entering' : null)
  const elementRef = useRef<HTMLElement | null>(null)

  const captureElement = (el: HTMLElement | null) => {
    elementRef.current = el
  }

  useEffect(
    function syncStateWithShow() {
      if (show) {
        // 퇴장 중 재진입하면 언마운트 없이 entering으로 되돌린다
        setState((prev) => (prev === null || prev === 'exiting' ? 'entering' : prev))
        return
      }
      setState((prev) => (prev === null ? null : 'exiting'))
    },
    [show],
  )

  useEffect(
    function promoteEnteringToEntered() {
      if (state !== 'entering') return
      // 브라우저가 entering 스타일을 먼저 그려야 entered로의 CSS transition이 발동한다.
      // 한 프레임으로는 페인트 전에 바뀔 수 있어 두 프레임을 기다린다.
      let innerFrame = 0
      const outerFrame = requestAnimationFrame(() => {
        innerFrame = requestAnimationFrame(() => setState('entered'))
      })
      return () => {
        cancelAnimationFrame(outerFrame)
        cancelAnimationFrame(innerFrame)
      }
    },
    [state],
  )

  useEffect(
    function unmountAfterExit() {
      if (state !== 'exiting') return
      const el = elementRef.current
      const finishExit = () => setState(null)
      // transitionend는 유실될 수 있다(display 전환·탭 백그라운드) — 타임아웃이 안전망
      const fallbackTimer = setTimeout(finishExit, timeoutMs)
      el?.addEventListener('transitionend', finishExit)
      el?.addEventListener('animationend', finishExit)
      return () => {
        clearTimeout(fallbackTimer)
        el?.removeEventListener('transitionend', finishExit)
        el?.removeEventListener('animationend', finishExit)
      }
    },
    [state, timeoutMs],
  )

  if (state === null || !isValidElement(children)) return null

  return cloneElement(children, {
    'data-state': state,
    ref: captureElement,
  } as Partial<unknown>)
}
