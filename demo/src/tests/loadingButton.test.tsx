import { render, screen, fireEvent, act } from '@testing-library/react'
import { LoadingButton } from '@skills/loading-button/assets/LoadingButton'

describe('LoadingButton — 제출 버튼 진행 표시', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  /** 대기 중인 프로미스와 타이머를 함께 흘려보낸다 (상태 갱신은 act로 감싼다) */
  const advance = async (ms: number) => {
    await act(async () => {
      await vi.advanceTimersByTimeAsync(ms)
    })
  }

  it('누르면 진행 표시로 바뀌고 aria-disabled가 붙는다', async () => {
    render(
      <LoadingButton onAction={() => new Promise(() => {})} loadingLabel="주문 중">
        주문하기
      </LoadingButton>,
    )
    const button = screen.getByRole('button', { name: '주문하기' })

    fireEvent.click(button)
    await advance(0)

    expect(button).toHaveAttribute('data-status', 'loading')
    expect(button).toHaveAttribute('aria-disabled', 'true')
    expect(screen.getByRole('status')).toHaveTextContent('주문 중')
  })

  it('진행 중에 여러 번 눌러도 작업은 한 번만 실행된다', async () => {
    const onAction = vi.fn(() => new Promise(() => {}))
    render(<LoadingButton onAction={onAction}>주문하기</LoadingButton>)
    const button = screen.getByRole('button', { name: '주문하기' })

    fireEvent.click(button)
    await advance(0)
    fireEvent.click(button)
    fireEvent.click(button)
    await advance(0)

    expect(onAction).toHaveBeenCalledTimes(1)
  })

  it('성공하면 완료 표시를 거쳐 원래 버튼으로 돌아온다', async () => {
    render(
      <LoadingButton onAction={async () => 'ok'} minLoadingMs={400} successHoldMs={1200} successLabel="주문 완료">
        주문하기
      </LoadingButton>,
    )
    const button = screen.getByRole('button', { name: '주문하기' })

    fireEvent.click(button)
    await advance(400)
    expect(button).toHaveAttribute('data-status', 'success')
    expect(screen.getByRole('status')).toHaveTextContent('주문 완료')

    await advance(1200)
    expect(button).toHaveAttribute('data-status', 'idle')
    expect(button).toHaveAttribute('aria-disabled', 'false')
  })

  it('작업이 실패하면 실패 표시로 간다', async () => {
    render(
      <LoadingButton
        onAction={async () => {
          throw new Error('품절')
        }}
        minLoadingMs={0}
        errorLabel="주문 실패"
      >
        주문하기
      </LoadingButton>,
    )

    fireEvent.click(screen.getByRole('button', { name: '주문하기' }))
    await advance(0)

    expect(screen.getByRole('button', { name: '주문하기' })).toHaveAttribute('data-status', 'error')
    expect(screen.getByRole('status')).toHaveTextContent('주문 실패')
  })

  it('상태가 바뀌어도 버튼 이름은 원래 라벨로 고정된다', async () => {
    render(
      <LoadingButton onAction={() => new Promise(() => {})} loadingLabel="주문 중">
        주문하기
      </LoadingButton>,
    )

    // 이름이 '주문하기 주문 중 완료 실패'로 합쳐지거나 '주문 중'으로 바뀌면 이 조회가 실패한다
    const button = screen.getByRole('button', { name: '주문하기' })
    fireEvent.click(button)
    await advance(0)

    expect(screen.getByRole('button', { name: '주문하기' })).toHaveAttribute('data-status', 'loading')
  })
})
