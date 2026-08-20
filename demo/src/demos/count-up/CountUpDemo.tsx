import { useState } from 'react'
import { CountUp } from '@skills/count-up/assets/CountUp'
import './count-up-demo.css'

const AMOUNTS = [1_234_567, 89_000, 25_000_000, 3_141_592]

export const CountUpDemo = () => {
  const [durationMs, setDurationMs] = useState(800)
  const [amountIndex, setAmountIndex] = useState(0)
  const [points, setPoints] = useState(12_400)

  return (
    <div className="playground">
      <section className="controls" aria-label="애니메이션 옵션">
        <label>
          <span>
            지속 시간 <code>durationMs</code>
          </span>
          <input
            type="range"
            min={200}
            max={2000}
            step={100}
            value={durationMs}
            onChange={(e) => setDurationMs(Number(e.target.value))}
          />
          <output>{durationMs}ms</output>
        </label>
        <p className="controls-note">
          숫자 폭이 떨리지 않는 것은 count-up.css의 tabular-nums 덕분입니다 — 금액 강조 연출은
          600~1200ms가 무난합니다.
        </p>
      </section>

      <div className="countup-grid">
        <section className="countup-card">
          <h2>잔액 표시 (값 교체)</h2>
          <strong className="countup-amount">
            <CountUp
              value={AMOUNTS[amountIndex]}
              durationMs={durationMs}
              format={(v) => `${Math.round(v).toLocaleString('ko-KR')}원`}
            />
          </strong>
          <button type="button" onClick={() => setAmountIndex((prev) => (prev + 1) % AMOUNTS.length)}>
            다른 금액으로 교체
          </button>
          <p>직전 값에서 새 값으로 이어서 굴러갑니다.</p>
        </section>

        <section className="countup-card">
          <h2>포인트 적립 (증감)</h2>
          <strong className="countup-amount">
            <CountUp value={points} durationMs={durationMs} format={(v) => `${Math.round(v).toLocaleString('ko-KR')}P`} />
          </strong>
          <div className="countup-actions">
            <button type="button" onClick={() => setPoints((prev) => prev + 1_500)}>
              +1,500P 적립
            </button>
            <button type="button" onClick={() => setPoints((prev) => Math.max(0, prev - 3_000))}>
              −3,000P 사용
            </button>
          </div>
          <p>감소 방향도 같은 코어가 처리합니다.</p>
        </section>
      </div>
    </div>
  )
}
