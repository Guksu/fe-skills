import { useState } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { useShake, FieldError } from '@skills/form-shake-error/assets/ShakeField'

const Form = () => {
  const [error, setError] = useState<string>()
  const field = useShake<HTMLInputElement>()
  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault()
        setError('전화번호를 입력해 주세요')
        field.shake()
      }}
    >
      <input ref={field.ref} aria-label="전화번호" aria-invalid={Boolean(error)} aria-describedby="phone-error" />
      <FieldError id="phone-error" message={error} />
      <button type="submit">예약</button>
    </form>
  )
}

describe('useShake + FieldError — 제출 실패 시 흔들림과 메시지', () => {
  it('제출 실패 시 입력에 data-shake가 붙고 aria-invalid가 켜진다', () => {
    render(<Form />)
    fireEvent.click(screen.getByText('예약'))
    const input = screen.getByLabelText('전화번호')
    expect(input).toHaveAttribute('data-shake')
    expect(input).toHaveAttribute('aria-invalid', 'true')
  })

  it('메시지는 항상 DOM에 있고 data-visible로 펼쳐진다 — role=alert로 읽힌다', () => {
    const { container } = render(<Form />)
    const wrap = container.querySelector('.field-error')!
    expect(wrap).toHaveAttribute('data-visible', 'false')
    fireEvent.click(screen.getByText('예약'))
    expect(wrap).toHaveAttribute('data-visible', 'true')
    expect(screen.getByRole('alert')).toHaveTextContent('전화번호를 입력해 주세요')
    expect(screen.getByRole('alert')).toHaveAttribute('id', 'phone-error')
  })
})
