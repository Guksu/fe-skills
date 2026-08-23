import type { ComponentType } from 'react'
import { EnterExitDemo } from './enter-exit/EnterExitDemo'
import { ScrollRevealDemo } from './scroll-reveal/ScrollRevealDemo'
import { SkeletonDemo } from './skeleton/SkeletonDemo'
import { CountUpDemo } from './count-up/CountUpDemo'
import { LikePopDemo } from './like-pop/LikePopDemo'
import { TabIndicatorDemo } from './tab-indicator/TabIndicatorDemo'
import { BottomSheetDemo } from './bottom-sheet/BottomSheetDemo'
import { StickyHeaderDemo } from './sticky-header/StickyHeaderDemo'
import { CarouselDemo } from './carousel/CarouselDemo'
import { StoryProgressDemo } from './story-progress/StoryProgressDemo'
import { FlipListDemo } from './flip-list/FlipListDemo'
import { CartFlyDemo } from './cart-fly/CartFlyDemo'
import { PullToRefreshDemo } from './pull-to-refresh/PullToRefreshDemo'

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
    description: '잔액·포인트가 목표값까지 굴러 올라가는 연출',
    Component: CountUpDemo,
  },
  {
    slug: 'like-pop',
    title: '좋아요 팝 + 더블탭 버스트',
    description: '하트 토글 팝과 더블탭 하트 버스트',
    Component: LikePopDemo,
  },
  {
    slug: 'tab-indicator',
    title: '탭 인디케이터 슬라이드',
    description: '활성 탭 밑줄이 미끄러져 이동',
    Component: TabIndicatorDemo,
  },
  {
    slug: 'bottom-sheet',
    title: '바텀시트',
    description: '아래에서 올라오는 시트 — 드래그로 끌어내려 닫기',
    Component: BottomSheetDemo,
  },
  {
    slug: 'sticky-header',
    title: '스티키 헤더 전환',
    description: '스크롤하면 큰 제목이 밀려 나가고 고정 바에 컴팩트 제목이 나타남',
    Component: StickyHeaderDemo,
  },
  {
    slug: 'carousel',
    title: '스냅 캐러셀',
    description: '스와이프 스냅 배너·카드 슬라이더 (CSS scroll-snap)',
    Component: CarouselDemo,
  },
  {
    slug: 'story-progress',
    title: '스토리 프로그레스',
    description: '자동 재생 구간 진행바 — 길게 눌러 멈춤, 탭으로 이동',
    Component: StoryProgressDemo,
  },
  {
    slug: 'flip-list',
    title: '리스트 재배치 (FLIP)',
    description: '정렬·재배치 시 항목이 순간이동 대신 미끄러져 이동',
    Component: FlipListDemo,
  },
  {
    slug: 'cart-fly',
    title: '카트 플라이',
    description: '담기를 누르면 상품이 장바구니로 포물선을 그리며 날아감',
    Component: CartFlyDemo,
  },
  {
    slug: 'pull-to-refresh',
    title: '당겨서 새로고침',
    description: '최상단에서 끌어내려 갱신 — 고무줄 저항과 스피너',
    Component: PullToRefreshDemo,
  },
]
