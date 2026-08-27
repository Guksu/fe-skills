import { useState, type CSSProperties } from 'react'
import { TextField } from '@skills/floating-label/assets/TextField'
import './floating-label-demo.css'

export const FloatingLabelDemo = () => {
  const [durationMs, setDurationMs] = useState(150)

  const vars = { '--field-duration': `${durationMs}ms` } as CSSProperties

  return (
    <div className="playground">
      <section className="controls" aria-label="애니메이션 옵션">
        <label>
          <span>
            떠오름 속도 <code>--field-duration</code>
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
        <p className="controls-note">
          클릭(포커스)하면 라벨이 떠오르고, 값을 남긴 채 벗어나도 떠 있습니다 — 판정이 전부
          CSS(:focus·:placeholder-shown)라 JS 상태가 없습니다.
        </p>
      </section>

      <form className="field-stage" style={vars} onSubmit={(e) => e.preventDefault()}>
        <h2 className="field-stage-title">단체 예약 문의</h2>
        <TextField label="예약자 이름" name="name" />
        <TextField label="연락처" type="tel" name="phone" />
        <TextField label="인원 (4명부터)" type="number" name="headcount" />
        <button type="submit">문의 남기기</button>
      </form>
    </div>
  )
}
