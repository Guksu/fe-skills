import { useRef, useState } from 'react'
import { ThemeToggle } from '@skills/theme-toggle/assets/ThemeToggle'
import './theme-toggle-demo.css'

const MENUS = [
  { id: 'myeolchi', name: '멸치국수', price: 8000, emoji: '🍜' },
  { id: 'bibim', name: '비빔국수', price: 9000, emoji: '🌶️' },
  { id: 'deulkkae', name: '들깨칼국수', price: 10000, emoji: '🥣' },
]

export const ThemeToggleDemo = () => {
  const [durationMs, setDurationMs] = useState(450)
  const cardRef = useRef<HTMLDivElement>(null)

  return (
    <div className="playground">
      <section className="controls" aria-label="전환 옵션">
        <label>
          <span>
            원이 퍼지는 시간 <code>durationMs</code>
          </span>
          <input type="range" min={150} max={900} step={50} value={durationMs} onChange={(e) => setDurationMs(Number(e.target.value))} />
          <output>{durationMs}ms</output>
        </label>
        <p className="controls-note">
          해/달 버튼을 눌러 보세요 — 누른 지점에서 원이 퍼지며 테마가 덮입니다. 버튼 위치를 바꿔 눌러도 원은 항상 누른
          자리에서 시작합니다. 이 데모는 <code>scopeRef</code>로 <b>미리보기 카드만</b> 전환합니다(실제 서비스에서는
          보통 화면 전체입니다). 선택은 브라우저에 저장돼 새로고침해도 유지됩니다.
        </p>
      </section>

      <div className="tt-stage">
        <div className="tt-card" ref={cardRef}>
          <header className="tt-card-head">
            <div>
              <strong className="tt-card-title">성수동 손칼국수</strong>
              <p className="tt-card-sub">성수동 2가 · 영업 중</p>
            </div>
            <ThemeToggle scopeRef={cardRef} durationMs={durationMs} storageKey="fe-skills-demo-theme" />
          </header>

          <ul className="tt-menus">
            {MENUS.map((menu) => (
              <li key={menu.id} className="tt-menu">
                <span className="tt-menu-emoji" aria-hidden="true">
                  {menu.emoji}
                </span>
                <span className="tt-menu-name">{menu.name}</span>
                <span className="tt-menu-price">{menu.price.toLocaleString('ko-KR')}원</span>
              </li>
            ))}
          </ul>

          <button type="button" className="tt-order">
            주문하기
          </button>
        </div>
      </div>
    </div>
  )
}
