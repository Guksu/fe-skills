import { useEffect, useRef, useState } from 'react'
import { createGlassNav } from './createGlassNav'
import { INITIAL_NAV_STATE, type NavOptions, type NavState } from './navScrollCore'
import './glass-nav.css'

type UseGlassNavOptions = NavOptions & {
  /** 스크롤 컨테이너 ref. 없으면 페이지(document) */
  containerRef?: { current: HTMLElement | null }
}

/**
 * createGlassNav 코어의 React 래퍼.
 * navRef를 <header class="gnav">에 달면 스크롤에 따라 data-elevated·data-hidden·data-compact가 붙는다.
 * 상태는 DOM 속성으로만 바뀌고(렌더 없음), 화면에 표시하고 싶을 때만 반환된 state를 쓴다.
 */
export const useGlassNav = ({ containerRef, ...options }: UseGlassNavOptions = {}) => {
  const navRef = useRef<HTMLElement | null>(null)
  const [state, setState] = useState<NavState>(INITIAL_NAV_STATE)
  const controllerRef = useRef<ReturnType<typeof createGlassNav> | null>(null)

  useEffect(
    function attachScrollNav() {
      const nav = navRef.current
      if (!nav) return
      const controller = createGlassNav({ container: containerRef?.current ?? document, nav, onChange: setState, ...options })
      controllerRef.current = controller
      return () => {
        controller.destroy()
        controllerRef.current = null
      }
    },
    // 컨테이너가 바뀔 때만 다시 붙인다 — 옵션 변경은 아래 setOptions로 흘려 스크롤 상태를 잃지 않는다
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [containerRef?.current],
  )

  useEffect(
    function syncOptions() {
      controllerRef.current?.setOptions(options)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [options.mode, options.thresholdPx, options.hideAfterPx, options.minDeltaPx],
  )

  return { navRef, state }
}
