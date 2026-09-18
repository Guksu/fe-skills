import { useState, type CSSProperties } from 'react'
import { flushSync } from 'react-dom'
import { useEdgeSwipeBack } from '@skills/edge-swipe-back/assets/useEdgeSwipeBack'
import { runPageTransition } from '@skills/page-transition/assets/runPageTransition'
import '@skills/page-transition/assets/page-transition.css'
import './edge-swipe-back-demo.css'

type Screen = { name: 'list' } | { name: 'detail'; id: string } | { name: 'reviews'; id: string }

type Menu = { id: string; name: string; price: number; emoji: string; desc: string }

const MENUS: Menu[] = [
  { id: 'janchi', name: '잔치국수', price: 8000, emoji: '🍜', desc: '멸치·다시마 육수에 애호박 고명' },
  { id: 'bibim', name: '비빔국수', price: 9000, emoji: '🌶️', desc: '직접 담근 고추장 양념, 배를 갈아 넣었습니다' },
  { id: 'kal', name: '손칼국수', price: 10000, emoji: '🥣', desc: '아침에 밀어 굵기가 조금씩 다릅니다' },
  { id: 'kong', name: '콩국수', price: 11000, emoji: '🥛', desc: '여름 한정 — 국산 백태만 씁니다' },
  { id: 'mandu', name: '손만두', price: 7000, emoji: '🥟', desc: '아침마다 빚는 6개들이' },
]

const REVIEWS = [
  '국물이 깔끔해서 끝까지 다 마셨어요.',
  '면발이 쫄깃하고 양도 넉넉합니다.',
  '점심에 웨이팅 있지만 회전이 빨라요.',
  '혼밥하기 좋은 자리가 많습니다.',
  '성수동에서 국수 생각나면 여기부터 갑니다.',
]

const titleOf = (screen: Screen) => {
  if (screen.name === 'list') return '성수동 국수집'
  const menu = MENUS.find((item) => item.id === screen.id)
  return screen.name === 'detail' ? (menu?.name ?? '') : `${menu?.name ?? ''} 리뷰`
}

export const EdgeSwipeBackDemo = () => {
  const [stack, setStack] = useState<Screen[]>([{ name: 'list' }])
  const [threshold, setThreshold] = useState(0.4)
  const [edgeWidth, setEdgeWidth] = useState(24)
  const [shiftPercent, setShiftPercent] = useState(30)
  const [log, setLog] = useState('상세로 들어간 뒤 왼쪽 가장자리를 오른쪽으로 끌어 보세요. 마우스로도 됩니다.')

  const current = stack[stack.length - 1]
  const previous = stack.length > 1 ? stack[stack.length - 2] : null

  /** 들어갈 때는 page-transition 코어로 오른쪽에서 덮으며 들어온다 */
  const push = (screen: Screen) => {
    void runPageTransition({ direction: 'forward', update: () => flushSync(() => setStack((prev) => [...prev, screen])) })
  }

  /** 제스처 커밋: 화면은 이미 오른쪽 끝에 밀려 있으므로 전환 없이 즉시 pop한다 — 훅이 flushSync로 감싼다 */
  const popNow = () => {
    setStack((prev) => prev.slice(0, -1))
    setLog('제스처로 돌아왔습니다 — 스프링이 끝난 뒤 즉시 pop.')
  }

  /** 버튼으로 돌아갈 때는 손가락이 움직인 적이 없으니 page-transition의 뒤로 전환을 재생한다 */
  const popWithTransition = () => {
    void runPageTransition({ direction: 'back', update: () => flushSync(() => setStack((prev) => prev.slice(0, -1))) })
    setLog('버튼으로 돌아왔습니다 — View Transition 재생.')
  }

  const { containerRef, screenRef, underlayRef, dimRef } = useEdgeSwipeBack({
    canGoBack: stack.length > 1,
    onBack: popNow,
    threshold,
    edgeWidth,
  })

  const render = (screen: Screen) => {
    const menu = 'id' in screen ? MENUS.find((item) => item.id === screen.id) : undefined
    if (screen.name === 'list') {
      return (
        <ul className="esb-list">
          {MENUS.map((item) => (
            <li key={item.id}>
              <button type="button" className="esb-row" onClick={() => push({ name: 'detail', id: item.id })}>
                <span className="esb-row-emoji" aria-hidden="true">
                  {item.emoji}
                </span>
                <span className="esb-row-body">
                  <span className="esb-row-name">{item.name}</span>
                  <span className="esb-row-desc">{item.desc}</span>
                </span>
                <span className="esb-row-price">{item.price.toLocaleString('ko-KR')}원</span>
              </button>
            </li>
          ))}
        </ul>
      )
    }
    if (screen.name === 'detail' && menu) {
      return (
        <article className="esb-detail">
          <div className="esb-detail-hero" aria-hidden="true">
            {menu.emoji}
          </div>
          <h3 className="esb-detail-name">{menu.name}</h3>
          <p className="esb-detail-price">{menu.price.toLocaleString('ko-KR')}원</p>
          <p className="esb-detail-desc">{menu.desc}</p>
          <button type="button" className="esb-more" onClick={() => push({ name: 'reviews', id: menu.id })}>
            리뷰 {REVIEWS.length}개 모두 보기 →
          </button>
          <p className="esb-hint">← 왼쪽 가장자리를 오른쪽으로 끌면 목록이 따라 나옵니다</p>
        </article>
      )
    }
    return (
      <ul className="esb-reviews">
        {REVIEWS.map((review) => (
          <li key={review}>{review}</li>
        ))}
      </ul>
    )
  }

  return (
    <div className="playground">
      <section className="controls" aria-label="제스처 옵션">
        <label>
          <span>
            커밋 임계 <code>threshold</code>
          </span>
          <input type="range" min={0.2} max={0.8} step={0.05} value={threshold} onChange={(e) => setThreshold(Number(e.target.value))} />
          <output>{Math.round(threshold * 100)}%</output>
        </label>
        <label>
          <span>
            가장자리 폭 <code>edgeWidth</code>
          </span>
          <input type="range" min={12} max={64} step={4} value={edgeWidth} onChange={(e) => setEdgeWidth(Number(e.target.value))} />
          <output>{edgeWidth}px</output>
        </label>
        <label>
          <span>
            물러남 거리 <code>--edge-shift</code>
          </span>
          <input type="range" min={0} max={100} step={5} value={shiftPercent} onChange={(e) => setShiftPercent(Number(e.target.value))} />
          <output>{shiftPercent}%</output>
        </label>
        <p className="controls-note">
          메뉴를 눌러 상세로 들어간 뒤, 폰 화면의 <b>왼쪽 가장자리</b>를 오른쪽으로 끌어 보세요. 현재 화면이 손가락을 따라
          밀리고 아래 목록이 따라 나오며 어둠이 걷힙니다. 폭의 {Math.round(threshold * 100)}%를 넘기거나 빠르게 튕기면 돌아가고,
          그 전에 놓거나 왼쪽으로 되튕기면 제자리로 스프링 복귀합니다. 상단 <b>← 뒤로</b> 버튼은 제스처를 쓸 수 없을 때의
          대안입니다(이쪽은 page-transition 전환을 재생).
        </p>
      </section>

      <div className="esb-stage">
        <div className="esb-phone">
          <header className="esb-header">
            {stack.length > 1 ? (
              <button type="button" className="esb-back" onClick={popWithTransition}>
                ← 뒤로
              </button>
            ) : (
              <span className="esb-back-placeholder" aria-hidden="true" />
            )}
            <strong className="esb-title">{titleOf(current)}</strong>
            <span className="esb-depth">{stack.length}단계</span>
          </header>

          {/* 네 요소는 한 번 마운트되면 그대로 두고 안의 내용만 바꾼다 — 코어가 요소를 붙잡고 있다 */}
          <div ref={containerRef} data-page-view className="edge-swipe esb-view" style={{ '--edge-shift': `${shiftPercent}%` } as CSSProperties}>
            <div ref={underlayRef} className="edge-swipe-underlay esb-screen" aria-hidden="true">
              {previous && render(previous)}
            </div>
            <div ref={dimRef} className="edge-swipe-dim" aria-hidden="true" />
            <div ref={screenRef} className="edge-swipe-screen esb-screen">
              {render(current)}
            </div>
          </div>
        </div>
        <p className="esb-log" aria-live="polite">
          {log}
        </p>
      </div>
    </div>
  )
}
