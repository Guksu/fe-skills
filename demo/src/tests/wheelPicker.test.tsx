import { useState } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { WheelPicker } from '@skills/wheel-picker/assets/WheelPicker'

const HOURS = Array.from({ length: 11 }, (_, i) => ({ value: String(11 + i), label: `${11 + i}시` }))

const Harness = ({ onChange = () => {} }: { onChange?: (value: string) => void }) => {
  const [value, setValue] = useState('13')
  return (
    <WheelPicker
      aria-label="예약 시"
      options={HOURS}
      value={value}
      itemHeight={40}
      onChange={(next) => {
        setValue(next)
        onChange(next)
      }}
    />
  )
}

describe('WheelPicker — listbox 역할·키보드·클릭 선택', () => {
  // jsdom에는 Element.scrollTo가 없다 — 호출 인자만 검증한다
  const scrollTo = vi.fn()
  beforeAll(() => {
    Element.prototype.scrollTo = scrollTo as unknown as typeof Element.prototype.scrollTo
  })
  beforeEach(() => scrollTo.mockClear())

  it('listbox/option 역할을 갖고, 선택 항목이 aria-selected·aria-activedescendant로 표시된다', () => {
    render(<Harness />)
    const listbox = screen.getByRole('listbox', { name: '예약 시' })
    expect(listbox).toHaveAttribute('tabindex', '0')
    const selected = screen.getByRole('option', { name: '13시' })
    expect(selected).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('option', { name: '11시' })).toHaveAttribute('aria-selected', 'false')
    expect(listbox).toHaveAttribute('aria-activedescendant', selected.id)
    // 초기 값 위치로 즉시(애니메이션 없이) 스크롤한다
    expect(scrollTo).toHaveBeenCalledWith({ top: 80, behavior: 'instant' })
  })

  it('ArrowDown/ArrowUp·End로 값이 바뀌고 해당 위치로 부드럽게 스크롤한다', () => {
    const onChange = vi.fn()
    render(<Harness onChange={onChange} />)
    const listbox = screen.getByRole('listbox')
    fireEvent.keyDown(listbox, { key: 'ArrowDown' })
    expect(onChange).toHaveBeenLastCalledWith('14')
    expect(scrollTo).toHaveBeenLastCalledWith({ top: 120, behavior: 'smooth' })
    fireEvent.keyDown(listbox, { key: 'ArrowUp' })
    expect(onChange).toHaveBeenLastCalledWith('13')
    fireEvent.keyDown(listbox, { key: 'End' })
    expect(onChange).toHaveBeenLastCalledWith('21')
    expect(screen.getByRole('option', { name: '21시' })).toHaveAttribute('aria-selected', 'true')
    expect(onChange).toHaveBeenCalledTimes(3)
  })

  it('항목 클릭으로 그 항목이 선택된다 (마우스 사용자 대안)', () => {
    const onChange = vi.fn()
    render(<Harness onChange={onChange} />)
    fireEvent.click(screen.getByRole('option', { name: '18시' }))
    expect(onChange).toHaveBeenCalledWith('18')
    expect(scrollTo).toHaveBeenLastCalledWith({ top: 280, behavior: 'smooth' })
  })
})
