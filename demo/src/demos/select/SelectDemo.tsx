import { useState, type CSSProperties } from 'react'
import { Select } from '@skills/select/assets/Select'
import './select-demo.css'

const NOODLES = [
  { value: 'somyeon', label: '소면' },
  { value: 'jungmyeon', label: '중면' },
  { value: 'kalguksu', label: '칼국수면' },
  { value: 'memil', label: '메밀면' },
  { value: 'ssal', label: '쌀국수면' },
]

const SPICE_LEVELS = [
  { value: '0', label: '0단계 — 맑은 국물' },
  { value: '1', label: '1단계 — 순한맛' },
  { value: '2', label: '2단계 — 칼칼한맛' },
  { value: '3', label: '3단계 — 얼얼한맛' },
]

export const SelectDemo = () => {
  const [noodle, setNoodle] = useState<string | null>(null)
  const [spice, setSpice] = useState<string | null>(null)
  const [durationMs, setDurationMs] = useState(200)

  const vars = { '--select-duration': `${durationMs}ms` } as CSSProperties
  const noodleLabel = NOODLES.find((option) => option.value === noodle)?.label
  const spiceLabel = SPICE_LEVELS.find((option) => option.value === spice)?.label

  return (
    <div className="playground">
      <section className="controls" aria-label="애니메이션 옵션">
        <label>
          <span>
            패널 드롭 속도 <code>--select-duration</code>
          </span>
          <input
            type="range"
            min={100}
            max={500}
            step={50}
            value={durationMs}
            onChange={(e) => setDurationMs(Number(e.target.value))}
          />
          <output>{durationMs}ms</output>
        </label>
        <p className="controls-note">
          클릭 대신 키보드로도 써보세요 — ↓로 열고 ↓↑로 이동, Enter로 선택, Esc로 취소. 포커스는
          트리거에 남고 활성 옵션은 aria-activedescendant가 가리킵니다.
        </p>
      </section>

      <div className="select-stage" style={vars}>
        <div className="select-field">
          <span className="select-field-label">면 종류</span>
          <Select options={NOODLES} value={noodle} onChange={setNoodle} placeholder="면 종류 선택" />
        </div>
        <div className="select-field">
          <span className="select-field-label">맵기</span>
          <Select options={SPICE_LEVELS} value={spice} onChange={setSpice} placeholder="맵기 선택" />
        </div>
        <p className="select-result" aria-live="polite">
          {noodleLabel && spiceLabel
            ? `${noodleLabel}, ${spiceLabel}로 준비하겠습니다.`
            : '두 가지를 고르면 주문 문장이 완성됩니다.'}
        </p>
      </div>
    </div>
  )
}
