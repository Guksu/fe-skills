import { useState } from 'react'
import { BottomSheet } from '@skills/bottom-sheet/assets/BottomSheet'
import './bottom-sheet-demo.css'

const MENU = [
  { emoji: '🍜', label: '주문하기', hint: '오늘의 국수 메뉴 보기' },
  { emoji: '❤️', label: '찜하기', hint: '이 가게를 찜 목록에 추가' },
  { emoji: '📞', label: '전화 걸기', hint: '가게에 직접 문의' },
  { emoji: '🔗', label: '공유하기', hint: '링크 복사' },
]

const SNAP_OFFSETS = [0, 240]

export const BottomSheetDemo = () => {
  const [open, setOpen] = useState(false)
  const [thresholdPx, setThresholdPx] = useState(120)
  const [useSnaps, setUseSnaps] = useState(false)
  const [lastAction, setLastAction] = useState<string | null>(null)

  return (
    <div className="playground">
      <section className="controls" aria-label="애니메이션 옵션">
        <label>
          <span>
            닫기 임계 거리 <code>dismissThresholdPx</code>
          </span>
          <input
            type="range"
            min={60}
            max={300}
            step={20}
            value={thresholdPx}
            onChange={(e) => setThresholdPx(Number(e.target.value))}
          />
          <output>{thresholdPx}px</output>
        </label>
        <label>
          <span>
            스냅 포인트 <code>snapOffsetsPx</code>
          </span>
          <span className="controls-inline">
            <input
              type="checkbox"
              checked={useSnaps}
              onChange={(e) => setUseSnaps(e.target.checked)}
            />
            <output>{useSnaps ? '반열림 ↔ 전체 열림' : '끔'}</output>
          </span>
        </label>
        <p className="controls-note">
          시트를 잡고 끌어보세요 — 스냅 포인트를 켜면 반열림에서 시작해 위로 끌면 전체 열림,
          마지막 스냅 아래로 끌거나 던지면 닫힙니다. 백드롭 클릭·Esc로도 닫힙니다.
        </p>
      </section>

      <div className="sheet-demo-stage">
        <button type="button" onClick={() => setOpen(true)}>
          바텀시트 열기
        </button>
        {lastAction && <p className="sheet-demo-result">마지막 선택: {lastAction}</p>}
      </div>

      <BottomSheet
        open={open}
        onClose={() => setOpen(false)}
        dismissThresholdPx={thresholdPx}
        snapOffsetsPx={useSnaps ? SNAP_OFFSETS : undefined}
        className="demo-sheet"
      >
        <ul className="sheet-menu">
          {MENU.map((item) => (
            <li key={item.label}>
              <button
                type="button"
                onClick={() => {
                  setLastAction(item.label)
                  setOpen(false)
                }}
              >
                <span className="sheet-menu-emoji">{item.emoji}</span>
                <span>
                  <strong>{item.label}</strong>
                  <small>{item.hint}</small>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </BottomSheet>
    </div>
  )
}
