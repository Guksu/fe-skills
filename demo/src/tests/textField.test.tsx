import { useState } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { TextField } from '@skills/floating-label/assets/TextField'

const Harness = () => {
  const [value, setValue] = useState('')
  return <TextField label="이름" value={value} onChange={(e) => setValue(e.target.value)} />
}

describe('TextField — 플로팅 라벨 배선', () => {
  it('라벨이 input과 htmlFor로 연결된다', () => {
    render(<Harness />)
    expect(screen.getByLabelText('이름')).toBeInstanceOf(HTMLInputElement)
  })

  it('placeholder는 항상 한 칸 공백이다 — :placeholder-shown 판정의 전제', () => {
    render(<Harness />)
    expect(screen.getByLabelText('이름')).toHaveAttribute('placeholder', ' ')
  })

  it('입력값이 반영된다 (controlled)', () => {
    render(<Harness />)
    const input = screen.getByLabelText('이름')
    fireEvent.change(input, { target: { value: '김국수' } })
    expect(input).toHaveValue('김국수')
  })

  it('외부 id를 주면 그 id로 연결된다', () => {
    render(<TextField label="연락처" id="phone" defaultValue="" />)
    expect(screen.getByLabelText('연락처')).toHaveAttribute('id', 'phone')
  })
})
