import { useState, type CSSProperties } from 'react'
import { SwipeToDelete } from '@skills/swipe-to-delete/assets/SwipeToDelete'
import './swipe-to-delete-demo.css'

type CartItem = { id: string; name: string; price: number }
type Order = { id: string; title: string; date: string; total: number; later?: boolean }

const INITIAL: CartItem[] = [
  { id: 'myeolchi', name: '멸치국수', price: 8000 },
  { id: 'bibim', name: '비빔국수', price: 9000 },
  { id: 'deulkkae', name: '들깨칼국수', price: 10000 },
  { id: 'mandu', name: '손만두 (6개)', price: 7000 },
]

const INITIAL_ORDERS: Order[] = [
  { id: 'o-0912', title: '잔치국수 2 · 손만두 1', date: '9월 12일 · 성수점', total: 23000 },
  { id: 'o-0905', title: '비빔국수 1', date: '9월 5일 · 성수점', total: 9000 },
  { id: 'o-0828', title: '들깨칼국수 1 · 공깃밥 1', date: '8월 28일 · 포장', total: 11000 },
]

export const SwipeToDeleteDemo = () => {
  const [items, setItems] = useState(INITIAL)
  const [orders, setOrders] = useState(INITIAL_ORDERS)
  const [actionWidth, setActionWidth] = useState(88)
  const [durationMs, setDurationMs] = useState(260)
  const [lastDeleted, setLastDeleted] = useState<string>()
  const [orderLog, setOrderLog] = useState<string>()

  const vars = { '--swipe-duration': `${durationMs}ms`, '--swipe-bg': 'var(--surface)' } as CSSProperties
  const total = items.reduce((sum, item) => sum + item.price, 0)

  const remove = (item: CartItem) => {
    setItems((prev) => prev.filter((cartItem) => cartItem.id !== item.id))
    setLastDeleted(item.name)
  }

  // 여러 액션 행 — 보관·나중에는 즉시 처리(행 유지 또는 제거), 삭제는 마지막 액션이라 접힘 뒤에 불린다
  const archiveOrder = (order: Order) => {
    setOrders((prev) => prev.filter((candidate) => candidate.id !== order.id))
    setOrderLog(`보관함으로 옮김: ${order.title}`)
  }
  const markLater = (order: Order) => {
    setOrders((prev) => prev.map((candidate) => (candidate.id === order.id ? { ...candidate, later: !candidate.later } : candidate)))
    setOrderLog(`${order.later ? '나중에 표시 해제' : '나중에 다시 주문'}: ${order.title}`)
  }
  const deleteOrder = (order: Order) => {
    setOrders((prev) => prev.filter((candidate) => candidate.id !== order.id))
    setOrderLog(`삭제: ${order.title}`)
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
          아래 주문 내역은 액션이 세 개라 열림 폭이 액션 폭 × 3이고, 끝까지 밀면 마지막 액션(삭제)이 늘어나며 실행됩니다.
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

      <div className="swipe-stage" style={vars}>
        <h2 className="swipe-stage-title">
          주문 내역<small>여러 액션 행 — 보관 · 나중에 · 삭제</small>
        </h2>
        <ul className="swipe-list">
          {orders.map((order) => (
            <li key={order.id}>
              <SwipeToDelete
                actionWidth={actionWidth}
                actions={[
                  { label: '보관', onClick: () => archiveOrder(order) },
                  { label: order.later ? '해제' : '나중에', onClick: () => markLater(order), tone: 'accent' },
                  { label: '삭제', onClick: () => deleteOrder(order), tone: 'danger' },
                ]}
              >
                <div className="order-row">
                  <div className="order-row-title">
                    <span>
                      {order.title}
                      {order.later && <span className="order-row-badge">나중에</span>}
                    </span>
                    <span className="cart-row-price">{order.total.toLocaleString('ko-KR')}원</span>
                  </div>
                  <span className="order-row-meta">{order.date}</span>
                </div>
              </SwipeToDelete>
            </li>
          ))}
        </ul>
        {orders.length === 0 && <p className="swipe-empty">주문 내역이 없습니다.</p>}
        <div className="swipe-footer">
          <span aria-live="polite">{orderLog ?? '행을 밀어 세 액션을 열어 보세요'}</span>
          <button
            type="button"
            onClick={() => {
              setOrders(INITIAL_ORDERS)
              setOrderLog(undefined)
            }}
          >
            다시 채우기
          </button>
        </div>
      </div>
    </div>
  )
}
