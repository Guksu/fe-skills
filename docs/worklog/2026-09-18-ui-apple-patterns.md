# UI 스킬 8종 추가 + 2종 확장 — 애플 UI 패턴 후보군

| 항목 | 내용 |
|------|------|
| 날짜 | 2026-09-18 |
| 작성 | 에이전트 (add-skill 파이프라인, 서브 에이전트 9개 병렬) |
| 관련 경로 | `plugins/ui/skills/{segmented-control,wheel-picker,long-press-menu,card-expand,stretchy-header,progress-ring,card-stack,edge-swipe-back}/`, `plugins/ui/skills/{swipe-to-delete,toast-stack}/`, `demo/src/demos/`, `demo/src/tests/`, `README.md` |

## 1. 개요

glass-surface(PR #20) 다음으로 "애플 UI를 참조해 후보군을 뽑아 달라"는 요청에서 시작했다. 기존 42종과 겹치지 않는 신규 8개와 기존 스킬 확장 3개를 제안했고, 사용자가 "판단해서 다 진행"을 승인했다. 확장 후보 중 바텀시트 높이 단계는 이미 `snapOffsetsPx`로 지원되어 제외했다. fe-ui 42 → 50종, 테스트 375 → 474건.

## 2. 작업내용

신규 스킬 8종 (각각 SKILL.md + assets + 데모 + 테스트):

| 스킬 | 애플 관례 | 핵심 기술 | 테스트 |
|------|-----------|-----------|--------|
| `segmented-control` | 설정 앱 세그먼트 | 네이티브 라디오 그룹 + thumb `translateX/width` 전이 | 6 |
| `wheel-picker` | 알람 시간 드럼 피커 | `scroll-snap` + 거리 기반 `rotateX`·opacity, scrollend/디바운스 | 10 |
| `long-press-menu` | 홈 화면 길게 누르기 | 포인터 타이머 코어 + 우클릭 + `backdrop-filter` 백드롭 + 메뉴 위치 순수 함수 | 10 |
| `card-expand` | App Store 투데이 카드 | View Transitions API, 클릭 순간에만 `view-transition-name` 부여 | 8 |
| `stretchy-header` | 앨범·프로필 헤더 | 스크롤 패럴랙스 + 맨 위 당김 늘어남(저항식), iOS 음수 scrollTop 경로 | 11 |
| `progress-ring` | 활동 링 | SVG `stroke-dashoffset` CSS transition, 3중 링, indeterminate | 12 |
| `card-stack` | 지갑 카드 묶음 | 순수 레이아웃 계산 + 상태 전이 함수, transform 스태거 | 14 |
| `edge-swipe-back` | 가장자리 뒤로가기 | 포인터 캡처 + 축 잠금 + 스프링(spring-physics 코어 복사본) | 21 |

확장 2종:
- `swipe-to-delete` — `actions` prop으로 여러 액션(보관·나중에·삭제), 열림 폭 = 액션 폭 × 개수, 끝까지 밀면 마지막 액션 실행. 하위 호환 유지. (+5 테스트)
- `toast-stack` — `position: 'top'` 옵션으로 상단 배너(iOS 푸시). 코어 reposition 부호 반전, CSS `translate` 속성으로 코어 transform과 분리. (+2 테스트)

공통:
- `demo/src/demos/index.ts` 8종 등록. README 표 8행 추가·확장 2행 문구 갱신·배지(fe-ui 50, tests 474).
- 모든 스킬에 `prefers-reduced-motion` 블록. 코어는 바닐라(의존성 0) + React 래퍼 2층.

### 브라우저 게이트에서 잡은 버그 1건

- **progress-ring 3중 링이 전부 같은 색** — CSS가 `--_color`를 바깥 `.progress-ring`에서 계산해 두어, ActivityRings가 각 `<g>`에 준 `--ring-color`가 무시됐다. 색 변수를 원(circle) 자신에서 풀도록 옮겨 해결. 계산된 stroke가 링별로 `#ff6b6b`·`#ffd166`·`#4ecdc4`로 나오는 것을 확인.

### 게이트 결과

| 게이트 | 결과 |
|--------|------|
| 빌드·린트·테스트 | 통과 (474 tests, 74 files) |
| 스킬 구조 검증 | 통과 |
| 브라우저 실동작 | Chromium(Playwright)으로 10종 확인 — 세그먼트 thumb 이동(2→159px), 휠 3D 기울기(±20°/40°)·방향키 이동, 길게 누르기 450ms 뒤 메뉴·우클릭·Esc, 카드 확장 상세/inert/Esc, 헤더 패럴랙스(translateY 60px, opacity .65)·당김 scale 1.33·복귀, 링 aria 값·색, 카드 묶음 stacked→fanned→selected→Esc, 가장자리 드래그 추종·취소·커밋(목록 복귀), 다중 액션 색·열림 폭 264px, 상단 토스트 `top: 24px`·아래로 쌓임. reduced-motion 에뮬레이션에서 세그먼트·카드 묶음 transition 0s |
| 모션 리뷰 | fe-craft 스킬이 세션에 없어 같은 기준으로 직접 검토 — 지적 없음 |

## 3. 주의사항

- **`npm run lint`가 `plugins/**/assets`를 실제로 검사하지 않는다.** ESLint 9 flat config가 `demo/` 밖 파일을 base path 밖으로 무시한다(서브 에이전트 4명이 독립적으로 확인). 에이전트들은 임시 설정으로 assets를 따로 검사해 통과시켰다. 후속 과제: `demo/eslint.config.js`를 저장소 루트 기준으로 옮기거나 루트 설정을 추가해야 한다.
- 브라우저 확인은 Chromium만. 확인이 필요한 항목: card-expand의 `::view-transition-image-pair` `overflow: clip`이 Safari에서 동작하는지, stretchy-header의 iOS 음수 scrollTop 경로(실기기), wheel-picker에서 Chrome의 `scroll-snap mandatory` + `scrollTo smooth`가 즉시 점프처럼 보이는지.
- edge-swipe-back은 브라우저 자체 히스토리 제스처를 막을 수 없다 — 앱 안 화면 스택에만 쓴다(SKILL.md 명시).
- long-press-menu는 포털 없이 형제 렌더링이라 조상에 transform/filter가 있으면 백드롭이 화면 전체를 못 덮는다(SKILL.md 명시).
- 이 세션은 `claude/glass-ui-design-iys2mh` 브랜치에서 작업했다(세션 지정). PR #20이 머지된 뒤 같은 브랜치 위에 이어서 커밋했다 — 로컬 끝 커밋이 main 머지 커밋의 부모라 내용은 main과 같다.
