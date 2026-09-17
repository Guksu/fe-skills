import { useRef, useState, type CSSProperties } from 'react'
import { Glass } from '@skills/glass-surface/assets/Glass'
import './glass-surface-demo.css'

type Tone = 'light' | 'dark'

const DEFAULT_ALPHA: Record<Tone, number> = { light: 0.14, dark: 0.5 }

const tintFor = ({ tone, alpha }: { tone: Tone; alpha: number }) =>
  tone === 'light' ? `rgba(255, 255, 255, ${alpha})` : `rgba(17, 19, 26, ${alpha})`

export const GlassSurfaceDemo = () => {
  const [blurPx, setBlurPx] = useState(16)
  const [tone, setTone] = useState<Tone>('light')
  const [alpha, setAlpha] = useState(DEFAULT_ALPHA.light)
  const [opaque, setOpaque] = useState(false)
  const dialogRef = useRef<HTMLDialogElement>(null)

  const changeTone = (next: Tone) => {
    setTone(next)
    setAlpha(DEFAULT_ALPHA[next])
  }

  const vars = {
    '--glass-blur': `${blurPx}px`,
    '--glass-tint': tintFor({ tone, alpha }),
  } as CSSProperties

  return (
    <div className="playground">
      <section className="controls" aria-label="유리 옵션">
        <label>
          <span>
            흐림 <code>--glass-blur</code>
          </span>
          <input type="range" min={0} max={40} step={2} value={blurPx} onChange={(e) => setBlurPx(Number(e.target.value))} />
          <output>{blurPx}px</output>
        </label>
        <label>
          <span>
            유리 투명도 <code>--glass-tint</code> 알파
          </span>
          <input type="range" min={0} max={0.9} step={0.02} value={alpha} onChange={(e) => setAlpha(Number(e.target.value))} />
          <output>{alpha.toFixed(2)}</output>
        </label>
        <fieldset className="glass-tone-picker">
          <legend>
            톤 <code>data-tone</code>
          </legend>
          <label>
            <input type="radio" name="tone" checked={tone === 'light'} onChange={() => changeTone('light')} /> 흰 유리
          </label>
          <label>
            <input type="radio" name="tone" checked={tone === 'dark'} onChange={() => changeTone('dark')} /> 검은 유리
          </label>
        </fieldset>
        <label>
          <span>
            불투명 폴백 미리보기 <code>data-opaque</code>
          </span>
          <input type="checkbox" checked={opaque} onChange={(e) => setOpaque(e.target.checked)} />
        </label>
        <p className="controls-note">
          흐림을 못 쓰는 환경(미지원 브라우저·투명도 줄이기·대비 높이기 설정)에서는 자동으로 이 폴백 모양이 됩니다.
          상단 바 아래로 메뉴 타일을 스크롤해 보세요.
        </p>
      </section>

      <div className="glass-stage" style={vars} data-tone={tone}>
        <Glass as="header" variant="nav" tone={tone} opaque={opaque} aria-label="국수집 상단 바">
          <strong className="glass-brand">🍜 국수집</strong>
          <nav className="glass-links" aria-label="주메뉴">
            <a href="#/glass-surface" aria-current="page">
              메뉴
            </a>
            <a href="#/glass-surface">매장</a>
            <a href="#/glass-surface">주문 내역</a>
          </nav>
        </Glass>

        <div className="glass-scene">
          <div className="glass-blob glass-blob-a" aria-hidden="true" />
          <div className="glass-blob glass-blob-b" aria-hidden="true" />
          <div className="glass-blob glass-blob-c" aria-hidden="true" />

          <div className="glass-cards">
            {MENU.map((item) => (
              <Glass key={item.name} as="article" variant="card" tone={tone} opaque={opaque} interactive>
                <span className="glass-card-emoji" aria-hidden="true">
                  {item.emoji}
                </span>
                <h3>{item.name}</h3>
                <p>{item.desc}</p>
                <strong className="glass-card-price">{item.price}</strong>
              </Glass>
            ))}
          </div>

          <div className="glass-tiles" aria-hidden="true">
            {TILES.map((emoji, index) => (
              <span key={index} className="glass-tile">
                {emoji}
              </span>
            ))}
          </div>

          <Glass as="section" variant="card" tone={tone} opaque={opaque} className="glass-cta">
            <h3>주문하시겠어요?</h3>
            <p>유리 모달이 뒤 화면 전체를 흐리며 올라옵니다.</p>
            <button type="button" onClick={() => dialogRef.current?.showModal()}>
              주문 확인 모달 열기
            </button>
          </Glass>
        </div>

        <dialog ref={dialogRef} className="glass glass-modal" data-tone={tone} data-opaque={opaque ? 'true' : undefined} aria-labelledby="glass-modal-title">
          <h3 id="glass-modal-title">주문 확인</h3>
          <p>잔치국수 1 · 비빔국수 1 — 합계 15,000원</p>
          <div className="glass-modal-actions">
            <button type="button" onClick={() => dialogRef.current?.close()}>
              취소
            </button>
            <button type="button" onClick={() => dialogRef.current?.close()}>
              주문하기
            </button>
          </div>
        </dialog>
      </div>
    </div>
  )
}

const MENU = [
  { emoji: '🍜', name: '잔치국수', desc: '멸치 육수에 소면. 고명은 애호박·계란·김.', price: '7,000원' },
  { emoji: '🌶️', name: '비빔국수', desc: '새콤한 양념에 오이·삶은 달걀. 여름 한정 아님.', price: '8,000원' },
  { emoji: '🥟', name: '칼국수 + 만두', desc: '새벽에 치댄 반죽. 손만두 4알이 따라온다.', price: '9,500원' },
]

const TILES = ['🍜', '🥢', '🧅', '🥚', '🌿', '🍋', '🧊', '🥬', '🍤', '🧄', '🥕', '🌽', '🍜', '🥟', '🌶️', '🥢', '🧅', '🥚', '🌿', '🍋', '🧊', '🥬', '🍤', '🧄']
