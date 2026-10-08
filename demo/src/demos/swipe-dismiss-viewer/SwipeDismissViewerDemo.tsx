import { useRef, useState } from 'react'
import { SwipeDismissViewer } from '@skills/swipe-dismiss-viewer/assets/SwipeDismissViewer'
import { DISHES, photoSrc, type DishId } from '../../shared/dishes'
import './swipe-dismiss-viewer-demo.css'

type Photo = { id: DishId; alt: string }

// 썸네일과 크게 보기가 같은 사진 파일을 쓴다 — 열 때 썸네일에서 이어 커지므로 다른 그림이면 튄다
const PHOTOS: Photo[] = (['deulkkae', 'bibim', 'kong', 'mandu', 'gamjajeon', 'geotjeori'] as const).map((id) => ({ id, alt: DISHES[id].name }))

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
                src={photoSrc(photo.id)}
                width={DISHES[photo.id].width}
                height={DISHES[photo.id].height}
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
          src={photoSrc(open.id)}
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
