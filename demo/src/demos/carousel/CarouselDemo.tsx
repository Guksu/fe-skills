import { useState, type CSSProperties } from 'react'
import { useCarousel } from '@skills/carousel/assets/useCarousel'
import './carousel-demo.css'

const SLIDES = [
  { emoji: '🍜', title: '이달의 국수', copy: '얼큰 칼국수 — 국물이 먼저 반깁니다' },
  { emoji: '🥟', title: '신메뉴', copy: '왕만두 세트 — 반죽부터 직접' },
  { emoji: '🧊', title: '여름 한정', copy: '냉모밀 — 육수 슬러시 직전' },
  { emoji: '🌶️', title: '도전 메뉴', copy: '지옥 비빔국수 — 우유 제공' },
  { emoji: '🎁', title: '단골 혜택', copy: '10그릇 도장이면 만두 서비스' },
]

export const CarouselDemo = () => {
  const [autoplay, setAutoplay] = useState(false)
  const { trackRef, activeIndex, goTo, autoplayOn, toggleAutoplay } = useCarousel({
    autoplayMs: autoplay ? 2500 : undefined,
  })
  const [slideWidth, setSlideWidth] = useState(70)

  return (
    <div className="playground">
      <section className="controls" aria-label="옵션">
        <label>
          <span>
            슬라이드 폭 <code>--slide-width</code>
          </span>
          <input
            type="range"
            min={40}
            max={100}
            step={5}
            value={slideWidth}
            onChange={(e) => setSlideWidth(Number(e.target.value))}
          />
          <output>{slideWidth}%</output>
        </label>
        <label>
          <span>
            자동재생 <code>autoplayMs</code>
          </span>
          <span className="controls-inline">
            <input type="checkbox" checked={autoplay} onChange={(e) => setAutoplay(e.target.checked)} />
            {autoplay && (
              <button type="button" onClick={toggleAutoplay}>
                {autoplayOn ? '⏸ 일시정지' : '▶ 재생'}
              </button>
            )}
          </span>
        </label>
        <p className="controls-note">
          트랙을 드래그(스와이프)하거나 도트를 눌러보세요 — 스냅·감속은 전부 CSS scroll-snap이
          처리합니다. 자동재생은 호버·키보드 포커스 중엔 멈추고, 일시정지 버튼은 접근성
          필수입니다(WCAG 2.2.2).
        </p>
      </section>

      <div style={{ '--slide-width': `${slideWidth}%` } as CSSProperties}>
        <div ref={trackRef} className="carousel-track">
          {SLIDES.map((slide) => (
            <div key={slide.title} className="carousel-slide banner-slide">
              <span className="banner-emoji">{slide.emoji}</span>
              <strong>{slide.title}</strong>
              <p>{slide.copy}</p>
            </div>
          ))}
        </div>
        <div className="carousel-dots" role="tablist" aria-label="슬라이드 선택">
          {SLIDES.map((slide, index) => (
            <button
              key={slide.title}
              type="button"
              className="carousel-dot"
              data-active={index === activeIndex ? 'true' : 'false'}
              aria-label={`${index + 1}번째 슬라이드`}
              onClick={() => goTo(index)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
