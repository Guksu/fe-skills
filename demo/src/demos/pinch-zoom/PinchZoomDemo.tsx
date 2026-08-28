import { useRef, useState, type CSSProperties } from 'react'
import { PinchZoom } from '@skills/pinch-zoom/assets/PinchZoom'
import './pinch-zoom-demo.css'

const POSTS = [
  { id: 'deulkkae', author: '국수공방', caption: '들깨칼국수 — 오늘 들깨 갓 볶았습니다', tone: 'linear-gradient(135deg, #f6d365, #fda085)', emoji: '🍜' },
  { id: 'bibim', author: '국수공방', caption: '비빔국수, 여름 한정 매운맛', tone: 'linear-gradient(135deg, #f093fb, #f5576c)', emoji: '🌶️' },
  { id: 'mandu', author: '국수공방', caption: '손만두 빚는 아침', tone: 'linear-gradient(135deg, #a1c4fd, #c2e9fb)', emoji: '🥟' },
]

type T = { clientX: number; clientY: number }

/** 데스크톱 확인용 — 실제 터치 대신 touches만 얹은 이벤트를 코어에 흘린다 (스킬 assets는 건드리지 않는다) */
const dispatchTouch = ({ el, type, touches }: { el: HTMLElement; type: string; touches: T[] }) => {
  const event = new Event(type, { bubbles: true, cancelable: true })
  Object.defineProperty(event, 'touches', { value: touches.map((t, i) => ({ identifier: i, ...t })) })
  el.dispatchEvent(event)
}

export const PinchZoomDemo = () => {
  const [maxScale, setMaxScale] = useState(4)
  const [dim, setDim] = useState(0.8)
  const [status, setStatus] = useState('두 손가락으로 사진을 벌려 보세요.')
  const feedRef = useRef<HTMLDivElement>(null)
  const playingRef = useRef(false)

  const vars = { '--pinch-dim': String(dim) } as CSSProperties

  /** 첫 사진 위에서 손가락 두 개가 벌어졌다 → 오른쪽 아래로 옮겼다 → 놓는 시나리오를 1.6초에 걸쳐 재생 */
  const replay = () => {
    const el = feedRef.current?.querySelector<HTMLElement>('.pinch')
    if (!el || playingRef.current) return
    playingRef.current = true
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const frame = (t: number): T[] => {
      // t: 0~1. 0~0.5 벌리기(거리 80→260), 0.5~1 이동(중점 +60,+40)
      const spread = 80 + Math.min(1, t / 0.5) * 180
      const shift = Math.max(0, (t - 0.5) / 0.5)
      const mx = cx + shift * 60
      const my = cy + shift * 40
      return [{ clientX: mx - spread / 2, clientY: my }, { clientX: mx + spread / 2, clientY: my }]
    }
    dispatchTouch({ el, type: 'touchstart', touches: frame(0) })
    const startedAt = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - startedAt) / 1600)
      dispatchTouch({ el, type: 'touchmove', touches: frame(t) })
      if (t < 1) {
        requestAnimationFrame(tick)
        return
      }
      window.setTimeout(() => {
        dispatchTouch({ el, type: 'touchend', touches: [] })
        playingRef.current = false
      }, 300)
    }
    requestAnimationFrame(tick)
  }

  return (
    <div className="playground">
      <section className="controls" aria-label="제스처 옵션">
        <label>
          <span>
            최대 배율 <code>maxScale</code>
          </span>
          <input type="range" min={2} max={6} step={0.5} value={maxScale} onChange={(e) => setMaxScale(Number(e.target.value))} />
          <output>{maxScale}×</output>
        </label>
        <label>
          <span>
            배경 딤 <code>--pinch-dim</code>
          </span>
          <input type="range" min={0} max={1} step={0.1} value={dim} onChange={(e) => setDim(Number(e.target.value))} />
          <output>{dim}</output>
        </label>
        <p className="controls-note">
          모바일에서 사진을 두 손가락으로 벌리면 그 자리에서 커지고, 손가락을 옮기면 따라오며, 놓으면 제자리로 돌아옵니다.
          데스크톱이면 아래 버튼으로 같은 제스처를 재생해 보세요.
        </p>
        <button type="button" onClick={replay}>
          핀치 제스처 재생
        </button>
      </section>

      <div ref={feedRef} className="pinch-feed" style={vars}>
        {POSTS.map((post) => (
          <article key={post.id} className="pinch-post">
            <header className="pinch-post-header">
              <span className="pinch-post-avatar" aria-hidden="true" />
              <strong>{post.author}</strong>
            </header>
            <PinchZoom
              maxScale={maxScale}
              onChange={({ scale, active }) =>
                setStatus(active ? `확대 중 — ${scale.toFixed(2)}×` : '제자리로 돌아왔습니다.')
              }
            >
              <div className="pinch-photo" style={{ background: post.tone }} role="img" aria-label={post.caption}>
                <span aria-hidden="true">{post.emoji}</span>
              </div>
            </PinchZoom>
            <p className="pinch-post-caption">{post.caption}</p>
          </article>
        ))}
      </div>
      <p className="pinch-status" aria-live="polite">
        {status}
      </p>
    </div>
  )
}
