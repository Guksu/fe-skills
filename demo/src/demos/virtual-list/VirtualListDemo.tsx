import { useMemo, useState, type CSSProperties } from 'react'
import { useVirtualList } from '@skills/virtual-list/assets/useVirtualList'
import { defineCopy, useDemoLang } from '../../demoLang'
import '@skills/virtual-list/assets/virtual-list.css'
import './virtual-list-demo.css'

const ITEM_HEIGHT = 56

const COPY = defineCopy({
  ko: {
    menus: ['멸치국수', '비빔국수', '들깨칼국수', '콩국수', '잔치국수', '바지락칼국수', '손만두', '수제비'],
    number: (n: number) => n.toLocaleString('ko-KR'),
    count: (n: number) => `${n.toLocaleString('ko-KR')}개`,
    price: (n: number) => `${n.toLocaleString('ko-KR')}원`,
    controlsLabel: '목록 옵션',
    itemCount: '항목 수',
    overscan: '여유분',
    note: (
      <>
        항목을 5만 개로 올려도 스크롤이 무겁지 않습니다 — 아래 <b>실제 DOM</b> 수를 보세요. 여유분을 0으로 두고 빠르게 스크롤하면 아래쪽에 빈 칸이 스치고, 3~5로 올리면 사라집니다.
      </>
    ),
    title: '주문 내역',
    total: '전체',
    inDom: '실제 DOM',
    listLabel: (n: number) => `주문 ${n}건`,
    toTop: '맨 위로',
    toMiddle: '중간으로',
    toBottom: '맨 아래로',
  },
  en: {
    menus: [
      'Anchovy-broth noodles',
      'Spicy mixed noodles',
      'Perilla knife-cut noodles',
      'Cold soy-milk noodles',
      'Feast noodles',
      'Clam knife-cut noodles',
      'Handmade dumplings',
      'Hand-torn noodle soup',
    ],
    number: (n: number) => n.toLocaleString('en-US'),
    count: (n: number) => n.toLocaleString('en-US'),
    price: (n: number) => `₩${n.toLocaleString('en-US')}`,
    controlsLabel: 'List options',
    itemCount: 'Item count',
    overscan: 'Extra rows',
    note: (
      <>
        Even at 50,000 items, scrolling stays light. Watch the <b>In DOM</b> count below. Set extra rows to 0 and scroll fast: blank rows flash at the bottom. Raise it to 3 to 5 and they go away.
      </>
    ),
    title: 'Order history',
    total: 'Total',
    inDom: 'In DOM',
    listLabel: (n: number) => `${n.toLocaleString('en-US')} orders`,
    toTop: 'To top',
    toMiddle: 'To middle',
    toBottom: 'To bottom',
  },
})

// 메뉴 이름은 언어마다 달라서 주문에는 메뉴 번호만 둔다
type Order = { id: number; menu: number; count: number; price: number }

const makeOrders = ({ count, menuCount }: { count: number; menuCount: number }): Order[] =>
  Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    menu: index % menuCount,
    count: (index % 3) + 1,
    price: 8000 + (index % 4) * 1000,
  }))

export const VirtualListDemo = () => {
  const t = COPY[useDemoLang()]
  const [itemCount, setItemCount] = useState(10000)
  const [overscan, setOverscan] = useState(3)
  const orders = useMemo(() => makeOrders({ count: itemCount, menuCount: COPY.ko.menus.length }), [itemCount])

  const list = useVirtualList<HTMLDivElement>({ itemCount: orders.length, itemHeight: ITEM_HEIGHT, overscan })
  const rendered = list.indexes.length

  const itemVars = { '--virtual-item-height': `${ITEM_HEIGHT}px` } as CSSProperties

  return (
    <div className="playground">
      <section className="controls" aria-label={t.controlsLabel}>
        <label>
          <span>
            {t.itemCount} <code>itemCount</code>
          </span>
          <input type="range" min={100} max={50000} step={100} value={itemCount} onChange={(e) => setItemCount(Number(e.target.value))} />
          <output>{t.count(itemCount)}</output>
        </label>
        <label>
          <span>
            {t.overscan} <code>overscan</code>
          </span>
          <input type="range" min={0} max={12} step={1} value={overscan} onChange={(e) => setOverscan(Number(e.target.value))} />
          <output>{t.count(overscan)}</output>
        </label>
        <p className="controls-note">{t.note}</p>
      </section>

      <div className="vl-stage">
        <div className="vl-head">
          <h2 className="vl-title">{t.title}</h2>
          <dl className="vl-counters">
            <div>
              <dt>{t.total}</dt>
              <dd>{t.count(itemCount)}</dd>
            </div>
            <div>
              <dt>{t.inDom}</dt>
              <dd className="vl-counter-strong">{t.count(rendered)}</dd>
            </div>
          </dl>
        </div>

        {/* 스크롤 영역은 키보드로도 닿아야 한다 — tabIndex로 포커스를 받아 방향키·PageDown으로 굴린다 */}
        <div
          ref={list.containerRef}
          className="virtual-viewport vl-viewport"
          role="list"
          aria-label={t.listLabel(itemCount)}
          tabIndex={0}
        >
          <div className="virtual-sizer" style={{ height: list.range.totalHeight }}>
            <div className="virtual-window" style={{ transform: `translateY(${list.range.offsetY}px)` }}>
              {list.indexes.map((index) => {
                const order = orders[index]
                return (
                  <div
                    key={order.id}
                    className="virtual-item vl-row"
                    style={itemVars}
                    role="listitem"
                    aria-posinset={index + 1}
                    aria-setsize={itemCount}
                  >
                    <span className="vl-no">#{t.number(order.id)}</span>
                    <span className="vl-menu">
                      {t.menus[order.menu]} × {order.count}
                    </span>
                    <span className="vl-price">{t.price(order.price * order.count)}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="vl-footer">
          {/* 먼 거리는 즉시 이동한다 — smooth로 5만 개를 훑으면 브라우저가 화면을 먼저 옮기는 동안
              JS가 따라가지 못해 빈 칸이 길게 스친다 */}
          <button type="button" onClick={() => list.scrollToIndex(0)}>
            {t.toTop}
          </button>
          <button type="button" onClick={() => list.scrollToIndex(Math.floor(itemCount / 2))}>
            {t.toMiddle}
          </button>
          <button type="button" onClick={() => list.scrollToIndex(itemCount - 1)}>
            {t.toBottom}
          </button>
        </div>
      </div>
    </div>
  )
}
