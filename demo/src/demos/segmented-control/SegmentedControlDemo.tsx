import { useState, type CSSProperties } from 'react'
import { SegmentedControl } from '@skills/segmented-control/assets/SegmentedControl'
import './segmented-control-demo.css'

type Noodle = 'somyeon' | 'kalguksu' | 'naengmyeon'
type Order = 'dine-in' | 'takeout'

const NOODLES: { value: Noodle; label: string }[] = [
  { value: 'somyeon', label: '소면' },
  { value: 'kalguksu', label: '칼국수' },
  { value: 'naengmyeon', label: '냉면' },
]

const ORDERS: { value: Order; label: string }[] = [
  { value: 'dine-in', label: '매장' },
  { value: 'takeout', label: '포장' },
]

const MENU: Record<Noodle, { emoji: string; name: string; price: number; note: string }> = {
  somyeon: { emoji: '🍜', name: '잔치국수', price: 7000, note: '멸치 육수에 가는 소면 — 성수동 점심 기본' },
  kalguksu: { emoji: '🥣', name: '손칼국수', price: 9000, note: '두툼한 면과 바지락 국물, 손만두 2개 포함' },
  naengmyeon: { emoji: '🧊', name: '물냉면', price: 10000, note: '살얼음 육수 — 여름 한정, 겨자·식초 따로' },
}

const ORDER_NOTE: Record<Order, string> = {
  'dine-in': '매장 식사 — 반찬·국물 리필 셀프',
  takeout: '포장 — 면과 국물을 따로 담아 드립니다 (+500원)',
}

export const SegmentedControlDemo = () => {
  const [noodle, setNoodle] = useState<Noodle>('somyeon')
  const [order, setOrder] = useState<Order>('dine-in')
  const [durationMs, setDurationMs] = useState(200)

  const vars = { '--segment-duration': `${durationMs}ms` } as CSSProperties
  const item = MENU[noodle]
  const price = item.price + (order === 'takeout' ? 500 : 0)

  return (
    <div className="playground">
      <section className="controls" aria-label="애니메이션 옵션">
        <label>
          <span>
            슬라이드 시간 <code>--segment-duration</code>
          </span>
          <input
            type="range"
            min={100}
            max={600}
            step={50}
            value={durationMs}
            onChange={(e) => setDurationMs(Number(e.target.value))}
          />
          <output>{durationMs}ms</output>
        </label>
        <p className="controls-note">
          칸을 눌러보세요 — 흰 알약(thumb)이 선택 칸 뒤로 미끄러집니다. 칸에 포커스를 두고 방향키(←→)로도
          이동합니다(네이티브 라디오 그룹).
        </p>
      </section>

      <div className="segment-stage" style={vars}>
        <div className="segment-row">
          <span className="segment-row-label">면 종류</span>
          <SegmentedControl name="noodle" label="면 종류" options={NOODLES} value={noodle} onChange={setNoodle} />
        </div>
        <div className="segment-row">
          <span className="segment-row-label">주문 방식</span>
          <SegmentedControl name="order" label="주문 방식" options={ORDERS} value={order} onChange={setOrder} />
        </div>

        <article className="segment-card" aria-live="polite">
          <div className="segment-card-emoji" aria-hidden="true">
            {item.emoji}
          </div>
          <div className="segment-card-body">
            <strong>{item.name}</strong>
            <p>{item.note}</p>
            <p>{ORDER_NOTE[order]}</p>
          </div>
          <span className="segment-card-price">{price.toLocaleString('ko-KR')}원</span>
        </article>
      </div>
    </div>
  )
}
