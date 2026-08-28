/**
 * 프레임워크 무관 흔들림 트리거 (의존성 0).
 *
 * data-shake 속성을 붙이면 CSS 키프레임이 돌고, animationend에 속성을 뗀다.
 * 이미 흔들리는 중에 다시 부르면 속성을 뗐다 붙여 처음부터 재생한다 — 그 사이 강제 리플로우가 없으면
 * 브라우저가 두 변경을 합쳐 애니메이션이 재시작되지 않는다.
 */
export const shake = (element: HTMLElement) => {
  if (element.hasAttribute('data-shake')) {
    element.removeAttribute('data-shake')
    void element.offsetWidth // 강제 리플로우 — 속성 제거를 확정해야 재부착이 새 애니메이션이 된다
  }
  element.setAttribute('data-shake', '')
  element.addEventListener('animationend', () => element.removeAttribute('data-shake'), { once: true })
}
