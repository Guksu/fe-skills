import { useState, type CSSProperties } from 'react'
import { QuantityStepper } from '@skills/quantity-stepper/assets/QuantityStepper'
import './quantity-stepper-demo.css'

type CartItem = { id: string; name: string; price: number; emoji: string; count: number }

const INITIAL: CartItem[] = [
  { id: 'myeolchi', name: '멸치국수', price: 8000, emoji: '🍜', count: 2 },
  { id: 'bibim', name: '비빔국수', price: 9000, emoji: '🌶️', count: 1 },
  { id: 'mandu', name: '손만두', price: 7000, emoji: '🥟', count: 1 },
]

export const QuantityStepperDemo = () => {
  const [items, setItems] = useState(INITIAL)
  const [max, setMax] = useState(20)
  const [removeAtOne, setRemoveAtOne] = useState(true)

  const total = items.reduce((sum, item) => sum + item.price * item.count, 0)

  const setCount = ({ id, count }: { id: string; count: number }) =>
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, count } : item)))

  const vars = {
    '--qty-bg': 'var(--bg)',
    '--qty-border': 'var(--border)',
    '--qty-color': 'var(--text)',
    '--qty-accent': 'var(--accent)',
    '--qty-hover': 'var(--accent-soft)',
    '--qty-active': 'var(--accent-soft)',
  } as CSSProperties

  return (
    <div className="playground">
      <section className="controls" aria-label="스테퍼 옵션">
        <label>
          <span>
            최대 수량 <code>max</code>
          </span>
          <input type="range" min={2} max={50} step={1} value={max} onChange={(e) => setMax(Number(e.target.value))} />
          <output>{max}개</output>
        </label>
        <label className="controls-inline">
          <input type="checkbox" checked={removeAtOne} onChange={(e) => setRemoveAtOne(e.target.checked)} />
          <span>
            수량 1에서 −를 누르면 삭제 <code>onBelowMin</code>
          </span>
        </label>
        <p className="controls-note">
          <b>+ 를 누르고 있어 보세요</b> — 0.4초 뒤부터 반복되며 점점 빨라집니다. 짧게 한 번 누르면 딱 한 칸만 오릅니다.
          숫자를 직접 쳐도 되고(다 치면 범위에 맞춰 정리됩니다), 숫자 칸에서 방향키로도 조절됩니다. 최대 수량에 닿으면 +
          버튼이 흐려집니다.
        </p>
      </section>

      <div className="qs-stage" style={vars}>
        <h2 className="qs-title">장바구니</h2>

        <ul className="qs-list">
          {items.map((item) => (
            <li key={item.id} className="qs-row">
              <span className="qs-emoji" aria-hidden="true">
                {item.emoji}
              </span>
              <span className="qs-body">
                <strong className="qs-name">{item.name}</strong>
                <span className="qs-unit">{item.price.toLocaleString('ko-KR')}원</span>
              </span>

              <QuantityStepper
                value={item.count}
                min={1}
                max={max}
                label={`${item.name} 수량`}
                onChange={(count) => setCount({ id: item.id, count })}
                onBelowMin={removeAtOne ? () => setItems((prev) => prev.filter((row) => row.id !== item.id)) : undefined}
              />

              <span className="qs-sum">{(item.price * item.count).toLocaleString('ko-KR')}원</span>
            </li>
          ))}
          {items.length === 0 && <li className="qs-empty">장바구니가 비었습니다</li>}
        </ul>

        <div className="qs-footer">
          <span>
            합계 <strong>{total.toLocaleString('ko-KR')}원</strong>
          </span>
          <button type="button" onClick={() => setItems(INITIAL)}>
            다시 채우기
          </button>
        </div>
      </div>
    </div>
  )
}
