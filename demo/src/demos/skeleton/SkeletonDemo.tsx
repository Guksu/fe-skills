import { useEffect, useState, type CSSProperties } from 'react'
import { Skeleton } from '@skills/skeleton/assets/Skeleton'
import './skeleton-demo.css'

export const SkeletonDemo = () => {
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
      <section className="controls" aria-label="애니메이션 옵션">
        <label>
          <span>
            시머 속도 <code>--skeleton-speed</code>
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
          <span>로딩 다시 보기 (2.5초 뒤 콘텐츠로 교체)</span>
          <button type="button" onClick={() => setReloadKey((prev) => prev + 1)}>
            다시 로딩
          </button>
        </label>
        <p className="controls-note">
          스켈레톤은 실제 콘텐츠와 같은 자리·크기여야 교체 순간 레이아웃이 밀리지 않습니다 — 아래
          카드로 확인하세요.
        </p>
      </section>

      <div className="skeleton-grid" style={vars}>
        {PROFILES.map((profile) =>
          loaded ? (
            <article key={profile.name} className="profile-card">
              <div className="profile-avatar">{profile.emoji}</div>
              <div className="profile-body">
                <strong>{profile.name}</strong>
                <p>{profile.bio}</p>
              </div>
            </article>
          ) : (
            <article key={profile.name} className="profile-card" aria-busy="true">
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

const PROFILES = [
  { name: '김국수', emoji: '🍜', bio: '오늘도 성수동에서 국수 한 그릇. 면은 언제나 옳다.' },
  { name: '박칼국', emoji: '🥟', bio: '칼국수와 만두는 세트다. 반죽은 새벽에 치대야 맛있다.' },
  { name: '이냉면', emoji: '🧊', bio: '한겨울에도 냉면파. 육수는 슬러시 직전이 정답이다.' },
]
