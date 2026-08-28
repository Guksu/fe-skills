import { useState, type CSSProperties } from 'react'
import { Checkbox } from '@skills/checkbox-radio/assets/Checkbox'
import { Radio } from '@skills/checkbox-radio/assets/Radio'
import './checkbox-radio-demo.css'

const NOODLES = [
  { value: 'somyeon', label: '소면' },
  { value: 'kalguksu', label: '칼국수' },
  { value: 'jjolmyeon', label: '쫄면' },
]

const TOPPINGS = [
  { id: 'egg', label: '계란 (+500원)' },
  { id: 'greenOnion', label: '파 많이' },
  { id: 'mandu', label: '만두 3개 (+2,000원)' },
]

export const CheckboxRadioDemo = () => {
  const [noodle, setNoodle] = useState('somyeon')
  const [toppings, setToppings] = useState<string[]>([])
  const [agree, setAgree] = useState(false)
  const [durationMs, setDurationMs] = useState(200)

  const vars = { '--check-duration': `${durationMs}ms`, '--check-accent': 'var(--accent)' } as CSSProperties
  const noodleLabel = NOODLES.find((item) => item.value === noodle)?.label

  const toggleTopping = ({ id, next }: { id: string; next: boolean }) => {
    setToppings((prev) => (next ? [...prev, id] : prev.filter((toppingId) => toppingId !== id)))
  }

  return (
    <div className="playground">
      <section className="controls" aria-label="애니메이션 옵션">
        <label>
          <span>
            속도 <code>--check-duration</code>
          </span>
          <input
            type="range"
            min={100}
            max={600}
            step={50}
            value={durationMs}
            onChange={(e) => setDurationMs(Number(e.target.value))}
          />
          <output>{durationMs}ms</output>
        </label>
        <p className="controls-note">
          체크마크는 획 순서대로 그려지고(박스가 먼저 칠해진 뒤 30% 늦게 시작), 라디오 도트는 살짝 튀어 맺힙니다.
          라디오에 포커스를 두고 ←→ 화살표로 옮겨 보세요 — 네이티브 input이라 그대로 됩니다.
        </p>
      </section>

      <form className="check-stage" style={vars} onSubmit={(e) => e.preventDefault()}>
        <fieldset className="check-group">
          <legend>면 종류 (하나만)</legend>
          {NOODLES.map((item) => (
            <Radio
              key={item.value}
              name="noodle"
              value={item.value}
              checked={noodle === item.value}
              onChange={() => setNoodle(item.value)}
              label={item.label}
            />
          ))}
        </fieldset>

        <fieldset className="check-group">
          <legend>토핑 (여러 개)</legend>
          {TOPPINGS.map((item) => (
            <Checkbox
              key={item.id}
              checked={toppings.includes(item.id)}
              onChange={(e) => toggleTopping({ id: item.id, next: e.target.checked })}
              label={item.label}
            />
          ))}
          <Checkbox label="셀프 리필 (준비 중)" disabled />
        </fieldset>

        <Checkbox checked={agree} onChange={(e) => setAgree(e.target.checked)} label="주문 안내에 동의합니다" />

        <p className="check-result" aria-live="polite">
          {noodleLabel}
          {toppings.length > 0 ? ` + 토핑 ${toppings.length}개` : ''}
          {agree ? ' — 주문 가능' : ' — 동의가 필요합니다'}
        </p>
      </form>
    </div>
  )
}
