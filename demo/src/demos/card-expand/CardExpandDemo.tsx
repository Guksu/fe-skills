import { useEffect, useRef, useState } from 'react'
import { useCardExpand } from '@skills/card-expand/assets/useCardExpand'
import './card-expand-demo.css'

type Pick = { id: string; emoji: string; title: string; subtitle: string; tone: string; price: number; story: string }

const PICKS: Pick[] = [
  {
    id: 'janchi',
    emoji: '🍜',
    title: '잔치국수',
    subtitle: '멸치 육수를 새벽부터 끓였습니다',
    tone: 'warm',
    price: 8000,
    story:
      '남해 멸치와 다시마를 새벽 다섯 시부터 세 시간 우려낸 맑은 육수에 가는 소면을 말았습니다. 애호박·당근·달걀지단을 곱게 채 썰어 올리고, 양념장은 취향대로 풀어 드세요.',
  },
  {
    id: 'bibim',
    emoji: '🌶️',
    title: '비빔국수',
    subtitle: '배를 갈아 넣은 고추장 양념',
    tone: 'hot',
    price: 9000,
    story:
      '직접 담근 고추장에 배와 사과를 갈아 넣어 단맛을 냈습니다. 삶은 면을 찬물에 여러 번 헹궈 쫄깃하게 하고, 오이·상추·삶은 달걀 반쪽을 올립니다. 매운 정도는 주문 시 조절할 수 있습니다.',
  },
  {
    id: 'kal',
    emoji: '🥣',
    title: '손칼국수',
    subtitle: '오늘 아침 반죽한 면',
    tone: 'cool',
    price: 10000,
    story:
      '아침마다 밀가루를 치대 홍두깨로 밀어 썰어 냅니다. 면에서 나온 전분이 국물을 걸쭉하게 만들어 숟가락이 계속 갑니다. 바지락을 넉넉히 넣어 시원한 맛을 더했습니다.',
  },
  {
    id: 'mandu',
    emoji: '🥟',
    title: '손만두 한 접시',
    subtitle: '국수 옆에 6개, 든든하게',
    tone: 'green',
    price: 7000,
    story:
      '돼지고기·두부·부추·당면을 넣어 매일 빚습니다. 찐만두 6개 한 접시. 국수와 함께 주문하면 1,000원을 빼 드립니다.',
  },
]

const supportsViewTransitions = () => typeof document !== 'undefined' && 'startViewTransition' in document

export const CardExpandDemo = () => {
  const [durationMs, setDurationMs] = useState(420)
  const containerRef = useRef<HTMLDivElement>(null)
  const detailRef = useRef<HTMLElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const { expandedId, expand, collapse } = useCardExpand({ containerRef, detailRef })
  const current = PICKS.find((pick) => pick.id === expandedId)

  // ::view-transition-* 가상 요소는 문서 루트에 붙는다 — 변수도 루트에 있어야 닿는다
  useEffect(
    function applyTransitionVars() {
      const root = document.documentElement
      root.style.setProperty('--card-expand-duration', `${durationMs}ms`)
      root.style.setProperty('--card-expand-radius', '18px')
      return () => {
        root.style.removeProperty('--card-expand-duration')
        root.style.removeProperty('--card-expand-radius')
      }
    },
    [durationMs],
  )

  // 상세가 열리면 첫 초점은 닫기 버튼 — 키보드 사용자가 갇히지 않는다
  useEffect(
    function focusCloseOnOpen() {
      if (expandedId !== null) closeRef.current?.focus({ preventScroll: true })
    },
    [expandedId],
  )

  return (
    <div className="playground">
      <section className="controls" aria-label="전환 옵션">
        <label>
          <span>
            자라나는 시간 <code>--card-expand-duration</code>
          </span>
          <input type="range" min={200} max={900} step={20} value={durationMs} onChange={(e) => setDurationMs(Number(e.target.value))} />
          <output>{durationMs}ms</output>
        </label>
        <p className="controls-note">
          카드를 눌러 보세요 — <b>그 카드가 제자리에서 자라나</b> 상세 화면이 되고, × 또는 <kbd>Esc</kbd>로 닫으면 원래 자리로
          줄어듭니다. 그림과 제목은 따로 움직입니다. 목록을 조금 내린 뒤 아래쪽 카드를 열어 보면 돌아가는 자리도 그대로입니다.
          상세는 창 전체가 아니라 <b>폰 프레임 안</b>을 채웁니다.
        </p>
        {!supportsViewTransitions() && (
          <p className="controls-note ce-unsupported" role="note">
            이 브라우저는 View Transitions API를 지원하지 않아 전환 없이 즉시 바뀝니다. 최신 Chrome·Edge·Safari 18에서 확인해 보세요.
          </p>
        )}
      </section>

      <div className="ce-stage">
        <div className="ce-phone">
          <header className="ce-header">
            <span className="ce-eyebrow">9월 17일 수요일</span>
            <strong className="ce-heading">오늘의 추천</strong>
          </header>

          <div ref={containerRef} className="card-expand-container ce-container">
            <ul className="ce-list" inert={expandedId !== null} aria-label="오늘의 추천 메뉴">
              {PICKS.map((pick) => (
                <li key={pick.id}>
                  <button
                    type="button"
                    className="ce-card"
                    data-card-id={pick.id}
                    data-tone={pick.tone}
                    aria-expanded={expandedId === pick.id}
                    onClick={(event) => void expand({ id: pick.id, card: event.currentTarget })}
                  >
                    <span className="ce-card-media" data-card-expand-part="media" aria-hidden="true">
                      {pick.emoji}
                    </span>
                    <span className="ce-card-text">
                      <span className="ce-card-title" data-card-expand-part="title">
                        {pick.title}
                      </span>
                      <span className="ce-card-subtitle">{pick.subtitle}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            {current && (
              <article
                ref={detailRef}
                className="card-expand-detail ce-detail"
                data-tone={current.tone}
                role="dialog"
                aria-modal="true"
                aria-labelledby="ce-detail-title"
              >
                <button ref={closeRef} type="button" className="card-expand-close" aria-label="닫기" onClick={() => void collapse()}>
                  ×
                </button>
                <div className="card-expand-detail-scroll">
                  <div className="ce-detail-media" data-card-expand-part="media" aria-hidden="true">
                    {current.emoji}
                  </div>
                  <div className="ce-detail-content">
                    <h3 id="ce-detail-title" className="ce-detail-title" data-card-expand-part="title">
                      {current.title}
                    </h3>
                    <div className="card-expand-detail-body">
                      <p className="ce-detail-subtitle">{current.subtitle}</p>
                      <p className="ce-detail-story">{current.story}</p>
                      <div className="ce-detail-foot">
                        <span className="ce-detail-price">{current.price.toLocaleString('ko-KR')}원</span>
                        <button type="button" className="ce-order">
                          주문하기
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
