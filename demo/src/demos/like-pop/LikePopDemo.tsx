import { useState, type CSSProperties } from 'react'
import { LikeButton } from '@skills/like-pop/assets/LikeButton'
import { DoubleTapArea } from '@skills/like-pop/assets/DoubleTapArea'
import './like-pop-demo.css'

export const LikePopDemo = () => {
  const [liked, setLiked] = useState(false)
  const [thresholdMs, setThresholdMs] = useState(300)
  const [burstSize, setBurstSize] = useState(96)

  const count = 128 + (liked ? 1 : 0)
  const vars = { '--burst-size': `${burstSize}px` } as CSSProperties

  return (
    <div className="playground">
      <section className="controls" aria-label="애니메이션 옵션">
        <label>
          <span>
            더블탭 판정 시간 <code>thresholdMs</code>
          </span>
          <input
            type="range"
            min={150}
            max={600}
            step={50}
            value={thresholdMs}
            onChange={(e) => setThresholdMs(Number(e.target.value))}
          />
          <output>{thresholdMs}ms</output>
        </label>
        <label>
          <span>
            버스트 하트 크기 <code>--burst-size</code>
          </span>
          <input
            type="range"
            min={48}
            max={200}
            step={8}
            value={burstSize}
            onChange={(e) => setBurstSize(Number(e.target.value))}
          />
          <output>{burstSize}px</output>
        </label>
        <p className="controls-note">
          사진을 빠르게 두 번 클릭(더블탭)하면 탭 지점에 하트가 터집니다 — 더블탭은 항상 좋아요
          설정이고, 취소는 버튼으로만 됩니다(인스타그램 관례).
        </p>
      </section>

      <article className="post-card" style={vars}>
        <header className="post-header">
          <span className="post-avatar">🍜</span>
          <strong>guksu_official</strong>
        </header>
        <DoubleTapArea onDoubleTap={() => setLiked(true)} thresholdMs={thresholdMs}>
          <div className="post-image">
            <span>🍜</span>
            <p>성수동 국수 맛집</p>
          </div>
        </DoubleTapArea>
        <footer className="post-footer">
          <LikeButton liked={liked} onChange={setLiked} count={count} />
          <span className="post-caption">오늘의 한 그릇 — 두 번 클릭해 보세요</span>
        </footer>
      </article>
    </div>
  )
}
