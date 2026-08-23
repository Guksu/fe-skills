import { useState } from 'react'
import { useFlipList } from '@skills/flip-list/assets/useFlipList'
import './flip-list-demo.css'

type MenuItem = { name: string; emoji: string; price: number; sold: number }

const INITIAL: MenuItem[] = [
  { name: '얼큰 칼국수', emoji: '🍜', price: 9000, sold: 812 },
  { name: '들깨 수제비', emoji: '🥣', price: 8500, sold: 356 },
  { name: '냉모밀 정식', emoji: '🧊', price: 10000, sold: 421 },
  { name: '왕만두 한 판', emoji: '🥟', price: 7000, sold: 977 },
  { name: '지옥 비빔국수', emoji: '🌶️', price: 9500, sold: 168 },
]

export const FlipListDemo = () => {
  const [items, setItems] = useState(INITIAL)
  const { containerRef } = useFlipList<HTMLUListElement>()

  const sortBy = (key: 'price' | 'sold') =>
    setItems((prev) => [...prev].sort((a, b) => (key === 'price' ? a.price - b.price : b.sold - a.sold)))

  return (
    <div className="playground">
      <section className="controls" aria-label="정렬">
        <label>
          <span>정렬 — 재배치가 미끄러지듯 보입니다</span>
          <span className="flip-actions">
            <button type="button" onClick={() => sortBy('price')}>가격순</button>
            <button type="button" onClick={() => sortBy('sold')}>판매량순</button>
            <button type="button" onClick={() => setItems((prev) => [...prev].reverse())}>뒤집기</button>
            <button type="button" onClick={() => setItems(INITIAL)}>원래대로</button>
          </span>
        </label>
        <p className="controls-note">
          top/left가 아니라 transform만 움직입니다(FLIP) — 각 항목의 data-flip-id가 이동 전후를
          잇습니다.
        </p>
      </section>

      <ul ref={containerRef} className="flip-menu">
        {items.map((item) => (
          <li key={item.name} data-flip-id={item.name} className="flip-row">
            <span className="flip-emoji">{item.emoji}</span>
            <strong>{item.name}</strong>
            <span className="flip-meta">
              {item.price.toLocaleString('ko-KR')}원 · {item.sold}그릇
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
