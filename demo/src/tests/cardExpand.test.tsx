import { useRef } from 'react'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { useCardExpand } from '@skills/card-expand/assets/useCardExpand'

const CARDS = [
  { id: 'janchi', title: '잔치국수' },
  { id: 'bibim', title: '비빔국수' },
]

/** expand/collapse는 전환 완료를 기다리는 async 함수다 — 잠금(busy)이 풀리는 마이크로태스크 한 틱을 흘려보낸다 */
const settle = () => act(async () => {})

/** 훅을 쓰는 최소 화면 — 목록 + 상세. jsdom에는 View Transitions가 없으므로 코어의 폴백(즉시 교체)으로 돈다 */
const Screen = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const detailRef = useRef<HTMLElement>(null)
  const { expandedId, expand, collapse } = useCardExpand({ containerRef, detailRef })
  const current = CARDS.find((card) => card.id === expandedId)

  return (
    <div ref={containerRef} className="card-expand-container">
      <ul inert={expandedId !== null} data-testid="list">
        {CARDS.map((card) => (
          <li key={card.id}>
            <button type="button" data-card-id={card.id} onClick={(event) => expand({ id: card.id, card: event.currentTarget })}>
              <span data-card-expand-part="title">{card.title}</span>
            </button>
          </li>
        ))}
      </ul>
      {current && (
        <article ref={detailRef} role="dialog" aria-label={current.title} className="card-expand-detail">
          <button type="button" className="card-expand-close" aria-label="닫기" onClick={collapse}>
            ×
          </button>
          <p>{current.title} 상세</p>
        </article>
      )}
    </div>
  )
}

describe('useCardExpand — 카드를 누르면 상세가 열리고, Esc·닫기로 돌아온다', () => {
  it('카드를 누르면 상세가 열리고 목록은 inert가 되며, Esc로 닫힌다', async () => {
    render(<Screen />)

    expect(screen.queryByRole('dialog')).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: '잔치국수' }))

    expect(screen.getByRole('dialog', { name: '잔치국수' })).toBeInTheDocument()
    expect(screen.getByTestId('list')).toHaveAttribute('inert')
    await settle()

    fireEvent.keyDown(window, { key: 'Escape' })
    await settle()
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(screen.getByTestId('list')).not.toHaveAttribute('inert')
  })

  it('닫기 버튼으로도 닫히고, 상세가 없을 때 Esc는 아무 일도 하지 않는다', async () => {
    render(<Screen />)

    fireEvent.keyDown(window, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).toBeNull()

    fireEvent.click(screen.getByRole('button', { name: '비빔국수' }))
    expect(screen.getByRole('dialog', { name: '비빔국수' })).toBeInTheDocument()
    await settle()

    fireEvent.click(screen.getByRole('button', { name: '닫기' }))
    await settle()
    expect(screen.queryByRole('dialog')).toBeNull()
  })
})
