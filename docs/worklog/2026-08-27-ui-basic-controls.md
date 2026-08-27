# UI 스킬 6종 추가 — hamburger-menu · tooltip · select · accordion · switch · floating-label

| 항목 | 내용 |
|------|------|
| 날짜 | 2026-08-27 |
| 작성 | Claude (add-skill 파이프라인) |
| 관련 경로 | plugins/ui/skills/{hamburger-menu,tooltip,select,accordion,switch,floating-label}/ · demo/src/demos/(동일 6종)/ · demo/src/demos/index.ts · demo/src/tests/ |

## 1. 개요

"애니메이션이 들어간 기본 UI" 배치 요청으로, 사용자가 지목한 햄버거 메뉴·툴팁·셀렉트 3종을 fe-ui 플러그인에 추가했다. 셋 다 CSS 우선 원칙(transition만, 라이브러리 없음)이며, 브랜치는 `feat/ui-basic-controls`(main에서 분기)다. 데모 카테고리에 `컨트롤`을 신설했다.

## 2. 작업내용

- **hamburger-menu** — ≡↔X 아이콘 모핑 + 사이드 드로어. 상태 스위치는 `aria-expanded` 단일 속성(시각·접근성 동기화). `assets/hamburger-menu.css` + `HamburgerMenu.tsx`(HamburgerButton·Drawer — Esc·백드롭·스크롤 잠금). 드로어는 언마운트 없이 `data-open` 토글.
- **tooltip** — 호버 지연(기본 400ms)·포커스 즉시·Esc 닫기 판정을 `assets/createTooltipTrigger.ts` 코어로 분리(의존성 0, focusin/focusout 버블링 사용). `tooltip.css`(4방향 `data-place`, 슬라이드 거리 `--_slide` 변수 — reduced-motion에서 0으로), `Tooltip.tsx`(cloneElement로 aria-describedby 주입).
- **select** — WAI-ARIA select-only combobox 패턴. 키보드 하이라이트 판정을 `assets/selectCore.ts` 순수 함수 `moveHighlight`로 분리. `select.css`(transform-origin: top, scale 0.98+translateY 드롭), `Select.tsx`(aria-activedescendant, 바깥 pointerdown 닫기, 하이라이트/선택 상태 분리).
- **테스트(TDD, Red→Green)** — `demo/src/tests/`에 4파일 24케이스: tooltipTriggerCore(타이머·Esc·cleanup), selectCore(경계 판정), hamburgerMenu(토글·Esc·백드롭·스크롤 잠금), select(키보드 선택·activedescendant·바깥 클릭).
- **데모 3종 + 레지스트리** — 국수집 테마(국수공방)로 작성, `demos/index.ts`에 slug 3개 등록, `DemoCategory`에 `'컨트롤'` 추가(select 소속).
- **게이트 결과** — ① build·lint·test 통과(21파일 119테스트) ② validateSkills 통과 ③ 브라우저 실동작 확인(드로어 열림/모핑/Esc, 툴팁 지연 호버, 셀렉트 패널 드롭·키보드 선택, 콘솔 에러 0) ④ fe-craft 모션 리뷰 — 툴팁 진입 이징 `ease`→`cubic-bezier(0.23,1,0.32,1)`(진입은 ease-out 규칙), 셀렉트 화살표 커브를 패널과 동일 커브로 교정(응집) 후 재검증 통과.

### 2차 배치 (2026-08-28) — accordion · switch · floating-label

- **accordion** — grid-template-rows 0fr↔1fr 전이로 JS 측정 없는 높이 애니메이션. `accordionCore.ts`(단일/다중 열림 순수 판정) + WAI-ARIA 아코디언 패턴(h3>button, role=region). 3층 구조(panel>inner>content)가 완전 닫힘의 전제.
- **switch** — 네이티브 `<input type="checkbox" role="switch">` 기반(접근성 재구현 없음). 썸 슬라이드·트랙 색 전환·누름 스퀴시(width 아닌 scaleX — 레이아웃 애니메이션 회피).
- **floating-label** — 라벨 떠오름 판정을 CSS만으로(:focus·:not(:placeholder-shown)), JS 상태 0. `placeholder=" "` 고정이 전제라 TextField가 placeholder prop을 차단.
- **테스트** — 4파일 17케이스 추가(accordionCore·accordion·switch·textField). jsdom이 disabled 클릭 차단을 시뮬레이션하지 않아 switch disabled 테스트는 속성 전달 검증으로 작성. 전체 25파일 **136테스트**.
- **모션 리뷰 발견·수정** — 닫힌 아코디언 패널과 닫힌 드로어(1차 배치)의 내부 링크가 aria-hidden인데 Tab 포커스를 받는 문제 → `visibility: hidden` + 닫힘 애니메이션 후 지연 숨김(`transition: …, visibility 0s var(--_duration)`)으로 수정. 수정 후 게이트 전체 재통과·브라우저 재확인.
- 데모 카테고리 '컨트롤'에 3종 모두 등록(1차 select 포함 4종).

## 3. 주의사항

- **hamburger-menu는 포커스 트랩 미포함** — 드로어 안에 Tab을 가두지 않는다. 필요 시 확장 과제(SKILL.md 주의사항에 명시).
- **tooltip은 고정 배치** — 뷰포트 가장자리 자동 플립 없음(place 지정으로 회피, 자동 플립은 위치 라이브러리 영역으로 선 그음). 연속 호버 시 지연 생략(warm-up) 패턴도 미구현 — 후속 확장 후보.
- **select는 폼 제출에 값이 실리지 않는다** — hidden input 병행 필요(SKILL.md에 명시). 옵션 수백 개·검색·가상 스크롤은 범위 밖.
- 데모 사이트 전역 `button` 스타일이 스킬 컴포넌트에 묻지 않도록 데모 CSS에서 되돌림 처리(`.drawer-stage-header .hamburger` 등) — 스킬 assets는 오염시키지 않았다.
- 커밋·PR은 사용자 육안 확인 후 직접(CLAUDE.md 규칙). dev 서버가 localhost:5173에 떠 있다.
