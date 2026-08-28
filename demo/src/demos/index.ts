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
import { PressFeedbackDemo } from './press-feedback/PressFeedbackDemo'
import { ToastStackDemo } from './toast-stack/ToastStackDemo'
import { ZoomLightboxDemo } from './zoom-lightbox/ZoomLightboxDemo'
import { HamburgerMenuDemo } from './hamburger-menu/HamburgerMenuDemo'
import { TooltipDemo } from './tooltip/TooltipDemo'
import { SelectDemo } from './select/SelectDemo'
import { AccordionDemo } from './accordion/AccordionDemo'
import { SwitchDemo } from './switch/SwitchDemo'
import { FloatingLabelDemo } from './floating-label/FloatingLabelDemo'
import { ModalDialogDemo } from './modal-dialog/ModalDialogDemo'
import { CheckboxRadioDemo } from './checkbox-radio/CheckboxRadioDemo'
import { FormShakeErrorDemo } from './form-shake-error/FormShakeErrorDemo'
import { SwipeToDeleteDemo } from './swipe-to-delete/SwipeToDeleteDemo'
import { PinchZoomDemo } from './pinch-zoom/PinchZoomDemo'

export type DemoCategory = '등장과 전환' | '로딩과 진행' | '피드백' | '내비게이션' | '제스처' | '컨트롤'

export type DemoEntry = {
  /** URL 해시 조각 (#/{slug}) — plugins/ui/skills/{slug}와 일치시킨다 */
  slug: string
  title: string
  description: string
  emoji: string
  category: DemoCategory
  /** 스킬 문서의 대표 사용 예시 — 데모 페이지의 "사용 예시" 코드 블록에 그대로 노출·복사된다 */
  usage: string
  Component: ComponentType
}

export const CATEGORIES: DemoCategory[] = ['등장과 전환', '로딩과 진행', '피드백', '내비게이션', '제스처', '컨트롤']

/** 데모 목록의 단일 출처 — 스킬 추가 시 여기에만 등록하면 목록·라우팅·카탈로그에 반영된다 */
export const demos: DemoEntry[] = [
  {
    slug: 'enter-exit',
    title: '진입/퇴장 애니메이션',
    description: '모달·토스트처럼 나타나고 사라지는 요소의 전환 — 퇴장까지 CSS로',
    emoji: '🎭',
    category: '등장과 전환',
    usage: `import { Presence } from './Presence'
import './enter-exit.css'

const Toast = ({ open, message }) => (
  <Presence show={open} timeoutMs={400}>
    <div className="fx fx-slide-up" role="status">
      {message}
    </div>
  </Presence>
)`,
    Component: EnterExitDemo,
  },
  {
    slug: 'scroll-reveal',
    title: '스크롤 리빌',
    description: '스크롤로 뷰포트에 들어올 때 콘텐츠를 순차 공개',
    emoji: '📜',
    category: '등장과 전환',
    usage: `import { ScrollReveal } from './ScrollReveal'
import './scroll-reveal.css'

{items.map((text, i) => (
  <ScrollReveal key={text} delayMs={i * 80}>
    <article className="card">{text}</article>
  </ScrollReveal>
))}`,
    Component: ScrollRevealDemo,
  },
  {
    slug: 'sticky-header',
    title: '스티키 헤더 전환',
    description: '스크롤하면 큰 제목이 밀려 나가고 고정 바에 컴팩트 제목이 나타남',
    emoji: '📌',
    category: '등장과 전환',
    usage: `import { useStickyHeader } from './useStickyHeader'

const { headerRef, sentinelRef } = useStickyHeader()

<header ref={headerRef} className="sticky-header">
  <span className="sticky-header-title">성수동 손칼국수</span>
</header>
<h1 ref={sentinelRef}>성수동 손칼국수</h1>`,
    Component: StickyHeaderDemo,
  },
  {
    slug: 'flip-list',
    title: '리스트 재배치 (FLIP)',
    description: '정렬·재배치 시 항목이 순간이동 대신 미끄러져 이동',
    emoji: '🔀',
    category: '등장과 전환',
    usage: `import { useFlipList } from './useFlipList'

const { containerRef } = useFlipList()

<ul ref={containerRef}>
  {items.map((item) => (
    <li key={item} data-flip-id={item}>{item}</li>
  ))}
</ul>`,
    Component: FlipListDemo,
  },
  {
    slug: 'zoom-lightbox',
    title: '확대 전환 라이트박스',
    description: '썸네일이 화면 중앙으로 커지는 공유 요소 전환',
    emoji: '🔍',
    category: '등장과 전환',
    usage: `import { openZoom } from './openZoom'
import './zoom-lightbox.css'

<img
  src={src}
  className="zoomable"
  onClick={(e) => openZoom({ source: e.currentTarget })}
/>`,
    Component: ZoomLightboxDemo,
  },
  {
    slug: 'skeleton',
    title: '스켈레톤 시머',
    description: '로딩 중 콘텐츠 자리를 잡아주는 뼈대 + 반짝임',
    emoji: '💀',
    category: '로딩과 진행',
    usage: `import { Skeleton } from './Skeleton'

<article aria-busy="true">
  <Skeleton variant="circle" width={48} />
  <Skeleton variant="text" lines={2} />
</article>`,
    Component: SkeletonDemo,
  },
  {
    slug: 'count-up',
    title: '숫자 카운트업',
    description: '잔액·포인트가 목표값까지 굴러 올라가는 연출',
    emoji: '🔢',
    category: '로딩과 진행',
    usage: `import { CountUp } from './CountUp'

<strong>
  <CountUp
    value={amount}
    format={(v) => \`\${Math.round(v).toLocaleString('ko-KR')}원\`}
  />
</strong>`,
    Component: CountUpDemo,
  },
  {
    slug: 'story-progress',
    title: '스토리 프로그레스',
    description: '자동 재생 구간 진행바 — 길게 눌러 멈춤, 탭으로 이동',
    emoji: '⏯️',
    category: '로딩과 진행',
    usage: `import { useStoryProgress } from './useStoryProgress'

const story = useStoryProgress({ count: scenes.length, durationMs: 4000 })

<div onPointerDown={story.pause} onPointerUp={story.resume}>
  <div className="story-bars">
    {scenes.map((scene, i) => (
      <span key={scene} className="story-bar">
        <span ref={story.registerBar(i)} className="story-bar-fill" />
      </span>
    ))}
  </div>
  <section>{scenes[story.index]}</section>
</div>`,
    Component: StoryProgressDemo,
  },
  {
    slug: 'press-feedback',
    title: '프레스 피드백',
    description: '버튼이 눌리는 순간 움츠렸다 스프링처럼 복귀 (CSS-only)',
    emoji: '👆',
    category: '피드백',
    usage: `<!-- CSS만 복사하면 끝 — 클래스를 붙인다 -->
<button class="pressable">주문하기</button>
<a class="pressable pressable-dim card" href="/menu">오늘의 국수</a>
<button class="pressable pressable-lift">찜하기</button>`,
    Component: PressFeedbackDemo,
  },
  {
    slug: 'toast-stack',
    title: '토스트 스택',
    description: '하단에 알림이 쌓이고 각자 시간이 되면 사라짐',
    emoji: '🍞',
    category: '피드백',
    usage: `import { useToastStack } from './useToastStack'

const { toast } = useToastStack()

<button onClick={() => toast('저장되었습니다 ✓')}>저장</button>`,
    Component: ToastStackDemo,
  },
  {
    slug: 'like-pop',
    title: '좋아요 팝 + 더블탭 버스트',
    description: '하트 토글 팝과 더블탭 하트 버스트',
    emoji: '❤️',
    category: '피드백',
    usage: `import { LikeButton } from './LikeButton'
import { DoubleTapArea } from './DoubleTapArea'

<DoubleTapArea onDoubleTap={() => setLiked(true)}>
  <img src={image} alt="" draggable={false} />
</DoubleTapArea>
<LikeButton liked={liked} onChange={setLiked} count={128} />`,
    Component: LikePopDemo,
  },
  {
    slug: 'cart-fly',
    title: '카트 플라이',
    description: '담기를 누르면 상품이 장바구니로 포물선을 그리며 날아감',
    emoji: '🛒',
    category: '피드백',
    usage: `import { useCartFly } from './useCartFly'

const { targetRef, flyFrom } = useCartFly()

<button ref={targetRef}>🛒 {count}</button>
<button onClick={() => flyFrom({
  source: thumbnailEl,
  arc: 'horizontal-first', // 'vertical-first'면 r자 궤적
  onArrive: () => setCount((prev) => prev + 1),
})}>담기</button>`,
    Component: CartFlyDemo,
  },
  {
    slug: 'tab-indicator',
    title: '탭 인디케이터 슬라이드',
    description: '활성 탭 밑줄이 미끄러져 이동',
    emoji: '🗂️',
    category: '내비게이션',
    usage: `import { useTabIndicator } from './useTabIndicator'

const { registerTab, indicatorRef } = useTabIndicator({ activeIndex })

<nav className="tab-bar" role="tablist">
  {tabs.map((label, i) => (
    <button key={label} ref={registerTab(i)} role="tab"
      aria-selected={i === activeIndex} onClick={() => setActive(i)}>
      {label}
    </button>
  ))}
  <span ref={indicatorRef} className="tab-indicator" aria-hidden="true" />
</nav>`,
    Component: TabIndicatorDemo,
  },
  {
    slug: 'carousel',
    title: '스냅 캐러셀',
    description: '스와이프 스냅 배너·카드 슬라이더 (CSS scroll-snap)',
    emoji: '🎠',
    category: '내비게이션',
    usage: `import { useCarousel } from './useCarousel'

const { trackRef, activeIndex, goTo } = useCarousel()

<div ref={trackRef} className="carousel-track">
  {items.map((item) => (
    <div key={item} className="carousel-slide">{item}</div>
  ))}
</div>`,
    Component: CarouselDemo,
  },
  {
    slug: 'bottom-sheet',
    title: '바텀시트',
    description: '아래에서 올라오는 시트 — 드래그로 끌어내려 닫기',
    emoji: '📋',
    category: '제스처',
    usage: `import { BottomSheet } from './BottomSheet'

<BottomSheet open={open} onClose={() => setOpen(false)}>
  <ul>…메뉴 항목…</ul>
</BottomSheet>`,
    Component: BottomSheetDemo,
  },
  {
    slug: 'pull-to-refresh',
    title: '당겨서 새로고침',
    description: '최상단에서 끌어내려 갱신 — 고무줄 저항과 스피너',
    emoji: '🔄',
    category: '제스처',
    usage: `import { PullToRefresh } from './PullToRefresh'

<PullToRefresh onRefresh={reload}>
  <ul>…피드 항목…</ul>
</PullToRefresh>`,
    Component: PullToRefreshDemo,
  },
  {
    slug: 'hamburger-menu',
    title: '햄버거 메뉴',
    description: '≡가 X로 모핑하는 버튼 + 옆에서 밀려 나오는 드로어',
    emoji: '🍔',
    category: '내비게이션',
    usage: `import { HamburgerButton, Drawer } from './HamburgerMenu'

<HamburgerButton open={open} onToggle={() => setOpen(!open)} label="메뉴 열기" />
<Drawer open={open} onClose={() => setOpen(false)}>
  <nav>…메뉴 링크…</nav>
</Drawer>`,
    Component: HamburgerMenuDemo,
  },
  {
    slug: 'tooltip',
    title: '툴팁',
    description: '호버는 지연 후·포커스는 즉시 떠오르는 말풍선 — 4방향 배치',
    emoji: '💬',
    category: '피드백',
    usage: `import { Tooltip } from './Tooltip'

<Tooltip label="장바구니에 담기" place="bottom">
  <button type="button" aria-label="담기">🛒</button>
</Tooltip>`,
    Component: TooltipDemo,
  },
  {
    slug: 'select',
    title: '커스텀 셀렉트',
    description: '패널이 드롭되는 셀렉트 — 키보드 내비게이션·ARIA 콤보박스 내장',
    emoji: '🔽',
    category: '컨트롤',
    usage: `import { Select } from './Select'

<Select
  options={[{ value: 'somyeon', label: '소면' }]}
  value={value}
  onChange={setValue}
  placeholder="면 종류 선택"
/>`,
    Component: SelectDemo,
  },
  {
    slug: 'accordion',
    title: '아코디언',
    description: 'JS 측정 없는 높이 애니메이션 — grid-template-rows 0fr↔1fr',
    emoji: '🪗',
    category: '컨트롤',
    usage: `import { Accordion } from './Accordion'

<Accordion
  items={[{ id: 'takeout', title: '포장 되나요?', content: '네, 가능합니다.' }]}
/>`,
    Component: AccordionDemo,
  },
  {
    slug: 'switch',
    title: '토글 스위치',
    description: '썸 슬라이드 + 누름 스퀴시 — 네이티브 체크박스 기반이라 접근성 공짜',
    emoji: '🎚️',
    category: '컨트롤',
    usage: `import { Switch } from './Switch'

<Switch checked={extra} onChange={setExtra} label="곱빼기 (+1,000원)" />`,
    Component: SwitchDemo,
  },
  {
    slug: 'floating-label',
    title: '플로팅 라벨 입력',
    description: '라벨이 플레이스홀더 자리에서 떠오르는 입력 — 판정은 CSS만으로',
    emoji: '🏷️',
    category: '컨트롤',
    usage: `import { TextField } from './TextField'

<TextField label="예약자 이름" value={name} onChange={(e) => setName(e.target.value)} />`,
    Component: FloatingLabelDemo,
  },
  {
    slug: 'modal-dialog',
    title: '모달 다이얼로그',
    description: '백드롭 페이드 + 패널 스케일 진입 — 네이티브 dialog라 포커스 트랩·Esc 공짜',
    emoji: '🪟',
    category: '등장과 전환',
    usage: `import { Modal } from './Modal'

<Modal open={open} onClose={() => setOpen(false)} labelledBy="cancel-title">
  <h2 id="cancel-title">주문을 취소할까요?</h2>
  <button type="button" onClick={() => setOpen(false)}>돌아가기</button>
</Modal>`,
    Component: ModalDialogDemo,
  },
  {
    slug: 'checkbox-radio',
    title: '체크박스 · 라디오',
    description: '체크마크가 획으로 그려지고 라디오 도트가 튀어 맺힘 — 네이티브 input 기반',
    emoji: '☑️',
    category: '컨트롤',
    usage: `import { Checkbox } from './Checkbox'
import { Radio } from './Radio'

<Radio name="noodle" value="somyeon" checked={noodle === 'somyeon'} onChange={() => setNoodle('somyeon')} label="소면" />
<Checkbox checked={agree} onChange={(e) => setAgree(e.target.checked)} label="주문 안내에 동의합니다" />`,
    Component: CheckboxRadioDemo,
  },
  {
    slug: 'form-shake-error',
    title: '폼 에러 흔들림',
    description: '틀린 입력을 좌우로 흔들고 에러 메시지가 밀려 올라옴 — 재시작 보장',
    emoji: '🚫',
    category: '피드백',
    usage: `import { useShake, FieldError } from './ShakeField'

const field = useShake<HTMLInputElement>()
// 제출 실패 시: setError('…'); field.shake(); field.ref.current?.focus()

<input ref={field.ref} aria-invalid={Boolean(error)} aria-describedby="phone-error" />
<FieldError id="phone-error" message={error} />`,
    Component: FormShakeErrorDemo,
  },
  {
    slug: 'swipe-to-delete',
    title: '밀어서 삭제',
    description: '왼쪽으로 밀면 삭제 버튼, 끝까지 밀면 바로 삭제 — 행 높이가 접히며 사라짐',
    emoji: '🗑️',
    category: '제스처',
    usage: `import { SwipeToDelete } from './SwipeToDelete'

{items.map((item) => (
  <li key={item.id}>
    <SwipeToDelete onDelete={() => remove(item.id)}>
      <div className="cart-row">{item.name}</div>
    </SwipeToDelete>
  </li>
))}`,
    Component: SwipeToDeleteDemo,
  },
  {
    slug: 'pinch-zoom',
    title: '피드 핀치줌',
    description: '두 손가락으로 벌리면 그 자리에서 커지고 놓으면 제자리로 — 인스타 피드 관례',
    emoji: '🤏',
    category: '제스처',
    usage: `import { PinchZoom } from './PinchZoom'

<PinchZoom maxScale={4}>
  <img src={post.image} alt={post.alt} draggable={false} />
</PinchZoom>`,
    Component: PinchZoomDemo,
  },
]
