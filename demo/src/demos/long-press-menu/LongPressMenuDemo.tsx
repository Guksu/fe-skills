import { useState, type CSSProperties } from 'react'
import { LongPressMenu } from '@skills/long-press-menu/assets/LongPressMenu'
import { Icon } from '../../shared/Icon'
import { DishPhoto } from '../../shared/DishPhoto'
import type { DishId } from '../../shared/dishes'
import './long-press-menu-demo.css'

type MenuItem = { id: string; dish: DishId; name: string; desc: string; price: string }

const MENU: MenuItem[] = [
  { id: 'janchi', dish: 'janchi', name: '잔치국수', desc: '멸치 육수에 소면', price: '7,000원' },
  { id: 'bibim', dish: 'bibim', name: '비빔국수', desc: '새콤한 양념·오이·달걀', price: '8,000원' },
  { id: 'kal', dish: 'kalguksu', name: '칼국수', desc: '새벽에 치댄 손반죽', price: '8,500원' },
  { id: 'mandu', dish: 'mandu', name: '손만두', desc: '고기·김치 반반 6알', price: '6,000원' },
  { id: 'kong', dish: 'kong', name: '콩국수', desc: '여름 한정 · 고소한 콩물', price: '9,000원' },
  { id: 'bajirak', dish: 'bajirak', name: '바지락칼국수', desc: '바지락 듬뿍 · 시원한 국물', price: '9,500원' },
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
                { label: <><Icon name="cart" /> 장바구니 담기</>, onSelect: () => setLastAction(`${item.name} 장바구니 담기`) },
                {
                  // 해제는 채운 별로 지금 상태를 보인다 — 같은 모양을 채우고 비우는 것으로 켜짐·꺼짐을 구분한다
                  label: favorites.includes(item.id) ? <><Icon name="star" filled /> 즐겨찾기 해제</> : <><Icon name="star" /> 즐겨찾기</>,
                  onSelect: () => toggleFavorite(item),
                },
                { label: <><Icon name="message" /> 리뷰 보기</>, onSelect: () => setLastAction(`${item.name} 리뷰 보기`) },
                {
                  label: <><Icon name="eye-off" /> 숨기기</>,
                  destructive: true,
                  onSelect: () => {
                    setHidden([...hidden, item.id])
                    setLastAction(`${item.name} 숨김`)
                  },
                },
              ]}
            >
              {/* layout-audit-ignore: nested-card — 무대는 흐려질 배경이고, 카드는 길게 눌러 떠오르는 주인공이다 */}
              <article className="lpm-card">
                <DishPhoto dish={item.dish} className="lpm-card-photo" />
                {/* 즐겨찾기 표시는 사진 위가 아니라 이름 옆에 — 사진마다 밝기가 달라 위에 얹으면 안 보일 때가 있다 */}
                <h3>
                  {item.name}
                  {favorites.includes(item.id) && (
                    <span className="lpm-card-star" role="img" aria-label="즐겨찾기">
                      <Icon name="star" filled />
                    </span>
                  )}
                </h3>
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
