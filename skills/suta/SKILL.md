---
name: suta
description: 웹 프론트엔드 UI를 만들거나 고칠 때 AI 슬롭(AI slop) — 모든 것을 감싼 카드와 제각각인 여백, 아무 데나 붙인 transition, 레이아웃을 흔드는 애니메이션, 동작 줄이기 설정 무시, 키보드로 못 쓰는 컴포넌트처럼 AI가 만든 티가 나는 UI — 을 없앤다. 이를 막는 레이아웃·모션 기준과 검증된 UI 패턴 55종의 코드(모달·바텀시트·토스트·드롭다운·캐러셀·탭·폼·제스처)를 제공한다. "로그인·목록·상세·설정 화면 만들어줘, 페이지 구현, 컴포넌트 추가, 레이아웃·여백 다듬어줘, 버튼 애니메이션 넣어줘, 인터랙션 다듬어줘, 모바일 제스처, AI 티 안 나게" 요청과 UI, landing page, screen, layout, spacing, component, modal, dropdown, toast, animation, micro-interaction, keyboard accessibility 작업에 쓴다. 화면이 없는 백엔드·데이터·문서 작업에는 쓰지 않는다.
---

# suta — AI 슬롭 없는 UI

AI에게 UI를 맡기면 어디서 본 듯한, 티 나는 결과가 나온다. 모든 섹션을 카드로 감싸고 간격을 한 값으로 맞추고, 그라데이션과 배지로 꾸민다. 모든 요소에 `transition: all`을 붙이고, `height`·`top`을 움직여 화면이 버벅이고, 동작 줄이기 설정을 무시하고, `div`에 `onClick`을 달아 키보드로 쓸 수 없게 만든다. 이 스킬은 그런 UI가 나오지 않게 한다. 아래 금지선을 지키고, 검증된 패턴 55종(테스트·접근성·reduced-motion을 갖춘 코드)을 프로젝트에 맞게 가져다 쓴다.

수타(手打)는 기계가 아니라 손으로 친다는 뜻이다. 찍어낸 UI가 아니라 손으로 다듬은 UI를 목표로 한다.

## 폴더 지도

| 경로 | 내용 |
|---|---|
| `SKILL.md` | 이 문서 — 작업 절차, 금지선, 레이아웃·모션 값, 패턴 카탈로그 |
| `patterns/{패턴}/PATTERN.md` | 패턴 설명서 — 언제 쓰는가, 왜 이 기술인가, 파일 표, 사용법(React / 순수 JS), 커스터마이즈, 주의사항 |
| `patterns/{패턴}/assets/` | 복사해 쓰는 코드 — 프레임워크 무관 코어(.ts, 의존성 0) + React 래퍼(.tsx) + CSS |
| `scripts/audit.mjs` | 통합 검사 — 레이아웃·모션 규칙을 한 번에 돌린다. 편집 후 검사 훅(`scripts/post-edit-hook.mjs`)도 같은 검사를 쓴다 |

## 작업 절차

1. **프로젝트를 먼저 읽는다.** 프레임워크(React·Vue·Svelte·순수 JS), TypeScript 여부, 스타일 방식(CSS 파일·CSS Modules·Tailwind), 기존 디자인 토큰과 컴포넌트를 확인한다. 이미 있는 체계가 우선이다 — 패턴은 그 위에 얹는다.
2. **순서부터 정한다.** 화면에 들어갈 요소를 적고 순위를 매긴다. 1순위는 하나다. 넣을 이유를 한 문장으로 말할 수 없는 요소는 뺀다. 그 순서를 크기·굵기·간격·정렬로 보이고, 카드·그라데이션·배지는 마지막에 한두 곳만 쓴다(`patterns/layout-principles/PATTERN.md`).
3. **금지선을 확인한다.** 아래 "AI 슬롭 금지선"은 맞는 패턴이 없는 UI에도 적용된다.
4. **카탈로그에서 패턴을 고른다.** 요청을 화면 요소로 쪼개 맞는 패턴을 모두 고른다. 예: "국수집 주문 화면" → `quantity-stepper`(수량)·`bottom-sheet`(옵션)·`loading-button`(주문)·`toast-stack`(담김 알림). 맞는 패턴이 없으면 금지선만으로 구현한다.
5. **고른 패턴의 `patterns/{패턴}/PATTERN.md`를 끝까지 읽는다.** 주의사항에 접근성·성능 함정이 적혀 있다.
6. **`assets/`를 프로젝트에 복사해 맞춘다.** PATTERN.md 파일 표의 "복사 대상"을 따른다.
   - 첫 줄이 `@shared-core`인 파일은 그 헤더를 지우지 않는다 — 같은 코드가 다른 패턴에도 들어 있다는 표시다.
   - JavaScript 프로젝트면 타입 표기만 벗긴다. 로직은 그대로다.
   - React가 아니면 코어(.ts)와 CSS만 쓰고, 상태 연결은 그 프레임워크의 방식으로 한다.
   - 다른 패턴의 코드가 필요하면 import 경로로 엮지 말고 그 파일을 함께 복사한다.
7. **값을 토큰에 연결한다.** 프로젝트에 기준이 없으면 `patterns/layout-principles/assets/layout-tokens.css`(간격·글자·굵기·반경)와 `patterns/motion-principles/assets/motion-tokens.css`(시간·이징)를 함께 넣는다. 컴포넌트에서는 숫자 대신 토큰을 쓰고, 패턴의 공개 변수(`--sheet-duration` 같은)를 토큰에 연결한다.
8. **검사한다.** `node <이 스킬 폴더>/scripts/audit.mjs <바꾼 파일·폴더>`를 실행해 error가 0이 될 때까지 고친다. 레이아웃·모션 규칙이 한 번에 돈다. warn은 원칙을 보고 판단한다. Node 22.18 이상이 필요하다. 실행할 수 없으면 `patterns/layout-audit/PATTERN.md`·`patterns/motion-audit/PATTERN.md`의 규칙표로 직접 확인한다.
   - 플러그인으로 설치했으면 파일을 고칠 때마다 같은 검사가 자동으로 돈다. error는 바로 돌려받으니 그 자리에서 고친다.
9. **마무리 체크리스트를 확인한다**(아래).
10. **어떤 패턴을 왜 썼는지 1~2줄로 보고한다.**

## AI 슬롭 금지선

### 레이아웃

| AI가 흔히 하는 것 | 대신 | 근거 패턴 |
|---|---|---|
| 모든 섹션·목록 행을 테두리+그림자+둥근 카드로 감싸고, 카드 안에 상자를 또 넣는다 | 간격과 얇은 선으로 묶는다. 카드는 독립 단위에 한 겹만 | `layout-principles`, `layout-audit` |
| 모든 간격이 같은 값 | 묶음 안 간격 ≤ 묶음 사이 간격의 1/2. 값은 4px 척도에서만 | `layout-principles` |
| 지표 숫자와 라벨이 비슷한 크기, 라벨까지 모두 굵게 | 숫자는 라벨의 2~3배. 굵기는 3종, 굵게는 영역마다 한 줄 | `layout-principles` |
| 그라데이션·글로우·글래스·채운 버튼을 여러 곳에 | 강한 효과와 채운 강조색은 화면마다 한 곳(주 행동) | `layout-principles`, `layout-audit` |
| 카드마다 색 배지·알약 태그, 아이콘마다 색 원 배경 | 회색 글자나 옅은 테두리, 배경 없는 단색 아이콘 | `layout-principles` |
| 제목·문단을 모두 가운데 정렬, 금액을 왼쪽 정렬 | 왼쪽 선 하나. 가운데는 짧은 한 줄만, 금액은 오른쪽 한 열 + `tabular-nums` | `layout-principles` |
| 좁은 화면에서 열을 유지하고 글자를 9~11px로 줄인다 | 열을 줄인다. 글자 12px 이상, 모바일 본문 14px 이상, 누르는 영역 44px | `layout-audit` |
| 화면을 채우려 카드·이미지를 폭 가득 늘린다 | 최대 폭(글은 65ch)을 두고, 넓은 화면은 열을 더한다 | `layout-principles` |
| 사진 위에 글을 바로 얹고, 사진이 늘어난다 | 글은 사진 밖으로(얹을 때는 스크림). `aspect-ratio` + `object-fit: cover` | `layout-principles` |
| 반경·글자 크기 값이 제각각, 짧은 영어 더미로만 확인 | 토큰에서만 고른다. 가장 긴 값·빈 값·320px 폭으로 확인한다 | `layout-principles` |

### 모션

| AI가 흔히 하는 것 | 대신 | 근거 패턴 |
|---|---|---|
| `transition: all` | 움직일 속성을 이름으로 나열한다 | `motion-audit` |
| `width`·`height`·`top`·`left`·`margin` 애니메이션 | `transform`·`opacity`만 움직인다. 높이는 `grid-template-rows: 0fr → 1fr`, 위치 변화는 FLIP | `accordion`, `flip-list` |
| 모든 것에 300ms `ease` | 크기에 맞는 시간(아래 "모션 값")과 들어올 때 ease-out | `motion-principles` |
| 퇴장에 ease-in, 진입과 같은 길이 | 퇴장도 ease-out, 시간은 진입의 3/4 | `motion-principles` |
| 이동에 `linear` | linear는 진행률·스피너처럼 시간에 비례하는 것에만 | `motion-principles` |
| 장식용 무한 반복 | 하루에 100번 보는 것은 움직이지 않는다. 모션은 "무슨 일이 일어났는지" 알릴 때만 쓴다 | `motion-principles` |
| 목록 20개를 하나씩 늦게 등장 | 30ms 간격, 처음 10개까지만 | `motion-principles` |
| `setInterval`로 스타일 갱신 | CSS transition, 필요하면 `requestAnimationFrame` | `motion-audit` |
| 드래그를 놓으면 정해진 시간으로 튕겨 돌아감 | 놓는 순간의 속도를 이어받는 스프링 | `spring-physics` |

### 상호작용·피드백

| AI가 흔히 하는 것 | 대신 | 근거 패턴 |
|---|---|---|
| 눌러도 아무 반응이 없음 | 누르는 순간 살짝 줄어들고 놓으면 돌아온다 | `press-feedback` |
| 로딩은 스피너 하나, 연타하면 두 번 제출 | 자리를 잡는 스켈레톤, 진행 중에는 버튼을 잠근다 | `skeleton`, `loading-button` |
| 끌어서 닫기가 손가락을 따라오지 않음 | 드래그 중에는 손가락을 따라가고, 거리·속도로 닫을지 판정한다 | `bottom-sheet`, `swipe-dismiss-viewer` |
| 늦게 온 검색 응답이 최신 결과를 덮음 | 입력이 멈춘 뒤 한 번만 요청하고, 옛 응답은 버린다 | `search-suggest` |
| 무한 스크롤의 중복 호출·연쇄 로딩 | 미리 불러오되 중복·연쇄·실패 폭주를 막고, "더 보기" 버튼을 함께 둔다 | `infinite-scroll` |
| 제스처와 페이지 스크롤이 충돌 | `touch-action`으로 제스처 방향을 지정한다 | `bottom-sheet`, `swipe-to-delete` |

### 접근성

| AI가 흔히 하는 것 | 대신 | 근거 패턴 |
|---|---|---|
| `div`에 `onClick` | `button`·`a`·`input`·`dialog` 같은 기본 요소 — 키보드와 스크린 리더가 그냥 된다 | `switch`, `checkbox-radio`, `modal-dialog` |
| 포커스 표시를 지움 | `:focus-visible`로 키보드 사용자에게만 보인다 | `dropdown-menu`, `quantity-stepper` |
| 모달·시트를 열어도 포커스·Esc·스크롤이 그대로 | 열면 포커스를 옮기고, Esc로 닫고, 배경을 `inert`로 막고, 닫으면 원래 자리로 포커스를 돌려준다 | `modal-dialog`, `bottom-sheet` |
| 알림·로딩 결과를 눈으로만 알림 | `role="status"`·`aria-live`로 읽어 준다 | `toast-stack`, `infinite-scroll` |
| 동작 줄이기 설정을 무시 | 모든 CSS에 `@media (prefers-reduced-motion: reduce)` — 이동·확대를 끄고 짧은 페이드만 남긴다 | 모든 패턴 |
| 마우스 호버로만 열리는 기능 | 키보드 포커스와 터치로도 열린다(길게 누르기·포커스) | `tooltip`, `long-press-menu` |

### CSS 구조

| AI가 흔히 하는 것 | 대신 | 근거 |
|---|---|---|
| 애니메이션 라이브러리부터 설치 | CSS로 되면 CSS로, 제스처·물리만 TypeScript로(의존성 0) | 모든 패턴 |
| 값을 곳곳에 하드코딩 | 공개 변수 `--{패턴}-xxx` + 내부 폴백 `--_xxx` | 모든 패턴 |
| 상시 `will-change` | 움직이기 직전 상태에서만 | `motion-audit` |
| 한국어 문구가 단어 중간에서 줄바꿈 | `word-break: keep-all` | 한국어 조판 |

## 레이아웃 값

| 무엇 | 값 |
|---|---|
| 간격 척도 | 4·8·12·16·24·32·48·64px — 묶음 안 8, 묶음 사이 24, 구역 사이 48 |
| 글자 크기 | 12(하한)·14(모바일 본문 하한)·16(본문)·20(섹션 제목)·24(화면 제목)·32(핵심 수치)·40px — 한 화면에 4~5종 |
| 굵기 | 400·600·700 |
| 모서리 반경 | 8(입력칸·버튼)·12(카드)·24px(시트) + 완전 둥근 것 |
| 폭·크기 | 글 덩어리 최대 65ch, 누르는 영역 44px, 입력칸·주 버튼 높이 48px |
| 이미지 비율 | 1:1·4:3·16:9 중 2~3개만, 한 목록은 한 비율 |

전체 토큰과 원칙 12개, 반대로 읽히는 조언의 판단 기준은 `patterns/layout-principles/PATTERN.md`에 있다.

## 모션 값

| 무엇이 움직이는가 | 시간 | 이징 |
|---|---|---|
| 색·불투명도 상태 변화(hover·pressed·포커스 링) | 100ms | ease-out `cubic-bezier(0.22, 1, 0.36, 1)` |
| 작은 요소의 등장·퇴장(툴팁·토글·체크) | 150ms | ease-out |
| 컴포넌트 전환(탭·아코디언·드롭다운·토스트) | 250ms | ease-out |
| 화면 크기의 이동(시트·모달·사이드 패널) | 350ms | drawer `cubic-bezier(0.32, 0.72, 0, 1)` |
| 화면 전환·카드 확장 | 420ms | drawer |
| 한 자리에서 다른 자리로(재배치·스냅) | 거리 기준 | in-out `cubic-bezier(0.65, 0, 0.35, 1)` |
| 살짝 넘쳤다 돌아옴(좋아요·체크 팝) | 150~250ms | overshoot `cubic-bezier(0.34, 1.56, 0.64, 1)` |

퇴장은 진입 × 0.75, 스태거는 30ms. reduced-motion에서는 1ms·80ms·120ms로 줄인다(0ms로 두면 `transitionend`가 오지 않는다). 전체 토큰과 고르는 원칙은 `patterns/motion-principles/PATTERN.md`에 있다.

## 마무리 체크리스트

- [ ] 1순위 요소가 하나다 — 가장 큰 글자 하나, 채운 주 버튼 하나.
- [ ] 상자 안에 상자가 없고, 묶음은 간격(묶음 안 ≤ 묶음 사이의 1/2)으로 보인다.
- [ ] 간격·글자 크기·반경은 토큰(척도)에서만 골랐고, 글자는 12px 이상이다.
- [ ] 가장 긴 값·빈 값·320px 폭에서 깨지지 않는다.
- [ ] 움직이는 속성이 `transform`·`opacity`뿐이다(예외는 근거를 주석으로 남겼다).
- [ ] 새로 쓴 CSS마다 reduced-motion 블록이 있다.
- [ ] 클릭할 수 있는 것은 모두 키보드로 닿고, 포커스가 보인다.
- [ ] 열리고 닫히는 것(모달·시트·메뉴)은 Esc로 닫히고 포커스가 돌아온다.
- [ ] 상태 변화(저장됨·오류·로딩 끝)는 스크린 리더에도 전달된다.
- [ ] 통합 검사(`scripts/audit.mjs`) error가 0이다.

## 패턴 카탈로그

요청에 맞는 패턴을 고른 뒤 그 `PATTERN.md`를 읽는다. 요약은 각 PATTERN.md의 description 첫 문장이다.

<!-- catalog:start -->
### 등장과 전환

| 패턴 | 무엇을 하나 |
|---|---|
| [`enter-exit`](patterns/enter-exit/PATTERN.md) | React 요소의 진입/퇴장(enter/exit) 애니메이션을 구현한다. |
| [`scroll-reveal`](patterns/scroll-reveal/PATTERN.md) | 스크롤로 뷰포트에 들어올 때 요소가 차례로 나타나는 스크롤 등장 애니메이션(scroll reveal, fade in on scroll)을 구현한다. |
| [`sticky-header`](patterns/sticky-header/PATTERN.md) | 스크롤하면 큰 제목이 밀려 나가고 상단 고정 헤더에 작은 컴팩트 제목이 나타나는 스티키 헤더(sticky header)를 구현한다. |
| [`flip-list`](patterns/flip-list/PATTERN.md) | 리스트 정렬·필터·추가·삭제로 순서를 바꿀 때 항목들이 순간이동하지 않고 미끄러져 자리를 잡는 FLIP 재배치 애니메이션(list reorder animation)을 구현한다. |
| [`zoom-lightbox`](patterns/zoom-lightbox/PATTERN.md) | 썸네일을 누르면 그 요소가 화면 가운데로 커지는 라이트박스(lightbox) 확대 전환을 구현한다. |
| [`modal-dialog`](patterns/modal-dialog/PATTERN.md) | 화면 가운데 창을 띄우고 뒤 배경을 어둡게 잠그는 모달 다이얼로그(modal dialog) 컴포넌트를 구현한다. |
| [`spring-physics`](patterns/spring-physics/PATTERN.md) | 스프링 물리 모션 유틸(spring physics)을 구현한다. |
| [`theme-toggle`](patterns/theme-toggle/PATTERN.md) | 다크모드 전환(dark mode toggle)을 구현한다 — 누른 지점에서 원이 퍼지며 테마가 바뀌고, 선택은 저장되며, 고르지 않았으면 기기 설정을 따른다. |
| [`card-expand`](patterns/card-expand/PATTERN.md) | 카드가 제자리에서 자라나 상세 화면이 되는 공유 요소 전환(shared element transition)을 구현한다. |
| [`card-stack`](patterns/card-stack/PATTERN.md) | Apple Wallet식 카드 묶음(card stack)을 구현한다. |
| [`stretchy-header`](patterns/stretchy-header/PATTERN.md) | 상세·프로필·앨범 상단의 큰 커버 이미지 헤더(stretchy header)를 구현한다. |

### 로딩과 진행

| 패턴 | 무엇을 하나 |
|---|---|
| [`skeleton`](patterns/skeleton/PATTERN.md) | 로딩 중 콘텐츠 자리를 잡아주는 스켈레톤 UI(skeleton loader)와 시머(반짝임) 애니메이션을 구현한다. |
| [`count-up`](patterns/count-up/PATTERN.md) | 숫자가 목표값까지 굴러 올라가는 카운트업(count up) 애니메이션을 구현한다 — 잔액·포인트·통계 숫자에 쓴다. |
| [`story-progress`](patterns/story-progress/PATTERN.md) | 스토리 화면 상단의 구간별 진행 막대(story progress)를 구현한다. |
| [`loading-button`](patterns/loading-button/PATTERN.md) | 제출(submit) 버튼의 진행 상태 표시(loading button)를 구현한다. |
| [`infinite-scroll`](patterns/infinite-scroll/PATTERN.md) | 목록 끝에 닿으면 다음 페이지를 자동으로 불러오는 무한 스크롤(infinite scroll)을 구현한다 — 미리 로드하고, 중복 호출·연쇄 로딩·실패 폭주를 막는다. |
| [`virtual-list`](patterns/virtual-list/PATTERN.md) | 항목이 수천·수만 개여도 화면에 보이는 구간만 그리는 가상 스크롤 목록(virtual list, virtualized/windowing)을 구현한다. |
| [`progress-ring`](patterns/progress-ring/PATTERN.md) | 원이 채워지는 원형 진행률 표시(progress ring, 애플워치 활동 링) 컴포넌트를 구현한다. |

### 피드백

| 패턴 | 무엇을 하나 |
|---|---|
| [`press-feedback`](patterns/press-feedback/PATTERN.md) | 버튼·카드를 탭하면 살짝 쪼그라들었다(움츠러들었다) 통 하고 튕겨 돌아오는 프레스 피드백(button press 눌림 효과)을 구현한다. |
| [`toast-stack`](patterns/toast-stack/PATTERN.md) | 화면 하단(또는 상단 배너 위치)에 토스트(toast) 알림이 쌓이고 몇 초 뒤 스스로 사라지는 시스템을 구현한다. |
| [`like-pop`](patterns/like-pop/PATTERN.md) | 좋아요 하트가 토글 시 튀어오르고 게시물을 더블탭(double tap like)하면 큰 하트가 팡 터지는 인스타그램식 반응 애니메이션을 구현한다. |
| [`cart-fly`](patterns/cart-fly/PATTERN.md) | 담기 버튼을 누르면 상품 이미지가 장바구니 아이콘으로 포물선을 그리며 날아가 들어가는 애니메이션(add to cart fly)을 구현한다. |
| [`tooltip`](patterns/tooltip/PATTERN.md) | 호버·포커스 시 잠시 뒤 떠오르는 툴팁(tooltip) 말풍선을 구현한다. |
| [`form-shake-error`](patterns/form-shake-error/PATTERN.md) | 잘못된 입력을 좌우로 흔들고(shake) 에러 메시지가 아래에서 밀려 올라오는 폼 검증 에러 피드백(form validation error)을 구현한다. |

### 내비게이션

| 패턴 | 무엇을 하나 |
|---|---|
| [`tab-indicator`](patterns/tab-indicator/PATTERN.md) | 탭을 바꿀 때 활성 탭 밑줄(tab indicator)이 옆으로 미끄러져 따라가는 애니메이션을 구현한다. |
| [`carousel`](patterns/carousel/PATTERN.md) | 캐러셀(carousel) 컴포넌트 — 스와이프로 옆으로 넘기면 한 장씩 딱 걸리는 스냅 슬라이더, 아래 점(도트) 내비게이션, 자동 넘김(autoplay)을 구현한다. |
| [`hamburger-menu`](patterns/hamburger-menu/PATTERN.md) | 햄버거 버튼(≡, 삼선 아이콘)이 X로 모핑하며 옆에서 사이드 드로어가 밀려 나오는 모바일 내비게이션(hamburger menu)을 구현한다. |
| [`page-transition`](patterns/page-transition/PATTERN.md) | 화면(라우트) 전환 애니메이션(page transition)을 구현한다 — 다음 화면이 오른쪽에서 밀려 들어오고 뒤로 가면 반대로 재생되며, 돌아오면 스크롤 위치가 복원된다. |
| [`dropdown-menu`](patterns/dropdown-menu/PATTERN.md) | ⋯ 버튼을 누르면 열리는 액션 드롭다운 메뉴(dropdown menu, kebab)를 구현한다. |
| [`glass-nav`](patterns/glass-nav/PATTERN.md) | 스크롤에 반응하는 유리 GNB(상단 내비게이션 바)를 구현한다. |

### 제스처

| 패턴 | 무엇을 하나 |
|---|---|
| [`bottom-sheet`](patterns/bottom-sheet/PATTERN.md) | 바텀시트(bottom sheet) 컴포넌트 — 아래에서 올라오는 시트를 구현한다. |
| [`pull-to-refresh`](patterns/pull-to-refresh/PATTERN.md) | 목록·피드를 맨 위에서 아래로 당기면 새로고침하는 pull to refresh 제스처(당김 저항·스피너·복귀)를 구현한다. |
| [`swipe-to-delete`](patterns/swipe-to-delete/PATTERN.md) | 리스트 항목을 옆으로 밀어 삭제하는 제스처(swipe to delete)를 구현한다 — 왼쪽으로 밀면 삭제 버튼이 드러나고, 끝까지 밀면 바로 삭제되며 행이 접혀 사라진다. |
| [`pinch-zoom`](patterns/pinch-zoom/PATTERN.md) | 피드 이미지를 두 손가락으로 벌려 확대하는 핀치줌(pinch to zoom)을 구현한다. |
| [`swipe-dismiss-viewer`](patterns/swipe-dismiss-viewer/PATTERN.md) | 전체화면 이미지 뷰어를 끌어내려 닫는 제스처(swipe to dismiss)를 구현한다. |
| [`drag-to-reorder`](patterns/drag-to-reorder/PATTERN.md) | 목록 항목을 잡고 끌어서 순서를 바꾸는 드래그 정렬(drag and drop reorder) 리스트를 구현한다. |
| [`long-press-menu`](patterns/long-press-menu/PATTERN.md) | 길게 누르면(long press) 항목이 살짝 떠오르고 뒤가 흐려지며 옆에 액션 메뉴가 나타나는 iOS식 미리보기 메뉴를 구현한다 — 데스크톱은 우클릭으로 열린다. |
| [`edge-swipe-back`](patterns/edge-swipe-back/PATTERN.md) | iOS swipe back — 화면 왼쪽 가장자리를 오른쪽으로 끌어 뒤로가기 하는 인터랙티브 제스처를 구현한다. |

### 컨트롤

| 패턴 | 무엇을 하나 |
|---|---|
| [`select`](patterns/select/PATTERN.md) | 네이티브 select를 대체하는 커스텀 셀렉트 박스(custom select, 콤보박스)를 구현한다. |
| [`accordion`](patterns/accordion/PATTERN.md) | 아코디언(accordion) 컴포넌트 — 눌러서 펼치고 접는 목록을 구현한다. |
| [`switch`](patterns/switch/PATTERN.md) | iOS 스타일 토글 스위치(toggle switch)를 구현한다 — 썸이 미끄러지고 트랙 색이 바뀌는 온오프 입력, 네이티브 input 기반이라 키보드·폼 연동이 된다. |
| [`floating-label`](patterns/floating-label/PATTERN.md) | 라벨이 플레이스홀더 자리에 있다가 입력창을 누르거나 글자를 치면 위로 떠올라 작아지는 플로팅 라벨 입력 필드(floating label input)를 구현한다. |
| [`checkbox-radio`](patterns/checkbox-radio/PATTERN.md) | 체크박스(checkbox)·라디오(radio) 버튼 컴포넌트 구현 |
| [`otp-input`](patterns/otp-input/PATTERN.md) | 인증번호(OTP) 칸 입력을 구현한다 — 한 글자를 치면 다음 칸으로 넘어가고, 빈 칸에서 지우면 앞 칸으로 돌아가며, 복사한 코드를 붙여넣으면 칸마다 하나씩 나뉜다. |
| [`search-suggest`](patterns/search-suggest/PATTERN.md) | 검색창 자동완성 제안 목록(search autocomplete, suggest)을 구현한다. |
| [`range-slider`](patterns/range-slider/PATTERN.md) | 두 손잡이로 최소·최대 구간을 고르는 범위 슬라이더(range slider, 가격·기간 필터) 컴포넌트를 구현한다. |
| [`quantity-stepper`](patterns/quantity-stepper/PATTERN.md) | 수량 조절 스테퍼(quantity stepper, − / + 버튼) 컴포넌트를 구현한다. |
| [`file-upload`](patterns/file-upload/PATTERN.md) | 파일 끌어다 놓기 업로드(file upload, drop zone) 영역을 구현한다. |
| [`segmented-control`](patterns/segmented-control/PATTERN.md) | iOS 스타일 세그먼트 컨트롤(segmented control) 컴포넌트를 구현한다. |
| [`wheel-picker`](patterns/wheel-picker/PATTERN.md) | iOS 드럼 휠 피커(wheel picker)를 구현한다. |

### 표면과 스타일

| 패턴 | 무엇을 하나 |
|---|---|
| [`glass-surface`](patterns/glass-surface/PATTERN.md) | 뒤 배경이 흐릿하게 비치는 반투명 유리판 글라스모피즘(glassmorphism) 카드·헤더·내비게이션 바를 구현한다. |

### 원칙과 검토

| 패턴 | 무엇을 하나 |
|---|---|
| [`motion-principles`](patterns/motion-principles/PATTERN.md) | 앱 전체의 애니메이션 시간·이징·스태거·reduced-motion 기준을 한 벌의 토큰(motion tokens)으로 정하고, 어떤 움직임에 어느 값을 쓰는지 고르는 원칙을 제공한다. |
| [`motion-audit`](patterns/motion-audit/PATTERN.md) | 프로젝트의 CSS·JS를 훑어 애니메이션 문제(크기·위치 속성 transition, transition: all, reduced-motion 누락, 시간 범위 밖, 이동에 linear, 퇴장에 ease-in, 무한 반복, setInterval 애니메이션)를 file:line으로 찾아 고치는 방법까지 알려주는 검사 도구(motion audit)다. |
| [`layout-principles`](patterns/layout-principles/PATTERN.md) | 화면의 순서·위계·묶음·정렬·강조를 정하는 레이아웃 원칙 12개와 간격·글자·반경 토큰(layout tokens)을 제공한다. |
| [`layout-audit`](patterns/layout-audit/PATTERN.md) | CSS·JSX·HTML에서 AI가 흔히 만드는 레이아웃 문제를 file:line으로 찾는 정적 검사 도구(layout audit)다. |
<!-- catalog:end -->

## 쓰지 않는 경우·한계

- 화면이 없는 작업(API·데이터·문서·배포)에는 쓰지 않는다.
- 이 스킬은 레이아웃·모션·상호작용·접근성을 다룬다. 브랜드 색·글꼴은 프로젝트의 디자인 체계를 따른다. 프로젝트에 간격·글자 체계가 이미 있으면 그 값을 쓰고, 순서·묶음·정렬·강조의 원칙만 이 스킬을 따른다.
- 패턴 코드는 React와 순수 TypeScript로 쓰여 있다. 다른 프레임워크는 코어와 CSS를 가져가 연결 부분만 새로 쓴다.
- 검사는 소스 텍스트를 읽는 정적 검사다. 글자 대비·누르는 영역·좁은 폭 넘침과 실제 동작은 브라우저에서 확인한다.
