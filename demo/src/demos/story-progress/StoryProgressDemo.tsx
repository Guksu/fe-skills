import { useState } from 'react'
import { useStoryProgress } from '@skills/story-progress/assets/useStoryProgress'
import './story-progress-demo.css'

const SCENES = [
  { emoji: '🌅', title: '새벽 4시', copy: '육수를 올리는 시간. 멸치와 다시마가 먼저 출근합니다.' },
  { emoji: '🫸', title: '오전 9시', copy: '반죽을 치댑니다. 오늘 면발의 탄력이 여기서 정해집니다.' },
  { emoji: '🍜', title: '정오', copy: '첫 그릇이 나갑니다. 오늘도 곱빼기 비율이 높습니다.' },
  { emoji: '🌙', title: '밤 9시', copy: '솥을 씻으며 마감. 내일의 육수를 계획합니다.' },
]

export const StoryProgressDemo = () => {
  const [durationMs, setDurationMs] = useState(3000)
  const [holding, setHolding] = useState(false)
  const story = useStoryProgress({ count: SCENES.length, durationMs })
  const scene = SCENES[story.index]

  const hold = () => {
    setHolding(true)
    story.pause()
  }
  const release = () => {
    setHolding(false)
    story.resume()
  }

  return (
    <div className="playground">
      <section className="controls" aria-label="옵션">
        <label>
          <span>
            구간 시간 <code>durationMs</code>
          </span>
          <input
            type="range"
            min={1500}
            max={8000}
            step={500}
            value={durationMs}
            onChange={(e) => setDurationMs(Number(e.target.value))}
          />
          <output>{(durationMs / 1000).toFixed(1)}s</output>
        </label>
        <label>
          <span>처음부터</span>
          <button type="button" onClick={story.restart}>
            다시 재생
          </button>
        </label>
        <p className="controls-note">
          화면을 길게 누르면 멈추고, 좌/우 절반을 탭하면 이전/다음 장면으로 이동합니다.
        </p>
      </section>

      <div
        className="story-viewer"
        onPointerDown={hold}
        onPointerUp={release}
        onPointerLeave={release}
      >
        <div className="story-bars">
          {SCENES.map((item, index) => (
            <span key={item.title} className="story-bar">
              <span ref={story.registerBar(index)} className="story-bar-fill" />
            </span>
          ))}
        </div>
        <div className="story-scene">
          <span className="story-emoji">{scene.emoji}</span>
          <strong>{scene.title}</strong>
          <p>{scene.copy}</p>
          {holding && <em className="story-paused">일시정지</em>}
        </div>
        <button type="button" className="story-nav story-nav-prev" aria-label="이전 장면" onClick={story.prev} />
        <button type="button" className="story-nav story-nav-next" aria-label="다음 장면" onClick={story.next} />
      </div>
    </div>
  )
}
