import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { useSpring } from '@skills/spring-physics/assets/useSpring'
import { dampingRatio, springDuration, springToLinear } from '@skills/spring-physics/assets/spring'
import './spring-physics-demo.css'

const PRESETS = [
  { name: '크리스프', stiffness: 170, damping: 26 },
  { name: '통통', stiffness: 300, damping: 15 },
  { name: '묵직', stiffness: 120, damping: 30 },
  { name: '임계', stiffness: 200, damping: 28 },
]

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const SpringPhysicsDemo = () => {
  const [stiffness, setStiffness] = useState(170)
  const [damping, setDamping] = useState(26)
  const [popped, setPopped] = useState(false)
  const config = { stiffness, damping }

  const ballRef = useRef<HTMLDivElement>(null)
  const ghostRef = useRef<HTMLDivElement>(null)
  const drag = useRef({ active: false, lastX: 0, lastT: 0, velocity: 0 })

  const x = useSpring({
    config,
    onUpdate: (value) => {
      if (ballRef.current) ballRef.current.style.transform = `translateX(${value}px)`
    },
  })

  // duration 비교용 고스트 — 같은 출발점에서 300ms ease-out으로 돌아온다
  const releaseGhost = (from: number) => {
    const ghost = ghostRef.current
    if (!ghost) return
    ghost.style.transition = 'none'
    ghost.style.transform = `translateX(${from}px)`
    void ghost.offsetWidth
    ghost.style.transition = 'transform 300ms cubic-bezier(0.22, 1, 0.36, 1)'
    ghost.style.transform = 'translateX(0px)'
  }

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    drag.current = { active: true, lastX: e.clientX, lastT: e.timeStamp, velocity: 0 }
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current
    if (!d.active) return
    const dt = Math.max(1, e.timeStamp - d.lastT)
    d.velocity = ((e.clientX - d.lastX) / dt) * 1000
    d.lastX = e.clientX
    d.lastT = e.timeStamp
    x.set(x.get() + e.movementX)
  }
  const onPointerUp = () => {
    const d = drag.current
    if (!d.active) return
    d.active = false
    releaseGhost(x.get())
    if (reducedMotion()) x.set(0)
    else x.to(0, d.velocity)
  }

  const linear = springToLinear({ config })
  const ratio = dampingRatio({ stiffness, damping, mass: 1 })
  const settleMs = springDuration({ motion: { from: 100, to: 0 }, config })

  useEffect(
    function applyLinearToPop() {
      const el = document.querySelector<HTMLElement>('.spring-pop')
      if (el) el.style.transition = `transform ${linear.duration}ms ${linear.easing}`
    },
    [linear.duration, linear.easing],
  )

  return (
    <div className="playground">
      <section className="controls" aria-label="스프링 옵션">
        <label>
          <span>
            강성 <code>stiffness</code>
          </span>
          <input type="range" min={50} max={500} step={10} value={stiffness} onChange={(e) => setStiffness(Number(e.target.value))} />
          <output>{stiffness}</output>
        </label>
        <label>
          <span>
            감쇠 <code>damping</code>
          </span>
          <input type="range" min={5} max={60} step={1} value={damping} onChange={(e) => setDamping(Number(e.target.value))} />
          <output>{damping}</output>
        </label>
        <div className="spring-presets">
          {PRESETS.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => {
                setStiffness(p.stiffness)
                setDamping(p.damping)
              }}
            >
              {p.name}
            </button>
          ))}
        </div>
        <p className="controls-note">
          감쇠비 ζ = {ratio.toFixed(2)} ({ratio < 0.98 ? '튐' : ratio <= 1.02 ? '임계 근처' : '굼뜸'}) · 100px 복귀 정착 약 {settleMs}ms.
          공을 잡아 던져 보세요 — 놓는 순간 속도를 이어받습니다. 아래 회색 공은 같은 자리에서 <code>300ms ease-out</code>으로
          돌아오는 비교용입니다.
        </p>
      </section>

      <div className="spring-stage">
        <div className="spring-track">
          <div
            ref={ballRef}
            className="spring-ball"
            role="slider"
            aria-label="스프링 공 — 끌어서 놓기"
            aria-valuenow={0}
            tabIndex={0}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight') x.to(160)
              if (e.key === 'ArrowLeft') x.to(0)
            }}
          >
            🍜
          </div>
        </div>
        <div className="spring-track spring-track-ghost" aria-hidden="true">
          <div ref={ghostRef} className="spring-ball spring-ball-ghost">
            ⏱
          </div>
        </div>

        <div className="spring-linear">
          <button
            type="button"
            className="spring-pop"
            data-popped={popped}
            onClick={() => setPopped((p) => !p)}
          >
            {popped ? '❤️' : '🤍'} CSS linear() 팝
          </button>
          <code className="spring-linear-code">{linear.easing.slice(0, 80)}… ({linear.duration}ms)</code>
        </div>
      </div>
    </div>
  )
}
