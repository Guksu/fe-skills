import type { ComponentType } from 'react'
import { EnterExitDemo } from './enter-exit/EnterExitDemo'
import { ScrollRevealDemo } from './scroll-reveal/ScrollRevealDemo'

export type DemoEntry = {
  /** URL 해시 조각 (#/{slug}) — plugin/skills/{slug}와 일치시킨다 */
  slug: string
  title: string
  description: string
  Component: ComponentType
}

/** 데모 목록의 단일 출처 — 스킬 추가 시 여기에만 등록하면 목록·라우팅에 반영된다 */
export const demos: DemoEntry[] = [
  {
    slug: 'enter-exit',
    title: '진입/퇴장 애니메이션',
    description: '모달·토스트처럼 나타나고 사라지는 요소의 전환 — 퇴장까지 CSS로',
    Component: EnterExitDemo,
  },
  {
    slug: 'scroll-reveal',
    title: '스크롤 리빌',
    description: '스크롤로 뷰포트에 들어올 때 콘텐츠를 순차 공개',
    Component: ScrollRevealDemo,
  },
]
