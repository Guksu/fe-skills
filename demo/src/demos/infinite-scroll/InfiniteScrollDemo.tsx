import { useRef, useState, type CSSProperties } from 'react'
import { useInfiniteScroll } from '@skills/infinite-scroll/assets/useInfiniteScroll'
import '@skills/infinite-scroll/assets/infinite-scroll.css'
import './infinite-scroll-demo.css'

type Review = { id: string; name: string; stars: number; text: string; page: number }

const NAMES = ['국수러버', '성수동주민', '면치기왕', '점심마다', '들깨파', '비빔러', '칼국수요정', '단골손님']
const TEXTS = [
  '멸치 육수가 진해서 국물까지 다 마셨어요.',
  '면발이 쫄깃하고 양이 넉넉합니다.',
  '점심에 웨이팅 있는데 회전이 빨라요.',
  '들깨칼국수는 꼭 곱빼기로 드세요.',
  '만두 피가 얇아서 자꾸 손이 갑니다.',
  '혼밥하기 편한 자리가 많아요.',
]

const TOTAL_PAGES = 5
const PAGE_SIZE = 6

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const makePage = (page: number): Review[] =>
  Array.from({ length: PAGE_SIZE }, (_, i) => {
    const index = page * PAGE_SIZE + i
    return {
      id: `review-${index}`,
      name: `${NAMES[index % NAMES.length]}${index}`,
      stars: 3 + (index % 3),
      text: TEXTS[index % TEXTS.length],
      page,
    }
  })

export const InfiniteScrollDemo = () => {
  const [reviews, setReviews] = useState<Review[]>(() => makePage(0))
  const [nextPage, setNextPage] = useState(1)
  const [latencyMs, setLatencyMs] = useState(600)
  const [rootMarginPx, setRootMarginPx] = useState(200)
  const [willFail, setWillFail] = useState(false)
  const [requests, setRequests] = useState(0)
  const boxRef = useRef<HTMLDivElement>(null)

  const feed = useInfiniteScroll({
    hasMore: nextPage < TOTAL_PAGES,
    rootMarginPx,
    rootRef: boxRef,
    loadMore: async () => {
      setRequests((prev) => prev + 1)
      await delay(latencyMs)
      if (willFail) throw new Error('네트워크 오류')
      setReviews((prev) => [...prev, ...makePage(nextPage)])
      setNextPage((prev) => prev + 1)
    },
  })

  const reset = () => {
    setReviews(makePage(0))
    setNextPage(1)
    setRequests(0)
    boxRef.current?.scrollTo({ top: 0 })
  }

  const vars = { '--infinite-scroll-dim': 'var(--text-dim)' } as CSSProperties

  return (
    <div className="playground">
      <section className="controls" aria-label="로딩 옵션">
        <label>
          <span>
            미리 부르는 거리 <code>rootMarginPx</code>
          </span>
          <input type="range" min={0} max={600} step={50} value={rootMarginPx} onChange={(e) => setRootMarginPx(Number(e.target.value))} />
          <output>{rootMarginPx}px</output>
        </label>
        <label>
          <span>
            서버 응답 지연 <code>latency</code>
          </span>
          <input type="range" min={0} max={2000} step={100} value={latencyMs} onChange={(e) => setLatencyMs(Number(e.target.value))} />
          <output>{latencyMs}ms</output>
        </label>
        <label className="controls-inline">
          <input type="checkbox" checked={willFail} onChange={(e) => setWillFail(e.target.checked)} />
          <span>서버가 실패로 응답</span>
        </label>
        <p className="controls-note">
          상자 안을 스크롤해 보세요. 미리 부르는 거리를 0으로 두면 바닥에 닿아야 로딩이 보이고, 400px로 올리면 로딩을
          거의 못 본 채 이어집니다. 실패로 바꾸면 멈춰 서서 <b>다시 시도</b>를 기다립니다 — 자동으로 재시도해 서버를
          때리지 않습니다.
        </p>
      </section>

      <div className="is-stage" style={vars}>
        <div className="is-stage-head">
          <h2 className="is-stage-title">손님 리뷰</h2>
          <span className="is-stage-count">
            {reviews.length}개 · 요청 {requests}회
          </span>
        </div>

        <div className="is-box" ref={boxRef}>
          <ul className="is-list">
            {reviews.map((review, index) => (
              <li
                key={review.id}
                className={review.page > 0 ? 'is-review infinite-item-new' : 'is-review'}
                style={{ '--infinite-item-order': index % PAGE_SIZE } as CSSProperties}
              >
                <div className="is-review-head">
                  <strong>{review.name}</strong>
                  <span className="is-stars" aria-label={`별점 ${review.stars}점`}>
                    {'★'.repeat(review.stars)}
                    <span className="is-stars-off">{'★'.repeat(5 - review.stars)}</span>
                  </span>
                </div>
                <p className="is-review-text">{review.text}</p>
              </li>
            ))}
          </ul>

          <div ref={feed.sentinelRef} className="infinite-sentinel" aria-hidden="true" />

          <div className="infinite-footer" role="status" aria-live="polite">
            {feed.status === 'loading' && (
              <>
                <span className="infinite-spinner" aria-hidden="true" />
                리뷰를 불러오는 중…
              </>
            )}
            {feed.status === 'error' && (
              <>
                <span>리뷰를 불러오지 못했습니다</span>
                <button type="button" onClick={feed.retry}>
                  다시 시도
                </button>
              </>
            )}
            {feed.status === 'done' && <span>마지막 리뷰입니다</span>}
            {feed.status === 'idle' && (
              <button type="button" onClick={feed.loadNow}>
                더 보기
              </button>
            )}
          </div>
        </div>

        <button type="button" className="is-reset" onClick={reset}>
          처음부터 다시
        </button>
      </div>
    </div>
  )
}
