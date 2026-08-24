import { openZoom } from '@skills/zoom-lightbox/assets/openZoom'
import '@skills/zoom-lightbox/assets/zoom-lightbox.css'
import './zoom-lightbox-demo.css'

const DISHES = [
  { emoji: '🍜', name: '얼큰 칼국수', tone: 'a' },
  { emoji: '🥟', name: '왕만두 한 판', tone: 'b' },
  { emoji: '🧊', name: '냉모밀 정식', tone: 'c' },
  { emoji: '🌶️', name: '지옥 비빔국수', tone: 'd' },
  { emoji: '🥣', name: '들깨 수제비', tone: 'e' },
  { emoji: '🍢', name: '수제 어묵탕', tone: 'f' },
]

export const ZoomLightboxDemo = () => (
  <div className="playground">
    <section className="controls" aria-label="안내">
      <p className="controls-note">
        썸네일을 누르면 그 카드가 화면 중앙으로 커집니다 — 백드롭 클릭이나 Esc로 닫으면 제자리로
        돌아갑니다. 팝업이 아니라 "그 카드가 커진 것"으로 보이는 게 핵심입니다.
      </p>
    </section>

    <div className="zoom-gallery">
      {DISHES.map((dish) => (
        <button
          key={dish.name}
          type="button"
          className={`zoomable zoom-card zoom-tone-${dish.tone}`}
          onClick={(event) => openZoom({ source: event.currentTarget })}
        >
          <span className="zoom-emoji">{dish.emoji}</span>
          <strong>{dish.name}</strong>
        </button>
      ))}
    </div>
  </div>
)
