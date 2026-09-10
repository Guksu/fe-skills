import { useState, type CSSProperties } from 'react'
import { RangeSlider, type RangeValue } from '@skills/range-slider/assets/RangeSlider'
import './range-slider-demo.css'

type Menu = { id: string; name: string; price: number; emoji: string }

const MENUS: Menu[] = [
  { id: 'mandu', name: '손만두', price: 7000, emoji: '🥟' },
  { id: 'myeolchi', name: '멸치국수', price: 8000, emoji: '🍜' },
  { id: 'janchi', name: '잔치국수', price: 8000, emoji: '🎊' },
  { id: 'sujebi', name: '수제비', price: 8500, emoji: '🥔' },
  { id: 'bibim', name: '비빔국수', price: 9000, emoji: '🌶️' },
  { id: 'mandu-guk', name: '만둣국', price: 9000, emoji: '🍲' },
  { id: 'deulkkae', name: '들깨칼국수', price: 10000, emoji: '🥣' },
  { id: 'naengmyeon', name: '물냉면', price: 10000, emoji: '❄️' },
  { id: 'kong', name: '콩국수', price: 11000, emoji: '🥛' },
  { id: 'kalguksu', name: '바지락칼국수', price: 11000, emoji: '🐚' },
]

const won = (value: number) => `${value.toLocaleString('ko-KR')}원`

export const RangeSliderDemo = () => {
  const [price, setPrice] = useState<RangeValue>({ lower: 8000, upper: 10000 })
  const [step, setStep] = useState(500)
  const [minDistance, setMinDistance] = useState(0)

  const matched = MENUS.filter((menu) => menu.price >= price.lower && menu.price <= price.upper)

  const vars = {
    '--range-accent': 'var(--accent)',
    '--range-track': 'var(--border)',
    '--range-thumb': 'var(--surface)',
  } as CSSProperties

  return (
    <div className="playground">
      <section className="controls" aria-label="슬라이더 옵션">
        <label>
          <span>
            눈금 <code>step</code>
          </span>
          <input type="range" min={500} max={5000} step={500} value={step} onChange={(e) => setStep(Number(e.target.value))} />
          <output>{won(step)}</output>
        </label>
        <label>
          <span>
            최소 간격 <code>minDistance</code>
          </span>
          <input
            type="range"
            min={0}
            max={10000}
            step={1000}
            value={minDistance}
            onChange={(e) => setMinDistance(Number(e.target.value))}
          />
          <output>{won(minDistance)}</output>
        </label>
        <p className="controls-note">
          손잡이를 끌어 보세요. <b>최저가를 최고가 너머로 밀어도 최고가는 그대로</b>입니다 — 움직인 쪽이 멈춥니다. 트랙의
          빈 곳을 누르면 가까운 손잡이가 그 자리로 오고, Tab으로 손잡이에 간 뒤 방향키로도 한 눈금씩 조절됩니다. 두
          손잡이를 오른쪽 끝에 붙인 뒤 왼쪽으로 끌어 보세요 — 겹쳐 있어도 잡힙니다.
        </p>
      </section>

      <div className="rs-stage" style={vars}>
        <div className="rs-head">
          <h2 className="rs-title">가격대</h2>
          <strong className="rs-value">
            {won(price.lower)} ~ {won(price.upper)}
          </strong>
        </div>

        <RangeSlider
          min={5000}
          max={15000}
          step={step}
          value={price}
          onChange={setPrice}
          minDistance={minDistance}
          label={{ lower: '최저 가격', upper: '최고 가격' }}
          format={won}
          className="rs-slider"
        />

        <div className="rs-scale" aria-hidden="true">
          <span>{won(5000)}</span>
          <span>{won(15000)}</span>
        </div>

        <p className="rs-count" aria-live="polite">
          이 가격대에 {matched.length}개 메뉴
        </p>

        <ul className="rs-menus">
          {matched.map((menu) => (
            <li key={menu.id} className="rs-menu">
              <span aria-hidden="true">{menu.emoji}</span>
              <span className="rs-menu-name">{menu.name}</span>
              <span className="rs-menu-price">{won(menu.price)}</span>
            </li>
          ))}
          {matched.length === 0 && <li className="rs-empty">이 가격대에는 메뉴가 없습니다</li>}
        </ul>
      </div>
    </div>
  )
}
