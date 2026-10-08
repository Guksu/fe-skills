import { useState, type CSSProperties } from 'react'
import { LikeButton } from '@skills/like-pop/assets/LikeButton'
import { DoubleTapArea } from '@skills/like-pop/assets/DoubleTapArea'
import { Icon } from '@skills/layout-principles/assets/Icon'
import { defineCopy, useDemoLang } from '../../demoLang'
import { DishPhoto } from '../../shared/DishPhoto'
import { dishName } from '../../shared/dishes'
import './like-pop-demo.css'

const COPY = defineCopy({
  ko: {
    controlsLabel: '애니메이션 옵션',
    threshold: '더블탭 판정 시간',
    burst: '버스트 하트 크기',
    note: '사진을 빠르게 두 번 클릭(더블탭)하면 탭 지점에 하트가 터집니다 — 더블탭은 항상 좋아요 설정이고, 취소는 버튼으로만 됩니다.',
    // 사진의 대체 글 — 메뉴 이름은 공용 사진 목록에서 고른 언어로 받는다
    photoAlt: (dish: string) => `${dish} 한 그릇 — 성수동 국수 맛집`,
    caption: '오늘의 한 그릇 — 두 번 클릭해 보세요',
    likeLabels: { like: '좋아요', unlike: '좋아요 취소' },
  },
  en: {
    controlsLabel: 'Animation options',
    threshold: 'Double-tap window',
    burst: 'Burst heart size',
    note: 'Click the photo twice quickly (a double-tap) and a heart bursts where you tapped. A double-tap always likes the post. Only the button can undo it.',
    photoAlt: (dish: string) => `${dish} from the best noodle spot in Seongsu-dong`,
    caption: "Today's bowl. Try a double click",
    likeLabels: { like: 'Like', unlike: 'Unlike' },
  },
})

export const LikePopDemo = () => {
  const lang = useDemoLang()
  const t = COPY[lang]
  const [liked, setLiked] = useState(false)
  const [thresholdMs, setThresholdMs] = useState(300)
  const [burstSize, setBurstSize] = useState(96)

  const count = 128 + (liked ? 1 : 0)
  const vars = { '--burst-size': `${burstSize}px` } as CSSProperties

  return (
    <div className="playground">
      <section className="controls" aria-label={t.controlsLabel}>
        <label>
          <span>
            {t.threshold} <code>thresholdMs</code>
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
            {t.burst} <code>--burst-size</code>
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
        <p className="controls-note">{t.note}</p>
      </section>

      <article className="post-card" style={vars}>
        <header className="post-header">
          {/* 가게 계정의 프로필 — 로고(국수 그릇)를 무채색 원에 */}
          <span className="post-avatar">
            <Icon name="bowl" />
          </span>
          <strong>guksu_official</strong>
        </header>
        <DoubleTapArea onDoubleTap={() => setLiked(true)} thresholdMs={thresholdMs}>
          <div className="post-image">
            <DishPhoto dish="janchi" alt={t.photoAlt(dishName({ id: 'janchi', lang }))} />
          </div>
        </DoubleTapArea>
        <footer className="post-footer">
          <LikeButton liked={liked} onChange={setLiked} count={count} labels={t.likeLabels} />
          <span className="post-caption">{t.caption}</span>
        </footer>
      </article>
    </div>
  )
}
