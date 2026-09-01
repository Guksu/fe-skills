import { useMemo, useState, type CSSProperties } from 'react'
import { useVirtualList } from '@skills/virtual-list/assets/useVirtualList'
import '@skills/virtual-list/assets/virtual-list.css'
import './virtual-list-demo.css'

const ITEM_HEIGHT = 56
const MENUS = ['멸치국수', '비빔국수', '들깨칼국수', '콩국수', '잔치국수', '바지락칼국수', '손만두', '수제비']

type Order = { id: number; menu: string; count: number; price: number }

const makeOrders = (count: number): Order[] =>
  Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    menu: MENUS[index % MENUS.length],
    count: (index % 3) + 1,
    price: 8000 + (index % 4) * 1000,
  }))

export const VirtualListDemo = () => {
  const [itemCount, setItemCount] = useState(10000)
  const [overscan, setOverscan] = useState(3)
  const orders = useMemo(() => makeOrders(itemCount), [itemCount])

  const list = useVirtualList<HTMLDivElement>({ itemCount: orders.length, itemHeight: ITEM_HEIGHT, overscan })
  const rendered = list.indexes.length

  const itemVars = { '--virtual-item-height': `${ITEM_HEIGHT}px` } as CSSProperties

  return (
    <div className="playground">
      <section className="controls" aria-label="목록 옵션">
        <label>
          <span>
            항목 수 <code>itemCount</code>
          </span>
          <input type="range" min={100} max={50000} step={100} value={itemCount} onChange={(e) => setItemCount(Number(e.target.value))} />
          <output>{itemCount.toLocaleString('ko-KR')}개</output>
        </label>
        <label>
          <span>
            여유분 <code>overscan</code>
          </span>
          <input type="range" min={0} max={12} step={1} value={overscan} onChange={(e) => setOverscan(Number(e.target.value))} />
          <output>{overscan}개</output>
        </label>
        <p className="controls-note">
          항목을 5만 개로 올려도 스크롤이 무겁지 않습니다 — 아래 <b>실제 DOM</b> 수를 보세요. 여유분을 0으로 두고 빠르게
          스크롤하면 아래쪽에 빈 칸이 스치고, 3~5로 올리면 사라집니다.
        </p>
      </section>

      <div className="vl-stage">
        <div className="vl-head">
          <h2 className="vl-title">주문 내역</h2>
          <dl className="vl-counters">
            <div>
              <dt>전체</dt>
              <dd>{itemCount.toLocaleString('ko-KR')}개</dd>
            </div>
            <div>
              <dt>실제 DOM</dt>
              <dd className="vl-counter-strong">{rendered}개</dd>
            </div>
          </dl>
        </div>

        <div ref={list.containerRef} className="virtual-viewport vl-viewport" role="list" aria-label={`주문 ${itemCount}건`}>
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
                    <span className="vl-no">#{order.id.toLocaleString('ko-KR')}</span>
                    <span className="vl-menu">
                      {order.menu} × {order.count}
                    </span>
                    <span className="vl-price">{(order.price * order.count).toLocaleString('ko-KR')}원</span>
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
            맨 위로
          </button>
          <button type="button" onClick={() => list.scrollToIndex(Math.floor(itemCount / 2))}>
            중간으로
          </button>
          <button type="button" onClick={() => list.scrollToIndex(itemCount - 1)}>
            맨 아래로
          </button>
        </div>
      </div>
    </div>
  )
}
