import { useState } from 'react'
import { Presence } from '@skills/enter-exit/assets/Presence'
import '@skills/enter-exit/assets/enter-exit.css'
import './enter-exit-demo.css'

const VARIANTS = [
  { className: 'fx-fade', label: '페이드' },
  { className: 'fx-slide-up', label: '슬라이드 업' },
  { className: 'fx-scale', label: '스케일' },
] as const

export const EnterExitDemo = () => {
  const [visible, setVisible] = useState<Record<string, boolean>>({})

  const toggle = (name: string) => setVisible((prev) => ({ ...prev, [name]: !prev[name] }))

  return (
    <div className="demo-grid">
      {VARIANTS.map((variant) => (
        <section key={variant.className} className="demo-cell">
          <button type="button" onClick={() => toggle(variant.className)}>
            {variant.label} {visible[variant.className] ? '숨기기' : '보이기'}
          </button>
          <div className="stage">
            <Presence show={Boolean(visible[variant.className])} timeoutMs={400}>
              <div className={`fx ${variant.className} demo-card`}>
                <strong>{variant.label}</strong>
                <span>.{variant.className}</span>
              </div>
            </Presence>
          </div>
        </section>
      ))}
      <section className="demo-cell demo-cell-wide">
        <ToastExample />
      </section>
    </div>
  )
}

const ToastExample = () => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button type="button" onClick={() => setOpen((prev) => !prev)}>
        토스트 {open ? '닫기' : '띄우기'} (실전 예시)
      </button>
      <div className="stage stage-toast">
        <Presence show={open} timeoutMs={400}>
          <div className="fx fx-slide-up demo-toast" role="status">
            저장되었습니다 ✓
          </div>
        </Presence>
      </div>
    </>
  )
}
