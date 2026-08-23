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
  const { trackRef, activeIndex, goTo } = useCarousel()
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
        <p className="controls-note">
          트랙을 드래그(스와이프)하거나 도트를 눌러보세요 — 스냅·감속은 전부 CSS scroll-snap이
          처리합니다. 폭을 100% 미만으로 두면 다음 슬라이드가 살짝 보입니다.
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
