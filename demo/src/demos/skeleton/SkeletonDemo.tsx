import { useEffect, useState, type CSSProperties } from 'react'
import { Skeleton } from '@skills/skeleton/assets/Skeleton'
import { Icon } from '@skills/layout-principles/assets/Icon'
import { defineCopy, useDemoLang } from '../../demoLang'
import './skeleton-demo.css'

// 언어와 무관한 데이터(id)는 밖에, 화면에 보이거나 읽히는 문구는 COPY 두 벌에 둔다
const PROFILES = [{ id: 'kim' }, { id: 'park' }, { id: 'lee' }] as const

const COPY = defineCopy({
  ko: {
    controlsLabel: '애니메이션 옵션',
    speed: '시머 속도',
    replay: '로딩 다시 보기 (2.5초 뒤 콘텐츠로 교체)',
    reload: '다시 로딩',
    note: '스켈레톤은 실제 콘텐츠와 같은 자리·크기여야 교체 순간 레이아웃이 밀리지 않습니다 — 아래 카드로 확인하세요.',
    profiles: {
      kim: { name: '김국수', bio: '오늘도 성수동에서 국수 한 그릇. 면은 언제나 옳다.' },
      park: { name: '박칼국', bio: '칼국수와 만두는 세트다. 반죽은 새벽에 치대야 맛있다.' },
      lee: { name: '이냉면', bio: '한겨울에도 냉면파. 육수는 슬러시 직전이 정답이다.' },
    },
  },
  en: {
    controlsLabel: 'Animation options',
    speed: 'Shimmer speed',
    replay: 'Replay loading (content swaps in after 2.5s)',
    reload: 'Reload',
    note: 'A skeleton needs the same position and size as the real content, so the layout does not jump when the content swaps in. Check it with the cards below.',
    profiles: {
      kim: { name: 'Noodle Kim', bio: 'Another bowl of noodles in Seongsu-dong today. Noodles are always the answer.' },
      park: { name: 'Knife-cut Park', bio: 'Knife-cut noodles and dumplings come as a set. Dough tastes best kneaded at dawn.' },
      lee: { name: 'Cold Noodle Lee', bio: 'Team cold noodles, even in midwinter. The broth should be just short of slush.' },
    },
  },
})

export const SkeletonDemo = () => {
  const t = COPY[useDemoLang()]
  const [speedMs, setSpeedMs] = useState(1400)
  const [loaded, setLoaded] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(
    function finishLoadingAfterDelay() {
      setLoaded(false)
      const timer = setTimeout(() => setLoaded(true), 2500)
      return () => clearTimeout(timer)
    },
    [reloadKey],
  )

  const vars = { '--skeleton-speed': `${speedMs}ms` } as CSSProperties

  return (
    <div className="playground">
      <section className="controls" aria-label={t.controlsLabel}>
        <label>
          <span>
            {t.speed} <code>--skeleton-speed</code>
          </span>
          <input
            type="range"
            min={600}
            max={3000}
            step={200}
            value={speedMs}
            onChange={(e) => setSpeedMs(Number(e.target.value))}
          />
          <output>{(speedMs / 1000).toFixed(1)}s</output>
        </label>
        <label>
          <span>{t.replay}</span>
          <button type="button" onClick={() => setReloadKey((prev) => prev + 1)}>
            {t.reload}
          </button>
        </label>
        <p className="controls-note">{t.note}</p>
      </section>

      <div className="skeleton-grid" style={vars}>
        {PROFILES.map((profile) =>
          loaded ? (
            <article key={profile.id} className="profile-card">
              {/* 사람 프로필 사진 자리 — 사진이 없을 때는 무채색 원에 사람 아이콘. 사람마다 색·이모지로 구분하지 않는다(이름이 구분한다) */}
              <div className="profile-avatar">
                <Icon name="user" />
              </div>
              <div className="profile-body">
                <strong>{t.profiles[profile.id].name}</strong>
                <p>{t.profiles[profile.id].bio}</p>
              </div>
            </article>
          ) : (
            <article key={profile.id} className="profile-card" aria-busy="true">
              <Skeleton variant="circle" width={48} height={48} />
              <div className="profile-body">
                <Skeleton variant="text" width="40%" />
                <Skeleton variant="text" lines={2} />
              </div>
            </article>
          ),
        )}
      </div>
    </div>
  )
}
