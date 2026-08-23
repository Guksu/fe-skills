import { useState, type CSSProperties } from 'react'
import { useTabIndicator } from '@skills/tab-indicator/assets/useTabIndicator'
import './tab-indicator-demo.css'

const TABS = ['소개', '면 메뉴', '오늘의 국수', '리뷰', '매장 안내']

export const TabIndicatorDemo = () => {
  const [active, setActive] = useState(0)
  const [durationMs, setDurationMs] = useState(250)
  const [heightPx, setHeightPx] = useState(2)
  const { registerTab, indicatorRef } = useTabIndicator({ activeIndex: active })

  const vars = {
    '--tab-indicator-duration': `${durationMs}ms`,
    '--tab-indicator-height': `${heightPx}px`,
  } as CSSProperties

  return (
    <div className="playground">
      <section className="controls" aria-label="애니메이션 옵션">
        <label>
          <span>
            슬라이드 시간 <code>--tab-indicator-duration</code>
          </span>
          <input
            type="range"
            min={100}
            max={600}
            step={50}
            value={durationMs}
            onChange={(e) => setDurationMs(Number(e.target.value))}
          />
          <output>{durationMs}ms</output>
        </label>
        <label>
          <span>
            두께 <code>--tab-indicator-height</code>
          </span>
          <input
            type="range"
            min={2}
            max={6}
            step={1}
            value={heightPx}
            onChange={(e) => setHeightPx(Number(e.target.value))}
          />
          <output>{heightPx}px</output>
        </label>
        <p className="controls-note">
          탭을 번갈아 눌러보세요 — 밑줄이 폭이 다른 탭 사이를 늘었다 줄며 미끄러집니다(전부
          transform, 레이아웃 애니메이션 없음).
        </p>
      </section>

      <div className="tab-demo" style={vars}>
        <nav className="tab-bar demo-tab-bar" role="tablist" aria-label="데모 탭">
          {TABS.map((label, index) => (
            <button
              key={label}
              ref={registerTab(index)}
              type="button"
              role="tab"
              aria-selected={index === active}
              className="demo-tab"
              onClick={() => setActive(index)}
            >
              {label}
            </button>
          ))}
          <span ref={indicatorRef} className="tab-indicator" aria-hidden="true" />
        </nav>
        <section className="tab-panel">
          <strong>{TABS[active]}</strong>
          <p>선택된 탭의 콘텐츠 영역입니다.</p>
        </section>
      </div>
    </div>
  )
}
