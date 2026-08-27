import { useState, type CSSProperties } from 'react'
import { HamburgerButton, Drawer } from '@skills/hamburger-menu/assets/HamburgerMenu'
import './hamburger-menu-demo.css'

const LINKS = ['소개', '면 메뉴', '오늘의 국수', '매장 안내', '리뷰']

export const HamburgerMenuDemo = () => {
  const [open, setOpen] = useState(false)
  const [side, setSide] = useState<'left' | 'right'>('left')
  const [durationMs, setDurationMs] = useState(300)

  const vars = {
    '--hamburger-duration': `${durationMs}ms`,
    '--drawer-duration': `${durationMs}ms`,
  } as CSSProperties

  return (
    <div className="playground" style={vars}>
      <section className="controls" aria-label="애니메이션 옵션">
        <label>
          <span>
            속도 <code>--drawer-duration</code>
          </span>
          <input
            type="range"
            min={150}
            max={700}
            step={50}
            value={durationMs}
            onChange={(e) => setDurationMs(Number(e.target.value))}
          />
          <output>{durationMs}ms</output>
        </label>
        <label>
          <span>
            방향 <code>side</code>
          </span>
          <select value={side} onChange={(e) => setSide(e.target.value as 'left' | 'right')}>
            <option value="left">left — 왼쪽에서</option>
            <option value="right">right — 오른쪽에서</option>
          </select>
        </label>
        <p className="controls-note">
          버튼을 누르면 ≡가 X로 모핑하며 드로어가 밀려 나옵니다 — 열림/닫힘의 스위치는
          aria-expanded 속성 하나입니다. Esc·백드롭 클릭으로도 닫힙니다.
        </p>
      </section>

      <div className="drawer-stage">
        <header className="drawer-stage-header">
          <HamburgerButton open={open} onToggle={() => setOpen(!open)} label="메뉴 열기" />
          <strong>국수공방</strong>
        </header>
        <p className="drawer-stage-body">
          왼쪽 위 햄버거 버튼을 눌러보세요. 드로어가 열려 있는 동안에는 뒤 페이지 스크롤이
          잠깁니다.
        </p>
      </div>

      <Drawer open={open} onClose={() => setOpen(false)} side={side} className="demo-drawer">
        <nav className="drawer-nav" aria-label="데모 메뉴">
          <strong className="drawer-nav-title">국수공방</strong>
          {LINKS.map((label) => (
            <a key={label} href="#/hamburger-menu" onClick={() => setOpen(false)}>
              {label}
            </a>
          ))}
        </nav>
      </Drawer>
    </div>
  )
}
