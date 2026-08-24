import { useEffect, useRef } from 'react'
import { createToastStack } from './createToastStack'
import './toast-stack.css'

type UseToastStackOptions = {
  durationMs?: number
  maxVisible?: number
}

/**
 * createToastStack 코어의 React 래퍼 — 마운트 시 스택을 만들고 언마운트 시 정리한다.
 * 반환된 toast(message)를 어디서든 호출하면 쌓인다.
 */
export const useToastStack = ({ durationMs, maxVisible }: UseToastStackOptions = {}) => {
  const stackRef = useRef<ReturnType<typeof createToastStack> | null>(null)

  useEffect(
    function mountToastRegion() {
      const stack = createToastStack({ durationMs, maxVisible })
      stackRef.current = stack
      return () => {
        stackRef.current = null
        stack.destroy()
      }
    },
    [durationMs, maxVisible],
  )

  const toast = (message: string) => stackRef.current?.show(message)

  return { toast }
}
