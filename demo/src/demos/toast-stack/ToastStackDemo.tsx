import { useRef, useState } from 'react'
import { useToastStack } from '@skills/toast-stack/assets/useToastStack'
import './toast-stack-demo.css'

const MESSAGES = [
  '저장되었습니다 ✓',
  '장바구니에 담았습니다 🛒',
  '주문이 접수되었습니다 🍜',
  '찜 목록에 추가했습니다 ❤️',
  '링크를 복사했습니다 🔗',
]

export const ToastStackDemo = () => {
  const [durationMs, setDurationMs] = useState(3500)
  const { toast } = useToastStack({ durationMs })
  const nextRef = useRef(0)

  const fire = () => {
    toast(MESSAGES[nextRef.current % MESSAGES.length])
    nextRef.current += 1
  }

  return (
    <div className="playground">
      <section className="controls" aria-label="옵션">
        <label>
          <span>
            소멸 시간 <code>durationMs</code>
          </span>
          <input
            type="range"
            min={1500}
            max={8000}
            step={500}
            value={durationMs}
            onChange={(e) => setDurationMs(Number(e.target.value))}
          />
          <output>{(durationMs / 1000).toFixed(1)}s</output>
        </label>
        <p className="controls-note">
          연타해 보세요 — 새 토스트가 기존 것을 밀어 올리며 쌓이고(최대 3개), 각자 시간이 되면
          사라집니다. 화면 하단 중앙을 보세요.
        </p>
      </section>

      <div className="toast-demo-stage">
        <button type="button" onClick={fire}>
          토스트 띄우기
        </button>
        <button
          type="button"
          onClick={() => {
            fire()
            setTimeout(fire, 250)
            setTimeout(fire, 500)
          }}
        >
          3연타
        </button>
      </div>
    </div>
  )
}
