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
import { SpringPhysicsDemo } from './spring-physics/SpringPhysicsDemo'
import { SwipeDismissViewerDemo } from './swipe-dismiss-viewer/SwipeDismissViewerDemo'
import { LoadingButtonDemo } from './loading-button/LoadingButtonDemo'
import { InfiniteScrollDemo } from './infinite-scroll/InfiniteScrollDemo'
import { DragToReorderDemo } from './drag-to-reorder/DragToReorderDemo'
import { PageTransitionDemo } from './page-transition/PageTransitionDemo'
import { OtpInputDemo } from './otp-input/OtpInputDemo'
import { ThemeToggleDemo } from './theme-toggle/ThemeToggleDemo'
import { SearchSuggestDemo } from './search-suggest/SearchSuggestDemo'
import { VirtualListDemo } from './virtual-list/VirtualListDemo'
import { DropdownMenuDemo } from './dropdown-menu/DropdownMenuDemo'
import { RangeSliderDemo } from './range-slider/RangeSliderDemo'
import { QuantityStepperDemo } from './quantity-stepper/QuantityStepperDemo'
import { FileUploadDemo } from './file-upload/FileUploadDemo'
import { GlassSurfaceDemo } from './glass-surface/GlassSurfaceDemo'
import { SegmentedControlDemo } from './segmented-control/SegmentedControlDemo'
import { WheelPickerDemo } from './wheel-picker/WheelPickerDemo'
import { LongPressMenuDemo } from './long-press-menu/LongPressMenuDemo'
import { CardExpandDemo } from './card-expand/CardExpandDemo'
import { ProgressRingDemo } from './progress-ring/ProgressRingDemo'
import { CardStackDemo } from './card-stack/CardStackDemo'
import { StretchyHeaderDemo } from './stretchy-header/StretchyHeaderDemo'
import { EdgeSwipeBackDemo } from './edge-swipe-back/EdgeSwipeBackDemo'
import { MotionPrinciplesDemo } from './motion-principles/MotionPrinciplesDemo'
import { MotionAuditDemo } from './motion-audit/MotionAuditDemo'

export type DemoCategory = '등장과 전환' | '로딩과 진행' | '피드백' | '내비게이션' | '제스처' | '컨트롤' | '표면과 스타일' | '원칙과 검토'

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

export const CATEGORIES: DemoCategory[] = ['등장과 전환', '로딩과 진행', '피드백', '내비게이션', '제스처', '컨트롤', '표면과 스타일', '원칙과 검토']

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
    slug: 'loading-button',
    title: '로딩 버튼',
    description: '제출 버튼이 스스로 진행 상태를 보여줌 — 연타해도 요청은 한 번만',
    emoji: '⏳',
    category: '로딩과 진행',
    usage: `import { LoadingButton } from './LoadingButton'

<LoadingButton
  onAction={() => placeOrder({ menu: 'myeolchi' })}
  loadingLabel="주문 중"
  successLabel="주문 완료"
>
  주문하기
</LoadingButton>`,
    Component: LoadingButtonDemo,
  },
  {
    slug: 'infinite-scroll',
    title: '무한 스크롤',
    description: '목록 끝에 닿기 전에 다음 페이지를 미리 불러옴 — 중복 호출·실패 폭주 차단',
    emoji: '♾️',
    category: '로딩과 진행',
    usage: `import { useInfiniteScroll } from './useInfiniteScroll'

const feed = useInfiniteScroll({
  hasMore,
  loadMore: async () => {
    const page = await fetchMenus({ cursor })
    setItems((prev) => [...prev, ...page.items])
    setCursor(page.nextCursor)
  },
})

<div ref={feed.sentinelRef} className="infinite-sentinel" aria-hidden="true" />`,
    Component: InfiniteScrollDemo,
  },
  {
    slug: 'virtual-list',
    title: '가상 스크롤',
    description: '항목이 5만 개여도 화면에 보이는 20여 개만 그림 — DOM 수는 그대로',
    emoji: '🪟',
    category: '로딩과 진행',
    usage: `import { useVirtualList } from './useVirtualList'

const ITEM_HEIGHT = 56
const list = useVirtualList({ itemCount: orders.length, itemHeight: ITEM_HEIGHT })

<div ref={list.containerRef} className="virtual-viewport">
  <div className="virtual-sizer" style={{ height: list.range.totalHeight }}>
    <div className="virtual-window" style={{ transform: \`translateY(\${list.range.offsetY}px)\` }}>
      {list.indexes.map((i) => (
        <div key={orders[i].id} className="virtual-item">{orders[i].name}</div>
      ))}
    </div>
  </div>
</div>`,
    Component: VirtualListDemo,
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
    slug: 'page-transition',
    title: '화면 전환',
    description: '들어갈 때는 오른쪽에서 덮고 뒤로 갈 때는 반대로 — 헤더·탭바는 제자리, 스크롤은 복원',
    emoji: '📱',
    category: '내비게이션',
    usage: `import { usePageStack } from './usePageStack'

const stack = usePageStack({ initial: { name: 'list' } })

<header>{stack.canGoBack && <button onClick={stack.back}>← 뒤로</button>}</header>

{/* 이 영역만 전환된다 — 헤더는 제자리를 지킨다 */}
<main data-page-view>
  {stack.current.name === 'list'
    ? <MenuList onSelect={(id) => stack.push({ name: 'detail', id })} />
    : <MenuDetail id={stack.current.id} />}
</main>`,
    Component: PageTransitionDemo,
  },
  {
    slug: 'dropdown-menu',
    title: '드롭다운 메뉴',
    description: '⋯ 버튼의 액션 메뉴 — 아래가 좁으면 위로 뒤집히고, 방향키·첫 글자로 이동',
    emoji: '⋯',
    category: '내비게이션',
    usage: `import { DropdownMenu } from './DropdownMenu'

<DropdownMenu
  label="주문 관리"
  align="end"
  items={[
    { id: 'receipt', label: '영수증 보기', onSelect: openReceipt },
    { id: 'cancel', label: '주문 취소', onSelect: cancel, danger: true },
  ]}
/>`,
    Component: DropdownMenuDemo,
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
    slug: 'otp-input',
    title: '인증번호 입력',
    description: '치면 다음 칸으로, 지우면 앞 칸으로 — 복사한 6자리는 칸마다 하나씩 나뉨',
    emoji: '🔢',
    category: '컨트롤',
    usage: `import { OtpInput, type OtpHandle } from './OtpInput'

const otp = useRef<OtpHandle>(null)

<OtpInput
  ref={otp}
  onComplete={async (code) => {
    if (await confirmCode(code)) return goNext()
    otp.current?.shake()
    otp.current?.clear()
  }}
/>`,
    Component: OtpInputDemo,
  },
  {
    slug: 'search-suggest',
    title: '검색어 자동완성',
    description: '입력이 멈춘 뒤 한 번만 요청 — 늦게 온 옛 응답이 최신 목록을 덮지 않음',
    emoji: '🔎',
    category: '컨트롤',
    usage: `import { useSearchSuggest } from './useSearchSuggest'

const search = useSearchSuggest({
  fetchSuggestions: ({ query, signal }) =>
    fetch(\`/api/menus?q=\${query}\`, { signal }).then((res) => res.json()),
  toText: (menu) => menu.name,
  onSelect: (menu) => goToMenu(menu.id),
})

<div className="suggest-root">
  <input {...search.inputProps} className="suggest-input" />
  {search.isOpen && (
    <ul {...search.listProps} className="suggest-panel">
      {search.items.map((menu, i) => (
        <li key={menu.id} {...search.getOptionProps(i)} className="suggest-option">
          {menu.name}
        </li>
      ))}
    </ul>
  )}
</div>`,
    Component: SearchSuggestDemo,
  },
  {
    slug: 'range-slider',
    title: '범위 슬라이더',
    description: '두 손잡이로 가격대를 고름 — 서로를 지나치지 않고, 겹쳐도 잡힘',
    emoji: '🎚️',
    category: '컨트롤',
    usage: `import { RangeSlider } from './RangeSlider'

const [price, setPrice] = useState({ lower: 8000, upper: 20000 })

<RangeSlider
  min={0}
  max={50000}
  step={1000}
  value={price}
  onChange={setPrice}
  minDistance={1000}
  label={{ lower: '최저 가격', upper: '최고 가격' }}
  format={(v) => \`\${v.toLocaleString('ko-KR')}원\`}
/>`,
    Component: RangeSliderDemo,
  },
  {
    slug: 'quantity-stepper',
    title: '수량 스테퍼',
    description: '− / + 로 수량 조절 — 누르고 있으면 점점 빨라지고, 1에서 −는 삭제로',
    emoji: '🔢',
    category: '컨트롤',
    usage: `import { QuantityStepper } from './QuantityStepper'

<QuantityStepper
  value={item.count}
  onChange={(count) => updateCount({ id: item.id, count })}
  min={1}
  max={20}
  label={\`\${item.name} 수량\`}
  onBelowMin={() => removeFromCart(item.id)}
/>`,
    Component: QuantityStepperDemo,
  },
  {
    slug: 'file-upload',
    title: '파일 업로드',
    description: '끌어다 놓으면 테두리가 살아나고 미리보기·진행률이 붙음 — 거절엔 이유가 따라옴',
    emoji: '📎',
    category: '컨트롤',
    usage: `import { FileDropZone } from './FileDropZone'

<FileDropZone
  files={files}
  onAdd={startUpload}
  onRemove={(id) => setFiles((prev) => prev.filter((f) => f.id !== id))}
  onReject={(rejections) => setMessage(describe(rejections))}
  accept="image/*"
  maxSizeBytes={5 * 1024 * 1024}
  maxFiles={5}
/>`,
    Component: FileUploadDemo,
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
  {
    slug: 'spring-physics',
    title: '스프링 물리 모션',
    description: 'duration 대신 강성·감쇠로 — 던진 속도를 이어받고 도중에 목표가 바뀌어도 끊기지 않음',
    emoji: '🪀',
    category: '등장과 전환',
    usage: `import { useSpring } from './useSpring'

const x = useSpring({ onUpdate: (v) => { el.current.style.transform = \`translateX(\${v}px)\` } })

// 드래그 중: x.set(x.get() + e.movementX)
// 놓는 순간: x.to(0, velocityPxPerSec)`,
    Component: SpringPhysicsDemo,
  },
  {
    slug: 'theme-toggle',
    title: '다크모드 전환',
    description: '누른 지점에서 원이 퍼지며 테마가 덮임 — 선택 기억·기기 설정 따라가기',
    emoji: '🌗',
    category: '등장과 전환',
    usage: `import { ThemeToggle } from './ThemeToggle'

<header>
  <h1>성수동 손칼국수</h1>
  <ThemeToggle />
</header>

/* 색은 프로젝트가 정의한다 */
:root[data-theme='dark'] {
  --bg: #0f1115;
  --text: #e8eaf0;
  color-scheme: dark;
}`,
    Component: ThemeToggleDemo,
  },
  {
    slug: 'swipe-dismiss-viewer',
    title: '끌어내려 닫는 뷰어',
    description: '이미지를 끌면 작아지며 뒤가 비치고, 놓으면 썸네일 자리로 스프링 복귀 — iOS 사진·인스타 관례',
    emoji: '🖼️',
    category: '제스처',
    usage: `import { SwipeDismissViewer } from './SwipeDismissViewer'

{open && (
  <SwipeDismissViewer
    src={open.src}
    alt={open.alt}
    returnTo={{ current: thumbs.current[open.id] }}
    onClose={() => setOpenId(null)}
  />
)}`,
    Component: SwipeDismissViewerDemo,
  },
  {
    slug: 'drag-to-reorder',
    title: '끌어서 순서 바꾸기',
    description: '손잡이를 끌면 항목이 떠오르고 지나친 항목이 자리를 비켜 줌 — 방향키로도 이동',
    emoji: '🧲',
    category: '제스처',
    usage: `import { useDragReorder } from './useDragReorder'

const reorder = useDragReorder({ onReorder: move })

<ul ref={reorder.containerRef} className="reorder-list">
  {todos.map((todo) => (
    <li key={todo.id} data-reorder-id={todo.id} className="reorder-item">
      <button {...reorder.getHandleProps({ label: todo.text })}>⠿</button>
      <span>{todo.text}</span>
    </li>
  ))}
</ul>`,
    Component: DragToReorderDemo,
  },
  {
    slug: 'glass-surface',
    title: '유리판 (글라스모피즘)',
    description: '뒤 배경이 흐릿하게 비치는 반투명 유리 카드·GNB·모달 — 흐림을 못 쓰면 불투명 판으로 자동 전환',
    emoji: '🪟',
    category: '표면과 스타일',
    usage: `import { Glass } from './Glass'

<Glass as="header" variant="nav" tone="dark">국수집</Glass>

<Glass as="article" variant="card" interactive>
  <h3>잔치국수</h3>
  <p>멸치 육수에 소면 · 7,000원</p>
</Glass>

<dialog className="glass glass-modal">…</dialog>`,
    Component: GlassSurfaceDemo,
  },
  {
    slug: 'segmented-control',
    title: '세그먼트 컨트롤',
    description: '선택 칸 뒤로 알약 배경이 미끄러지는 iOS 세그먼트 — 네이티브 라디오 그룹이라 방향키·스크린 리더 공짜',
    emoji: '🎛️',
    category: '컨트롤',
    usage: `import { SegmentedControl } from './SegmentedControl'

const ORDERS = [
  { value: 'dine-in', label: '매장' },
  { value: 'takeout', label: '포장' },
]

const [order, setOrder] = useState('dine-in')

<SegmentedControl name="order" label="주문 방식" options={ORDERS} value={order} onChange={setOrder} />`,
    Component: SegmentedControlDemo,
  },
  {
    slug: 'wheel-picker',
    title: '휠 피커',
    description: 'iOS 드럼처럼 굴려서 고르는 원통형 선택기 — 가운데 스냅·3D 기울기·페이드, 클릭·키보드 병행',
    emoji: '🎡',
    category: '컨트롤',
    usage: `import { useState } from 'react'
import { WheelPicker } from './WheelPicker'

const HOURS = Array.from({ length: 11 }, (_, i) => ({ value: String(11 + i), label: \`\${11 + i}시\` }))

const ReservationHour = () => {
  const [hour, setHour] = useState('18')
  return <WheelPicker aria-label="시" options={HOURS} value={hour} onChange={setHour} visibleCount={5} />
}`,
    Component: WheelPickerDemo,
  },
  {
    slug: 'long-press-menu',
    title: '길게 눌러 메뉴',
    description: '길게 누르면 항목이 떠오르고 뒤가 흐려지며 옆에 메뉴 — 데스크톱은 우클릭, iOS 홈 화면 관례',
    emoji: '👆',
    category: '제스처',
    usage: `import { LongPressMenu } from './LongPressMenu'

<LongPressMenu
  label={\`\${item.name} 동작\`}
  items={[
    { label: '장바구니 담기', onSelect: () => addToCart(item) },
    { label: '즐겨찾기', onSelect: () => favorite(item) },
    { label: '숨기기', onSelect: () => hide(item), destructive: true },
  ]}
>
  <article className="menu-card">{item.name}</article>
</LongPressMenu>`,
    Component: LongPressMenuDemo,
  },
  {
    slug: 'card-expand',
    title: '카드 확장',
    description: '누른 카드가 제자리에서 자라나 상세 화면이 되고, 닫으면 그 자리로 줄어든다 — 그림·제목은 따로 이어져 움직인다',
    emoji: '🃏',
    category: '등장과 전환',
    usage: `import { useCardExpand } from './useCardExpand'

const { expandedId, expand, collapse } = useCardExpand({ containerRef, detailRef })

<div ref={containerRef} className="card-expand-container">
  <ul inert={expandedId !== null}>
    <button data-card-id={pick.id} onClick={(e) => expand({ id: pick.id, card: e.currentTarget })}>
      <span data-card-expand-part="media">{pick.emoji}</span>
      <span data-card-expand-part="title">{pick.title}</span>
    </button>
  </ul>
  {current && (
    <article ref={detailRef} className="card-expand-detail" role="dialog">
      <button className="card-expand-close" onClick={collapse}>×</button>
      <div data-card-expand-part="media">{current.emoji}</div>
      <h2 data-card-expand-part="title">{current.title}</h2>
    </article>
  )}
</div>`,
    Component: CardExpandDemo,
  },
  {
    slug: 'progress-ring',
    title: '원형 진행 링',
    description: '애플워치 활동 링처럼 원이 채워지는 진행 표시 — 값이 바뀌면 CSS transition으로 따라가고 3중 링·무한 로딩 지원',
    emoji: '⭕',
    category: '로딩과 진행',
    usage: `import { ProgressRing } from './ProgressRing'
import { ActivityRings } from './ActivityRings'

<ProgressRing value={percent} max={100} size={140} label="주문 준비 진행률">
  <strong>{Math.round(percent)}%</strong>
</ProgressRing>

<ActivityRings
  size={180}
  rings={[
    { value: 96, max: 120, color: '#ff6b6b', label: '판매 그릇 수' },
    { value: 130, max: 200, color: '#ffd166', label: '만두 빚기' },
  ]}
/>`,
    Component: ProgressRingDemo,
  },
  {
    slug: 'card-stack',
    title: '카드 묶음',
    description: '애플 지갑식 카드 스택 — 겹침에서 펼치고, 하나를 고르면 맨 위로 올라오고 나머지는 아래로 내려가 겹친다',
    emoji: '🗂️',
    category: '등장과 전환',
    usage: `import { CardStack } from './CardStack'

const CARDS = [
  { id: 'points', render: () => <div className="wallet-card points">적립 카드</div> },
  { id: 'coupon', render: () => <div className="wallet-card coupon">손만두 1인분 무료</div> },
  { id: 'prepaid', render: () => <div className="wallet-card prepaid">선불 카드 32,000원</div> },
]

<CardStack cards={CARDS} cardHeight={180} peekPx={56} fanGapPx={72} label="국수집 멤버십 카드" />`,
    Component: CardStackDemo,
  },
  {
    slug: 'stretchy-header',
    title: '늘어나는 이미지 헤더',
    description: '위로 스크롤하면 이미지가 느리게 밀리며 어두워지고, 맨 위에서 당기면 늘어났다 돌아옴',
    emoji: '🖼️',
    category: '등장과 전환',
    usage: `import { useStretchyHeader } from './useStretchyHeader'

const { containerRef, imageRef } = useStretchyHeader({ headerHeight: 240 })

<div ref={containerRef} className="stretchy-container">
  <div className="stretchy-header">
    <div className="stretchy-header-clip">
      <img ref={imageRef} className="stretchy-header-image" src="/shop.jpg" alt="" />
    </div>
    <div className="stretchy-header-overlay"><h1>성수동 손칼국수</h1></div>
  </div>
  <main>…본문…</main>
</div>`,
    Component: StretchyHeaderDemo,
  },
  {
    slug: 'edge-swipe-back',
    title: '가장자리 스와이프 뒤로가기',
    description: '왼쪽 가장자리를 끌면 현재 화면이 손가락을 따라 밀리고 이전 화면이 따라 나온다 — 놓으면 거리·속도로 판정해 스프링으로 가거나 되돌아온다',
    emoji: '👈',
    category: '제스처',
    usage: `import { useEdgeSwipeBack } from './useEdgeSwipeBack'

const { containerRef, screenRef, underlayRef, dimRef } = useEdgeSwipeBack({
  canGoBack: stack.length > 1,
  onBack: () => setStack((prev) => prev.slice(0, -1)), // 훅이 flushSync로 감싼다
})

<div ref={containerRef} className="edge-swipe">
  <div ref={underlayRef} className="edge-swipe-underlay" aria-hidden="true">{previous}</div>
  <div ref={dimRef} className="edge-swipe-dim" aria-hidden="true" />
  <div ref={screenRef} className="edge-swipe-screen">{current}</div>
</div>`,
    Component: EdgeSwipeBackDemo,
  },
  {
    slug: 'motion-principles',
    title: '모션 원칙과 토큰',
    description: '앱 전체의 시간·이징·스태거·reduced-motion 기준을 토큰 한 벌로 — 이징을 나란히 비교하고 시간 단계를 골라 본다',
    emoji: '📐',
    category: '원칙과 검토',
    usage: `/* motion-tokens.css를 전역에서 불러온 뒤, 스킬들의 공개 변수를 토큰에 연결 */
:root {
  --sheet-duration: var(--motion-duration-slow);
  --toast-duration: var(--motion-duration-base);
  --tooltip-duration: var(--motion-duration-fast);
  --fx-ease: var(--motion-ease-out);
}

.card {
  transition: transform var(--motion-duration-base) var(--motion-ease-out);
}
.card[data-state='exiting'] {
  transition-duration: calc(var(--motion-duration-base) * var(--motion-exit-ratio));
}`,
    Component: MotionPrinciplesDemo,
  },
  {
    slug: 'motion-audit',
    title: '모션 검사',
    description: 'CSS·JS를 훑어 레이아웃 속성 애니메이션·reduced-motion 누락·시간 범위 밖 같은 문제를 file:line으로 찾고 고치는 법을 알려줌',
    emoji: '🔍',
    category: '원칙과 검토',
    usage: `# 폴더 전체 검사 — error가 있으면 exit 1
node tools/motion-audit/audit.mjs src/

# 프로그램에서
import { auditMotion, formatFindings } from './auditMotion'
const findings = auditMotion([{ file: 'menu.css', text: cssSource }])
console.log(formatFindings(findings))
// menu.css:41 [error] layout-animation — height를 transition — 매 프레임 레이아웃이 돈다
//     → 높이 변화는 grid-template-rows: 0fr→1fr (accordion 스킬) 또는 transform: scaleY`,
    Component: MotionAuditDemo,
  },
]
