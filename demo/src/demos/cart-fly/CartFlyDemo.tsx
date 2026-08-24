import { useRef, useState } from 'react'
import { useCartFly } from '@skills/cart-fly/assets/useCartFly'
import './cart-fly-demo.css'

const PRODUCTS = [
  { name: '얼큰 칼국수', emoji: '🍜', price: 9000 },
  { name: '왕만두 한 판', emoji: '🥟', price: 7000 },
  { name: '냉모밀 정식', emoji: '🧊', price: 10000 },
  { name: '수제 어묵탕', emoji: '🍢', price: 6000 },
]

type Arc = 'horizontal-first' | 'vertical-first'

export const CartFlyDemo = () => {
  const [count, setCount] = useState(0)
  const [bumpKey, setBumpKey] = useState(0)
  const [arc, setArc] = useState<Arc>('horizontal-first')
  const { targetRef, flyFrom } = useCartFly<HTMLButtonElement>()
  const cardRefs = useRef<Record<string, HTMLElement | null>>({})

  const addToCart = (name: string) => {
    const source = cardRefs.current[name]?.querySelector('.cart-thumb') as HTMLElement | null
    if (!source) return
    flyFrom({
      source,
      arc,
      onArrive: () => {
        setCount((prev) => prev + 1)
        setBumpKey((prev) => prev + 1) // key 교체로 뱃지 팝을 재트리거
      },
    })
  }

  return (
    <div className="playground">
      <section className="controls" aria-label="옵션">
        <label>
          <span>
            궤적 방향 <code>arc</code>
          </span>
          <select value={arc} onChange={(e) => setArc(e.target.value as Arc)}>
            <option value="horizontal-first">j자 — 옆으로 갔다가 끝에서 상승 (기본)</option>
            <option value="vertical-first">r자 — 먼저 떠올랐다가 옆으로</option>
          </select>
        </label>
        <p className="controls-note">
          담기를 누르면 썸네일 고스트가 장바구니로 곡선을 그리며 날아갑니다 — 한 축은 등속, 다른
          축은 가속이라 곡선이 되고, 어느 축이 가속이냐가 j자/r자를 가릅니다. 카운트는 도착 순간에
          올라갑니다.
        </p>
      </section>

      <div className="cart-bar">
        <button ref={targetRef} type="button" className="cart-button" aria-label={`장바구니 ${count}개`}>
          🛒 장바구니
          {count > 0 && (
            <span key={bumpKey} className="cart-badge">
              {count}
            </span>
          )}
        </button>
      </div>

      <div className="cart-grid">
        {PRODUCTS.map((product) => (
          <article
            key={product.name}
            ref={(el) => {
              cardRefs.current[product.name] = el
            }}
            className="cart-card"
          >
            <span className="cart-thumb">{product.emoji}</span>
            <strong>{product.name}</strong>
            <span className="cart-price">{product.price.toLocaleString('ko-KR')}원</span>
            <button type="button" onClick={() => addToCart(product.name)}>
              담기
            </button>
          </article>
        ))}
      </div>
    </div>
  )
}
