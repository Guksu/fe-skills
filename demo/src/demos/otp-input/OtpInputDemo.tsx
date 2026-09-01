import { useRef, useState, type CSSProperties } from 'react'
import { OtpInput, type OtpHandle } from '@skills/otp-input/assets/OtpInput'
import './otp-input-demo.css'

const CORRECT = '482913'

export const OtpInputDemo = () => {
  const [length, setLength] = useState(6)
  const [cellSize, setCellSize] = useState(48)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [attempts, setAttempts] = useState(0)
  const otp = useRef<OtpHandle>(null)

  const expected = CORRECT.slice(0, length)

  const verify = (code: string) => {
    setAttempts((prev) => prev + 1)
    if (code === expected) {
      setStatus('success')
      return
    }
    setStatus('error')
    otp.current?.shake()
    otp.current?.clear()
  }

  const vars = {
    '--otp-cell-size': `${cellSize}px`,
    '--otp-bg': 'var(--bg)',
    '--otp-color': 'var(--text)',
    '--otp-border': 'var(--border)',
    '--otp-filled-border': 'var(--text-dim)',
    '--otp-accent': 'var(--accent)',
  } as CSSProperties

  const reset = () => {
    setStatus('idle')
    setAttempts(0)
    otp.current?.clear()
  }

  return (
    <div className="playground">
      <section className="controls" aria-label="입력 옵션">
        <label>
          <span>
            칸 수 <code>length</code>
          </span>
          <input type="range" min={4} max={8} step={1} value={length} onChange={(e) => setLength(Number(e.target.value))} />
          <output>{length}칸</output>
        </label>
        <label>
          <span>
            칸 크기 <code>--otp-cell-size</code>
          </span>
          <input type="range" min={36} max={72} step={2} value={cellSize} onChange={(e) => setCellSize(Number(e.target.value))} />
          <output>{cellSize}px</output>
        </label>
        <p className="controls-note">
          <b>{expected}</b>를 입력하면 통과입니다. 한 글자를 치면 다음 칸으로 넘어가고, 빈 칸에서 지우면 앞 칸으로
          돌아갑니다. <b>{expected}</b>를 복사해 아무 칸에나 붙여넣어 보세요 — 칸마다 하나씩 나뉩니다. 틀리면 흔들리고
          비워집니다(마지막 칸을 채우는 순간 자동으로 확인합니다).
        </p>
      </section>

      <div className="otp-stage" style={vars}>
        <h2 className="otp-stage-title">휴대폰 인증</h2>
        <p className="otp-stage-hint">010-••••-1234로 보낸 {length}자리를 입력해 주세요</p>

        {/* key로 칸 수가 바뀔 때 입력을 새로 만든다 — 남은 값이 새 칸 수와 어긋나지 않게 */}
        <OtpInput key={length} ref={otp} length={length} onComplete={verify} autoFocus={false} />

        <p className="otp-message" role="alert" data-status={status}>
          {status === 'error' && '인증번호가 올바르지 않습니다'}
          {status === 'success' && '인증되었습니다 ✓'}
        </p>

        <div className="otp-footer">
          <span>시도 {attempts}회</span>
          <button type="button" onClick={reset}>
            다시 하기
          </button>
        </div>
      </div>
    </div>
  )
}
