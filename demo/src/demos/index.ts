import type { ComponentType } from 'react'
import { EnterExitDemo } from './enter-exit/EnterExitDemo'
import { ScrollRevealDemo } from './scroll-reveal/ScrollRevealDemo'
import { SkeletonDemo } from './skeleton/SkeletonDemo'
import { CountUpDemo } from './count-up/CountUpDemo'
import { LikePopDemo } from './like-pop/LikePopDemo'

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
  {
    slug: 'skeleton',
    title: '스켈레톤 시머',
    description: '로딩 중 콘텐츠 자리를 잡아주는 뼈대 + 반짝임',
    Component: SkeletonDemo,
  },
  {
    slug: 'count-up',
    title: '숫자 카운트업',
    description: '잔액·포인트가 목표값까지 굴러 올라가는 연출 (토스 스타일)',
    Component: CountUpDemo,
  },
  {
    slug: 'like-pop',
    title: '좋아요 팝 + 더블탭 버스트',
    description: '하트 토글 팝과 더블탭 하트 버스트 (인스타그램 스타일)',
    Component: LikePopDemo,
  },
]
