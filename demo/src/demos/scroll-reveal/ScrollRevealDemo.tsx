import { useState } from 'react'
import { ScrollReveal } from '@skills/scroll-reveal/assets/ScrollReveal'
import '@skills/scroll-reveal/assets/scroll-reveal.css'
import './scroll-reveal-demo.css'

const CARDS = ['첫 번째 섹션', '두 번째 섹션', '세 번째 섹션', '네 번째 섹션']

export const ScrollRevealDemo = () => {
  // key를 바꿔 전체를 리마운트하는 리플레이 장치 — 데모 전용, 스킬 코드와 무관
  const [replayKey, setReplayKey] = useState(0)

  return (
    <div key={replayKey} className="reveal-demo">
      <div className="reveal-toolbar">
        <button type="button" onClick={() => setReplayKey((prev) => prev + 1)}>
          처음부터 다시 보기
        </button>
        <p>아래로 스크롤하세요 — 섹션이 뷰포트에 들어올 때 순차 공개됩니다.</p>
      </div>
      <div className="reveal-spacer">⬇ 스크롤</div>
      {CARDS.map((title, index) => (
        <ScrollReveal key={title} delayMs={(index % 2) * 80}>
          <article className="reveal-card">
            <h2>{title}</h2>
            <p>
              IntersectionObserver가 이 카드의 15%가 보이는 순간을 감지해 data-revealed를 바꾸고,
              나머지는 CSS transition이 처리합니다.
            </p>
          </article>
        </ScrollReveal>
      ))}
      <ScrollReveal once={false}>
        <article className="reveal-card reveal-card-repeat">
          <h2>once=false 예시</h2>
          <p>이 카드는 뷰포트를 벗어나면 다시 감춰집니다 — 스크롤을 위아래로 움직여 보세요.</p>
        </article>
      </ScrollReveal>
    </div>
  )
}
