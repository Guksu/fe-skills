# UI 스킬 확장 — glass-nav 링크 → 섹션 이동과 활성 추적(spy)

| 항목 | 내용 |
|------|------|
| 날짜 | 2026-09-21 |
| 작성 | 에이전트 (add-skill 파이프라인) |
| 관련 경로 | `plugins/ui/skills/glass-nav/`, `demo/src/demos/glass-nav/`, `demo/src/tests/glassNavSpy.test.ts`, `evals/selection/glass-nav.json`, `README.md`·`README.en.md` |

## 1. 개요

glass-nav(PR #27)의 GNB 링크는 모양만 있고 눌러도 아무 데도 가지 않았다. 사용자 요청 "GNB 클릭했을 때 해당 메뉴로 움직이는 게 없다"에서 시작해, 링크 클릭 → 섹션 스크롤, 스크롤 → 활성 링크·알약 추적(scroll spy)을 같은 스킬의 `spy` 옵션으로 넣었다. 새 스킬을 만들지 않은 이유: 활성 표시와 compact의 현재 메뉴 텍스트가 이미 glass-nav 안에 있어, 따로 두면 두 스킬이 같은 DOM을 건드리게 된다. 테스트 507 → 517건.

## 2. 작업내용

- `assets/navSpyCore.ts` — 순수 계산 3개. `activeSectionFor`(시작점이 GNB 아래로 들어온 마지막 섹션. 끝에 닿으면 마지막 섹션), `scrollTargetFor`(섹션 시작 − GNB 높이 − 여유. 올림 — 내림하면 도착 위치가 1px 위라 이전 섹션이 활성이 된다), `pillFrame`(translateX + width).
- `assets/createGlassNav.ts` — `spy: true | { offsetPx, lockMs, onActive }`. 붙일 때 `.gnav-links a[href^="#"]`와 컨테이너 안의 같은 id 요소를 짝짓는다. 클릭은 `preventDefault` 후 `scrollTo({ behavior: 'smooth' })`(reduced-motion이면 `auto`) — 데모의 해시 라우터(`#/slug`)와 부딪히지 않게 해시를 바꾸지 않는다. 클릭 후 `lockMs`(900) 동안 숨김·축소를 막고 활성을 목표에 고정한다(지나가는 섹션마다 알약이 튀지 않게). 잠금 중에는 기준점(anchorY)을 매 프레임 따라가 잠금이 풀린 직후 방향 판정이 새로 시작된다. 활성 링크에 `aria-current="page"`, `.gnav-current` 텍스트, `.gnav-pill` 위치를 준다. 웹폰트 로드(`document.fonts.ready`)·창 크기 변경 시 알약을 다시 잰다. `getActive`·`refresh` 추가.
- `assets/glass-nav.css` — `.gnav-pill`(absolute, transform·width 전이, `motion-audit-ignore: layout-animation`), 알약이 있으면 활성 링크 배경은 끔(`:has`). reduced-motion에서 전이 없음.
- `assets/useGlassNav.ts` — `spy` 옵션 전달, `activeId` 반환.
- 데모: 폰 화면을 메뉴·매장·주문 내역 세 섹션으로 나누고 링크를 `#menu`·`#stores`·`#orders`로. 알약 추가. 현재 섹션 표시.
- 테스트 10건(Red→Green): 순수 계산 5, DOM 코어 5(초기 활성·알약, 클릭 → scrollTo 836·aria-current·gnav-current·알약·onActive, reduced-motion → auto, 잠금 중 숨김 안 됨·활성 고정·잠금 후 추적 재개, 끝에 닿으면 마지막·destroy 후 기본 클릭).
- 선택 평가: should "GNB 메뉴 누르면 그 섹션으로 스크롤되고 활성 표시가 따라가게" 추가, shouldNot "탭 누르면 밑줄이 탭 사이를 미끄러지게"(tab-indicator) 추가. 9/9, 전체 404/404.

### 게이트 결과

| 게이트 | 결과 |
|--------|------|
| 빌드·린트·테스트 | 통과 (517 tests) |
| 스킬 구조·선택 평가·모션 검사 | 통과 (404/404, error 0 warn 0) |
| 브라우저 실동작 | Chromium — "매장" 클릭: 해시 그대로(`#/glass-nav`), scrollTop 981, 매장 제목이 폰 화면 위에서 76px(GNB 69 + 여유 8 − 반올림 1)에 도착, 알약 `translateX(52px)` 48px, hide 모드인데 클릭 스크롤 중·후 `data-hidden=false`. "주문 내역"·"메뉴"도 같음. 사용자 스크롤 1000·1400에서 활성이 매장·주문 내역으로 따라옴. compact 모드에서 클릭해도 축소되지 않음. reduced-motion: 클릭 30ms 뒤 이미 도착(981), 알약 전이 0s. 첫 프레임 알약 0px → 600ms 뒤 링크 너비와 같은 48px |
| 모션 리뷰 | 직접 검토 — 알약 이동 250ms `cubic-bezier(0.22, 1, 0.36, 1)`(motion-principles base/out), 스크롤은 브라우저 smooth. 지적 없음 |

## 3. 주의사항

- 링크·섹션 짝은 붙일 때 한 번 수집한다. 나중에 섹션이 생기면 다시 붙여야 한다.
- 해시를 바꾸지 않으므로 새 탭 열기·주소 복사로는 섹션에 못 간다. 필요하면 `onActive`에서 `history.replaceState`.
- 마지막 섹션들이 짧으면 끝에서 마지막 섹션만 활성이 된다. 데모는 주문 내역을 6건으로 늘려 매장 섹션이 GNB 아래까지 올라오게 했다.
- 알약 `width` 전이는 레이아웃 속성이지만 absolute·pointer-events:none이라 자기 자신만 다시 그린다(segmented-control thumb과 같은 결정). 모션 검사에는 ignore 주석으로 사유를 남겼다.
