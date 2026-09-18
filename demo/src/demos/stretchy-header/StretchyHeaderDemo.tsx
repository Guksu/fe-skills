import { useState, type CSSProperties } from 'react'
import { useStretchyHeader } from '@skills/stretchy-header/assets/useStretchyHeader'
import './stretchy-header-demo.css'

const MENU = [
  { name: '손칼국수', desc: '멸치 육수, 새벽에 치댄 반죽', price: '9,000원' },
  { name: '얼큰 칼국수', desc: '고추기름 한 바퀴, 청양고추 두 개', price: '9,500원' },
  { name: '들깨 수제비', desc: '들깨가루 듬뿍, 감자 큼직', price: '9,500원' },
  { name: '잔치국수', desc: '애호박·계란·김 고명', price: '7,000원' },
  { name: '비빔국수', desc: '새콤한 양념에 오이·삶은 달걀', price: '8,000원' },
  { name: '냉모밀', desc: '슬러시 직전 육수, 무 간 것 별도', price: '8,500원' },
  { name: '손만두 한 판', desc: '고기 4 · 김치 4', price: '7,000원' },
  { name: '왕만두', desc: '주먹만 한 크기, 2개', price: '6,000원' },
  { name: '만둣국', desc: '사골 육수에 손만두 6알', price: '9,500원' },
  { name: '떡만둣국', desc: '떡국떡 추가', price: '10,000원' },
  { name: '보리밥 (곁들임)', desc: '열무김치·강된장', price: '3,000원' },
  { name: '수육 (소)', desc: '앞다리살, 새우젓', price: '15,000원' },
  { name: '막걸리', desc: '성수동 양조장 생막걸리', price: '5,000원' },
  { name: '식혜', desc: '직접 삭힌 것, 얼음 동동', price: '3,000원' },
]

export const StretchyHeaderDemo = () => {
  const [parallaxRatio, setParallaxRatio] = useState(0.5)
  const [headerHeight, setHeaderHeight] = useState(240)
  const { containerRef, imageRef } = useStretchyHeader<HTMLDivElement, HTMLDivElement>({ headerHeight, parallaxRatio })

  return (
    <div className="playground">
      <section className="controls" aria-label="스트레치 헤더 옵션">
        <label>
          <span>
            패럴랙스 비율 <code>parallaxRatio</code>
          </span>
          <input type="range" min={0} max={1} step={0.1} value={parallaxRatio} onChange={(e) => setParallaxRatio(Number(e.target.value))} />
          <output>{parallaxRatio.toFixed(1)} (0 = 콘텐츠와 같이, 1 = 화면에 고정)</output>
        </label>
        <label>
          <span>
            헤더 높이 <code>--stretch-height</code>
          </span>
          <input type="range" min={160} max={360} step={20} value={headerHeight} onChange={(e) => setHeaderHeight(Number(e.target.value))} />
          <output>{headerHeight}px</output>
        </label>
        <p className="controls-note">
          위로 스크롤 / 맨 위에서 아래로 당겨 보세요 — 스크롤하면 이미지가 메뉴보다 느리게 밀려 올라가며 어두워지고,
          맨 위에서 아래로 당기면(마우스 드래그도 됨) 이미지가 늘어났다가 놓으면 제자리로 돌아옵니다.
        </p>
      </section>

      <div ref={containerRef} className="stretchy-container stretchy-demo-frame">
        <div className="stretchy-header" style={{ '--stretch-height': `${headerHeight}px` } as CSSProperties}>
          <div className="stretchy-header-clip">
            {/* 실제 사진 대신 그라디언트 + 이모지로 만든 "이미지" — img 태그를 써도 똑같이 동작한다 */}
            <div ref={imageRef} className="stretchy-header-image stretchy-demo-image" aria-hidden="true">
              🍜
            </div>
          </div>
          <div className="stretchy-header-overlay">
            <h2 className="stretchy-demo-title">성수동 손칼국수</h2>
            <p className="stretchy-demo-subtitle">매일 새벽 반죽 · 11:00–21:00 · 브레이크 없음</p>
          </div>
        </div>

        <ul className="stretchy-demo-menu" aria-label="메뉴">
          {MENU.map((item) => (
            <li key={item.name} className="stretchy-demo-item">
              <div>
                <strong>{item.name}</strong>
                <span>{item.desc}</span>
              </div>
              <em>{item.price}</em>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
