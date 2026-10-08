import { useState, type CSSProperties } from 'react'
import { useDragReorder } from '@skills/drag-to-reorder/assets/useDragReorder'
import { defineCopy, useDemoLang } from '../../demoLang'
import { DishPhoto } from '../../shared/DishPhoto'
import { dishName, type DishId } from '../../shared/dishes'
import './drag-to-reorder-demo.css'

// 언어와 무관한 데이터(id·가격·사진)는 밖에 둔다. 메뉴 이름은 공용 사진 목록(dishName)에서 고른 언어로 읽는다
type Menu = { id: string; price: number; dish: DishId }

const INITIAL: readonly Menu[] = [
  { id: 'myeolchi', price: 8000, dish: 'myeolchi' },
  { id: 'bibim', price: 9000, dish: 'bibim' },
  { id: 'deulkkae', price: 10000, dish: 'deulkkae' },
  { id: 'kong', price: 11000, dish: 'kong' },
  { id: 'mandu', price: 7000, dish: 'mandu' },
]

const COPY = defineCopy({
  ko: {
    price: (n: number) => `${n.toLocaleString('ko-KR')}원`,
    // 화면 낭독 문구 — 한국어는 훅의 기본 문구와 같다
    messages: {
      moved: ({ name, to, total }: { name?: string; to: number; total: number }) => `${name ? `${name} — ` : ''}${total}개 중 ${to}번째로 이동`,
      handle: (label: string) => `${label} 순서 바꾸기 — 위아래 방향키로 이동`,
    },
    controlsLabel: '드래그 옵션',
    settle: '비켜 주기·정착 속도',
    lift: '들어올린 크기',
    scale: (n: number) => `${n.toFixed(2)}배`,
    longPress: '항목 전체를 길게 눌러 끌기',
    note: (
      <>
        손잡이(⠿)를 끌어 순서를 바꿔 보세요. 지나친 항목이 자리를 비켜 주고, 놓으면 빈 자리로 정착한 뒤에야 순서가
        확정됩니다. <b>Tab으로 손잡이에 간 뒤 위아래 방향키</b>로도 옮길 수 있습니다 — 마우스 없이 쓰는 사람에게는
        그 경로가 전부입니다.
      </>
    ),
    stageTitle: '메뉴판 노출 순서',
    stageHint: '위에 있을수록 손님에게 먼저 보입니다.',
    currentOrder: '현재 순서:',
    reset: '처음 순서로',
  },
  en: {
    price: (n: number) => `₩${n.toLocaleString('en-US')}`,
    messages: {
      moved: ({ name, to, total }: { name?: string; to: number; total: number }) => `${name ? `${name}: ` : ''}moved to ${to} of ${total}`,
      handle: (label: string) => `Reorder ${label}. Use the up and down arrow keys`,
    },
    controlsLabel: 'Drag options',
    settle: 'Shift and settle speed',
    lift: 'Lift scale',
    scale: (n: number) => `${n.toFixed(2)}×`,
    longPress: 'Long-press anywhere on a row to drag',
    note: (
      <>
        Drag a handle (⠿) to reorder. Rows you pass move aside, and the order is final only once the row settles into
        the gap. You can also <b>Tab to a handle and use the up and down arrow keys</b>. For people who do not use a
        mouse, that is the only way.
      </>
    ),
    stageTitle: 'Menu display order',
    stageHint: 'Customers see items at the top first.',
    currentOrder: 'Current order:',
    reset: 'Reset',
  },
})

export const DragToReorderDemo = () => {
  const lang = useDemoLang()
  const t = COPY[lang]
  const nameOf = (menu: Menu) => dishName({ id: menu.dish, lang })
  const [menus, setMenus] = useState<readonly Menu[]>(INITIAL)
  const [useLongPress, setUseLongPress] = useState(false)
  const [durationMs, setDurationMs] = useState(200)
  const [liftScale, setLiftScale] = useState(1.02)

  const reorder = useDragReorder<HTMLUListElement>({
    longPressMs: useLongPress ? 250 : 0,
    settleMs: durationMs,
    liftScale,
    describe: (id) => {
      const menu = menus.find((candidate) => candidate.id === id)
      return menu ? nameOf(menu) : ''
    },
    messages: t.messages,
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
      <section className="controls" aria-label={t.controlsLabel}>
        <label>
          <span>
            {t.settle} <code>settleMs</code>
          </span>
          <input type="range" min={80} max={500} step={20} value={durationMs} onChange={(e) => setDurationMs(Number(e.target.value))} />
          <output>{durationMs}ms</output>
        </label>
        <label>
          <span>
            {t.lift} <code>liftScale</code>
          </span>
          <input type="range" min={1} max={1.12} step={0.01} value={liftScale} onChange={(e) => setLiftScale(Number(e.target.value))} />
          <output>{t.scale(liftScale)}</output>
        </label>
        <label className="controls-inline">
          <input type="checkbox" checked={useLongPress} onChange={(e) => setUseLongPress(e.target.checked)} />
          <span>
            {t.longPress} <code>longPressMs=250</code>
          </span>
        </label>
        <p className="controls-note">{t.note}</p>
      </section>

      <div className="dr-stage" style={vars}>
        <h2 className="dr-stage-title">{t.stageTitle}</h2>
        <p className="dr-stage-hint">{t.stageHint}</p>

        <ul ref={reorder.containerRef} className="reorder-list dr-list">
          {menus.map((menu, index) => (
            <li key={menu.id} data-reorder-id={menu.id} className="reorder-item dr-row">
              <button {...reorder.getHandleProps({ label: nameOf(menu) })} className="dr-handle">
                ⠿
              </button>
              <span className="dr-rank">{index + 1}</span>
              <DishPhoto dish={menu.dish} className="dr-thumb" />
              <span className="dr-name">{nameOf(menu)}</span>
              <span className="dr-price">{t.price(menu.price)}</span>
            </li>
          ))}
        </ul>

        <p role="status" aria-live="polite" className="reorder-announcement">
          {reorder.announcement}
        </p>

        <div className="dr-footer">
          <span>
            {t.currentOrder} <b>{menus.map((menu) => nameOf(menu)).join(' → ')}</b>
          </span>
          <button type="button" onClick={() => setMenus(INITIAL)}>
            {t.reset}
          </button>
        </div>
      </div>
    </div>
  )
}
