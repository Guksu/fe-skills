import { useState, type CSSProperties } from 'react'
import { DropdownMenu } from '@skills/dropdown-menu/assets/DropdownMenu'
import './dropdown-menu-demo.css'

type Order = { id: string; menu: string; date: string; price: number }

const ORDERS: Order[] = [
  { id: 'o-1', menu: '멸치국수 × 2', date: '9월 1일', price: 16000 },
  { id: 'o-2', menu: '들깨칼국수 × 1', date: '8월 28일', price: 10000 },
  { id: 'o-3', menu: '비빔국수 × 3', date: '8월 21일', price: 27000 },
  { id: 'o-4', menu: '손만두 × 2', date: '8월 14일', price: 14000 },
  { id: 'o-5', menu: '콩국수 × 1', date: '8월 3일', price: 11000 },
]

export const DropdownMenuDemo = () => {
  const [align, setAlign] = useState<'start' | 'end'>('end')
  const [lastAction, setLastAction] = useState<string>()

  const vars = {
    '--menu-bg': 'var(--surface)',
    '--menu-color': 'var(--text)',
    '--menu-border': 'var(--border)',
    '--menu-active-bg': 'var(--accent-soft)',
    '--menu-focus': 'var(--accent)',
    '--menu-danger': '#f87171',
  } as CSSProperties

  const itemsFor = (order: Order) => [
    { id: 'receipt', label: '영수증 보기', onSelect: () => setLastAction(`${order.menu} — 영수증 보기`) },
    { id: 'repeat', label: '같은 메뉴 다시 주문', onSelect: () => setLastAction(`${order.menu} — 다시 주문`) },
    { id: 'review', label: '리뷰 쓰기 (기간 지남)', onSelect: () => {}, disabled: true },
    { id: 'cancel', label: '주문 취소', onSelect: () => setLastAction(`${order.menu} — 주문 취소`), danger: true },
  ]

  return (
    <div className="playground">
      <section className="controls" aria-label="메뉴 옵션">
        <label className="controls-inline">
          <input type="checkbox" checked={align === 'end'} onChange={(e) => setAlign(e.target.checked ? 'end' : 'start')} />
          <span>
            버튼 오른쪽에 맞추기 <code>align="end"</code>
          </span>
        </label>
        <p className="controls-note">
          각 행의 <b>⋯</b>를 눌러 보세요. <b>맨 아래 행</b>에서 열면 아래 공간이 모자라 위로 뒤집혀 열리고, 등장 방향도
          함께 바뀝니다. 키보드로는 Tab으로 ⋯에 간 뒤 <b>아래 방향키</b>로 열고, 방향키·첫 글자로 옮기며, Esc로 닫으면
          포커스가 버튼으로 돌아옵니다. 비활성 항목(리뷰 쓰기)은 방향키가 건너뜁니다.
        </p>
      </section>

      <div className="dm-stage" style={vars}>
        <h2 className="dm-title">주문 내역</h2>

        <ul className="dm-list">
          {ORDERS.map((order) => (
            <li key={order.id} className="dm-row">
              <span className="dm-row-body">
                <strong className="dm-row-menu">{order.menu}</strong>
                <span className="dm-row-date">{order.date}</span>
              </span>
              <span className="dm-row-price">{order.price.toLocaleString('ko-KR')}원</span>
              <DropdownMenu label={`${order.menu} 주문 관리`} align={align} items={itemsFor(order)} />
            </li>
          ))}
        </ul>

        <p className="dm-result" role="status">
          {lastAction ? `실행: ${lastAction}` : '아직 아무 동작도 실행하지 않았습니다'}
        </p>
      </div>
    </div>
  )
}
