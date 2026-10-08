import { useState } from 'react'
import { useFlipList } from '@skills/flip-list/assets/useFlipList'
import { defineCopy, useDemoLang } from '../../demoLang'
import { DishPhoto } from '../../shared/DishPhoto'
import type { DishId } from '../../shared/dishes'
import './flip-list-demo.css'

// data-flip-id는 언어를 바꿔도 같아야 이동 전후가 이어진다 — 이름 대신 id를 쓴다
type MenuItem = { id: 'eolkeun' | 'sujebi' | 'naengmomil' | 'wangmandu' | 'jiok'; dish: DishId; price: number; sold: number }

const INITIAL: MenuItem[] = [
  { id: 'eolkeun', dish: 'kalguksu', price: 9000, sold: 812 },
  { id: 'sujebi', dish: 'sujebi', price: 8500, sold: 356 },
  { id: 'naengmomil', dish: 'memil', price: 10000, sold: 421 },
  { id: 'wangmandu', dish: 'mandu', price: 7000, sold: 977 },
  { id: 'jiok', dish: 'bibim', price: 9500, sold: 168 },
]

const COPY = defineCopy({
  ko: {
    menus: { eolkeun: '얼큰 칼국수', sujebi: '들깨 수제비', naengmomil: '냉모밀 정식', wangmandu: '왕만두 한 판', jiok: '지옥 비빔국수' },
    meta: ({ price, sold }: { price: number; sold: number }) => `${price.toLocaleString('ko-KR')}원 · ${sold}그릇`,
    controlsLabel: '정렬',
    sortTitle: '정렬 — 재배치가 미끄러지듯 보입니다',
    byPrice: '가격순',
    bySold: '판매량순',
    reverse: '뒤집기',
    reset: '원래대로',
    note: 'top/left가 아니라 transform만 움직입니다(FLIP) — 각 항목의 data-flip-id가 이동 전후를 잇습니다.',
  },
  en: {
    menus: {
      eolkeun: 'Spicy knife-cut noodles',
      sujebi: 'Perilla hand-torn noodle soup',
      naengmomil: 'Cold soba set',
      wangmandu: 'Jumbo dumpling tray',
      jiok: 'Fiery spicy mixed noodles',
    },
    meta: ({ price, sold }: { price: number; sold: number }) => `₩${price.toLocaleString('en-US')} · ${sold} sold`,
    controlsLabel: 'Sort',
    sortTitle: 'Sort: items glide to their new places',
    byPrice: 'By price',
    bySold: 'Best sellers',
    reverse: 'Reverse',
    reset: 'Reset',
    note: 'Only transform moves, never top or left (FLIP). The data-flip-id on each item links where it was to where it lands.',
  },
})

export const FlipListDemo = () => {
  const t = COPY[useDemoLang()]
  const [items, setItems] = useState(INITIAL)
  const { containerRef } = useFlipList<HTMLUListElement>()

  const sortBy = (key: 'price' | 'sold') =>
    setItems((prev) => [...prev].sort((a, b) => (key === 'price' ? a.price - b.price : b.sold - a.sold)))

  return (
    <div className="playground">
      <section className="controls" aria-label={t.controlsLabel}>
        <label>
          <span>{t.sortTitle}</span>
          <span className="flip-actions">
            <button type="button" onClick={() => sortBy('price')}>{t.byPrice}</button>
            <button type="button" onClick={() => sortBy('sold')}>{t.bySold}</button>
            <button type="button" onClick={() => setItems((prev) => [...prev].reverse())}>{t.reverse}</button>
            <button type="button" onClick={() => setItems(INITIAL)}>{t.reset}</button>
          </span>
        </label>
        <p className="controls-note">{t.note}</p>
      </section>

      <ul ref={containerRef} className="flip-menu">
        {items.map((item) => (
          <li key={item.id} data-flip-id={item.id} className="flip-row">
            <DishPhoto dish={item.dish} className="flip-thumb" />
            <strong>{t.menus[item.id]}</strong>
            <span className="flip-meta">{t.meta({ price: item.price, sold: item.sold })}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
