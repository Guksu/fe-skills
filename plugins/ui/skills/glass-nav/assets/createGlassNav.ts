import { INITIAL_NAV_STATE, reduceNavState, type NavOptions, type NavState } from './navScrollCore'

/**
 * 프레임워크 무관 GNB 스크롤 반응 코어 (의존성 0).
 *
 * 스크롤 컨테이너(또는 window)의 scroll 이벤트를 passive로 듣고, 프레임당 한 번만 판정해
 * nav 요소에 data-elevated · data-hidden · data-compact를 붙인다. 움직임 자체는 CSS(glass-nav.css)가
 * transition으로 그린다 — JS는 상태만 정한다.
 *
 * 바닐라: createGlassNav({ container: document, nav, mode: 'hide' })
 * React: useGlassNav.ts가 이 코어를 감싼다.
 */

type CreateGlassNavOptions = NavOptions & {
  /** 스크롤되는 요소. 페이지 전체가 스크롤되면 document(기본) */
  container?: HTMLElement | Document
  /** 상태 속성을 붙일 GNB 요소 */
  nav: HTMLElement
  onChange?: (state: NavState) => void
}

const scrollTopOf = (container: HTMLElement | Document) =>
  container instanceof Document ? container.documentElement.scrollTop || document.body.scrollTop || 0 : container.scrollTop

export const createGlassNav = ({ container = document, nav, onChange, ...options }: CreateGlassNavOptions) => {
  let state: NavState = INITIAL_NAV_STATE
  let current: NavOptions = options
  let frame = 0

  const apply = (next: NavState) => {
    const changed = next.elevated !== state.elevated || next.hidden !== state.hidden || next.compact !== state.compact
    state = next
    if (!changed) return
    nav.dataset.elevated = String(next.elevated)
    nav.dataset.hidden = String(next.hidden)
    nav.dataset.compact = String(next.compact)
    onChange?.(next)
  }

  const measure = () => {
    frame = 0
    apply(reduceNavState({ prev: state, scrollTop: scrollTopOf(container), options: current }))
  }

  const onScroll = () => {
    // 스크롤 이벤트는 프레임보다 자주 올 수 있다 — 프레임당 한 번만 판정
    if (frame) return
    frame = requestAnimationFrame(measure)
  }

  // 첫 상태 — 새로고침으로 중간에서 시작해도 맞는 모양으로
  nav.dataset.elevated = 'false'
  nav.dataset.hidden = 'false'
  nav.dataset.compact = 'false'
  measure()
  container.addEventListener('scroll', onScroll, { passive: true })

  return {
    /** 지금 상태 */
    getState: () => state,
    /** 옵션 변경(모드·임계) — 다음 스크롤부터 반영. 모드가 바뀌면 숨김·축소를 풀어 어색한 잔상을 없앤다 */
    setOptions: (next: NavOptions) => {
      current = { ...current, ...next }
      apply({ ...state, hidden: false, compact: false })
    },
    destroy: () => {
      cancelAnimationFrame(frame)
      container.removeEventListener('scroll', onScroll)
      delete nav.dataset.elevated
      delete nav.dataset.hidden
      delete nav.dataset.compact
    },
  }
}
