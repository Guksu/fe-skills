import { useState, type CSSProperties } from 'react'
import { ScrollReveal } from '@skills/scroll-reveal/assets/ScrollReveal'
import '@skills/scroll-reveal/assets/scroll-reveal.css'
import './scroll-reveal-demo.css'

const CARDS = ['첫 번째 섹션', '두 번째 섹션', '세 번째 섹션', '네 번째 섹션']

export const ScrollRevealDemo = () => {
  // key를 바꿔 전체를 리마운트하는 리플레이 장치 — 데모 전용, 스킬 코드와 무관
  const [replayKey, setReplayKey] = useState(0)
  const [durationMs, setDurationMs] = useState(600)
  const [distancePx, setDistancePx] = useState(24)
  const [staggerMs, setStaggerMs] = useState(80)
  const [threshold, setThreshold] = useState(0.15)

  // SKILL.md의 커스터마이즈 포인트(CSS 변수·props)를 그대로 노출한다 — 데모 전용 장치
  const revealVars = {
    '--reveal-duration': `${durationMs}ms`,
    '--reveal-distance': `${distancePx}px`,
  } as CSSProperties

  return (
    <div className="reveal-demo">
      <section className="controls" aria-label="애니메이션 옵션">
        <label>
          <span>
            지속 시간 <code>--reveal-duration</code>
          </span>
          <input
            type="range"
            min={200}
            max={1200}
            step={100}
            value={durationMs}
            onChange={(e) => setDurationMs(Number(e.target.value))}
          />
          <output>{durationMs}ms</output>
        </label>
        <label>
          <span>
            이동 거리 <code>--reveal-distance</code>
          </span>
          <input
            type="range"
            min={0}
            max={80}
            step={8}
            value={distancePx}
            onChange={(e) => setDistancePx(Number(e.target.value))}
          />
          <output>{distancePx}px</output>
        </label>
        <label>
          <span>
            연쇄 간격 <code>delayMs</code>
          </span>
          <input
            type="range"
            min={0}
            max={200}
            step={20}
            value={staggerMs}
            onChange={(e) => setStaggerMs(Number(e.target.value))}
          />
          <output>{staggerMs}ms</output>
        </label>
        <label>
          <span>
            공개 시점 <code>threshold</code>
          </span>
          <input
            type="range"
            min={0}
            max={0.9}
            step={0.05}
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
          />
          <output>{Math.round(threshold * 100)}% 보일 때</output>
        </label>
        <p className="controls-note">
          연쇄 간격은 30~80ms가 권장값입니다. 옵션을 바꾼 뒤 아래 버튼으로 처음부터 다시 보세요.
        </p>
      </section>

      <div key={replayKey} className="reveal-list" style={revealVars}>
        <div className="reveal-toolbar">
          <button type="button" onClick={() => setReplayKey((prev) => prev + 1)}>
            처음부터 다시 보기
          </button>
          <p>아래로 스크롤하세요 — 섹션이 뷰포트에 들어올 때 순차 공개됩니다.</p>
        </div>
        <div className="reveal-spacer">⬇ 스크롤</div>
        {CARDS.map((title, index) => (
          <ScrollReveal key={title} threshold={threshold} delayMs={(index % 2) * staggerMs}>
            <article className="reveal-card">
              <h2>{title}</h2>
              <p>
                IntersectionObserver가 이 카드의 {Math.round(threshold * 100)}%가 보이는 순간을
                감지해 data-revealed를 바꾸고, 나머지는 CSS transition이 처리합니다.
              </p>
            </article>
          </ScrollReveal>
        ))}
        <ScrollReveal once={false} threshold={threshold}>
          <article className="reveal-card reveal-card-repeat">
            <h2>once=false 예시</h2>
            <p>이 카드는 뷰포트를 벗어나면 다시 감춰집니다 — 스크롤을 위아래로 움직여 보세요.</p>
          </article>
        </ScrollReveal>
      </div>
    </div>
  )
}
