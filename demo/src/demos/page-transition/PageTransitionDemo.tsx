import { useEffect, useRef, useState } from 'react'
import { usePageStack } from '@skills/page-transition/assets/usePageStack'
import './page-transition-demo.css'

type Screen = { name: 'list' } | { name: 'detail'; id: string } | { name: 'reviews'; id: string }

type Menu = { id: string; name: string; price: number; emoji: string; desc: string }

const MENUS: Menu[] = [
  { id: 'myeolchi', name: '멸치국수', price: 8000, emoji: '🍜', desc: '남해 멸치로 3시간 우린 맑은 육수' },
  { id: 'bibim', name: '비빔국수', price: 9000, emoji: '🌶️', desc: '직접 담근 고추장 양념에 배를 갈아 넣었습니다' },
  { id: 'deulkkae', name: '들깨칼국수', price: 10000, emoji: '🥣', desc: '거피 들깨를 그날 갈아 씁니다' },
  { id: 'kong', name: '콩국수', price: 11000, emoji: '🥛', desc: '여름 한정 — 국산 백태만 씁니다' },
  { id: 'mandu', name: '손만두', price: 7000, emoji: '🥟', desc: '아침마다 빚는 6개들이' },
]

const REVIEWS = [
  '국물이 깔끔해서 끝까지 다 마셨어요.',
  '면발이 쫄깃하고 양도 넉넉합니다.',
  '점심에 웨이팅 있지만 회전이 빨라요.',
  '혼밥하기 좋은 자리가 많습니다.',
  '들깨 향이 진해서 계속 생각나요.',
]

export const PageTransitionDemo = () => {
  const [durationMs, setDurationMs] = useState(280)
  const [shiftPercent, setShiftPercent] = useState(30)
  const scrollRef = useRef<HTMLDivElement>(null)
  const stack = usePageStack<Screen>({ initial: { name: 'list' }, scrollRef })

  const screen = stack.current
  const menu = 'id' in screen ? MENUS.find((item) => item.id === screen.id) : undefined

  // ::view-transition-* 가상 요소는 문서 루트에 붙는다 — 변수도 루트에 있어야 닿는다
  useEffect(
    function applyTransitionVars() {
      const root = document.documentElement
      root.style.setProperty('--page-transition-duration', `${durationMs}ms`)
      root.style.setProperty('--page-transition-shift', `${shiftPercent}%`)
      return () => {
        root.style.removeProperty('--page-transition-duration')
        root.style.removeProperty('--page-transition-shift')
      }
    },
    [durationMs, shiftPercent],
  )

  const title = screen.name === 'list' ? '성수동 손칼국수' : screen.name === 'detail' ? (menu?.name ?? '') : '리뷰 전체보기'

  return (
    <div className="playground">
      <section className="controls" aria-label="전환 옵션">
        <label>
          <span>
            전환 속도 <code>--page-transition-duration</code>
          </span>
          <input type="range" min={120} max={700} step={20} value={durationMs} onChange={(e) => setDurationMs(Number(e.target.value))} />
          <output>{durationMs}ms</output>
        </label>
        <label>
          <span>
            물러나는 거리 <code>--page-transition-shift</code>
          </span>
          <input type="range" min={0} max={100} step={5} value={shiftPercent} onChange={(e) => setShiftPercent(Number(e.target.value))} />
          <output>{shiftPercent}%</output>
        </label>
        <p className="controls-note">
          메뉴를 눌러 들어갔다가 <b>← 뒤로</b>로 나와 보세요 — 방향이 반대로 재생됩니다. 상단 헤더와 하단 탭바는 전환 영역
          바깥이라 제자리를 지킵니다. 목록을 아래까지 스크롤한 뒤 들어갔다 나오면 보던 위치로 돌아옵니다. 물러나는 거리를
          100%로 올리면 두 화면이 나란히 밀립니다.
        </p>
      </section>

      <div className="pt-stage">
        <div className="pt-phone">
          <header className="pt-header">
            {stack.canGoBack ? (
              <button type="button" className="pt-back" onClick={stack.back}>
                ← 뒤로
              </button>
            ) : (
              <span className="pt-back-placeholder" aria-hidden="true" />
            )}
            <strong className="pt-title">{title}</strong>
            <span className="pt-depth">{stack.depth}단계</span>
          </header>

          <div className="pt-scroll" ref={scrollRef}>
            {/* 전환되는 영역은 여기 하나뿐이다 — data-page-view는 문서에 하나만 있어야 한다 */}
            <main data-page-view className="pt-view">
              {screen.name === 'list' && (
                <ul className="pt-list">
                  {MENUS.map((item) => (
                    <li key={item.id}>
                      <button type="button" className="pt-row" onClick={() => stack.push({ name: 'detail', id: item.id })}>
                        <span className="pt-row-emoji" aria-hidden="true">
                          {item.emoji}
                        </span>
                        <span className="pt-row-body">
                          <span className="pt-row-name">{item.name}</span>
                          <span className="pt-row-desc">{item.desc}</span>
                        </span>
                        <span className="pt-row-price">{item.price.toLocaleString('ko-KR')}원</span>
                      </button>
                    </li>
                  ))}
                  <li className="pt-filler">아래까지 내려온 뒤 메뉴를 눌러 보세요 — 돌아오면 이 위치입니다.</li>
                </ul>
              )}

              {screen.name === 'detail' && menu && (
                <article className="pt-detail">
                  <div className="pt-detail-hero" aria-hidden="true">
                    {menu.emoji}
                  </div>
                  <h3 className="pt-detail-name">{menu.name}</h3>
                  <p className="pt-detail-price">{menu.price.toLocaleString('ko-KR')}원</p>
                  <p className="pt-detail-desc">{menu.desc}</p>
                  <button type="button" className="pt-more" onClick={() => stack.push({ name: 'reviews', id: menu.id })}>
                    리뷰 {REVIEWS.length}개 모두 보기 →
                  </button>
                </article>
              )}

              {screen.name === 'reviews' && (
                <ul className="pt-reviews">
                  {REVIEWS.map((review) => (
                    <li key={review}>{review}</li>
                  ))}
                </ul>
              )}
            </main>
          </div>

          <nav className="pt-tabbar" aria-label="데모 하단 탭 (전환 영역 바깥)">
            <span className="pt-tab pt-tab-active">메뉴</span>
            <span className="pt-tab">주문</span>
            <span className="pt-tab">내정보</span>
          </nav>
        </div>
      </div>
    </div>
  )
}
