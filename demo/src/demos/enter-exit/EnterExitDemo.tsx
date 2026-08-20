import { useState, type CSSProperties } from 'react'
import { Presence } from '@skills/enter-exit/assets/Presence'
import '@skills/enter-exit/assets/enter-exit.css'
import './enter-exit-demo.css'

const VARIANTS = [
  { className: 'fx-fade', label: '페이드', hint: '오버레이·딤 배경용' },
  { className: 'fx-slide-up', label: '슬라이드 업', hint: '토스트·카드용' },
  { className: 'fx-scale', label: '스케일', hint: '팝오버·모달용' },
] as const

const EASINGS = [
  { label: '표준 ease-out — cubic-bezier(0.22, 1, 0.36, 1)', value: 'cubic-bezier(0.22, 1, 0.36, 1)' },
  { label: '스냅 ease-out — cubic-bezier(0.23, 1, 0.32, 1)', value: 'cubic-bezier(0.23, 1, 0.32, 1)' },
  { label: 'ease-in-out — cubic-bezier(0.77, 0, 0.175, 1)', value: 'cubic-bezier(0.77, 0, 0.175, 1)' },
  { label: 'linear (비교용 — UI에는 비권장)', value: 'linear' },
] as const

export const EnterExitDemo = () => {
  const [visible, setVisible] = useState<Record<string, boolean>>({})
  const [durationMs, setDurationMs] = useState(300)
  const [easing, setEasing] = useState<string>(EASINGS[0].value)
  const [distancePx, setDistancePx] = useState(16)
  const [fromScale, setFromScale] = useState(0.9)

  const toggle = (name: string) => setVisible((prev) => ({ ...prev, [name]: !prev[name] }))

  // SKILL.md의 커스터마이즈 포인트(CSS 변수)를 그대로 노출한다 — 데모 전용 장치
  const fxVars = {
    '--fx-duration': `${durationMs}ms`,
    '--fx-ease': easing,
    '--fx-distance': `${distancePx}px`,
    '--fx-from-scale': String(fromScale),
  } as CSSProperties

  return (
    <div className="playground">
      <section className="controls" aria-label="애니메이션 옵션">
        <label>
          <span>
            지속 시간 <code>--fx-duration</code>
          </span>
          <input
            type="range"
            min={100}
            max={800}
            step={50}
            value={durationMs}
            onChange={(e) => setDurationMs(Number(e.target.value))}
          />
          <output>{durationMs}ms</output>
        </label>
        <label>
          <span>
            이징 <code>--fx-ease</code>
          </span>
          <select value={easing} onChange={(e) => setEasing(e.target.value)}>
            {EASINGS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>
            이동 거리 (슬라이드 업) <code>--fx-distance</code>
          </span>
          <input
            type="range"
            min={4}
            max={48}
            step={4}
            value={distancePx}
            onChange={(e) => setDistancePx(Number(e.target.value))}
          />
          <output>{distancePx}px</output>
        </label>
        <label>
          <span>
            시작 배율 (스케일) <code>--fx-from-scale</code>
          </span>
          <input
            type="range"
            min={0.5}
            max={1}
            step={0.05}
            value={fromScale}
            onChange={(e) => setFromScale(Number(e.target.value))}
          />
          <output>{fromScale.toFixed(2)}</output>
        </label>
        <p className="controls-note">
          UI 애니메이션은 300ms 이하, 시작 배율은 0.9~0.97이 권장값입니다 — 범위 밖은 차이를 눈으로
          비교하기 위한 것입니다.
        </p>
      </section>

      <div className="demo-grid" style={fxVars}>
        {VARIANTS.map((variant) => (
          <section key={variant.className} className="demo-cell">
            <button type="button" onClick={() => toggle(variant.className)}>
              {variant.label} {visible[variant.className] ? '숨기기' : '보이기'}
            </button>
            <div className="stage">
              <Presence show={Boolean(visible[variant.className])} timeoutMs={durationMs + 100}>
                <div className={`fx ${variant.className} demo-card`}>
                  <strong>{variant.label}</strong>
                  <span>.{variant.className}</span>
                  <em>{variant.hint}</em>
                </div>
              </Presence>
            </div>
          </section>
        ))}
      </div>

      <section className="demo-cell">
        <ToastExample durationMs={durationMs} fxVars={fxVars} />
      </section>
    </div>
  )
}

const ToastExample = ({ durationMs, fxVars }: { durationMs: number; fxVars: CSSProperties }) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button type="button" onClick={() => setOpen((prev) => !prev)}>
        토스트 {open ? '닫기' : '띄우기'} (실전 예시)
      </button>
      <div className="stage stage-toast" style={fxVars}>
        <Presence show={open} timeoutMs={durationMs + 100}>
          <div className="fx fx-slide-up demo-toast" role="status">
            저장되었습니다 ✓
          </div>
        </Presence>
      </div>
    </>
  )
}
