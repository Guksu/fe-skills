import { useState, type CSSProperties, type FormEvent } from 'react'
import { useShake, FieldError } from '@skills/form-shake-error/assets/ShakeField'
import './form-shake-error-demo.css'

const PHONE_PATTERN = /^01\d-\d{3,4}-\d{4}$/

export const FormShakeErrorDemo = () => {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [nameError, setNameError] = useState<string>()
  const [phoneError, setPhoneError] = useState<string>()
  const [distancePx, setDistancePx] = useState(6)
  const [shakeWholeForm, setShakeWholeForm] = useState(false)
  const [log, setLog] = useState('빈 채로 예약을 눌러 보세요.')

  const nameField = useShake<HTMLInputElement>()
  const phoneField = useShake<HTMLInputElement>()
  const form = useShake<HTMLFormElement>()

  const vars = { '--shake-distance': `${distancePx}px` } as CSSProperties

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const nextNameError = name.trim() ? undefined : '예약자 이름을 입력해 주세요'
    const nextPhoneError = PHONE_PATTERN.test(phone) ? undefined : '010-1234-5678 형식으로 입력해 주세요'
    setNameError(nextNameError)
    setPhoneError(nextPhoneError)

    if (!nextNameError && !nextPhoneError) {
      setLog(`${name}님, 예약이 접수되었습니다 🍜`)
      return
    }
    setLog('입력을 확인해 주세요.')
    if (shakeWholeForm) {
      form.shake()
    } else {
      if (nextNameError) nameField.shake()
      if (nextPhoneError) phoneField.shake()
    }
    // 첫 번째 오류 입력으로 포커스 — 키보드·스크린 리더 사용자가 곧바로 고칠 수 있다
    ;(nextNameError ? nameField : phoneField).ref.current?.focus()
  }

  return (
    <div className="playground">
      <section className="controls" aria-label="애니메이션 옵션">
        <label>
          <span>
            세기 <code>--shake-distance</code>
          </span>
          <input type="range" min={2} max={14} step={1} value={distancePx} onChange={(e) => setDistancePx(Number(e.target.value))} />
          <output>{distancePx}px</output>
        </label>
        <label className="controls-inline">
          <input type="checkbox" checked={shakeWholeForm} onChange={(e) => setShakeWholeForm(e.target.checked)} />
          <span>입력 대신 폼 전체를 흔들기</span>
        </label>
        <p className="controls-note">
          연속으로 여러 번 눌러 보세요 — 흔들리는 도중에 다시 틀려도 매번 처음부터 다시 흔들립니다(코어가 재시작을 보장).
          흔들림과 함께 테두리가 붉어지고 메시지가 밀려 올라옵니다.
        </p>
      </section>

      <form ref={form.ref} className="shake-stage" style={vars} onSubmit={handleSubmit} noValidate>
        <h2 className="shake-stage-title">국수공방 예약</h2>

        <div className="shake-field">
          <label htmlFor="shake-name">예약자 이름</label>
          <input
            id="shake-name"
            ref={nameField.ref}
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={Boolean(nameError)}
            aria-describedby="shake-name-error"
            autoComplete="off"
          />
          <FieldError id="shake-name-error" message={nameError} />
        </div>

        <div className="shake-field">
          <label htmlFor="shake-phone">전화번호</label>
          <input
            id="shake-phone"
            ref={phoneField.ref}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            aria-invalid={Boolean(phoneError)}
            aria-describedby="shake-phone-error"
            inputMode="tel"
            autoComplete="off"
          />
          <FieldError id="shake-phone-error" message={phoneError} />
        </div>

        <button type="submit">예약하기</button>
        <p className="shake-log" aria-live="polite">
          {log}
        </p>
      </form>
    </div>
  )
}
