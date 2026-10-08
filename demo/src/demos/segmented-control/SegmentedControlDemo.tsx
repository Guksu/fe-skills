import { useState, type CSSProperties } from 'react'
import { SegmentedControl } from '@skills/segmented-control/assets/SegmentedControl'
import { defineCopy, useDemoLang } from '../../demoLang'
import { DishPhoto } from '../../shared/DishPhoto'
import type { DishId } from '../../shared/dishes'
import './segmented-control-demo.css'

type Noodle = 'somyeon' | 'kalguksu' | 'naengmyeon'
type Order = 'dine-in' | 'takeout'

// 언어와 무관한 데이터(값·사진·가격)는 밖에, 화면에 보이거나 읽히는 문구는 COPY 두 벌에 둔다
const NOODLE_VALUES: Noodle[] = ['somyeon', 'kalguksu', 'naengmyeon']
const ORDER_VALUES: Order[] = ['dine-in', 'takeout']

const MENU: Record<Noodle, { dish: DishId; price: number }> = {
  somyeon: { dish: 'janchi', price: 7000 },
  kalguksu: { dish: 'bajirak', price: 9000 },
  naengmyeon: { dish: 'naengmyeon', price: 10000 },
}

const TAKEOUT_FEE = 500

const COPY = defineCopy({
  ko: {
    noodles: { somyeon: '소면', kalguksu: '칼국수', naengmyeon: '냉면' },
    orders: { 'dine-in': '매장', takeout: '포장' },
    menu: {
      somyeon: { name: '잔치국수', note: '멸치 육수에 가는 소면 — 성수동 점심 기본' },
      kalguksu: { name: '손칼국수', note: '두툼한 면과 바지락 국물, 손만두 2개 포함' },
      naengmyeon: { name: '물냉면', note: '살얼음 육수 — 여름 한정, 겨자·식초 따로' },
    },
    orderNote: {
      'dine-in': '매장 식사 — 반찬·국물 리필 셀프',
      takeout: '포장 — 면과 국물을 따로 담아 드립니다 (+500원)',
    },
    price: (n: number) => `${n.toLocaleString('ko-KR')}원`,
    controlsLabel: '애니메이션 옵션',
    duration: '슬라이드 시간',
    note: '칸을 눌러보세요 — 흰 알약(thumb)이 선택 칸 뒤로 미끄러집니다. 칸에 포커스를 두고 방향키(←→)로도 이동합니다(네이티브 라디오 그룹).',
    noodleLabel: '면 종류',
    orderLabel: '주문 방식',
  },
  en: {
    noodles: { somyeon: 'Thin', kalguksu: 'Knife-cut', naengmyeon: 'Cold' },
    orders: { 'dine-in': 'Dine in', takeout: 'Takeout' },
    menu: {
      somyeon: { name: 'Anchovy-broth noodles', note: 'Thin wheat noodles in anchovy broth. A Seongsu-dong lunch staple.' },
      kalguksu: { name: 'Knife-cut noodles', note: 'Thick noodles in clam broth, with two handmade dumplings' },
      naengmyeon: { name: 'Cold buckwheat noodles', note: 'Icy, slushy broth. Summer only, mustard and vinegar on the side.' },
    },
    orderNote: {
      'dine-in': 'Dining in: side dish and broth refills are self-serve',
      takeout: 'Takeout: noodles and broth packed separately (+₩500)',
    },
    price: (n: number) => `₩${n.toLocaleString('en-US')}`,
    controlsLabel: 'Animation options',
    duration: 'Slide duration',
    note: 'Tap a segment. The white pill (thumb) slides behind the one you picked. You can also focus a segment and move with the arrow keys (←→), since it is a native radio group.',
    noodleLabel: 'Noodle type',
    orderLabel: 'Order type',
  },
})

export const SegmentedControlDemo = () => {
  const t = COPY[useDemoLang()]
  const [noodle, setNoodle] = useState<Noodle>('somyeon')
  const [order, setOrder] = useState<Order>('dine-in')
  const [durationMs, setDurationMs] = useState(200)

  const vars = { '--segment-duration': `${durationMs}ms` } as CSSProperties
  const item = MENU[noodle]
  const price = item.price + (order === 'takeout' ? TAKEOUT_FEE : 0)
  const noodleOptions = NOODLE_VALUES.map((value) => ({ value, label: t.noodles[value] }))
  const orderOptions = ORDER_VALUES.map((value) => ({ value, label: t.orders[value] }))

  return (
    <div className="playground">
      <section className="controls" aria-label={t.controlsLabel}>
        <label>
          <span>
            {t.duration} <code>--segment-duration</code>
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
        <p className="controls-note">{t.note}</p>
      </section>

      <div className="segment-stage" style={vars}>
        <div className="segment-row">
          <span className="segment-row-label">{t.noodleLabel}</span>
          <SegmentedControl name="noodle" label={t.noodleLabel} options={noodleOptions} value={noodle} onChange={setNoodle} />
        </div>
        <div className="segment-row">
          <span className="segment-row-label">{t.orderLabel}</span>
          <SegmentedControl name="order" label={t.orderLabel} options={orderOptions} value={order} onChange={setOrder} />
        </div>

        <article className="segment-card" aria-live="polite">
          <DishPhoto dish={item.dish} className="segment-card-photo" />
          <div className="segment-card-body">
            <strong>{t.menu[noodle].name}</strong>
            <p>{t.menu[noodle].note}</p>
            <p>{t.orderNote[order]}</p>
          </div>
          <span className="segment-card-price">{t.price(price)}</span>
        </article>
      </div>
    </div>
  )
}
