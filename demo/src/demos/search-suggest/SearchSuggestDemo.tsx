import { useState, type CSSProperties, type ReactNode } from 'react'
import { useSearchSuggest } from '@skills/search-suggest/assets/useSearchSuggest'
import './search-suggest-demo.css'

type Menu = { id: string; name: string; price: number; emoji: string }

const MENUS: Menu[] = [
  { id: 'myeolchi', name: '멸치국수', price: 8000, emoji: '🍜' },
  { id: 'bibim', name: '비빔국수', price: 9000, emoji: '🌶️' },
  { id: 'deulkkae', name: '들깨칼국수', price: 10000, emoji: '🥣' },
  { id: 'kong', name: '콩국수', price: 11000, emoji: '🥛' },
  { id: 'janchi', name: '잔치국수', price: 8000, emoji: '🎊' },
  { id: 'kalguksu', name: '바지락칼국수', price: 11000, emoji: '🐚' },
  { id: 'mandu', name: '손만두', price: 7000, emoji: '🥟' },
  { id: 'mandu-guk', name: '만둣국', price: 9000, emoji: '🍲' },
  { id: 'sujebi', name: '수제비', price: 8500, emoji: '🥔' },
  { id: 'naengmyeon', name: '물냉면', price: 10000, emoji: '❄️' },
]

const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/** 검색어와 일치하는 부분만 굵게 — 사용자 입력이 정규식에 들어가므로 이스케이프가 필수다 */
const highlight = ({ text, query }: { text: string; query: string }): ReactNode => {
  const keyword = query.trim()
  if (!keyword) return text
  return text.split(new RegExp(`(${escapeRegExp(keyword)})`, 'gi')).map((part, index) =>
    part.toLowerCase() === keyword.toLowerCase() ? <mark key={index}>{part}</mark> : part,
  )
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const SearchSuggestDemo = () => {
  const [debounceMs, setDebounceMs] = useState(200)
  const [latencyMs, setLatencyMs] = useState(300)
  const [requests, setRequests] = useState(0)
  const [picked, setPicked] = useState<Menu>()

  const search = useSearchSuggest<Menu>({
    debounceMs,
    toText: (menu) => menu.name,
    onSelect: setPicked,
    fetchSuggestions: async ({ query, signal }) => {
      setRequests((prev) => prev + 1)
      await delay(latencyMs)
      // 실제 서비스라면 여기서 fetch(url, { signal })를 호출한다 — 취소가 실제로 동작하려면 signal을 넘겨야 한다
      if (signal.aborted) throw new DOMException('Aborted', 'AbortError')
      return MENUS.filter((menu) => menu.name.includes(query.trim()))
    },
  })

  const vars = {
    '--suggest-bg': 'var(--surface)',
    '--suggest-color': 'var(--text)',
    '--suggest-border': 'var(--border)',
    '--suggest-accent': 'var(--accent)',
    '--suggest-active-bg': 'var(--accent-soft)',
    '--suggest-dim': 'var(--text-dim)',
  } as CSSProperties

  return (
    <div className="playground">
      <section className="controls" aria-label="검색 옵션">
        <label>
          <span>
            기다리는 시간 <code>debounceMs</code>
          </span>
          <input type="range" min={0} max={600} step={50} value={debounceMs} onChange={(e) => setDebounceMs(Number(e.target.value))} />
          <output>{debounceMs}ms</output>
        </label>
        <label>
          <span>
            서버 응답 지연 <code>latency</code>
          </span>
          <input type="range" min={0} max={1500} step={100} value={latencyMs} onChange={(e) => setLatencyMs(Number(e.target.value))} />
          <output>{latencyMs}ms</output>
        </label>
        <p className="controls-note">
          <b>국수</b>나 <b>만두</b>를 쳐 보세요. 기다리는 시간을 0으로 내리면 글자마다 요청이 나가고(아래 <b>요청</b>{' '}
          수), 200ms면 멈춘 뒤 한 번만 나갑니다. 지연을 1초 넘게 올리고 빠르게 지웠다 다시 쳐도 <b>옛 응답이 최신 목록을
          덮지 않습니다</b>. 방향키로 고르고 Enter로 선택합니다.
        </p>
      </section>

      <div className="ss-stage" style={vars}>
        <div className="suggest-root ss-field">
          <input {...search.inputProps} className="suggest-input" placeholder="메뉴 검색" aria-label="메뉴 검색" />

          {search.isOpen && (
            <ul {...search.listProps} className="suggest-panel">
              {search.status === 'loading' && <li className="suggest-message">찾는 중…</li>}
              {search.status === 'error' && <li className="suggest-message">불러오지 못했습니다</li>}
              {search.items.map((menu, index) => (
                <li key={menu.id} {...search.getOptionProps(index)} className="suggest-option">
                  <span aria-hidden="true">{menu.emoji}</span>
                  <span className="ss-option-name">{highlight({ text: menu.name, query: search.query })}</span>
                  <span className="ss-option-price">{menu.price.toLocaleString('ko-KR')}원</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="ss-footer">
          <span>서버 요청 {requests}회</span>
          <span>{picked ? `선택: ${picked.emoji} ${picked.name}` : '아직 고르지 않았습니다'}</span>
          <button type="button" onClick={() => setRequests(0)}>
            요청 수 초기화
          </button>
        </div>
      </div>
    </div>
  )
}
