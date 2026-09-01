import { useState, type CSSProperties } from 'react'
import { useDragReorder } from '@skills/drag-to-reorder/assets/useDragReorder'
import './drag-to-reorder-demo.css'

type Menu = { id: string; name: string; price: number; emoji: string }

const INITIAL: Menu[] = [
  { id: 'myeolchi', name: '멸치국수', price: 8000, emoji: '🍜' },
  { id: 'bibim', name: '비빔국수', price: 9000, emoji: '🌶️' },
  { id: 'deulkkae', name: '들깨칼국수', price: 10000, emoji: '🥣' },
  { id: 'kong', name: '콩국수', price: 11000, emoji: '🥛' },
  { id: 'mandu', name: '손만두', price: 7000, emoji: '🥟' },
]

export const DragToReorderDemo = () => {
  const [menus, setMenus] = useState(INITIAL)
  const [useLongPress, setUseLongPress] = useState(false)
  const [durationMs, setDurationMs] = useState(200)
  const [liftScale, setLiftScale] = useState(1.02)

  const reorder = useDragReorder<HTMLUListElement>({
    longPressMs: useLongPress ? 250 : 0,
    settleMs: durationMs,
    liftScale,
    describe: (id) => menus.find((menu) => menu.id === id)?.name ?? '',
    onReorder: ({ from, to }) => {
      setMenus((prev) => {
        const next = [...prev]
        const [moved] = next.splice(from, 1)
        next.splice(to, 0, moved)
        return next
      })
    },
  })

  const vars = { '--reorder-duration': `${durationMs}ms`, '--reorder-handle-color': 'var(--text-dim)' } as CSSProperties

  return (
    <div className="playground">
      <section className="controls" aria-label="드래그 옵션">
        <label>
          <span>
            비켜 주기·정착 속도 <code>settleMs</code>
          </span>
          <input type="range" min={80} max={500} step={20} value={durationMs} onChange={(e) => setDurationMs(Number(e.target.value))} />
          <output>{durationMs}ms</output>
        </label>
        <label>
          <span>
            들어올린 크기 <code>liftScale</code>
          </span>
          <input type="range" min={1} max={1.12} step={0.01} value={liftScale} onChange={(e) => setLiftScale(Number(e.target.value))} />
          <output>{liftScale.toFixed(2)}배</output>
        </label>
        <label className="controls-inline">
          <input type="checkbox" checked={useLongPress} onChange={(e) => setUseLongPress(e.target.checked)} />
          <span>
            항목 전체를 길게 눌러 끌기 <code>longPressMs=250</code>
          </span>
        </label>
        <p className="controls-note">
          손잡이(⠿)를 끌어 순서를 바꿔 보세요. 지나친 항목이 자리를 비켜 주고, 놓으면 빈 자리로 정착한 뒤에야 순서가
          확정됩니다. <b>Tab으로 손잡이에 간 뒤 위아래 방향키</b>로도 옮길 수 있습니다 — 마우스 없이 쓰는 사람에게는
          그 경로가 전부입니다.
        </p>
      </section>

      <div className="dr-stage" style={vars}>
        <h2 className="dr-stage-title">메뉴판 노출 순서</h2>
        <p className="dr-stage-hint">위에 있을수록 손님에게 먼저 보입니다.</p>

        <ul ref={reorder.containerRef} className="reorder-list dr-list">
          {menus.map((menu, index) => (
            <li key={menu.id} data-reorder-id={menu.id} className="reorder-item dr-row">
              <button {...reorder.getHandleProps({ label: menu.name })} className="dr-handle">
                ⠿
              </button>
              <span className="dr-rank">{index + 1}</span>
              <span className="dr-name">
                {menu.emoji} {menu.name}
              </span>
              <span className="dr-price">{menu.price.toLocaleString('ko-KR')}원</span>
            </li>
          ))}
        </ul>

        <p role="status" aria-live="polite" className="reorder-announcement">
          {reorder.announcement}
        </p>

        <div className="dr-footer">
          <span>
            현재 순서: <b>{menus.map((menu) => menu.name).join(' → ')}</b>
          </span>
          <button type="button" onClick={() => setMenus(INITIAL)}>
            처음 순서로
          </button>
        </div>
      </div>
    </div>
  )
}
