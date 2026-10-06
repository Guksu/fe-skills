import { useEffect, useRef } from 'react'
import { createCountUp } from './createCountUp'
import './count-up.css'

type CountUpProps = {
  /** 목표값 — 바뀔 때마다 직전 값에서 새 값으로 굴러간다 (최초 마운트는 0에서 시작) */
  value: number
  durationMs?: number
  format?: (value: number) => string
  className?: string
}

/**
 * createCountUp 코어의 React 래퍼 — value가 바뀔 때마다 직전 값에서 이어서 굴러간다.
 */
export const CountUp = ({ value, durationMs = 800, format, className }: CountUpProps) => {
  const elementRef = useRef<HTMLSpanElement | null>(null)
  const previousRef = useRef(0)

  useEffect(
    function animateToValue() {
      const el = elementRef.current
      if (!el) return
      const counter = createCountUp({
        element: el,
        from: previousRef.current,
        to: value,
        durationMs,
        format,
      })
      counter.start()
      previousRef.current = value
      return () => counter.stop()
    },
    [value, durationMs, format],
  )

  return <span ref={elementRef} className={className ? `count-up ${className}` : 'count-up'} />
}
