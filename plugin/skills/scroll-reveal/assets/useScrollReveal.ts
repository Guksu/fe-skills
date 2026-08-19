import { useEffect, useRef, useState } from 'react'

type UseScrollRevealOptions = {
  /** 요소가 몇 % 보였을 때 공개할지 (0~1). 기본 0.15 */
  threshold?: number
  /** 뷰포트 경계 보정 — 미리 공개하려면 '0px 0px -10% 0px' 형태로 */
  rootMargin?: string
  /** true(기본)면 한 번 공개 후 유지, false면 벗어날 때 다시 감춘다 */
  once?: boolean
}

/**
 * IntersectionObserver로 "뷰포트 진입"을 감지한다 — scroll 이벤트 리스너와 달리
 * 메인 스레드를 스크롤마다 깨우지 않아 성능 비용이 없다.
 * 반환된 targetRef를 대상 요소에, revealed를 스타일 분기에 쓴다.
 */
export const useScrollReveal = <T extends HTMLElement = HTMLDivElement>({
  threshold = 0.15,
  rootMargin,
  once = true,
}: UseScrollRevealOptions = {}) => {
  const targetRef = useRef<T | null>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(
    function observeViewportEntry() {
      const el = targetRef.current
      if (!el) return
      if (typeof IntersectionObserver === 'undefined') {
        // 구형 환경·SSR 폴백: 감추지 말고 그냥 보여준다 — 콘텐츠가 실종되는 것보다 낫다
        setRevealed(true)
        return
      }
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              setRevealed(true)
              if (once) observer.unobserve(entry.target)
            } else if (!once) {
              setRevealed(false)
            }
          }
        },
        { threshold, rootMargin },
      )
      observer.observe(el)
      return () => observer.disconnect()
    },
    [threshold, rootMargin, once],
  )

  return { targetRef, revealed }
}
