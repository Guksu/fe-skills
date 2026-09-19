import { useRef, useState, type CSSProperties } from 'react'
import { useGlassNav } from '@skills/glass-nav/assets/useGlassNav'
import type { NavMode } from '@skills/glass-nav/assets/navScrollCore'
import './glass-nav-demo.css'

const MODES: Array<{ value: NavMode; label: string; hint: string }> = [
  { value: 'elevate', label: '투명 → 유리', hint: '배민 홈·카카오맵 검색 바' },
  { value: 'hide', label: '내리면 숨김', hint: '배민·카카오 목록 화면' },
  { value: 'compact', label: '알약 축소', hint: 'iOS 26 Liquid Glass 탭 바' },
]

const MENU = [
  { emoji: '🍜', name: '잔치국수', desc: '멸치 육수에 소면. 고명은 애호박·계란·김.', price: '7,000원' },
  { emoji: '🌶️', name: '비빔국수', desc: '새콤한 양념에 오이·삶은 달걀.', price: '8,000원' },
  { emoji: '🥟', name: '칼국수 + 만두', desc: '새벽에 치댄 반죽. 손만두 4알.', price: '9,500원' },
  { emoji: '🧊', name: '물냉면', desc: '살얼음 육수. 여름 한정.', price: '10,000원' },
  { emoji: '🥛', name: '콩국수', desc: '국산 백태만 씁니다.', price: '11,000원' },
  { emoji: '🥣', name: '들깨칼국수', desc: '거피 들깨를 그날 갈아 씁니다.', price: '10,000원' },
  { emoji: '🍲', name: '만두국', desc: '손만두 6알, 사골 육수.', price: '9,000원' },
  { emoji: '🍚', name: '공기밥', desc: '국물에 말아 드세요.', price: '1,000원' },
]

export const GlassNavDemo = () => {
  const [mode, setMode] = useState<NavMode>('hide')
  const [thresholdPx, setThresholdPx] = useState(8)
  const [hideAfterPx, setHideAfterPx] = useState(80)
  const [durationMs, setDurationMs] = useState(250)
  const containerRef = useRef<HTMLDivElement>(null)
  const { navRef, state } = useGlassNav({ containerRef, mode, thresholdPx, hideAfterPx })

  const vars = { '--gnav-duration': `${durationMs}ms` } as CSSProperties
  const status = state.hidden ? '숨김' : state.compact ? '축소' : state.elevated ? '유리' : '투명'

  return (
    <div className="playground">
      <section className="controls" aria-label="GNB 옵션">
        <fieldset className="gn-mode">
          <legend>
            모드 <code>mode</code>
          </legend>
          {MODES.map((item) => (
            <label key={item.value}>
              <input type="radio" name="gnav-mode" checked={mode === item.value} onChange={() => setMode(item.value)} /> {item.label}
              <small>{item.hint}</small>
            </label>
          ))}
        </fieldset>
        <label>
          <span>
            유리 시작점 <code>thresholdPx</code>
          </span>
          <input type="range" min={0} max={240} step={8} value={thresholdPx} onChange={(e) => setThresholdPx(Number(e.target.value))} />
          <output>{thresholdPx}px</output>
        </label>
        <label>
          <span>
            숨김·축소 시작점 <code>hideAfterPx</code>
          </span>
          <input type="range" min={0} max={300} step={10} value={hideAfterPx} onChange={(e) => setHideAfterPx(Number(e.target.value))} />
          <output>{hideAfterPx}px</output>
        </label>
        <label>
          <span>
            속도 <code>--gnav-duration</code>
          </span>
          <input type="range" min={100} max={600} step={50} value={durationMs} onChange={(e) => setDurationMs(Number(e.target.value))} />
          <output>{durationMs}ms</output>
        </label>
        <p className="controls-note">
          폰 화면을 아래로 스크롤해 보세요. 맨 위에서는 바가 투명하고, 내려가면 유리가 됩니다. "내리면 숨김"은 아래로 가면 바가 위로
          사라지고 조금만 올리면 돌아옵니다. "알약 축소"는 링크가 접혀 현재 메뉴만 남습니다. 지금 상태: <b>{status}</b>
        </p>
      </section>

      <div className="gn-phone" ref={containerRef} style={vars}>
        <header ref={navRef} className="gnav" data-mode={mode}>
          <div className="gnav-bar">
            <a className="gnav-brand" href="#/glass-nav">
              🍜 국수집
            </a>
            <nav className="gnav-links" aria-label="주메뉴">
              <div>
                <a href="#/glass-nav" aria-current="page">
                  메뉴
                </a>
                <a href="#/glass-nav">매장</a>
                <a href="#/glass-nav">주문 내역</a>
              </div>
            </nav>
            <span className="gnav-current" aria-hidden="true">
              메뉴
            </span>
          </div>
        </header>

        <section className="gn-hero">
          <span className="gn-hero-badge">오늘의 추천</span>
          <h2>성수동 손칼국수</h2>
          <p>매일 새벽 반죽 · 11:00–21:00</p>
        </section>

        <ul className="gn-list" aria-label="메뉴 목록">
          {MENU.map((item) => (
            <li key={item.name} className="gn-item">
              <span className="gn-item-emoji" aria-hidden="true">
                {item.emoji}
              </span>
              <div>
                <strong>{item.name}</strong>
                <p>{item.desc}</p>
              </div>
              <span className="gn-item-price">{item.price}</span>
            </li>
          ))}
        </ul>
        <p className="gn-end">끝까지 내려왔습니다. 위로 올려 보세요.</p>
      </div>
    </div>
  )
}
