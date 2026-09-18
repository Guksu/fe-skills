import { useState, type CSSProperties } from 'react'
import { ProgressRing } from '@skills/progress-ring/assets/ProgressRing'
import { ActivityRings } from '@skills/progress-ring/assets/ActivityRings'
import { clampProgress } from '@skills/progress-ring/assets/ringGeometry'
import './progress-ring-demo.css'

/** 오늘 목표 3종 — 바깥 링부터 안쪽 순서 */
const GOALS = [
  { key: 'bowls', label: '판매 그릇 수', unit: '그릇', max: 120, color: '#ff6b6b' },
  { key: 'dumplings', label: '만두 빚기', unit: '개', max: 200, color: '#ffd166' },
  { key: 'broth', label: '육수 끓이기', unit: 'L', max: 80, color: '#4ecdc4' },
] as const

type GoalKey = (typeof GOALS)[number]['key']

export const ProgressRingDemo = () => {
  const [values, setValues] = useState<Record<GoalKey, number>>({ bowls: 96, dumplings: 130, broth: 52 })
  const [orderProgress, setOrderProgress] = useState(45)
  const [durationMs, setDurationMs] = useState(600)
  const [showIndeterminate, setShowIndeterminate] = useState(false)

  const setValue = ({ key, value }: { key: GoalKey; value: number }) =>
    setValues((prev) => ({ ...prev, [key]: value }))

  const vars = { '--ring-duration': `${durationMs}ms` } as CSSProperties
  const orderPercent = Math.round(clampProgress({ value: orderProgress, max: 100 }).progress * 100)

  return (
    <div className="playground" style={vars}>
      <section className="controls" aria-label="애니메이션 옵션">
        {GOALS.map((goal) => (
          <label key={goal.key}>
            <span>
              {goal.label} <code>value / {goal.max}</code>
            </span>
            <input
              type="range"
              min={0}
              max={Math.round(goal.max * 1.3)}
              step={1}
              value={values[goal.key]}
              onChange={(e) => setValue({ key: goal.key, value: Number(e.target.value) })}
            />
            <output>
              {values[goal.key]}
              {goal.unit}
            </output>
          </label>
        ))}
        <label>
          <span>
            주문 준비 진행률 <code>value</code>
          </span>
          <input
            type="range"
            min={0}
            max={120}
            step={1}
            value={orderProgress}
            onChange={(e) => setOrderProgress(Number(e.target.value))}
          />
          <output>{orderProgress}%</output>
        </label>
        <label>
          <span>
            속도 <code>--ring-duration</code>
          </span>
          <input
            type="range"
            min={100}
            max={2000}
            step={100}
            value={durationMs}
            onChange={(e) => setDurationMs(Number(e.target.value))}
          />
          <output>{durationMs}ms</output>
        </label>
        <label className="controls-inline">
          <input type="checkbox" checked={showIndeterminate} onChange={(e) => setShowIndeterminate(e.target.checked)} />
          <span>
            무한 로딩 보기 <code>value=undefined</code>
          </span>
        </label>
        <p className="controls-note">
          슬라이더를 움직이면 링이 직전 위치에서 새 위치로 따라갑니다 — JS 프레임 루프 없이 stroke-dashoffset의
          CSS transition만 씁니다. 목표(120%)를 넘기면 링은 한 바퀴에서 멈추고 번짐으로 초과를 알립니다.
        </p>
      </section>

      <div className="ring-grid">
        <section className="ring-card">
          <h2>오늘 목표</h2>
          <div className="ring-stage">
            <ActivityRings
              size={180}
              stroke={16}
              gap={5}
              rings={GOALS.map((goal) => ({
                value: values[goal.key],
                max: goal.max,
                color: goal.color,
                label: goal.label,
              }))}
            />
            <ul className="ring-legend">
              {GOALS.map((goal) => {
                const { over } = clampProgress({ value: values[goal.key], max: goal.max })
                return (
                  <li key={goal.key}>
                    <span className="ring-legend-swatch" style={{ background: goal.color }} aria-hidden="true" />
                    <span className="ring-legend-label">{goal.label}</span>
                    <strong className="ring-legend-value">
                      {values[goal.key]} / {goal.max}
                      {goal.unit}
                    </strong>
                    {over && <span className="ring-legend-over">목표 초과</span>}
                  </li>
                )
              })}
            </ul>
          </div>
          <p>3중 링 — 바깥부터 안쪽으로 겹칩니다. 각 링이 개별 progressbar로 읽힙니다.</p>
        </section>

        <section className="ring-card">
          <h2>주문 준비 진행률</h2>
          <div className="ring-stage">
            <ProgressRing
              value={showIndeterminate ? undefined : orderProgress}
              max={100}
              size={140}
              stroke={12}
              color="var(--accent)"
              label="잔치국수 2인분 준비"
            >
              {showIndeterminate ? (
                <span className="ring-center-text">준비 중</span>
              ) : (
                <span className="ring-center-percent">{orderPercent}%</span>
              )}
            </ProgressRing>
            <div className="ring-order">
              <strong>잔치국수 2인분 · 손만두 1접시</strong>
              <span>{showIndeterminate ? '주방에서 확인 중…' : orderProgress >= 100 ? '곧 나갑니다' : '면 삶는 중'}</span>
            </div>
          </div>
          <p>가운데 슬롯에 퍼센트 숫자. 값이 없으면(무한 로딩) 짧은 호가 돕니다.</p>
        </section>
      </div>
    </div>
  )
}
