import { useState } from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { Modal } from '@skills/modal-dialog/assets/Modal'

// jsdom은 showModal/close를 구현하지 않는다 — open 속성만 흉내 낸다
const showModal = vi.fn(function (this: HTMLDialogElement) {
  this.setAttribute('open', '')
})
const close = vi.fn(function (this: HTMLDialogElement) {
  this.removeAttribute('open')
})

const Harness = ({ onClose = () => {}, dismissOnBackdrop }: { onClose?: () => void; dismissOnBackdrop?: boolean }) => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        열기
      </button>
      <Modal
        open={open}
        onClose={() => {
          setOpen(false)
          onClose()
        }}
        labelledBy="title"
        dismissOnBackdrop={dismissOnBackdrop}
      >
        <h2 id="title">주문을 취소할까요?</h2>
        <button type="button">돌아가기</button>
      </Modal>
    </>
  )
}

const dialogEl = () => document.querySelector('dialog')!

describe('Modal — 네이티브 dialog 기반 열림·닫힘 지연·Esc·백드롭', () => {
  beforeAll(() => {
    HTMLDialogElement.prototype.showModal = showModal
    HTMLDialogElement.prototype.close = close
  })
  beforeEach(() => {
    showModal.mockClear()
    close.mockClear()
    vi.useFakeTimers()
  })
  afterEach(() => vi.useRealTimers())

  it('open이 true가 되면 showModal()로 연다 (show()가 아니다)', () => {
    render(<Harness />)
    fireEvent.click(screen.getByText('열기'))
    expect(showModal).toHaveBeenCalledTimes(1)
    expect(dialogEl()).toHaveAttribute('open')
    expect(dialogEl()).toHaveAttribute('aria-labelledby', 'title')
  })

  it('닫을 때 data-closing을 먼저 붙이고, animationend 뒤에야 close()한다', () => {
    render(<Harness />)
    fireEvent.click(screen.getByText('열기'))
    act(() => {
      dialogEl().dispatchEvent(new Event('cancel', { cancelable: true }))
    })
    expect(dialogEl()).toHaveAttribute('data-closing')
    expect(close).not.toHaveBeenCalled()
    fireEvent.animationEnd(dialogEl())
    expect(close).toHaveBeenCalledTimes(1)
    expect(dialogEl()).not.toHaveAttribute('data-closing')
  })

  it('animationend가 오지 않아도 폴백 타이머로 닫힌다', () => {
    render(<Harness />)
    fireEvent.click(screen.getByText('열기'))
    act(() => {
      dialogEl().dispatchEvent(new Event('cancel', { cancelable: true }))
    })
    act(() => {
      vi.advanceTimersByTime(500)
    })
    expect(close).toHaveBeenCalledTimes(1)
  })

  it('Esc(cancel 이벤트)는 기본 닫힘을 막고 onClose로 위임한다', () => {
    const onClose = vi.fn()
    render(<Harness onClose={onClose} />)
    fireEvent.click(screen.getByText('열기'))
    const cancel = new Event('cancel', { cancelable: true })
    act(() => {
      dialogEl().dispatchEvent(cancel)
    })
    expect(cancel.defaultPrevented).toBe(true)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('백드롭 클릭(target이 dialog 자신)만 닫고, 패널 안쪽 클릭은 닫지 않는다', () => {
    const onClose = vi.fn()
    render(<Harness onClose={onClose} />)
    fireEvent.click(screen.getByText('열기'))
    fireEvent.click(screen.getByText('돌아가기'))
    expect(onClose).not.toHaveBeenCalled()
    fireEvent.click(dialogEl())
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('dismissOnBackdrop=false면 백드롭 클릭을 무시한다', () => {
    const onClose = vi.fn()
    render(<Harness onClose={onClose} dismissOnBackdrop={false} />)
    fireEvent.click(screen.getByText('열기'))
    fireEvent.click(dialogEl())
    expect(onClose).not.toHaveBeenCalled()
  })
})
