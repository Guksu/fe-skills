import { useRef, useState } from 'react'
import { SwipeDismissViewer } from '@skills/swipe-dismiss-viewer/assets/SwipeDismissViewer'
import './swipe-dismiss-viewer-demo.css'

type Photo = { id: string; alt: string; tone: string; emoji: string }

const PHOTOS: Photo[] = [
  { id: 'deulkkae', alt: '들깨칼국수', tone: '#f6d365,#fda085', emoji: '🍜' },
  { id: 'bibim', alt: '비빔국수', tone: '#f093fb,#f5576c', emoji: '🌶️' },
  { id: 'kong', alt: '콩국수', tone: '#fdfbfb,#ebedee', emoji: '🥛' },
  { id: 'mandu', alt: '손만두', tone: '#a1c4fd,#c2e9fb', emoji: '🥟' },
  { id: 'jeon', alt: '감자전', tone: '#fbc2eb,#a6c1ee', emoji: '🥞' },
  { id: 'kimchi', alt: '겉절이', tone: '#ff9a9e,#fecfef', emoji: '🥬' },
]

/** 사진 대신 쓰는 SVG 데이터 URL — 외부 이미지 없이 데모를 돌린다 */
const svgFor = ({ tone, emoji, size }: { tone: string; emoji: string; size: number }) => {
  const [a, b] = tone.split(',')
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/><text x="50%" y="55%" font-size="${size * 0.4}" text-anchor="middle" dominant-baseline="middle">${emoji}</text></svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

export const SwipeDismissViewerDemo = () => {
  const [openId, setOpenId] = useState<string | null>(null)
  const [log, setLog] = useState('사진을 눌러 크게 보고, 아무 방향으로 끌어내려 닫아 보세요.')
  const thumbs = useRef<Record<string, HTMLImageElement | null>>({})
  const open = PHOTOS.find((photo) => photo.id === openId)

  return (
    <div className="playground">
      <section className="controls" aria-label="안내">
        <p className="controls-note">
          썸네일에서 커지며 열리고, 끌면 손가락을 따라 작아지며 뒤가 비칩니다. 120px 이상 끌거나 세게 튕기면 썸네일 자리로
          돌아가며 닫히고, 그 전에 놓으면 중앙으로 스프링 복귀합니다. Esc·✕로도 같은 복귀로 닫힙니다. 마우스로도 됩니다.
        </p>
      </section>

      <div className="dismiss-stage">
        <h2 className="dismiss-stage-title">국수공방 갤러리</h2>
        <div className="dismiss-grid">
          {PHOTOS.map((photo) => (
            <button
              key={photo.id}
              type="button"
              className="dismiss-thumb"
              onClick={() => {
                setOpenId(photo.id)
                setLog(`${photo.alt} 열림`)
              }}
            >
              <img
                ref={(el) => {
                  thumbs.current[photo.id] = el
                }}
                src={svgFor({ tone: photo.tone, emoji: photo.emoji, size: 240 })}
                alt={photo.alt}
                draggable={false}
              />
            </button>
          ))}
        </div>
        <p className="dismiss-log" aria-live="polite">
          {log}
        </p>
      </div>

      {open && (
        <SwipeDismissViewer
          src={svgFor({ tone: open.tone, emoji: open.emoji, size: 900 })}
          alt={open.alt}
          returnTo={{ current: thumbs.current[open.id] }}
          onClose={() => {
            setOpenId(null)
            setLog(`${open.alt} 닫힘 — 썸네일 자리로 돌아왔습니다.`)
          }}
        />
      )}
    </div>
  )
}
