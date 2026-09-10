import { useState } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { RangeSlider, type RangeValue } from '@skills/range-slider/assets/RangeSlider'

const Harness = ({ minDistance, onChange }: { minDistance?: number; onChange?: (v: RangeValue) => void }) => {
  const [value, setValue] = useState<RangeValue>({ lower: 10000, upper: 40000 })
  return (
    <RangeSlider
      min={0}
      max={50000}
      step={1000}
      value={value}
      minDistance={minDistance}
      label={{ lower: '최저 가격', upper: '최고 가격' }}
      format={(v) => `${v.toLocaleString('ko-KR')}원`}
      onChange={(next) => {
        setValue(next)
        onChange?.(next)
      }}
    />
  )
}

describe('RangeSlider — 네이티브 input 두 개로 만든 범위 슬라이더', () => {
  const lower = () => screen.getByRole('slider', { name: '최저 가격' })
  const upper = () => screen.getByRole('slider', { name: '최고 가격' })

  it('두 손잡이가 각각 slider로 노출되고 값이 문구로 읽힌다', () => {
    render(<Harness />)

    expect(lower()).toHaveValue('10000')
    expect(lower()).toHaveAttribute('aria-valuetext', '10,000원')
    expect(upper()).toHaveAttribute('aria-valuetext', '40,000원')
  })

  it('값을 바꾸면 눈금에 맞춰 반영된다', () => {
    const onChange = vi.fn()
    render(<Harness onChange={onChange} />)

    fireEvent.change(lower(), { target: { value: '12400' } })
    expect(onChange).toHaveBeenCalledWith({ lower: 12000, upper: 40000 })
  })

  it('아래 손잡이를 위 손잡이 너머로 올려도 위쪽은 그대로다 — 자기가 멈춘다', () => {
    const onChange = vi.fn()
    render(<Harness onChange={onChange} />)

    fireEvent.change(lower(), { target: { value: '45000' } })
    expect(onChange).toHaveBeenCalledWith({ lower: 40000, upper: 40000 })
  })

  it('최소 간격을 주면 그만큼 떨어져 멈춘다', () => {
    const onChange = vi.fn()
    render(<Harness minDistance={5000} onChange={onChange} />)

    fireEvent.change(upper(), { target: { value: '8000' } })
    expect(onChange).toHaveBeenCalledWith({ lower: 10000, upper: 15000 })
  })

  it('고른 구간이 CSS 변수로 나가 채움 막대가 그려진다', () => {
    const { container } = render(<Harness />)
    const root = container.querySelector('.range-root') as HTMLElement

    expect(root.style.getPropertyValue('--range-lower')).toBe('20%')
    expect(root.style.getPropertyValue('--range-upper')).toBe('80%')
  })

  it('두 손잡이가 오른쪽 끝에 겹치면 아래쪽을 위로 올린다 (왼쪽으로 끌 수 있게)', () => {
    const { container } = render(<Harness />)
    const root = container.querySelector('.range-root') as HTMLElement

    fireEvent.change(lower(), { target: { value: '50000' } })
    expect(root.dataset.onTop).toBe('lower')
  })
})
