import { useState } from 'react'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { QuantityStepper } from '@skills/quantity-stepper/assets/QuantityStepper'

const Harness = ({
  initial = 1,
  min,
  max,
  step,
  onBelowMin,
  onChange,
}: {
  initial?: number
  min?: number
  max?: number
  step?: number
  onBelowMin?: () => void
  onChange?: (v: number) => void
}) => {
  const [value, setValue] = useState(initial)
  return (
    <QuantityStepper
      value={value}
      min={min}
      max={max}
      step={step}
      label="멸치국수 수량"
      onBelowMin={onBelowMin}
      onChange={(next) => {
        setValue(next)
        onChange?.(next)
      }}
    />
  )
}

describe('QuantityStepper — 수량 조절과 경계', () => {
  const plus = () => screen.getByRole('button', { name: '멸치국수 수량 늘리기' })
  const minus = () => screen.queryByRole('button', { name: '멸치국수 수량 줄이기' })
  const field = () => screen.getByRole('textbox', { name: '멸치국수 수량' })

  it('+를 누르면 늘고 −를 누르면 준다', () => {
    render(<Harness initial={2} />)

    fireEvent.pointerDown(plus())
    fireEvent.pointerUp(plus())
    expect(field()).toHaveValue('3')

    fireEvent.pointerDown(minus()!)
    fireEvent.pointerUp(minus()!)
    expect(field()).toHaveValue('2')
  })

  it('최댓값에서는 더 늘지 않고 버튼이 끝임을 알린다', () => {
    render(<Harness initial={5} max={5} />)

    expect(plus()).toHaveAttribute('aria-disabled', 'true')
    fireEvent.pointerDown(plus())
    expect(field()).toHaveValue('5')
  })

  it('최솟값에서는 더 줄지 않는다', () => {
    render(<Harness initial={1} min={1} />)

    expect(minus()).toHaveAttribute('aria-disabled', 'true')
    fireEvent.pointerDown(minus()!)
    expect(field()).toHaveValue('1')
  })

  it('onBelowMin을 주면 최솟값에서 −가 삭제로 바뀐다 (장바구니 관례)', () => {
    const onBelowMin = vi.fn()
    render(<Harness initial={1} min={1} onBelowMin={onBelowMin} />)

    const remove = screen.getByRole('button', { name: '멸치국수 수량 삭제' })
    expect(remove).not.toHaveAttribute('aria-disabled')

    fireEvent.pointerDown(remove)
    expect(onBelowMin).toHaveBeenCalledTimes(1)
    expect(field()).toHaveValue('1')
  })

  it('누르고 있으면 반복해서 올라가고, 떼면 멈춘다', () => {
    vi.useFakeTimers()
    render(<Harness initial={1} max={99} />)

    fireEvent.pointerDown(plus())
    expect(field()).toHaveValue('2') // 첫 실행은 누르는 즉시

    act(() => {
      vi.advanceTimersByTime(400) // 지연 뒤 첫 반복
      vi.advanceTimersByTime(500) // 그 뒤로 몇 번 더
    })
    const held = Number((field() as HTMLInputElement).value)
    expect(held).toBeGreaterThan(3)

    fireEvent.pointerUp(plus())
    act(() => {
      vi.advanceTimersByTime(2000)
    })
    expect(field()).toHaveValue(String(held))
    vi.useRealTimers()
  })

  it('손가락이 버튼 밖으로 나가도 멈춘다', () => {
    vi.useFakeTimers()
    render(<Harness initial={1} />)

    fireEvent.pointerDown(plus())
    fireEvent.pointerLeave(plus())
    act(() => {
      vi.advanceTimersByTime(2000)
    })

    expect(field()).toHaveValue('2')
    vi.useRealTimers()
  })

  it('숫자를 직접 입력하면 눈금과 범위에 맞춰 정리된다', () => {
    render(<Harness initial={1} min={1} max={20} step={2} />)

    fireEvent.change(field(), { target: { value: '15' } })
    fireEvent.blur(field())
    expect(field()).toHaveValue('15') // 1에서 2씩 → 15는 눈금 위

    fireEvent.change(field(), { target: { value: '999' } })
    fireEvent.blur(field())
    expect(field()).toHaveValue('19') // 최댓값 20 아래의 눈금
  })

  it('알아볼 수 없는 입력은 원래 값으로 되돌린다', () => {
    render(<Harness initial={3} />)

    fireEvent.change(field(), { target: { value: '곱빼기' } })
    fireEvent.blur(field())
    expect(field()).toHaveValue('3')
  })

  it('입력 칸에서 방향키로도 조절된다', () => {
    render(<Harness initial={3} />)

    fireEvent.keyDown(field(), { key: 'ArrowUp' })
    expect(field()).toHaveValue('4')

    fireEvent.keyDown(field(), { key: 'ArrowDown' })
    expect(field()).toHaveValue('3')
  })
})
