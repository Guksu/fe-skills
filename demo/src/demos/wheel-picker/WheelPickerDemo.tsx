import { useState } from 'react'
import { WheelPicker } from '@skills/wheel-picker/assets/WheelPicker'
import './wheel-picker-demo.css'

const HOURS = Array.from({ length: 11 }, (_, i) => {
  const hour = 11 + i
  return { value: String(hour), label: `${hour}시` }
})
const MINUTES = [
  { value: '00', label: '00분' },
  { value: '30', label: '30분' },
]
const PARTY = Array.from({ length: 8 }, (_, i) => ({ value: String(i + 1), label: `${i + 1}명` }))

const meridiem = (hour: number) => (hour < 12 ? `오전 ${hour}시` : hour === 12 ? '낮 12시' : `오후 ${hour - 12}시`)

export const WheelPickerDemo = () => {
  const [hour, setHour] = useState('18')
  const [minute, setMinute] = useState('30')
  const [party, setParty] = useState('2')
  const [visibleCount, setVisibleCount] = useState(5)
  const [itemHeight, setItemHeight] = useState(36)

  const wheelProps = { visibleCount, itemHeight }

  return (
    <div className="playground">
      <section className="controls" aria-label="휠 피커 옵션">
        <label>
          <span>
            보이는 칸 수 <code>--wheel-visible</code>
          </span>
          <input type="range" min={3} max={9} step={2} value={visibleCount} onChange={(e) => setVisibleCount(Number(e.target.value))} />
          <output>{visibleCount}칸</output>
        </label>
        <label>
          <span>
            항목 높이 <code>--wheel-item-height</code>
          </span>
          <input type="range" min={28} max={52} step={4} value={itemHeight} onChange={(e) => setItemHeight(Number(e.target.value))} />
          <output>{itemHeight}px</output>
        </label>
        <label>
          <span>바로 가기 (외부에서 value 변경)</span>
          <span className="wheel-demo-presets">
            <button type="button" onClick={() => { setHour('12'); setMinute('00') }}>
              점심 12:00
            </button>
            <button type="button" onClick={() => { setHour('19'); setMinute('30') }}>
              저녁 19:30
            </button>
          </span>
        </label>
        <p className="controls-note">
          휠을 굴리거나(트랙패드·마우스 휠·터치), 항목을 클릭하거나, 포커스한 뒤 방향키·Home/End·PageUp/Down으로 고르세요.
          모션 줄이기 설정에서는 기울기·흐림 없이 평평한 목록으로 스냅만 됩니다.
        </p>
      </section>

      <div className="wheel-demo-stage">
        <p className="wheel-demo-title">🍜 성수동 국수집 — 예약</p>
        <div className="wheel-demo-row">
          <div className="wheel-demo-col">
            <span id="wheel-demo-hour" className="wheel-demo-label">시</span>
            <WheelPicker {...wheelProps} aria-labelledby="wheel-demo-hour" options={HOURS} value={hour} onChange={setHour} />
          </div>
          <div className="wheel-demo-col">
            <span id="wheel-demo-minute" className="wheel-demo-label">분</span>
            <WheelPicker {...wheelProps} aria-labelledby="wheel-demo-minute" options={MINUTES} value={minute} onChange={setMinute} />
          </div>
          <div className="wheel-demo-col">
            <span id="wheel-demo-party" className="wheel-demo-label">인원</span>
            <WheelPicker {...wheelProps} aria-labelledby="wheel-demo-party" options={PARTY} value={party} onChange={setParty} />
          </div>
        </div>
        <p className="wheel-demo-result" aria-live="polite">
          <strong>
            {meridiem(Number(hour))} {minute}분
          </strong>
          에 <strong>{party}명</strong> 자리를 잡아둘게요. 칼국수 반죽은 그 시간에 맞춰 치댑니다.
        </p>
      </div>
    </div>
  )
}
