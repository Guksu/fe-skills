import { useState, type CSSProperties } from 'react'
import '@skills/press-feedback/assets/press-feedback.css'
import { defineCopy, useDemoLang } from '../../demoLang'
import { DishPhoto } from '../../shared/DishPhoto'
import './press-feedback-demo.css'

const COPY = defineCopy({
  ko: {
    controlsLabel: '옵션',
    scale: '눌림 배율',
    note: '꾹 눌러보세요 — 누름은 60ms 즉각, 복귀는 220ms 스프링(비대칭 타이밍)입니다. 0.9 이하로 과장하면 고빈도 사용에서 금방 피로해집니다.',
    basic: '기본 — pressable',
    order: '주문하기',
    card: '카드형 — pressable-dim',
    cardTitle: '오늘의 국수',
    cardMeta: '얼큰 칼국수 9,000원',
    lift: '호버 리프트 — pressable-lift',
    save: '찜하기',
  },
  en: {
    controlsLabel: 'Options',
    scale: 'Press scale',
    note: 'Press and hold. The press lands in 60ms and the release springs back over 220ms (asymmetric timing). Push it to 0.9 or lower and it quickly gets tiring on buttons people tap often.',
    basic: 'Default: pressable',
    order: 'Order',
    card: 'Card: pressable-dim',
    cardTitle: "Today's noodles",
    cardMeta: 'Spicy knife-cut noodles ₩9,000',
    lift: 'Hover lift: pressable-lift',
    save: 'Save',
  },
})

export const PressFeedbackDemo = () => {
  const t = COPY[useDemoLang()]
  const [pressScale, setPressScale] = useState(0.96)

  const vars = { '--press-scale': String(pressScale) } as CSSProperties

  return (
    <div className="playground" style={vars}>
      <section className="controls" aria-label={t.controlsLabel}>
        <label>
          <span>
            {t.scale} <code>--press-scale</code>
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
        <p className="controls-note">{t.note}</p>
      </section>

      <div className="press-grid">
        <section className="press-cell">
          <h2>{t.basic}</h2>
          <button type="button" className="pressable press-primary">
            {t.order}
          </button>
        </section>
        <section className="press-cell">
          <h2>{t.card}</h2>
          <button type="button" className="pressable pressable-dim press-card">
            <DishPhoto dish="kalguksu" className="press-card-photo" />
            <strong>{t.cardTitle}</strong>
            <small>{t.cardMeta}</small>
          </button>
        </section>
        <section className="press-cell">
          <h2>{t.lift}</h2>
          <button type="button" className="pressable pressable-lift press-primary">
            {t.save}
          </button>
        </section>
      </div>
    </div>
  )
}
