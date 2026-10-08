import { useRef, useState, type CSSProperties } from 'react'
import { Glass } from '@skills/glass-surface/assets/Glass'
import { Icon } from '@skills/layout-principles/assets/Icon'
import { defineCopy, useDemoLang } from '../../demoLang'
import { DishPhoto } from '../../shared/DishPhoto'
import type { DishId } from '../../shared/dishes'
import './glass-surface-demo.css'

type Tone = 'light' | 'dark'

const DEFAULT_ALPHA: Record<Tone, number> = { light: 0.14, dark: 0.5 }

const tintFor = ({ tone, alpha }: { tone: Tone; alpha: number }) =>
  tone === 'light' ? `rgba(255, 255, 255, ${alpha})` : `rgba(17, 19, 26, ${alpha})`

// 언어와 무관한 데이터(사진·가격)는 밖에, 화면에 보이거나 읽히는 문구는 COPY 두 벌에 둔다
const MENU = [
  { id: 'janchi', dish: 'janchi', price: 7000 },
  { id: 'bibim', dish: 'bibim', price: 8000 },
  { id: 'kalMandu', dish: 'kalguksu', price: 9500 },
] as const satisfies readonly { id: string; dish: DishId; price: number }[]

// 모달 주문 확인 — 잔치국수 1 + 비빔국수 1
const ORDER_TOTAL = MENU[0].price + MENU[1].price

const TILE_SET: DishId[] = ['bibim', 'janchi', 'gamjajeon', 'naengmyeon', 'eomuk', 'kong', 'geotjeori', 'mandu', 'memil', 'kalguksu', 'manduguk', 'sujebi']
const TILES = [...TILE_SET, ...TILE_SET]

const COPY = defineCopy({
  ko: {
    menu: {
      janchi: { name: '잔치국수', desc: '멸치 육수에 소면. 고명은 애호박·계란·김.' },
      bibim: { name: '비빔국수', desc: '새콤한 양념에 오이·삶은 달걀. 여름 한정 아님.' },
      kalMandu: { name: '칼국수 + 만두', desc: '새벽에 치댄 반죽. 손만두 4알이 따라온다.' },
    },
    price: (n: number) => `${n.toLocaleString('ko-KR')}원`,
    controlsLabel: '유리 옵션',
    blur: '흐림',
    tint: '유리 투명도',
    tintAlpha: '알파',
    tone: '톤',
    light: '흰 유리',
    dark: '검은 유리',
    opaque: '불투명 폴백 미리보기',
    note: '흐림을 못 쓰는 환경(미지원 브라우저·투명도 줄이기·대비 높이기 설정)에서는 자동으로 이 폴백 모양이 됩니다. 상단 바 아래로 메뉴 타일을 스크롤해 보세요.',
    headerLabel: '국수집 상단 바',
    brand: '국수집',
    navLabel: '주메뉴',
    links: ['메뉴', '매장', '주문 내역'],
    ctaTitle: '주문하시겠어요?',
    ctaDesc: '유리 모달이 뒤 화면 전체를 흐리며 올라옵니다.',
    ctaButton: '주문 확인 모달 열기',
    modalTitle: '주문 확인',
    modalSummary: (total: string) => `잔치국수 1 · 비빔국수 1 — 합계 ${total}`,
    cancel: '취소',
    order: '주문하기',
  },
  en: {
    menu: {
      janchi: { name: 'Anchovy-broth noodles', desc: 'Thin wheat noodles in anchovy broth, topped with zucchini, egg and seaweed.' },
      bibim: { name: 'Spicy mixed noodles', desc: 'Tangy sauce, cucumber and a boiled egg. Not just for summer.' },
      kalMandu: { name: 'Knife-cut noodles + dumplings', desc: 'Dough kneaded at dawn. Comes with four handmade dumplings.' },
    },
    price: (n: number) => `₩${n.toLocaleString('en-US')}`,
    controlsLabel: 'Glass options',
    blur: 'Blur',
    tint: 'Glass tint',
    tintAlpha: 'alpha',
    tone: 'Tone',
    light: 'White glass',
    dark: 'Dark glass',
    opaque: 'Preview the opaque fallback',
    note: 'Where blur is not available (unsupported browsers, or the Reduce transparency and Increase contrast settings), the surface switches to this fallback on its own. Scroll the menu tiles under the top bar.',
    headerLabel: 'Noodle House top bar',
    brand: 'Noodle House',
    navLabel: 'Main menu',
    links: ['Menu', 'Shop', 'Orders'],
    ctaTitle: 'Ready to order?',
    ctaDesc: 'A glass modal rises and blurs the whole screen behind it.',
    ctaButton: 'Open order confirmation',
    modalTitle: 'Confirm order',
    modalSummary: (total: string) => `Anchovy-broth noodles ×1, Spicy mixed noodles ×1. Total ${total}`,
    cancel: 'Cancel',
    order: 'Order',
  },
})

export const GlassSurfaceDemo = () => {
  const t = COPY[useDemoLang()]
  const [blurPx, setBlurPx] = useState(16)
  const [tone, setTone] = useState<Tone>('light')
  const [alpha, setAlpha] = useState(DEFAULT_ALPHA.light)
  const [opaque, setOpaque] = useState(false)
  const dialogRef = useRef<HTMLDialogElement>(null)

  const changeTone = (next: Tone) => {
    setTone(next)
    setAlpha(DEFAULT_ALPHA[next])
  }

  const vars = {
    '--glass-blur': `${blurPx}px`,
    '--glass-tint': tintFor({ tone, alpha }),
  } as CSSProperties

  return (
    <div className="playground">
      <section className="controls" aria-label={t.controlsLabel}>
        <label>
          <span>
            {t.blur} <code>--glass-blur</code>
          </span>
          <input type="range" min={0} max={40} step={2} value={blurPx} onChange={(e) => setBlurPx(Number(e.target.value))} />
          <output>{blurPx}px</output>
        </label>
        <label>
          <span>
            {t.tint} <code>--glass-tint</code> {t.tintAlpha}
          </span>
          <input type="range" min={0} max={0.9} step={0.02} value={alpha} onChange={(e) => setAlpha(Number(e.target.value))} />
          <output>{alpha.toFixed(2)}</output>
        </label>
        <fieldset className="glass-tone-picker">
          <legend>
            {t.tone} <code>data-tone</code>
          </legend>
          <label>
            <input type="radio" name="tone" checked={tone === 'light'} onChange={() => changeTone('light')} /> {t.light}
          </label>
          <label>
            <input type="radio" name="tone" checked={tone === 'dark'} onChange={() => changeTone('dark')} /> {t.dark}
          </label>
        </fieldset>
        <label>
          <span>
            {t.opaque} <code>data-opaque</code>
          </span>
          <input type="checkbox" checked={opaque} onChange={(e) => setOpaque(e.target.checked)} />
        </label>
        <p className="controls-note">{t.note}</p>
      </section>

      <div className="glass-stage" style={vars} data-tone={tone}>
        <Glass as="header" variant="nav" tone={tone} opaque={opaque} aria-label={t.headerLabel}>
          <strong className="glass-brand">
            <Icon name="bowl" />
            {t.brand}
          </strong>
          <nav className="glass-links" aria-label={t.navLabel}>
            {t.links.map((label, index) => (
              <a key={label} href="#/glass-surface" aria-current={index === 0 ? 'page' : undefined}>
                {label}
              </a>
            ))}
          </nav>
        </Glass>

        <div className="glass-scene">
          <div className="glass-blob glass-blob-a" aria-hidden="true" />
          <div className="glass-blob glass-blob-b" aria-hidden="true" />
          <div className="glass-blob glass-blob-c" aria-hidden="true" />

          <div className="glass-cards">
            {MENU.map((item) => (
              <Glass key={item.id} as="article" variant="card" tone={tone} opaque={opaque} interactive>
                <DishPhoto dish={item.dish} className="glass-card-photo" />
                <h3>{t.menu[item.id].name}</h3>
                <p>{t.menu[item.id].desc}</p>
                <strong className="glass-card-price">{t.price(item.price)}</strong>
              </Glass>
            ))}
          </div>

          <div className="glass-tiles" aria-hidden="true">
            {/* 유리 뒤로 지나갈 사진 — 흐림이 무엇을 뭉개는지 보이도록 색과 무늬가 많은 음식 사진을 깐다 */}
            {TILES.map((dish, index) => (
              <DishPhoto key={index} dish={dish} className="glass-tile" />
            ))}
          </div>

          <Glass as="section" variant="card" tone={tone} opaque={opaque} className="glass-cta">
            <h3>{t.ctaTitle}</h3>
            <p>{t.ctaDesc}</p>
            <button type="button" onClick={() => dialogRef.current?.showModal()}>
              {t.ctaButton}
            </button>
          </Glass>
        </div>

        <dialog ref={dialogRef} className="glass glass-modal" data-tone={tone} data-opaque={opaque ? 'true' : undefined} aria-labelledby="glass-modal-title">
          <h3 id="glass-modal-title">{t.modalTitle}</h3>
          <p>{t.modalSummary(t.price(ORDER_TOTAL))}</p>
          <div className="glass-modal-actions">
            <button type="button" onClick={() => dialogRef.current?.close()}>
              {t.cancel}
            </button>
            <button type="button" onClick={() => dialogRef.current?.close()}>
              {t.order}
            </button>
          </div>
        </dialog>
      </div>
    </div>
  )
}
