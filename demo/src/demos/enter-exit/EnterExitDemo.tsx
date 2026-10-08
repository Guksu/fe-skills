import { useState, type CSSProperties } from 'react'
import { Presence } from '@skills/enter-exit/assets/Presence'
import '@skills/enter-exit/assets/enter-exit.css'
import { defineCopy, useDemoLang } from '../../demoLang'
import './enter-exit-demo.css'

// 언어와 무관한 데이터(클래스 이름·이징 값)는 밖에, 화면에 보이거나 읽히는 문구는 COPY 두 벌에 둔다
const VARIANTS = ['fx-fade', 'fx-slide-up', 'fx-scale'] as const

const EASINGS = [
  { key: 'standard', value: 'cubic-bezier(0.22, 1, 0.36, 1)' },
  { key: 'snap', value: 'cubic-bezier(0.23, 1, 0.32, 1)' },
  { key: 'inOut', value: 'cubic-bezier(0.77, 0, 0.175, 1)' },
  { key: 'linear', value: 'linear' },
] as const

const COPY = defineCopy({
  ko: {
    variants: {
      'fx-fade': { label: '페이드', hint: '오버레이·딤 배경용' },
      'fx-slide-up': { label: '슬라이드 업', hint: '토스트·카드용' },
      'fx-scale': { label: '스케일', hint: '팝오버·모달용' },
    },
    easings: {
      standard: '표준 ease-out — cubic-bezier(0.22, 1, 0.36, 1)',
      snap: '스냅 ease-out — cubic-bezier(0.23, 1, 0.32, 1)',
      inOut: 'ease-in-out — cubic-bezier(0.77, 0, 0.175, 1)',
      linear: 'linear (비교용 — UI에는 비권장)',
    },
    controlsLabel: '애니메이션 옵션',
    duration: '지속 시간',
    easing: '이징',
    distance: '이동 거리 (슬라이드 업)',
    fromScale: '시작 배율 (스케일)',
    note: 'UI 애니메이션은 300ms 이하, 시작 배율은 0.9~0.97이 권장값입니다 — 범위 밖은 차이를 눈으로 비교하기 위한 것입니다.',
    toggle: ({ label, shown }: { label: string; shown: boolean }) => `${label} ${shown ? '숨기기' : '보이기'}`,
    toastButton: (open: boolean) => `토스트 ${open ? '닫기' : '띄우기'} (실전 예시)`,
    toast: '저장되었습니다 ✓',
  },
  en: {
    variants: {
      'fx-fade': { label: 'Fade', hint: 'For overlays and dimmed backdrops' },
      'fx-slide-up': { label: 'Slide up', hint: 'For toasts and cards' },
      'fx-scale': { label: 'Scale', hint: 'For popovers and modals' },
    },
    easings: {
      standard: 'Standard ease-out: cubic-bezier(0.22, 1, 0.36, 1)',
      snap: 'Snappy ease-out: cubic-bezier(0.23, 1, 0.32, 1)',
      inOut: 'ease-in-out: cubic-bezier(0.77, 0, 0.175, 1)',
      linear: 'linear (for comparison, not for UI)',
    },
    controlsLabel: 'Animation options',
    duration: 'Duration',
    easing: 'Easing',
    distance: 'Distance (slide up)',
    fromScale: 'Starting scale (scale)',
    note: 'For UI animation, keep durations at 300ms or less and the starting scale between 0.9 and 0.97. Values outside that range are here so you can compare the difference by eye.',
    toggle: ({ label, shown }: { label: string; shown: boolean }) => `${shown ? 'Hide' : 'Show'}: ${label}`,
    toastButton: (open: boolean) => `${open ? 'Close' : 'Show'} toast (real-world example)`,
    toast: 'Saved ✓',
  },
})

export const EnterExitDemo = () => {
  const t = COPY[useDemoLang()]
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
      <section className="controls" aria-label={t.controlsLabel}>
        <label>
          <span>
            {t.duration} <code>--fx-duration</code>
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
            {t.easing} <code>--fx-ease</code>
          </span>
          <select value={easing} onChange={(e) => setEasing(e.target.value)}>
            {EASINGS.map((option) => (
              <option key={option.value} value={option.value}>
                {t.easings[option.key]}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>
            {t.distance} <code>--fx-distance</code>
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
            {t.fromScale} <code>--fx-from-scale</code>
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
        <p className="controls-note">{t.note}</p>
      </section>

      <div className="demo-grid" style={fxVars}>
        {VARIANTS.map((className) => (
          <section key={className} className="demo-cell">
            <button type="button" onClick={() => toggle(className)}>
              {t.toggle({ label: t.variants[className].label, shown: Boolean(visible[className]) })}
            </button>
            <div className="stage">
              <Presence show={Boolean(visible[className])} timeoutMs={durationMs + 100}>
                {/* layout-audit-ignore: nested-card — 점선 칸은 등장 자리 표시이고, 카드는 나타나고 사라지는 주인공이다 */}
                <div className={`fx ${className} demo-card`}>
                  <strong>{t.variants[className].label}</strong>
                  <span>.{className}</span>
                  <em>{t.variants[className].hint}</em>
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
  const t = COPY[useDemoLang()]
  const [open, setOpen] = useState(false)

  return (
    <>
      <button type="button" onClick={() => setOpen((prev) => !prev)}>
        {t.toastButton(open)}
      </button>
      <div className="stage stage-toast" style={fxVars}>
        <Presence show={open} timeoutMs={durationMs + 100}>
          <div className="fx fx-slide-up demo-toast" role="status">
            {t.toast}
          </div>
        </Presence>
      </div>
    </>
  )
}
