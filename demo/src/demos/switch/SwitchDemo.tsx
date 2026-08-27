import { useState, type CSSProperties } from 'react'
import { Switch } from '@skills/switch/assets/Switch'
import './switch-demo.css'

const OPTIONS = [
  { id: 'extra', label: '곱빼기 (+1,000원)' },
  { id: 'greenOnion', label: '파 많이' },
  { id: 'egg', label: '계란 추가 (+500원)' },
  { id: 'soupApart', label: '국물 따로 포장' },
]

export const SwitchDemo = () => {
  const [checkedIds, setCheckedIds] = useState<string[]>([])
  const [durationMs, setDurationMs] = useState(200)

  const vars = { '--switch-duration': `${durationMs}ms` } as CSSProperties
  const count = checkedIds.length

  const toggleOption = ({ id, next }: { id: string; next: boolean }) => {
    setCheckedIds((prev) => (next ? [...prev, id] : prev.filter((checkedId) => checkedId !== id)))
  }

  return (
    <div className="playground">
      <section className="controls" aria-label="애니메이션 옵션">
        <label>
          <span>
            속도 <code>--switch-duration</code>
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
          마우스로 누르고 있어 보세요 — 썸이 살짝 눌리는 스퀴시(iOS 관례)가 들어 있습니다. Tab으로
          포커스한 뒤 Space로도 켜집니다 — 네이티브 체크박스가 그대로 일하기 때문입니다.
        </p>
      </section>

      <div className="switch-stage" style={vars}>
        <h2 className="switch-stage-title">주문 옵션</h2>
        {OPTIONS.map((option) => (
          <Switch
            key={option.id}
            checked={checkedIds.includes(option.id)}
            onChange={(next) => toggleOption({ id: option.id, next })}
            label={option.label}
          />
        ))}
        <Switch checked={false} onChange={() => {}} label="셀프 리필 (준비 중)" disabled />
        <p className="switch-result" aria-live="polite">
          {count > 0 ? `옵션 ${count}개가 주문에 적용됩니다.` : '원하는 옵션을 켜보세요.'}
        </p>
      </div>
    </div>
  )
}
