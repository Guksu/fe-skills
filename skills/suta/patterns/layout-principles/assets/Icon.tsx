import { createElement } from 'react'
import { ICONS, type IconName } from './icons'

type IconProps = {
  name: IconName
  size?: number
  strokeWidth?: number
  /** 글자 없이 아이콘만 있는 버튼이면 뜻을 적는다(화면 낭독기가 읽는다). 옆에 글자가 있으면 비워서 숨긴다 */
  label?: string
  /** 닫힌 모양(home·heart·star·user·bell·bag)을 채운다 — 선택된 탭·눌린 찜 */
  filled?: boolean
  className?: string
}

/** 선 아이콘 한 벌의 React 래퍼 — 색은 글자 색(currentColor)을 따른다 */
export const Icon = ({ name, size = 24, strokeWidth = 1.75, label, filled = false, className }: IconProps) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    focusable="false"
    role={label ? 'img' : undefined}
    aria-label={label}
    aria-hidden={label ? undefined : true}
  >
    {ICONS[name].map(([tag, attrs], index) => createElement(tag, { key: index, ...attrs }))}
  </svg>
)
