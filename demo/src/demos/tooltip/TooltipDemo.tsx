import { useState } from 'react'
import { Tooltip } from '@skills/tooltip/assets/Tooltip'
import './tooltip-demo.css'

export const TooltipDemo = () => {
  const [delayMs, setDelayMs] = useState(400)

  return (
    <div className="playground">
      <section className="controls" aria-label="애니메이션 옵션">
        <label>
          <span>
            호버 지연 <code>showDelayMs</code>
          </span>
          <input
            type="range"
            min={0}
            max={1000}
            step={100}
            value={delayMs}
            onChange={(e) => setDelayMs(Number(e.target.value))}
          />
          <output>{delayMs}ms</output>
        </label>
        <p className="controls-note">
          마우스는 지연 후, 키보드 포커스(Tab 이동)는 즉시 열립니다 — 스치는 커서에는 반응하지
          않고 의도가 분명한 포커스는 기다리게 하지 않습니다. Esc로 닫힙니다.
        </p>
      </section>

      <div className="tooltip-stage">
        <Tooltip label="곱빼기는 +1,000원" place="top" showDelayMs={delayMs}>
          <button type="button">면 추가</button>
        </Tooltip>
        <Tooltip label="2단계 — 국물이 칼칼합니다" place="bottom" showDelayMs={delayMs}>
          <button type="button">🌶️ 맵기</button>
        </Tooltip>
        <Tooltip label="매일 아침 뽑은 생면만 씁니다" place="left" showDelayMs={delayMs}>
          <button type="button">생면</button>
        </Tooltip>
        <Tooltip label="국물은 따로 담아드려요" place="right" showDelayMs={delayMs}>
          <button type="button">포장</button>
        </Tooltip>
      </div>
    </div>
  )
}
