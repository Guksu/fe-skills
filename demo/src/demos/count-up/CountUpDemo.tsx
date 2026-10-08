import { useState } from 'react'
import { CountUp } from '@skills/count-up/assets/CountUp'
import { defineCopy, useDemoLang } from '../../demoLang'
import './count-up-demo.css'

const AMOUNTS = [1_234_567, 89_000, 25_000_000, 3_141_592]

const COPY = defineCopy({
  ko: {
    controlsLabel: '애니메이션 옵션',
    duration: '지속 시간',
    note: '숫자 폭이 떨리지 않는 것은 count-up.css의 tabular-nums 덕분입니다 — 금액 강조 연출은 600~1200ms가 무난합니다.',
    balanceTitle: '잔액 표시 (값 교체)',
    // format은 CountUp 효과의 의존성이다 — COPY에 두어 렌더마다 새 함수가 되지 않게 한다
    money: (v: number) => `${Math.round(v).toLocaleString('ko-KR')}원`,
    swap: '다른 금액으로 교체',
    swapNote: '직전 값에서 새 값으로 이어서 굴러갑니다.',
    pointsTitle: '포인트 적립 (증감)',
    points: (v: number) => `${Math.round(v).toLocaleString('ko-KR')}P`,
    earn: '+1,500P 적립',
    spend: '−3,000P 사용',
    pointsNote: '감소 방향도 같은 코어가 처리합니다.',
  },
  en: {
    controlsLabel: 'Animation options',
    duration: 'Duration',
    note: 'The digits keep a steady width thanks to tabular-nums in count-up.css. For highlighting an amount, 600 to 1200ms works well.',
    balanceTitle: 'Balance (value swap)',
    money: (v: number) => `₩${Math.round(v).toLocaleString('en-US')}`,
    swap: 'Swap in another amount',
    swapNote: 'It rolls on from the last value to the new one.',
    pointsTitle: 'Points (up and down)',
    points: (v: number) => `${Math.round(v).toLocaleString('en-US')} pts`,
    earn: 'Earn 1,500 pts',
    spend: 'Spend 3,000 pts',
    pointsNote: 'The same core handles counting down.',
  },
})

export const CountUpDemo = () => {
  const t = COPY[useDemoLang()]
  const [durationMs, setDurationMs] = useState(800)
  const [amountIndex, setAmountIndex] = useState(0)
  const [points, setPoints] = useState(12_400)

  return (
    <div className="playground">
      <section className="controls" aria-label={t.controlsLabel}>
        <label>
          <span>
            {t.duration} <code>durationMs</code>
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
        <p className="controls-note">{t.note}</p>
      </section>

      <div className="countup-grid">
        <section className="countup-card">
          <h2>{t.balanceTitle}</h2>
          <strong className="countup-amount">
            <CountUp value={AMOUNTS[amountIndex]} durationMs={durationMs} format={t.money} />
          </strong>
          <button type="button" onClick={() => setAmountIndex((prev) => (prev + 1) % AMOUNTS.length)}>
            {t.swap}
          </button>
          <p>{t.swapNote}</p>
        </section>

        <section className="countup-card">
          <h2>{t.pointsTitle}</h2>
          <strong className="countup-amount">
            <CountUp value={points} durationMs={durationMs} format={t.points} />
          </strong>
          <div className="countup-actions">
            <button type="button" onClick={() => setPoints((prev) => prev + 1_500)}>
              {t.earn}
            </button>
            <button type="button" onClick={() => setPoints((prev) => Math.max(0, prev - 3_000))}>
              {t.spend}
            </button>
          </div>
          <p>{t.pointsNote}</p>
        </section>
      </div>
    </div>
  )
}
