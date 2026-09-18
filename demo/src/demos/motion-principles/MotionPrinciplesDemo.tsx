import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { DURATION, EASE, cubicBezier, exitDuration, staggerDelay, type MotionSize } from '@skills/motion-principles/assets/motionTokens'
import '@skills/motion-principles/assets/motion-tokens.css'
import './motion-principles-demo.css'

type EaseKey = keyof typeof EASE

const EASE_LABEL: Record<EaseKey, string> = {
  out: 'ease-out — 들어오고 정착',
  inOut: 'in-out — 자리 옮김',
  drawer: 'drawer — 끝에서 길게 감속',
  overshoot: 'overshoot — 넘쳤다 돌아옴',
  linear: 'linear — 시간 비례',
}

const SIZES: MotionSize[] = ['instant', 'fast', 'base', 'slow', 'page']

const MENU = ['잔치국수', '비빔국수', '칼국수', '손만두', '냉면', '콩국수', '들깨칼국수', '만두국']

/** 이징 곡선을 SVG path로 — x는 시간, y는 진행도(위가 1) */
const curvePath = (easing: string) => {
  const f = cubicBezier(easing)
  const points: string[] = []
  for (let i = 0; i <= 60; i += 1) {
    const t = i / 60
    points.push(`${(t * 100).toFixed(1)},${(100 - f(t) * 100).toFixed(1)}`)
  }
  return `M${points.join(' L')}`
}

export const MotionPrinciplesDemo = () => {
  const [leftEase, setLeftEase] = useState<EaseKey>('out')
  const [rightEase, setRightEase] = useState<EaseKey>('inOut')
  const [size, setSize] = useState<MotionSize>('base')
  const [runKey, setRunKey] = useState(0)
  const [staggerOn, setStaggerOn] = useState(true)
  const [listKey, setListKey] = useState(0)
  const [moved, setMoved] = useState(false)
  const firstRun = useRef(true)

  useEffect(
    function replayMoveAfterRun() {
      if (firstRun.current) {
        firstRun.current = false
        return
      }
      setMoved(false)
      const timer = setTimeout(() => setMoved(true), 30)
      return () => clearTimeout(timer)
    },
    [runKey],
  )

  const ms = DURATION[size]
  const vars = { '--demo-duration': `${ms}ms`, '--demo-exit': `${exitDuration(ms)}ms` } as CSSProperties

  return (
    <div className="playground">
      <section className="controls" aria-label="모션 토큰 옵션">
        <label>
          <span>
            왼쪽 이징 <code>--motion-ease-*</code>
          </span>
          <select value={leftEase} onChange={(e) => setLeftEase(e.target.value as EaseKey)}>
            {(Object.keys(EASE) as EaseKey[]).map((key) => (
              <option key={key} value={key}>
                {EASE_LABEL[key]}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>오른쪽 이징 (비교용)</span>
          <select value={rightEase} onChange={(e) => setRightEase(e.target.value as EaseKey)}>
            {(Object.keys(EASE) as EaseKey[]).map((key) => (
              <option key={key} value={key}>
                {EASE_LABEL[key]}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>
            시간 단계 <code>--motion-duration-*</code>
          </span>
          <select value={size} onChange={(e) => setSize(e.target.value as MotionSize)}>
            {SIZES.map((key) => (
              <option key={key} value={key}>
                {key} — {DURATION[key]}ms (퇴장 {exitDuration(DURATION[key])}ms)
              </option>
            ))}
          </select>
        </label>
        <label className="controls-inline">
          <input type="checkbox" checked={staggerOn} onChange={(e) => setStaggerOn(e.target.checked)} />
          <span>
            목록 스태거 <code>--motion-stagger</code> 30ms, 10개까지
          </span>
        </label>
        <p className="controls-note">
          같은 시간에 이징만 다르게 두 카드를 나란히 움직여 보세요. 시간 단계는 "무엇이 움직이는가"로 고릅니다 — 작은 것은 짧게,
          화면 크기의 것은 길게, 퇴장은 진입의 3/4. 아래 목록은 30ms 간격으로 차례로 나타납니다.
        </p>
      </section>

      <div className="mp-stage" style={vars}>
        <div className="mp-compare">
          {([leftEase, rightEase] as EaseKey[]).map((key, side) => (
            <div key={side} className="mp-lane">
              <svg className="mp-curve" viewBox="-5 -15 110 130" aria-hidden="true">
                <line x1="0" y1="100" x2="100" y2="100" />
                <line x1="0" y1="0" x2="0" y2="100" />
                <path d={curvePath(EASE[key])} />
              </svg>
              <div className="mp-track">
                <div className="mp-card" data-moved={moved ? 'true' : 'false'} style={{ '--demo-ease': EASE[key] } as CSSProperties}>
                  🍜
                </div>
              </div>
              <code className="mp-ease-value">{EASE[key]}</code>
            </div>
          ))}
        </div>
        <div className="mp-actions">
          <button type="button" onClick={() => setRunKey((k) => k + 1)}>
            움직이기 ({ms}ms)
          </button>
          <button type="button" onClick={() => setListKey((k) => k + 1)}>
            목록 다시 등장
          </button>
        </div>

        <ul className="mp-list" key={listKey} aria-label="오늘의 메뉴">
          {MENU.map((name, index) => (
            <li
              key={name}
              className="mp-item"
              style={{ '--delay': `${staggerOn ? staggerDelay({ index }) : 0}ms` } as CSSProperties}
            >
              {name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
