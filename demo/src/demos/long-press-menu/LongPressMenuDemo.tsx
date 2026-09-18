import { useState, type CSSProperties } from 'react'
import { LongPressMenu } from '@skills/long-press-menu/assets/LongPressMenu'
import './long-press-menu-demo.css'

type MenuItem = { id: string; emoji: string; name: string; desc: string; price: string }

const MENU: MenuItem[] = [
  { id: 'janchi', emoji: '🍜', name: '잔치국수', desc: '멸치 육수에 소면', price: '7,000원' },
  { id: 'bibim', emoji: '🌶️', name: '비빔국수', desc: '새콤한 양념·오이·달걀', price: '8,000원' },
  { id: 'kal', emoji: '🥣', name: '칼국수', desc: '새벽에 치댄 손반죽', price: '8,500원' },
  { id: 'mandu', emoji: '🥟', name: '손만두', desc: '고기·김치 반반 6알', price: '6,000원' },
  { id: 'kong', emoji: '🥛', name: '콩국수', desc: '여름 한정 · 고소한 콩물', price: '9,000원' },
  { id: 'yeol', emoji: '🔥', name: '열무국수', desc: '살얼음 열무김치 국물', price: '8,000원' },
]

export const LongPressMenuDemo = () => {
  const [delayMs, setDelayMs] = useState(450)
  const [blurPx, setBlurPx] = useState(12)
  const [lastAction, setLastAction] = useState<string | null>(null)
  const [favorites, setFavorites] = useState<string[]>([])
  const [hidden, setHidden] = useState<string[]>([])

  const vars = { '--lpm-blur': `${blurPx}px` } as CSSProperties

  const toggleFavorite = (item: MenuItem) => {
    const already = favorites.includes(item.id)
    setFavorites(already ? favorites.filter((id) => id !== item.id) : [...favorites, item.id])
    setLastAction(`${item.name} ${already ? '즐겨찾기 해제' : '즐겨찾기 추가'}`)
  }

  const visible = MENU.filter((item) => !hidden.includes(item.id))

  return (
    <div className="playground">
      <section className="controls" aria-label="길게 누르기 옵션">
        <label>
          <span>
            누르고 있는 시간 <code>delayMs</code>
          </span>
          <input type="range" min={200} max={1000} step={50} value={delayMs} onChange={(e) => setDelayMs(Number(e.target.value))} />
          <output>{delayMs}ms</output>
        </label>
        <label>
          <span>
            뒤 흐림 <code>--lpm-blur</code>
          </span>
          <input type="range" min={0} max={24} step={2} value={blurPx} onChange={(e) => setBlurPx(Number(e.target.value))} />
          <output>{blurPx}px</output>
        </label>
        <p className="controls-note">
          카드를 길게 누르거나(터치·마우스) 우클릭하면 카드가 떠오르고 옆에 메뉴가 나옵니다. 키보드는 카드에 포커스한 뒤 Shift+F10.
          바깥 클릭·Esc·스크롤로 닫힙니다.
        </p>
      </section>

      <div className="lpm-stage" style={vars}>
        <div className="lpm-grid">
          {visible.map((item) => (
            <LongPressMenu
              key={item.id}
              label={`${item.name} 동작`}
              delayMs={delayMs}
              items={[
                { label: '🛒 장바구니 담기', onSelect: () => setLastAction(`${item.name} 장바구니 담기`) },
                { label: favorites.includes(item.id) ? '💔 즐겨찾기 해제' : '⭐ 즐겨찾기', onSelect: () => toggleFavorite(item) },
                { label: '💬 리뷰 보기', onSelect: () => setLastAction(`${item.name} 리뷰 보기`) },
                {
                  label: '🙈 숨기기',
                  destructive: true,
                  onSelect: () => {
                    setHidden([...hidden, item.id])
                    setLastAction(`${item.name} 숨김`)
                  },
                },
              ]}
            >
              <article className="lpm-card">
                <span className="lpm-card-emoji" aria-hidden="true">
                  {item.emoji}
                </span>
                {favorites.includes(item.id) && (
                  <span className="lpm-card-star" aria-label="즐겨찾기">
                    ⭐
                  </span>
                )}
                <h3>{item.name}</h3>
                <p>{item.desc}</p>
                <strong>{item.price}</strong>
              </article>
            </LongPressMenu>
          ))}
        </div>

        {visible.length === 0 && <p className="lpm-empty">메뉴를 전부 숨겼습니다.</p>}
      </div>

      <div className="lpm-status">
        <p role="status" aria-live="polite">
          마지막 동작: <strong>{lastAction ?? '아직 없음'}</strong>
        </p>
        {hidden.length > 0 && (
          <button type="button" onClick={() => setHidden([])}>
            숨긴 메뉴 {hidden.length}개 다시 보이기
          </button>
        )}
      </div>
    </div>
  )
}
