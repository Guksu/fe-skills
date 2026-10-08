import { useState } from 'react'
import { WheelPicker } from '@skills/wheel-picker/assets/WheelPicker'
import { defineCopy, useDemoLang } from '../../demoLang'
import './wheel-picker-demo.css'

// 언어와 무관한 값(시·분·인원 숫자)은 밖에, 휠에 보이는 표기는 COPY의 함수로 만든다
const HOUR_VALUES = Array.from({ length: 11 }, (_, i) => 11 + i)
const MINUTE_VALUES = ['00', '30']
const PARTY_VALUES = Array.from({ length: 8 }, (_, i) => i + 1)

const COPY = defineCopy({
  ko: {
    hourOption: (hour: number) => `${hour}시`,
    minuteOption: (minute: string) => `${minute}분`,
    partyOption: (count: number) => `${count}명`,
    controlsLabel: '휠 피커 옵션',
    visibleCount: '보이는 칸 수',
    rows: (count: number) => `${count}칸`,
    itemHeight: '항목 높이',
    presets: '바로 가기 (외부에서 value 변경)',
    lunch: '점심 12:00',
    dinner: '저녁 19:30',
    note: '휠을 굴리거나(트랙패드·마우스 휠·터치), 항목을 클릭하거나, 포커스한 뒤 방향키·Home/End·PageUp/Down으로 고르세요. 모션 줄이기 설정에서는 기울기·흐림 없이 평평한 목록으로 스냅만 됩니다.',
    title: '성수동 국수집 — 예약',
    hour: '시',
    minute: '분',
    party: '인원',
    result: ({ hour, minute, party }: { hour: number; minute: string; party: string }) => {
      const meridiem = hour < 12 ? `오전 ${hour}시` : hour === 12 ? '낮 12시' : `오후 ${hour - 12}시`
      return (
        <>
          <strong>
            {meridiem} {minute}분
          </strong>
          에 <strong>{party}명</strong> 자리를 잡아둘게요. 칼국수 반죽은 그 시간에 맞춰 치댑니다.
        </>
      )
    },
  },
  en: {
    hourOption: (hour: number) => `${hour > 12 ? hour - 12 : hour} ${hour < 12 ? 'AM' : 'PM'}`,
    // 열 머리(Min·Guests)가 단위를 말해 주니 좁은 휠 칸에는 숫자만 둔다
    minuteOption: (minute: string) => minute,
    partyOption: (count: number) => String(count),
    controlsLabel: 'Wheel picker options',
    visibleCount: 'Visible rows',
    rows: (count: number) => `${count} rows`,
    itemHeight: 'Item height',
    presets: 'Shortcuts (set value from outside)',
    lunch: 'Lunch 12:00 PM',
    dinner: 'Dinner 7:30 PM',
    note: 'Scroll the wheel (trackpad, mouse wheel or touch), click an item, or focus it and use the arrow keys, Home/End and PageUp/Down. With reduced motion on, it becomes a flat list that only snaps, with no tilt or blur.',
    title: 'Seongsu-dong Noodle House: book a table',
    hour: 'Hour',
    minute: 'Min',
    party: 'Guests',
    result: ({ hour, minute, party }: { hour: number; minute: string; party: string }) => (
      <>
        We will hold a table for <strong>{party}</strong> at{' '}
        <strong>
          {hour > 12 ? hour - 12 : hour}:{minute} {hour < 12 ? 'AM' : 'PM'}
        </strong>
        . The knife-cut noodle dough gets kneaded to be ready right then.
      </>
    ),
  },
})

export const WheelPickerDemo = () => {
  const t = COPY[useDemoLang()]
  const [hour, setHour] = useState('18')
  const [minute, setMinute] = useState('30')
  const [partySize, setPartySize] = useState('2')
  const [visibleCount, setVisibleCount] = useState(5)
  const [itemHeight, setItemHeight] = useState(36)

  const wheelProps = { visibleCount, itemHeight }
  const hours = HOUR_VALUES.map((value) => ({ value: String(value), label: t.hourOption(value) }))
  const minutes = MINUTE_VALUES.map((value) => ({ value, label: t.minuteOption(value) }))
  const party = PARTY_VALUES.map((value) => ({ value: String(value), label: t.partyOption(value) }))

  return (
    <div className="playground">
      <section className="controls" aria-label={t.controlsLabel}>
        <label>
          <span>
            {t.visibleCount} <code>--wheel-visible</code>
          </span>
          <input type="range" min={3} max={9} step={2} value={visibleCount} onChange={(e) => setVisibleCount(Number(e.target.value))} />
          <output>{t.rows(visibleCount)}</output>
        </label>
        <label>
          <span>
            {t.itemHeight} <code>--wheel-item-height</code>
          </span>
          <input type="range" min={28} max={52} step={4} value={itemHeight} onChange={(e) => setItemHeight(Number(e.target.value))} />
          <output>{itemHeight}px</output>
        </label>
        <label>
          <span>{t.presets}</span>
          <span className="wheel-demo-presets">
            <button type="button" onClick={() => { setHour('12'); setMinute('00') }}>
              {t.lunch}
            </button>
            <button type="button" onClick={() => { setHour('19'); setMinute('30') }}>
              {t.dinner}
            </button>
          </span>
        </label>
        <p className="controls-note">{t.note}</p>
      </section>

      <div className="wheel-demo-stage">
        <p className="wheel-demo-title">{t.title}</p>
        <div className="wheel-demo-row">
          <div className="wheel-demo-col">
            <span id="wheel-demo-hour" className="wheel-demo-label">
              {t.hour}
            </span>
            <WheelPicker {...wheelProps} aria-labelledby="wheel-demo-hour" options={hours} value={hour} onChange={setHour} />
          </div>
          <div className="wheel-demo-col">
            <span id="wheel-demo-minute" className="wheel-demo-label">
              {t.minute}
            </span>
            <WheelPicker {...wheelProps} aria-labelledby="wheel-demo-minute" options={minutes} value={minute} onChange={setMinute} />
          </div>
          <div className="wheel-demo-col">
            <span id="wheel-demo-party" className="wheel-demo-label">
              {t.party}
            </span>
            <WheelPicker {...wheelProps} aria-labelledby="wheel-demo-party" options={party} value={partySize} onChange={setPartySize} />
          </div>
        </div>
        <p className="wheel-demo-result" aria-live="polite">
          {t.result({ hour: Number(hour), minute, party: partySize })}
        </p>
      </div>
    </div>
  )
}
