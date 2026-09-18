import { useState } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { segmentThumbFrame, moveSegmentThumb } from '@skills/segmented-control/assets/moveSegmentThumb'
import { SegmentedControl } from '@skills/segmented-control/assets/SegmentedControl'

const NOODLES = [
  { value: 'somyeon', label: '소면' },
  { value: 'kalguksu', label: '칼국수' },
  { value: 'naengmyeon', label: '냉면' },
]

const Harness = ({ onChange = () => {} }: { onChange?: (value: string) => void }) => {
  const [noodle, setNoodle] = useState('somyeon')
  return (
    <SegmentedControl
      name="noodle"
      label="면 종류"
      options={NOODLES}
      value={noodle}
      onChange={(next) => {
        setNoodle(next)
        onChange(next)
      }}
    />
  )
}

const makeSegment = ({ left, width }: { left: number; width: number }) => {
  const el = document.createElement('label')
  Object.defineProperty(el, 'offsetLeft', { value: left })
  Object.defineProperty(el, 'offsetWidth', { value: width })
  return el
}

describe('segmentThumbFrame — 측정값 → thumb 스타일 (순수 계산)', () => {
  it('offsetLeft는 translateX로, offsetWidth는 width로 옮긴다', () => {
    expect(segmentThumbFrame({ offsetLeft: 120, offsetWidth: 80 })).toEqual({
      transform: 'translateX(120px)',
      width: '80px',
    })
  })
})

describe('moveSegmentThumb — thumb를 선택 칸 위치로 이동', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['requestAnimationFrame', 'cancelAnimationFrame'] })
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('immediate면 transition을 껐다가 다음 프레임에 복원한다 (첫 배치가 슬라이드로 보이지 않게)', () => {
    const thumb = document.createElement('span')
    moveSegmentThumb({ thumb, target: makeSegment({ left: 40, width: 60 }), immediate: true })
    expect(thumb.style.transition).toBe('none')
    expect(thumb.style.transform).toBe('translateX(40px)')
    expect(thumb.style.width).toBe('60px')
    vi.advanceTimersByTime(50)
    expect(thumb.style.transition).toBe('')
  })

  it('immediate가 아니면 transition을 건드리지 않는다', () => {
    const thumb = document.createElement('span')
    moveSegmentThumb({ thumb, target: makeSegment({ left: 0, width: 50 }) })
    expect(thumb.style.transition).toBe('')
    expect(thumb.style.transform).toBe('translateX(0px)')
  })
})

describe('SegmentedControl — 네이티브 라디오 그룹 기반 세그먼트', () => {
  it('radiogroup으로 노출되고 옵션마다 라디오가 라벨과 연결된다', () => {
    render(<Harness />)
    expect(screen.getByRole('radiogroup', { name: '면 종류' })).toBeInTheDocument()
    expect(screen.getAllByRole('radio')).toHaveLength(3)
    expect(screen.getByRole('radio', { name: '소면' })).toBeChecked()
    expect(screen.getByRole('radio', { name: '칼국수' })).not.toBeChecked()
  })

  it('칸을 클릭하면 onChange가 값을 받고 선택 상태가 옮겨간다', () => {
    const onChange = vi.fn()
    render(<Harness onChange={onChange} />)
    fireEvent.click(screen.getByRole('radio', { name: '냉면' }))
    expect(onChange).toHaveBeenCalledWith('naengmyeon')
    expect(screen.getByRole('radio', { name: '냉면' })).toBeChecked()
    expect(screen.getByRole('radio', { name: '소면' })).not.toBeChecked()
  })

  it('name이 모든 라디오에 전달되고 thumb는 보조기기에서 숨겨진다', () => {
    const { container } = render(<Harness />)
    screen.getAllByRole('radio').forEach((radio) => expect(radio).toHaveAttribute('name', 'noodle'))
    expect(container.querySelector('.segment-thumb')).toHaveAttribute('aria-hidden', 'true')
  })
})
