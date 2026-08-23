import { useEffect, useRef, useState } from 'react'
import { observeActiveSlide, scrollToSlide } from './carouselCore'
import './carousel.css'

/**
 * carousel 코어의 React 래퍼 — trackRef를 트랙에 달면
 * activeIndex가 스와이프를 따라가고, goTo(index)로 도트·화살표 이동을 만든다.
 */
export const useCarousel = () => {
  const trackRef = useRef<HTMLDivElement | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(function trackActiveSlide() {
    const track = trackRef.current
    if (!track) return
    return observeActiveSlide({ track, onChange: setActiveIndex })
  }, [])

  const goTo = (index: number) => {
    const track = trackRef.current
    if (track) scrollToSlide({ track, index })
  }

  return { trackRef, activeIndex, goTo }
}
