# UI 스킬 추가 — 스크롤 반응 유리 GNB (glass-nav)

| 항목 | 내용 |
|------|------|
| 날짜 | 2026-09-19 |
| 작성 | 에이전트 (add-skill 파이프라인) |
| 관련 경로 | `plugins/ui/skills/glass-nav/`, `demo/src/demos/glass-nav/`, `demo/src/tests/glassNav.test.ts`, `evals/selection/glass-nav.json`, `README.md`·`README.en.md` |

## 1. 개요

glass-surface 데모의 GNB는 자리만 고정되고 스크롤에 반응하지 않았다. 사용자 요청 "배민·카카오맵·애플 글라스 UI의 GNB처럼 실제로 움직이게"에서 시작해, 문답으로 세 동작을 모두 넣기로 했다. glass-surface(겉모습)와 역할이 달라 새 스킬 `glass-nav`(동작)로 만들었다. fe-ui 52 → 53종, 테스트 498 → 507건.

## 2. 작업내용

- `assets/navScrollCore.ts` — 순수 판정 `reduceNavState`. 세 상태: `elevated`(threshold 8px 넘으면 유리), `hidden`(hide 모드, hideAfter 80px 넘어 내려가면 숨고 위로 올리면 즉시 펼침), `compact`(같은 신호로 축소). 최소 이동량 6px 안의 튐은 무시. 맨 위(0)와 음수(iOS 고무줄)는 항상 펼친 투명.
- `assets/createGlassNav.ts` — passive scroll + rAF 프레임당 1회 판정, `data-elevated`·`data-hidden`·`data-compact` 부여, `setOptions`(모드 변경 시 숨김·축소 해제)·`destroy`.
- `assets/glass-nav.css` — 숨김은 `transform`, 유리 전환은 `background`·`border-color`·`box-shadow`·`backdrop-filter` 전이, 축소는 링크 묶음의 `grid-template-columns 1fr→0fr`(accordion 기법을 가로로) + `gnav-current`(현재 메뉴 복제)가 알약에 남음. 투명 띠(`gnav`)는 `pointer-events: none`으로 클릭을 통과시키고 유리 판만 받는다. reduced-motion에서 전이 없음.
- `assets/useGlassNav.ts` — `navRef`·`state`. 옵션 변경은 재생성 없이 `setOptions`로.
- 데모: 폰 프레임 안에서 모드 라디오 3개(투명→유리 / 내리면 숨김 / 알약 축소), 유리 시작점·숨김 시작점·속도 슬라이더, 현재 상태 표시. 히어로가 투명 GNB 뒤로 올라오게 배치해 "맨 위 투명"이 의미 있게.
- 테스트 9건(Red→Green): 판정 6, DOM 코어 3.
- 선택 평가 7/7. 새 스킬이 IDF를 바꿔 swipe-dismiss-viewer의 얇은 마진(0.7)이 뒤집혔다 → 그 description에 "뷰어의 닫히는 드래그 거리" 표현을 넣어 회복.
- 클래스 이름은 `.gnav*`. glass-surface가 이미 `.glass-nav`를 쓰고 있어 충돌을 피했다.

### 게이트 결과

| 게이트 | 결과 |
|--------|------|
| 빌드·린트·테스트 | 통과 (507 tests) |
| 스킬 구조·선택 평가·모션 검사 | 통과 (402/402, error 0 warn 0) |
| 브라우저 실동작 | Chromium — 맨 위: 투명(`rgba(0,0,0,0)`, blur 0), hide 모드 300px 내려가면 `translateY(-77px)`로 숨고 20px 올리면 복귀 + 유리(blur 16px), compact 모드 내려가면 링크 열 0px·알약에 "국수집 · 메뉴"만, 올리면 펼침, elevate 모드는 깊이 내려도 숨지 않음, reduced-motion에서 전이 0s |
| 모션 리뷰 | 직접 검토 — 숨김·유리·축소 모두 250ms `cubic-bezier(0.22, 1, 0.36, 1)`(motion-principles base/out), 지적 없음 |

## 3. 주의사항

- compact의 현재 메뉴(`gnav-current`)는 복제 텍스트다. 라우트가 바뀌면 이 텍스트도 바꿔야 한다.
- 스크롤 컨테이너가 `document`가 아니면 `containerRef`/`container`를 넘겨야 한다.
- 축소의 `grid-template-columns` 전이는 Chrome 107·Safari 16·Firefox 66 이상.
- 이 브랜치는 `feat/demo-en`(PR #26) 위에 쌓였다.
