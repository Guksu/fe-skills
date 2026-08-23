import { useStickyHeader } from '@skills/sticky-header/assets/useStickyHeader'
import './sticky-header-demo.css'

const SECTIONS = ['얼큰 칼국수', '들깨 수제비', '냉모밀 정식', '만두 한 판']

export const StickyHeaderDemo = () => {
  const { headerRef, sentinelRef } = useStickyHeader<HTMLElement, HTMLHeadingElement>()

  return (
    <div className="playground">
      <section className="controls" aria-label="안내">
        <p className="controls-note">
          아래 상세 화면을 스크롤하세요 — 큰 제목이 밀려 나가는 순간 상단 고정 바에 컴팩트 제목이
          나타납니다. 헤더 높이는 변하지 않습니다(레이아웃 애니메이션 없음).
        </p>
      </section>

      <div className="header-demo-frame">
        <header ref={headerRef} className="sticky-header header-demo-bar">
          <span className="sticky-header-title">성수동 손칼국수</span>
        </header>
        <div className="header-demo-hero">
          <h2 ref={sentinelRef} className="header-demo-title">
            성수동 손칼국수
          </h2>
          <p>수요미식회에 안 나온 것이 미스터리인 집</p>
        </div>
        {SECTIONS.map((name) => (
          <section key={name} className="header-demo-section">
            <h3>{name}</h3>
            <p>
              멸치 육수는 새벽마다 다시 내립니다. 면은 주문이 들어오면 그때 썰기 시작합니다. 곱빼기는
              사장님 기분에 따라 무료입니다.
            </p>
          </section>
        ))}
      </div>
    </div>
  )
}
