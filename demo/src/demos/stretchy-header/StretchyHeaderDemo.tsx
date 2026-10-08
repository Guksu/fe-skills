import { useState, type CSSProperties } from 'react'
import { useStretchyHeader } from '@skills/stretchy-header/assets/useStretchyHeader'
import { defineCopy, useDemoLang } from '../../demoLang'
import { DISHES, photoSrc } from '../../shared/dishes'
import './stretchy-header-demo.css'

// 언어와 무관한 데이터(아이디·가격)는 밖에, 화면에 보이거나 읽히는 문구는 COPY 두 벌에 둔다
const MENU = [
  { id: 'kal', price: 9000 },
  { id: 'spicyKal', price: 9500 },
  { id: 'sujebi', price: 9500 },
  { id: 'janchi', price: 7000 },
  { id: 'bibim', price: 8000 },
  { id: 'soba', price: 8500 },
  { id: 'mandu', price: 7000 },
  { id: 'kingMandu', price: 6000 },
  { id: 'manduguk', price: 9500 },
  { id: 'tteokManduguk', price: 10000 },
  { id: 'barley', price: 3000 },
  { id: 'suyuk', price: 15000 },
  { id: 'makgeolli', price: 5000 },
  { id: 'sikhye', price: 3000 },
] as const

const COPY = defineCopy({
  ko: {
    menu: {
      kal: { name: '손칼국수', desc: '멸치 육수, 새벽에 치댄 반죽' },
      spicyKal: { name: '얼큰 칼국수', desc: '고추기름 한 바퀴, 청양고추 두 개' },
      sujebi: { name: '들깨 수제비', desc: '들깨가루 듬뿍, 감자 큼직' },
      janchi: { name: '잔치국수', desc: '애호박·계란·김 고명' },
      bibim: { name: '비빔국수', desc: '새콤한 양념에 오이·삶은 달걀' },
      soba: { name: '냉모밀', desc: '슬러시 직전 육수, 무 간 것 별도' },
      mandu: { name: '손만두 한 판', desc: '고기 4 · 김치 4' },
      kingMandu: { name: '왕만두', desc: '주먹만 한 크기, 2개' },
      manduguk: { name: '만둣국', desc: '사골 육수에 손만두 6알' },
      tteokManduguk: { name: '떡만둣국', desc: '떡국떡 추가' },
      barley: { name: '보리밥 (곁들임)', desc: '열무김치·강된장' },
      suyuk: { name: '수육 (소)', desc: '앞다리살, 새우젓' },
      makgeolli: { name: '막걸리', desc: '성수동 양조장 생막걸리' },
      sikhye: { name: '식혜', desc: '직접 삭힌 것, 얼음 동동' },
    },
    price: (n: number) => `${n.toLocaleString('ko-KR')}원`,
    controlsLabel: '스트레치 헤더 옵션',
    parallax: '패럴랙스 비율',
    parallaxScale: '(0 = 콘텐츠와 같이, 1 = 화면에 고정)',
    headerHeight: '헤더 높이',
    note: '위로 스크롤 / 맨 위에서 아래로 당겨 보세요 — 스크롤하면 이미지가 메뉴보다 느리게 밀려 올라가며 어두워지고, 맨 위에서 아래로 당기면(마우스 드래그도 됨) 이미지가 늘어났다가 놓으면 제자리로 돌아옵니다.',
    frameLabel: '가게 소개와 메뉴',
    shopName: '성수동 손칼국수',
    shopInfo: '매일 새벽 반죽 · 11:00–21:00 · 브레이크 없음',
    menuLabel: '메뉴',
  },
  en: {
    menu: {
      kal: { name: 'Knife-cut noodles', desc: 'Anchovy broth, dough kneaded at dawn' },
      spicyKal: { name: 'Spicy knife-cut noodles', desc: 'A swirl of chili oil, two hot green chilies' },
      sujebi: { name: 'Perilla hand-torn noodle soup', desc: 'Plenty of ground perilla, big chunks of potato' },
      janchi: { name: 'Anchovy-broth noodles', desc: 'Topped with zucchini, egg and laver' },
      bibim: { name: 'Spicy mixed noodles', desc: 'Tangy sauce with cucumber and a boiled egg' },
      soba: { name: 'Cold soba', desc: 'Broth chilled almost to slush, grated radish on the side' },
      mandu: { name: 'Handmade dumplings, plate', desc: '4 meat · 4 kimchi' },
      kingMandu: { name: 'Jumbo dumplings', desc: 'Fist-sized, 2 pieces' },
      manduguk: { name: 'Dumpling soup', desc: '6 handmade dumplings in beef bone broth' },
      tteokManduguk: { name: 'Rice cake dumpling soup', desc: 'With sliced rice cakes added' },
      barley: { name: 'Barley rice (side)', desc: 'Young radish kimchi, thick soybean paste' },
      suyuk: { name: 'Boiled pork (small)', desc: 'Pork shoulder, salted shrimp' },
      makgeolli: { name: 'Rice wine', desc: 'Unpasteurized makgeolli from a Seongsu-dong brewery' },
      sikhye: { name: 'Sweet rice drink', desc: 'Brewed in house, served icy' },
    },
    price: (n: number) => `₩${n.toLocaleString('en-US')}`,
    controlsLabel: 'Stretchy header options',
    parallax: 'Parallax ratio',
    parallaxScale: '(0 = moves with content, 1 = fixed on screen)',
    headerHeight: 'Header height',
    note: 'Scroll up, or pull down from the top. As you scroll, the image slides up slower than the menu and darkens. Pull down at the top (mouse drag works too) and the image stretches, then settles back when you let go.',
    frameLabel: 'Shop intro and menu',
    shopName: 'Seongsu-dong Knife-cut Noodles',
    shopInfo: 'Dough made at dawn · 11:00–21:00 · No break time',
    menuLabel: 'Menu',
  },
})

export const StretchyHeaderDemo = () => {
  const t = COPY[useDemoLang()]
  const [parallaxRatio, setParallaxRatio] = useState(0.5)
  const [headerHeight, setHeaderHeight] = useState(240)
  const { containerRef, imageRef } = useStretchyHeader<HTMLDivElement, HTMLImageElement>({ headerHeight, parallaxRatio })

  return (
    <div className="playground">
      <section className="controls" aria-label={t.controlsLabel}>
        <label>
          <span>
            {t.parallax} <code>parallaxRatio</code>
          </span>
          <input type="range" min={0} max={1} step={0.1} value={parallaxRatio} onChange={(e) => setParallaxRatio(Number(e.target.value))} />
          <output>
            {parallaxRatio.toFixed(1)} {t.parallaxScale}
          </output>
        </label>
        <label>
          <span>
            {t.headerHeight} <code>--stretch-height</code>
          </span>
          <input type="range" min={160} max={360} step={20} value={headerHeight} onChange={(e) => setHeaderHeight(Number(e.target.value))} />
          <output>{headerHeight}px</output>
        </label>
        <p className="controls-note">{t.note}</p>
      </section>

      {/* 스크롤 상자라 키보드로도 닿아야 한다(화살표·Page Down으로 스크롤) — 초점을 받으니 이름과 역할을 함께 준다 */}
      <div ref={containerRef} className="stretchy-container stretchy-demo-frame" role="region" aria-label={t.frameLabel} tabIndex={0}>
        <div className="stretchy-header" style={{ '--stretch-height': `${headerHeight}px` } as CSSProperties}>
          <div className="stretchy-header-clip">
            {/* 가게 대표 사진 — 제목이 사진 위에 얹히므로 패턴의 아래쪽 스크림(그라디언트)이 대비를 맡는다 */}
            <img
              ref={imageRef}
              className="stretchy-header-image"
              src={photoSrc('kalguksu')}
              alt=""
              width={DISHES.kalguksu.width}
              height={DISHES.kalguksu.height}
              draggable={false}
            />
          </div>
          <div className="stretchy-header-overlay">
            <h2 className="stretchy-demo-title">{t.shopName}</h2>
            <p className="stretchy-demo-subtitle">{t.shopInfo}</p>
          </div>
        </div>

        <ul className="stretchy-demo-menu" aria-label={t.menuLabel}>
          {MENU.map((item) => (
            <li key={item.id} className="stretchy-demo-item">
              <div>
                <strong>{t.menu[item.id].name}</strong>
                <span>{t.menu[item.id].desc}</span>
              </div>
              <em>{t.price(item.price)}</em>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
