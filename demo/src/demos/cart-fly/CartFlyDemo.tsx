import { useRef, useState } from 'react'
import { useCartFly } from '@skills/cart-fly/assets/useCartFly'
import { Icon } from '@skills/layout-principles/assets/Icon'
import { defineCopy, useDemoLang } from '../../demoLang'
import { DishPhoto } from '../../shared/DishPhoto'
import type { DishId } from '../../shared/dishes'
import './cart-fly-demo.css'

// 언어와 무관한 데이터(id·사진·가격)는 밖에, 상품 이름은 COPY에 id로 둔다
const PRODUCTS: { id: 'eolkeun' | 'wangmandu' | 'naengmomil' | 'eomuk'; dish: DishId; price: number }[] = [
  { id: 'eolkeun', dish: 'kalguksu', price: 9000 },
  { id: 'wangmandu', dish: 'mandu', price: 7000 },
  { id: 'naengmomil', dish: 'memil', price: 10000 },
  { id: 'eomuk', dish: 'eomuk', price: 6000 },
]

const COPY = defineCopy({
  ko: {
    products: { eolkeun: '얼큰 칼국수', wangmandu: '왕만두 한 판', naengmomil: '냉모밀 정식', eomuk: '수제 어묵탕' },
    price: (n: number) => `${n.toLocaleString('ko-KR')}원`,
    controlsLabel: '옵션',
    arc: '궤적 방향',
    arcOptions: { 'horizontal-first': 'j자 — 옆으로 갔다가 끝에서 상승 (기본)', 'vertical-first': 'r자 — 먼저 떠올랐다가 옆으로' },
    note: '담기를 누르면 썸네일 고스트가 장바구니로 곡선을 그리며 날아갑니다 — 한 축은 등속, 다른 축은 가속이라 곡선이 되고, 어느 축이 가속이냐가 j자/r자를 가릅니다. 카운트는 도착 순간에 올라갑니다.',
    cartLabel: (count: number) => `장바구니 ${count}개`,
    cart: '장바구니',
    add: '담기',
  },
  en: {
    products: { eolkeun: 'Spicy knife-cut noodles', wangmandu: 'Jumbo dumpling tray', naengmomil: 'Cold soba set', eomuk: 'Homemade fish cake soup' },
    price: (n: number) => `₩${n.toLocaleString('en-US')}`,
    controlsLabel: 'Options',
    arc: 'Flight path',
    arcOptions: { 'horizontal-first': 'j curve: across first, rising at the end (default)', 'vertical-first': 'r curve: up first, then across' },
    note: 'Tap Add and a ghost of the thumbnail flies to the cart on a curve. One axis moves at a steady speed while the other accelerates, which bends the path. Which axis accelerates decides j or r. The count goes up the moment it lands.',
    cartLabel: (count: number) => `Cart, ${count} items`,
    cart: 'Cart',
    add: 'Add',
  },
})

type Arc = 'horizontal-first' | 'vertical-first'
const ARCS: Arc[] = ['horizontal-first', 'vertical-first']

export const CartFlyDemo = () => {
  const t = COPY[useDemoLang()]
  const [count, setCount] = useState(0)
  const [bumpKey, setBumpKey] = useState(0)
  const [arc, setArc] = useState<Arc>('horizontal-first')
  const { targetRef, flyFrom } = useCartFly<HTMLButtonElement>()
  const cardRefs = useRef<Record<string, HTMLElement | null>>({})

  const addToCart = (id: string) => {
    const source = cardRefs.current[id]?.querySelector('.cart-thumb') as HTMLElement | null
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
      <section className="controls" aria-label={t.controlsLabel}>
        <label>
          <span>
            {t.arc} <code>arc</code>
          </span>
          <select value={arc} onChange={(e) => setArc(e.target.value as Arc)}>
            {ARCS.map((value) => (
              <option key={value} value={value}>
                {t.arcOptions[value]}
              </option>
            ))}
          </select>
        </label>
        <p className="controls-note">{t.note}</p>
      </section>

      <div className="cart-bar">
        <button ref={targetRef} type="button" className="cart-button" aria-label={t.cartLabel(count)}>
          <Icon name="cart" />
          {t.cart}
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
            key={product.id}
            ref={(el) => {
              cardRefs.current[product.id] = el
            }}
            className="cart-card"
          >
            {/* 날아가는 고스트는 이 사진을 복제한다(.cart-thumb) — 사진이 그대로 장바구니로 들어간다 */}
            <DishPhoto dish={product.dish} className="cart-thumb" />
            <strong>{t.products[product.id]}</strong>
            <span className="cart-price">{t.price(product.price)}</span>
            <button type="button" onClick={() => addToCart(product.id)}>
              {t.add}
            </button>
          </article>
        ))}
      </div>
    </div>
  )
}
