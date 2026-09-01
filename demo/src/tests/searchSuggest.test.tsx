import { act, fireEvent, render, screen } from '@testing-library/react'
import { useSearchSuggest } from '@skills/search-suggest/assets/useSearchSuggest'

type Menu = { id: string; name: string }

const MENUS: Menu[] = [
  { id: 'myeolchi', name: '멸치국수' },
  { id: 'bibim', name: '비빔국수' },
  { id: 'kong', name: '콩국수' },
]

const Harness = ({ onSelect = () => {} }: { onSelect?: (menu: Menu) => void }) => {
  const search = useSearchSuggest<Menu>({
    debounceMs: 0,
    toText: (menu) => menu.name,
    onSelect,
    fetchSuggestions: async ({ query }) => MENUS.filter((menu) => menu.name.includes(query)),
  })

  return (
    <div className="suggest-root">
      <input {...search.inputProps} aria-label="메뉴 검색" />
      {search.isOpen && (
        <ul {...search.listProps}>
          {search.items.map((menu, index) => (
            <li key={menu.id} {...search.getOptionProps(index)}>
              {menu.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

describe('useSearchSuggest — 콤보박스 조작과 ARIA', () => {
  const input = () => screen.getByRole('combobox', { name: '메뉴 검색' })

  /** 글자를 치고 디바운스 타이머와 응답이 모두 흘러가게 둔다 */
  const type = async (value: string) => {
    fireEvent.change(input(), { target: { value } })
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 20))
    })
  }

  it('입력하면 제안 목록이 열리고 콤보박스로 연결된다', async () => {
    render(<Harness />)
    await type('국수')

    const list = screen.getByRole('listbox')
    expect(input()).toHaveAttribute('aria-expanded', 'true')
    expect(input()).toHaveAttribute('aria-controls', list.id)
    expect(screen.getAllByRole('option')).toHaveLength(3)
  })

  it('방향키로 고르면 포커스는 입력창에 남고 활성 항목만 가리킨다', async () => {
    render(<Harness />)
    await type('국수')

    fireEvent.keyDown(input(), { key: 'ArrowDown' })
    const options = screen.getAllByRole('option')
    expect(options[0]).toHaveAttribute('aria-selected', 'true')
    expect(input()).toHaveAttribute('aria-activedescendant', options[0].id)
    expect(document.activeElement).not.toBe(options[0])
  })

  it('목록 끝에서 다시 내리면 처음으로 감긴다', async () => {
    render(<Harness />)
    await type('국수')

    fireEvent.keyDown(input(), { key: 'ArrowUp' }) // 위로 먼저 = 마지막 항목
    expect(screen.getAllByRole('option')[2]).toHaveAttribute('aria-selected', 'true')

    fireEvent.keyDown(input(), { key: 'ArrowDown' })
    expect(screen.getAllByRole('option')[0]).toHaveAttribute('aria-selected', 'true')
  })

  it('Enter로 고르면 입력창이 그 값으로 채워지고 목록이 닫힌다', async () => {
    const onSelect = vi.fn()
    render(<Harness onSelect={onSelect} />)
    await type('국수')

    fireEvent.keyDown(input(), { key: 'ArrowDown' })
    fireEvent.keyDown(input(), { key: 'Enter' })

    expect(onSelect).toHaveBeenCalledWith(MENUS[0])
    expect(input()).toHaveValue('멸치국수')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('고르지 않은 채 Enter를 누르면 아무 일도 하지 않는다 (폼 제출은 그대로)', async () => {
    const onSelect = vi.fn()
    render(<Harness onSelect={onSelect} />)
    await type('국수')

    const event = fireEvent.keyDown(input(), { key: 'Enter' })
    expect(onSelect).not.toHaveBeenCalled()
    expect(event).toBe(true) // preventDefault가 걸리지 않았다
  })

  it('Escape로 목록을 닫는다 — 입력한 글자는 남는다', async () => {
    render(<Harness />)
    await type('국수')

    fireEvent.keyDown(input(), { key: 'Escape' })
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    expect(input()).toHaveValue('국수')
  })

  it('항목을 누르면 선택된다 — click이 아니라 mousedown에서 (blur가 먼저 와도 놓치지 않게)', async () => {
    const onSelect = vi.fn()
    render(<Harness onSelect={onSelect} />)
    await type('국수')

    fireEvent.mouseDown(screen.getAllByRole('option')[1])
    expect(onSelect).toHaveBeenCalledWith(MENUS[1])
  })

  it('입력을 지우면 목록이 닫힌다', async () => {
    render(<Harness />)
    await type('국수')
    expect(screen.getByRole('listbox')).toBeInTheDocument()

    await type('')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })
})
