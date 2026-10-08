import { openZoom } from '@skills/zoom-lightbox/assets/openZoom'
import { DishPhoto } from '../../shared/DishPhoto'
import type { DishId } from '../../shared/dishes'
import '@skills/zoom-lightbox/assets/zoom-lightbox.css'
import './zoom-lightbox-demo.css'

const DISHES: { dish: DishId; name: string }[] = [
  { dish: 'kalguksu', name: '얼큰 칼국수' },
  { dish: 'mandu', name: '왕만두 한 판' },
  { dish: 'memil', name: '냉모밀 정식' },
  { dish: 'bibim', name: '지옥 비빔국수' },
  { dish: 'sujebi', name: '들깨 수제비' },
  { dish: 'eomuk', name: '수제 어묵탕' },
]

export const ZoomLightboxDemo = () => (
  <div className="playground">
    <section className="controls" aria-label="안내">
      <p className="controls-note">
        썸네일을 누르면 그 카드가 화면 중앙으로 커집니다 — 백드롭 클릭이나 Esc로 닫으면 제자리로
        돌아갑니다. 팝업이 아니라 "그 카드가 커진 것"으로 보이는 게 핵심입니다.
      </p>
    </section>

    <ul className="zoom-gallery">
      {DISHES.map((item) => (
        <li key={item.name} className="zoom-item">
          {/* 커지는 것은 사진(단추)만이다 — 이름은 사진 밖 아래에 두어 확대에 따라오지 않는다 */}
          <button
            type="button"
            className="zoomable zoom-card"
            aria-label={`${item.name} 크게 보기`}
            onClick={(event) => openZoom({ source: event.currentTarget })}
          >
            <DishPhoto dish={item.dish} />
          </button>
          <span className="zoom-name">{item.name}</span>
        </li>
      ))}
    </ul>
  </div>
)
