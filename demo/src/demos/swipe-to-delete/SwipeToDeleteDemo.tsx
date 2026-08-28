import { useState, type CSSProperties } from 'react'
import { SwipeToDelete } from '@skills/swipe-to-delete/assets/SwipeToDelete'
import './swipe-to-delete-demo.css'

type CartItem = { id: string; name: string; price: number }

const INITIAL: CartItem[] = [
  { id: 'myeolchi', name: '멸치국수', price: 8000 },
  { id: 'bibim', name: '비빔국수', price: 9000 },
  { id: 'deulkkae', name: '들깨칼국수', price: 10000 },
  { id: 'mandu', name: '손만두 (6개)', price: 7000 },
]

export const SwipeToDeleteDemo = () => {
  const [items, setItems] = useState(INITIAL)
  const [actionWidth, setActionWidth] = useState(88)
  const [durationMs, setDurationMs] = useState(260)
  const [lastDeleted, setLastDeleted] = useState<string>()

  const vars = { '--swipe-duration': `${durationMs}ms`, '--swipe-bg': 'var(--surface)' } as CSSProperties
  const total = items.reduce((sum, item) => sum + item.price, 0)

  const remove = (item: CartItem) => {
    setItems((prev) => prev.filter((cartItem) => cartItem.id !== item.id))
    setLastDeleted(item.name)
  }

  return (
    <div className="playground">
      <section className="controls" aria-label="제스처 옵션">
        <label>
          <span>
            액션 폭 <code>actionWidth</code>
          </span>
          <input type="range" min={64} max={140} step={4} value={actionWidth} onChange={(e) => setActionWidth(Number(e.target.value))} />
          <output>{actionWidth}px</output>
        </label>
        <label>
          <span>
            속도 <code>--swipe-duration</code>
          </span>
          <input type="range" min={100} max={600} step={20} value={durationMs} onChange={(e) => setDurationMs(Number(e.target.value))} />
          <output>{durationMs}ms</output>
        </label>
        <p className="controls-note">
          행을 왼쪽으로 끌어 보세요 — 절반 이상 끌면 삭제 버튼이 열리고, 액션 폭의 2.5배 이상 끌거나 세게 튕기면 바로
          삭제됩니다. 세로로 스크롤하면 행이 따라오지 않습니다(축 잠금). Tab으로 삭제 버튼에 가면 행이 열립니다.
        </p>
      </section>

      <div className="swipe-stage" style={vars}>
        <h2 className="swipe-stage-title">장바구니</h2>
        <ul className="swipe-list">
          {items.map((item) => (
            <li key={item.id}>
              <SwipeToDelete onDelete={() => remove(item)} actionWidth={actionWidth}>
                <div className="cart-row">
                  <span className="cart-row-name">{item.name}</span>
                  <span className="cart-row-price">{item.price.toLocaleString('ko-KR')}원</span>
                </div>
              </SwipeToDelete>
            </li>
          ))}
        </ul>
        {items.length === 0 && <p className="swipe-empty">장바구니가 비었습니다.</p>}
        <div className="swipe-footer">
          <span aria-live="polite">
            합계 {total.toLocaleString('ko-KR')}원{lastDeleted ? ` · 마지막 삭제: ${lastDeleted}` : ''}
          </span>
          <button
            type="button"
            onClick={() => {
              setItems(INITIAL)
              setLastDeleted(undefined)
            }}
          >
            다시 채우기
          </button>
        </div>
      </div>
    </div>
  )
}
