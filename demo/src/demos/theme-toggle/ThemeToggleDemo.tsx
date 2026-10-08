import { useRef, useState } from 'react'
import { ThemeToggle } from '@skills/theme-toggle/assets/ThemeToggle'
import { DishPhoto } from '../../shared/DishPhoto'
import type { DishId } from '../../shared/dishes'
import { defineCopy, useDemoLang } from '../../demoLang'
import './theme-toggle-demo.css'

// 언어와 무관한 데이터(아이디·가격·사진)는 밖에, 메뉴 이름은 COPY에 아이디로 둔다
const MENUS = [
  { id: 'myeolchi', price: 8000, dish: 'myeolchi' },
  { id: 'bibim', price: 9000, dish: 'bibim' },
  { id: 'deulkkae', price: 10000, dish: 'deulkkae' },
] as const satisfies readonly { id: string; price: number; dish: DishId }[]

const COPY = defineCopy({
  ko: {
    menus: { myeolchi: '멸치국수', bibim: '비빔국수', deulkkae: '들깨칼국수' },
    price: (n: number) => `${n.toLocaleString('ko-KR')}원`,
    controlsLabel: '전환 옵션',
    duration: '원이 퍼지는 시간',
    note: (
      <>
        해/달 버튼을 눌러 보세요 — 누른 지점에서 원이 퍼지며 테마가 덮입니다. 버튼 위치를 바꿔 눌러도 원은 항상 누른
        자리에서 시작합니다. 이 데모는 <code>scopeRef</code>로 <b>미리보기 카드만</b> 전환합니다(실제 서비스에서는
        보통 화면 전체입니다). 선택은 브라우저에 저장돼 새로고침해도 유지됩니다.
      </>
    ),
    shopName: '성수동 손칼국수',
    shopInfo: '성수동 2가 · 영업 중',
    toggleLabel: '다크 모드',
    order: '주문하기',
  },
  en: {
    menus: { myeolchi: 'Anchovy-broth noodles', bibim: 'Spicy mixed noodles', deulkkae: 'Perilla knife-cut noodles' },
    price: (n: number) => `₩${n.toLocaleString('en-US')}`,
    controlsLabel: 'Transition options',
    duration: 'Circle spread time',
    note: (
      <>
        Press the sun/moon button. A circle spreads from the spot you pressed and paints the new theme over the card. Press
        from a different spot and the circle still starts right there. This demo uses <code>scopeRef</code> to switch{' '}
        <b>only the preview card</b> (a real service usually switches the whole screen). Your choice is saved in the browser
        and stays after a reload.
      </>
    ),
    shopName: 'Seongsu-dong Knife-cut Noodles',
    shopInfo: 'Seongsu-dong 2-ga · Open now',
    toggleLabel: 'Dark mode',
    order: 'Order',
  },
})

export const ThemeToggleDemo = () => {
  const t = COPY[useDemoLang()]
  const [durationMs, setDurationMs] = useState(450)
  const cardRef = useRef<HTMLDivElement>(null)

  return (
    <div className="playground">
      <section className="controls" aria-label={t.controlsLabel}>
        <label>
          <span>
            {t.duration} <code>durationMs</code>
          </span>
          <input type="range" min={150} max={900} step={50} value={durationMs} onChange={(e) => setDurationMs(Number(e.target.value))} />
          <output>{durationMs}ms</output>
        </label>
        <p className="controls-note">{t.note}</p>
      </section>

      <div className="tt-stage">
        {/* layout-audit-ignore: nested-card — 무대는 데모 바탕이고, 카드는 테마가 바뀌는 앱 화면 미리보기다 */}
        <div className="tt-card" ref={cardRef}>
          <header className="tt-card-head">
            <div>
              <strong className="tt-card-title">{t.shopName}</strong>
              <p className="tt-card-sub">{t.shopInfo}</p>
            </div>
            <ThemeToggle scopeRef={cardRef} durationMs={durationMs} storageKey="suta-demo-theme" label={t.toggleLabel} />
          </header>

          <ul className="tt-menus">
            {MENUS.map((menu) => (
              <li key={menu.id} className="tt-menu">
                <DishPhoto dish={menu.dish} className="tt-menu-thumb" />
                <span className="tt-menu-name">{t.menus[menu.id]}</span>
                <span className="tt-menu-price">{t.price(menu.price)}</span>
              </li>
            ))}
          </ul>

          <button type="button" className="tt-order">
            {t.order}
          </button>
        </div>
      </div>
    </div>
  )
}
