import { useState } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Checkbox } from '@skills/checkbox-radio/assets/Checkbox'
import { Radio } from '@skills/checkbox-radio/assets/Radio'

const RadioHarness = () => {
  const [noodle, setNoodle] = useState('somyeon')
  return (
    <fieldset>
      <legend>면 종류</legend>
      <Radio name="noodle" value="somyeon" checked={noodle === 'somyeon'} onChange={() => setNoodle('somyeon')} label="소면" />
      <Radio name="noodle" value="kalguksu" checked={noodle === 'kalguksu'} onChange={() => setNoodle('kalguksu')} label="칼국수" />
    </fieldset>
  )
}

describe('Checkbox / Radio — 네이티브 input 기반 선택 입력', () => {
  it('체크박스가 라벨과 연결되고 클릭으로 토글된다', () => {
    const onChange = vi.fn()
    render(<Checkbox label="동의" onChange={onChange} />)
    const input = screen.getByRole('checkbox', { name: '동의' })
    expect(input).not.toBeChecked()
    fireEvent.click(input)
    expect(input).toBeChecked()
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('라디오는 같은 name 안에서 하나만 선택된다', () => {
    render(<RadioHarness />)
    const somyeon = screen.getByRole('radio', { name: '소면' })
    const kalguksu = screen.getByRole('radio', { name: '칼국수' })
    expect(somyeon).toBeChecked()
    fireEvent.click(kalguksu)
    expect(kalguksu).toBeChecked()
    expect(somyeon).not.toBeChecked()
  })

  it('data-kind로 체크박스/라디오 모양이 갈린다 (CSS 훅)', () => {
    const { container } = render(
      <>
        <Checkbox label="a" />
        <Radio name="r" label="b" />
      </>,
    )
    expect(container.querySelector('.check[data-kind="checkbox"] .check-mark')).not.toBeNull()
    expect(container.querySelector('.check[data-kind="radio"] .check-dot')).not.toBeNull()
  })

  it('disabled·name·value가 input에 그대로 전달된다', () => {
    render(<Checkbox label="셀프 리필" name="refill" value="yes" disabled />)
    const input = screen.getByRole('checkbox', { name: '셀프 리필' })
    expect(input).toBeDisabled()
    expect(input).toHaveAttribute('name', 'refill')
    expect(input).toHaveAttribute('value', 'yes')
  })
})
