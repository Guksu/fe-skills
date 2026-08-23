/**
 * 프레임워크 무관 카트 플라이 코어 (의존성 0).
 *
 * 출발 요소의 복제(고스트)를 띄워 목적지(장바구니 버튼 등)로 날린다.
 * 포물선 궤적의 비밀: 바깥 요소는 가로(translateX)를 등속으로, 안쪽 요소는
 * 세로(translateY)를 가속(ease-in)으로 움직인다 — 두 축의 이징이 달라야 곡선이 된다.
 * transform·opacity만 쓰므로 GPU 합성으로 처리된다.
 */

type FlyToTargetOptions = {
  /** 날아갈 모양의 원본 — 복제되어 고스트가 된다 */
  source: HTMLElement
  /** 도착 지점 (장바구니 버튼 등) */
  target: HTMLElement
  durationMs?: number
  /** 고스트가 도착해 사라진 순간 — 뱃지 카운트 증가는 여기서 */
  onArrive?: () => void
}

const prefersReducedMotion = () =>
  typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

export const flyToTarget = ({ source, target, durationMs = 600, onArrive }: FlyToTargetOptions) => {
  if (prefersReducedMotion()) {
    onArrive?.() // 비행 연출 생략 — 결과(카운트 증가)만 즉시
    return
  }

  const from = source.getBoundingClientRect()
  const to = target.getBoundingClientRect()
  const dx = to.left + to.width / 2 - (from.left + from.width / 2)
  const dy = to.top + to.height / 2 - (from.top + from.height / 2)

  // 바깥(가로 축) — 원본 복제를 감싼다
  const ghost = document.createElement('div')
  ghost.className = 'fly-ghost'
  ghost.style.cssText = `position: fixed; left: ${from.left}px; top: ${from.top}px; width: ${from.width}px; height: ${from.height}px; margin: 0; pointer-events: none; z-index: 9999; transition: transform ${durationMs}ms linear;`

  // 안쪽(세로 축 + 축소·페이드)
  const inner = source.cloneNode(true) as HTMLElement
  inner.style.cssText = `width: 100%; height: 100%; margin: 0; transition: transform ${durationMs}ms cubic-bezier(0.55, 0, 1, 0.45), opacity ${durationMs}ms ease-in;`
  ghost.appendChild(inner)
  document.body.appendChild(ghost)

  let finished = false
  const finish = () => {
    if (finished) return
    finished = true
    clearTimeout(fallbackTimer)
    ghost.remove()
    onArrive?.()
  }
  // transitionend는 유실될 수 있다(탭 전환 등) — 타임아웃이 안전망
  const fallbackTimer = setTimeout(finish, durationMs + 200)
  inner.addEventListener('transitionend', finish)

  // 브라우저가 시작 위치를 그린 다음 프레임에 목적지로 전환한다
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      ghost.style.transform = `translateX(${dx}px)`
      inner.style.transform = `translateY(${dy}px) scale(0.25)`
      inner.style.opacity = '0.4'
    })
  })
}
