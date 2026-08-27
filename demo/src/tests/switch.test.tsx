import { useState } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Switch } from '@skills/switch/assets/Switch'

const Harness = ({ onChange = () => {} }: { onChange?: (checked: boolean) => void }) => {
  const [checked, setChecked] = useState(false)
  return (
    <Switch
      checked={checked}
      onChange={(next) => {
        setChecked(next)
        onChange(next)
      }}
      label="곱빼기"
    />
  )
}

describe('Switch — 네이티브 체크박스 기반 토글', () => {
  it('role=switch로 노출되고 라벨과 연결된다', () => {
    render(<Harness />)
    expect(screen.getByRole('switch', { name: '곱빼기' })).not.toBeChecked()
  })

  it('클릭하면 onChange가 다음 상태를 받고 checked가 바뀐다', () => {
    const onChange = vi.fn()
    render(<Harness onChange={onChange} />)
    const input = screen.getByRole('switch', { name: '곱빼기' })
    fireEvent.click(input)
    expect(onChange).toHaveBeenCalledWith(true)
    expect(input).toBeChecked()
    fireEvent.click(input)
    expect(onChange).toHaveBeenLastCalledWith(false)
  })

  it('disabled가 입력에 전달된다 — 조작 차단은 네이티브 체크박스가 보장한다', () => {
    render(<Switch checked={false} onChange={() => {}} label="파 많이" disabled />)
    expect(screen.getByRole('switch', { name: '파 많이' })).toBeDisabled()
  })
})
