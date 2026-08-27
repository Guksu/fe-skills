import { useState } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Select } from '@skills/select/assets/Select'

const OPTIONS = [
  { value: 'somyeon', label: '소면' },
  { value: 'jungmyeon', label: '중면' },
  { value: 'kalguksu', label: '칼국수면' },
]

const Harness = ({ onChange = () => {} }: { onChange?: (value: string) => void }) => {
  const [value, setValue] = useState<string | null>(null)
  return (
    <Select
      options={OPTIONS}
      value={value}
      onChange={(next) => {
        setValue(next)
        onChange(next)
      }}
      placeholder="면 종류 선택"
    />
  )
}

describe('Select — 열림/닫힘·키보드 내비게이션·선택', () => {
  it('클릭으로 열리고 listbox 패널이 data-open이 된다', () => {
    render(<Harness />)
    const trigger = screen.getByRole('combobox')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    fireEvent.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('listbox')).toHaveAttribute('data-open', 'true')
  })

  it('ArrowDown으로 열고 하이라이트를 옮겨 Enter로 선택한다 — onChange 후 닫힘', () => {
    const onChange = vi.fn()
    render(<Harness onChange={onChange} />)
    const trigger = screen.getByRole('combobox')
    fireEvent.keyDown(trigger, { key: 'ArrowDown' }) // 열림 — 하이라이트 첫 항목
    fireEvent.keyDown(trigger, { key: 'ArrowDown' }) // 두 번째 항목으로
    fireEvent.keyDown(trigger, { key: 'Enter' })
    expect(onChange).toHaveBeenCalledWith('jungmyeon')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(trigger).toHaveTextContent('중면')
  })

  it('열린 동안 aria-activedescendant가 하이라이트 옵션을 가리킨다', () => {
    render(<Harness />)
    const trigger = screen.getByRole('combobox')
    fireEvent.keyDown(trigger, { key: 'ArrowDown' })
    const highlighted = screen.getAllByRole('option')[0]
    expect(trigger).toHaveAttribute('aria-activedescendant', highlighted.id)
  })

  it('옵션 클릭으로도 선택된다', () => {
    const onChange = vi.fn()
    render(<Harness onChange={onChange} />)
    fireEvent.click(screen.getByRole('combobox'))
    fireEvent.click(screen.getByRole('option', { name: '칼국수면' }))
    expect(onChange).toHaveBeenCalledWith('kalguksu')
  })

  it('Escape는 선택 없이 닫는다', () => {
    const onChange = vi.fn()
    render(<Harness onChange={onChange} />)
    const trigger = screen.getByRole('combobox')
    fireEvent.click(trigger)
    fireEvent.keyDown(trigger, { key: 'Escape' })
    expect(onChange).not.toHaveBeenCalled()
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })

  it('바깥 포인터다운으로 닫힌다', () => {
    render(<Harness />)
    const trigger = screen.getByRole('combobox')
    fireEvent.click(trigger)
    fireEvent.pointerDown(document.body)
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })

  it('선택된 옵션은 aria-selected로 표시된다', () => {
    render(<Harness />)
    const trigger = screen.getByRole('combobox')
    fireEvent.click(trigger)
    fireEvent.click(screen.getByRole('option', { name: '소면' }))
    fireEvent.click(trigger)
    expect(screen.getByRole('option', { name: /소면/ })).toHaveAttribute('aria-selected', 'true')
  })
})
