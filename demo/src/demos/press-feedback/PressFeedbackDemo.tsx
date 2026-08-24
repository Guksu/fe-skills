import { useState, type CSSProperties } from 'react'
import '@skills/press-feedback/assets/press-feedback.css'
import './press-feedback-demo.css'

export const PressFeedbackDemo = () => {
  const [pressScale, setPressScale] = useState(0.96)

  const vars = { '--press-scale': String(pressScale) } as CSSProperties

  return (
    <div className="playground" style={vars}>
      <section className="controls" aria-label="옵션">
        <label>
          <span>
            눌림 배율 <code>--press-scale</code>
          </span>
          <input
            type="range"
            min={0.85}
            max={1}
            step={0.01}
            value={pressScale}
            onChange={(e) => setPressScale(Number(e.target.value))}
          />
          <output>{pressScale.toFixed(2)}</output>
        </label>
        <p className="controls-note">
          꾹 눌러보세요 — 누름은 60ms 즉각, 복귀는 220ms 스프링(비대칭 타이밍)입니다. 0.9 이하로
          과장하면 고빈도 사용에서 금방 피로해집니다.
        </p>
      </section>

      <div className="press-grid">
        <section className="press-cell">
          <h2>기본 — pressable</h2>
          <button type="button" className="pressable press-primary">
            주문하기
          </button>
        </section>
        <section className="press-cell">
          <h2>카드형 — pressable-dim</h2>
          <button type="button" className="pressable pressable-dim press-card">
            <span>🍜</span>
            <strong>오늘의 국수</strong>
            <small>얼큰 칼국수 9,000원</small>
          </button>
        </section>
        <section className="press-cell">
          <h2>호버 리프트 — pressable-lift</h2>
          <button type="button" className="pressable pressable-lift press-primary">
            찜하기
          </button>
        </section>
      </div>
    </div>
  )
}
