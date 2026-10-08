import { useState, type CSSProperties } from 'react'
import { TextField } from '@skills/floating-label/assets/TextField'
import { defineCopy, useDemoLang } from '../../demoLang'
import './floating-label-demo.css'

const COPY = defineCopy({
  ko: {
    controlsLabel: '애니메이션 옵션',
    speed: '떠오름 속도',
    note: '클릭(포커스)하면 라벨이 떠오르고, 값을 남긴 채 벗어나도 떠 있습니다 — 판정이 전부 CSS(:focus·:placeholder-shown)라 JS 상태가 없습니다.',
    title: '단체 예약 문의',
    name: '예약자 이름',
    phone: '연락처',
    headcount: '인원 (4명부터)',
    submit: '문의 남기기',
  },
  en: {
    controlsLabel: 'Animation options',
    speed: 'Float speed',
    note: 'Click (focus) a field and the label floats up. Leave with a value in it and the label stays up. It is all decided in CSS (:focus, :placeholder-shown), so there is no JS state.',
    title: 'Group booking inquiry',
    name: 'Name for the booking',
    phone: 'Phone',
    headcount: 'Party size (4 or more)',
    submit: 'Send inquiry',
  },
})

export const FloatingLabelDemo = () => {
  const t = COPY[useDemoLang()]
  const [durationMs, setDurationMs] = useState(150)

  const vars = { '--field-duration': `${durationMs}ms` } as CSSProperties

  return (
    <div className="playground">
      <section className="controls" aria-label={t.controlsLabel}>
        <label>
          <span>
            {t.speed} <code>--field-duration</code>
          </span>
          <input
            type="range"
            min={80}
            max={400}
            step={10}
            value={durationMs}
            onChange={(e) => setDurationMs(Number(e.target.value))}
          />
          <output>{durationMs}ms</output>
        </label>
        <p className="controls-note">{t.note}</p>
      </section>

      <form className="field-stage" style={vars} onSubmit={(e) => e.preventDefault()}>
        <h2 className="field-stage-title">{t.title}</h2>
        <TextField label={t.name} name="name" />
        <TextField label={t.phone} type="tel" name="phone" />
        <TextField label={t.headcount} type="number" name="headcount" />
        <button type="submit">{t.submit}</button>
      </form>
    </div>
  )
}
