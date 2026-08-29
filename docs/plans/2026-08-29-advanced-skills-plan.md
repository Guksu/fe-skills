# 심화 스킬 플랜 — 제스처·물리·스크롤 연동·공유 요소 전환

| 항목 | 내용 |
|------|------|
| 날짜 | 2026-08-29 |
| 작성 | Claude (리서치 서브 에이전트 + 보유 스킬 대조) |
| 기준 | 보유 27종(등장과 전환 6 · 피드백 6 · 컨트롤 5 · 제스처 4 · 내비게이션 3 · 로딩과 진행 3) 이후, pinch-zoom 수준 이상의 "심화" 패턴 |
| 상태 | **승인(2026-08-29)** — 배치 A 중 spring-physics·swipe-dismiss-viewer 완료, **momentum-drag는 실기기 실패로 제거(재도전 후보)** — 워크로그 `2026-08-29-ui-physics-core.md`. 다음은 배치 B |

## 1. 후보 14종 (난이도 1~5, Safari iOS 지원 경계 포함)

| # | slug | 사용자 동작 | 참조 앱 | 핵심 기술 | Safari iOS 주의 | 난이도 | 카테고리 |
|---|---|---|---|---|---|---|---|
| 1 | `spring-physics` | 유틸 — 복귀·팝 모션을 duration이 아닌 stiffness/damping/velocity로 | iOS 전반, Linear | 순수 TS 스프링 솔버 → rAF 또는 CSS `linear()` easing 사전 샘플링 | `linear()` Safari 17.2+, 폴백 rAF | 3 | 등장과 전환 |
| 2 | `momentum-drag` | 끌어 놓으면 관성으로 미끄러지고 경계에서 고무줄 복귀 | Google Maps, Figma 모바일 | velocity 추적 → rAF 감쇠 + 러버밴드 저항 + 스프링 복귀 | `overscroll-behavior: contain` | 4 | 제스처 |
| 3 | `swipe-dismiss-viewer` | 전체화면 이미지를 아래로 끌면 축소·배경 투명해지며 닫힘 | iOS Photos, Instagram | Pointer Events, 거리→scale/opacity 매핑, velocity 판정 | 엣지 스와이프(뒤로가기) 충돌 — 가장자리 시작 무시 | 4 | 제스처 |
| 4 | `card-swipe-stack` | 최상단 카드를 좌우로 끌면 기울고 임계 넘기면 날아감, 다음 카드 스케일업 | Tinder | 회전=dx 비례, 임계 35%·velocity, 하위 카드 스택 | 없음(`touch-action: pan-y`) | 3 | 제스처 |
| 5 | `long-press-reorder` | 길게 누르면 들려 드래그, 다른 항목이 FLIP으로 비켜줌, 자동 스크롤 | iOS 미리알림, Spotify 큐 | 롱프레스 인식 + FLIP + auto-scroll | `-webkit-touch-callout: none`, 롱프레스 전 pan-y→후 none 전환 함정 | 5 | 제스처 |
| 6 | `context-menu-preview` | 길게 누르면 대상이 살짝 들리고 블러 배경 위 메뉴가 스프링으로 펼쳐짐 | iOS Haptic Touch | 롱프레스(#5와 코어 공유) + `backdrop-filter` + 스프링 | `-webkit-touch-callout: none` 없으면 링크 미리보기 | 3 | 피드백 |
| 7 | `scroll-driven-animation` | 스크롤 진행에 읽기 진행바·요소 이동이 JS 없이 링크 | Medium, Apple 제품 페이지 | CSS `animation-timeline: scroll()/view()` | **Safari 26+(2025-09)만**, `@supports` 폴백 필수 | 3 | 등장과 전환 |
| 8 | `collapsing-profile-header` | 커버가 패럴랙스·블러, 아바타 축소, 이름이 상단바로 고정 | X 프로필, Instagram 프로필 | sticky + scroll timeline(폴백 scroll+rAF), 오버스크롤 커버 확대 | #7과 동일 + JS 폴백 권장 | 4 | 내비게이션 |
| 9 | `hide-on-scroll-tabbar` | 아래로 스크롤하면 하단 탭바 숨김, 위로 하면 즉시 재등장 | YouTube, Chrome 모바일 | 방향 판정 + 히스테리시스 + `translateY` | 러버밴드 구간 scrollTop 클램프, `safe-area-inset-bottom` | 2 | 내비게이션 |
| 10 | `shared-element-transition` | 썸네일 탭 → 상세로 이미지가 이동·확대되며 전환 | App Store, Pinterest | View Transitions API(same-document) | Safari 18+, cross-document는 SPA 데모에 불필요 | 3 | 등장과 전환 |
| 11 | `filter-chips-layout` | 칩 토글 시 선택 칩이 앞으로 이동, 나머지 FLIP, 결과 크로스페이드 | Airbnb 필터 | FLIP 또는 View Transition | 가로 스크롤 컨테이너 내 클리핑 주의 | 3 | 컨트롤 |
| 12 | `segmented-control` | 세그먼트 탭·드래그로 썸 이동, 눌림 스케일 | iOS 설정 | radiogroup + 썸 translateX + 드래그 | 없음 | 2 | 컨트롤 |
| 13 | `wheel-picker` | 드럼처럼 도는 시간 피커, 원통 곡면 회전·페이드 | iOS UIDatePicker | scroll-snap + `view()` 타임라인 `rotateX`(폴백 rAF), `scrollend` | `view()`·`scrollend` Safari 26+ | 4 | 컨트롤 |
| 14 | `otp-code-input` | 6칸 코드 자동 다음 칸·붙여넣기 분배·SMS 자동완성·오류 셰이크 | 은행·인증 앱 | 단일 hidden input(`one-time-code`) + 시각 셀 | 다중 input은 iOS 자동완성 첫 칸만 채움 → 단일 input 필수 | 2 | 컨트롤 |

제외: 3D flip card·magnetic button(호버 중심, 모바일 가치 낮음), pull-down search(pull-to-refresh 변형), snap date strip(carousel 중복).

## 2. 배치 제안 — 앞 배치의 코어를 뒤 배치가 재사용한다

| 배치 | 스킬 | 왜 이 묶음인가 | 예상 난이도 |
|---|---|---|---|
| **A. 물리 코어** | 1 spring-physics → 2 momentum-drag → 3 swipe-dismiss-viewer | 스프링 솔버를 먼저 만들고, 감쇠·러버밴드·스프링 복귀를 momentum-drag에서 결합, swipe-dismiss가 그 코어로 복귀/닫힘 판정. 이후 모든 제스처 스킬의 기반 | ★★★★ |
| **B. 제스처 심화** | 4 card-swipe-stack → 5 long-press-reorder → 6 context-menu-preview | 롱프레스 인식기를 5·6이 공유, FLIP 재배치는 기존 flip-list 확장. 전부 A의 스프링에 의존 | ★★★★★ |
| **C. 스크롤 연동 (Safari 26+)** | 7 scroll-driven-animation → 8 collapsing-profile-header → 9 hide-on-scroll-tabbar | CSS 스크롤 타임라인 한 벌 + JS 폴백 패턴을 세우고, 프로필 헤더·탭바가 적용 | ★★★ |
| **D. 전환·컨트롤** | 10 shared-element-transition → 11 filter-chips-layout → 12 segmented-control → 13 wheel-picker → 14 otp-code-input | View Transitions API 도입 + 컨트롤군 보강. 서로 독립이라 골라 담기 가능 | ★★★ |

권장 순서: **A → B → C → D**. A가 없으면 B의 복귀 모션이 전부 duration 기반이 되어 나중에 갈아엎게 된다. C는 사용자 기기 분포(iOS 26 비율)에 따라 D보다 뒤로 미룰 수 있다.

## 3. 공통 설계 결정 (2026-08-29 사용자 확정)

- **스프링 재생 방식 — 확정: rAF 루프 + `linear()` 생성기 병행.** 코어는 rAF(인터럽트·velocity 이어받기), CSS 전이용 `linear()` easing 문자열 생성기를 함께 제공.
- **Safari 26+ 전용 API(#7·8·13)**: `@supports (animation-timeline: scroll())` 폴백을 스킬 기본으로 포함. 폴백은 "정적 상태"(7)와 "scroll+rAF"(8·13) 두 등급.
- **공유 코어(스프링·롱프레스) — 확정: 각 스킬 assets에 복사본 포함.** 원본은 공유 스킬(spring-physics 등)에 두고 의존 스킬은 같은 파일을 복사해 단독 완결을 유지한다. 복사본 드리프트는 `validateSkills`에 해시 비교 검사를 추가해 잡는다(배치 A에서 구현).
- **데모 실기기 검증**: 제스처 스킬은 합성 이벤트 재생 버튼(pinch-zoom 방식) + 사용자 실기기 확인을 게이트 3에 포함.

## 4. 참고 출처

MDN scroll-driven animations · WebKit "Safari 26.0 features" · WebKit scroll-driven CSS 가이드 · MDN View Transition API · MDN `linear()` easing · animations.dev · PhotoSwipe verticalDrag · react-beautiful-dnd touch sensor 문서 · Radix long-press 논의 · web.dev SMS OTP form · CSS-Tricks elastic overflow scrolling
