import { openZoom } from '@skills/zoom-lightbox/assets/openZoom'
import { DishPhoto } from '../../shared/DishPhoto'
import type { DishId } from '../../shared/dishes'
import '@skills/zoom-lightbox/assets/zoom-lightbox.css'
import { defineCopy, useDemoLang } from '../../demoLang'
import './zoom-lightbox-demo.css'

// 언어와 무관한 데이터(사진 아이디)는 밖에, 요리 이름은 COPY에 사진 아이디로 둔다
const DISHES = ['kalguksu', 'mandu', 'memil', 'bibim', 'sujebi', 'eomuk'] as const satisfies readonly DishId[]

type ItemId = (typeof DISHES)[number]

const COPY = defineCopy({
  ko: {
    // 공용 사진 이름과 다른 가게 메뉴 이름이라(얼큰·한 판·정식) 공용 데이터 대신 여기 둔다
    dishes: {
      kalguksu: '얼큰 칼국수',
      mandu: '왕만두 한 판',
      memil: '냉모밀 정식',
      bibim: '지옥 비빔국수',
      sujebi: '들깨 수제비',
      eomuk: '수제 어묵탕',
    } satisfies Record<ItemId, string>,
    zoomLabel: (name: string) => `${name} 크게 보기`,
    controlsLabel: '안내',
    note: '썸네일을 누르면 그 카드가 화면 중앙으로 커집니다 — 백드롭 클릭이나 Esc로 닫으면 제자리로 돌아갑니다. 팝업이 아니라 "그 카드가 커진 것"으로 보이는 게 핵심입니다.',
  },
  en: {
    dishes: {
      kalguksu: 'Spicy knife-cut noodles',
      mandu: 'Jumbo dumplings, one plate',
      memil: 'Cold soba set',
      bibim: 'Fiery spicy mixed noodles',
      sujebi: 'Perilla hand-torn noodle soup',
      eomuk: 'Homemade fish cake soup',
    },
    zoomLabel: (name: string) => `View larger photo of ${name}`,
    controlsLabel: 'Guide',
    note: 'Press a thumbnail and that card grows to the center of the screen. Close it with a backdrop click or Esc and it shrinks back into place. The point is that it reads as "that card got bigger," not as a popup.',
  },
})

export const ZoomLightboxDemo = () => {
  const t = COPY[useDemoLang()]
  return (
    <div className="playground">
      <section className="controls" aria-label={t.controlsLabel}>
        <p className="controls-note">{t.note}</p>
      </section>

      <ul className="zoom-gallery">
        {DISHES.map((id) => (
          <li key={id} className="zoom-item">
            {/* 커지는 것은 사진(단추)만이다 — 이름은 사진 밖 아래에 두어 확대에 따라오지 않는다 */}
            <button
              type="button"
              className="zoomable zoom-card"
              aria-label={t.zoomLabel(t.dishes[id])}
              onClick={(event) => openZoom({ source: event.currentTarget })}
            >
              <DishPhoto dish={id} />
            </button>
            <span className="zoom-name">{t.dishes[id]}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
