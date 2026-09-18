# 원칙·검토 스킬 2종 추가 — motion-principles · motion-audit

| 항목 | 내용 |
|------|------|
| 날짜 | 2026-09-18 |
| 작성 | 에이전트 |
| 관련 경로 | `plugins/ui/skills/{motion-principles,motion-audit}/`, `demo/src/demos/{motion-principles,motion-audit}/`, `demo/src/tests/{motionTokens,auditMotion}.test.ts`, `evals/selection/`, `package.json`(validate), 스킬 CSS 7개 |

## 1. 개요

레퍼런스 조사에서 드러난 부족한 점 4번. 설치 수 상위 프론트엔드 스킬은 패턴이 아니라 "원칙"과 "감사" 스킬인데, 우리는 패턴 스킬 50개뿐이었다. 두 가지를 더했다. `motion-principles`는 우리 스킬 50개에 흩어져 있던 시간·이징 값을 토큰 한 벌로 모은 원칙 스킬이고, `motion-audit`은 CSS·JS를 훑어 모션 결함을 `file:line`으로 찾는 검사 스킬이다. 새 데모 카테고리 '원칙과 검토'. fe-ui 50 → 52종, 테스트 474 → 493건.

## 2. 작업내용

### motion-principles

- `assets/motion-tokens.css` — 시간 5단계(100/150/250/350/420ms), 이징 5종(out·in-out·drawer·overshoot·linear), 퇴장 비율 0.75, 스태거 30ms, reduced-motion에서 시간 축소(0ms가 아닌 1~120ms — transitionend 유실 방지). 값마다 이유를 주석으로.
- `assets/motionTokens.ts` — 같은 값의 TS 상수 + `durationFor`(거리 기준)·`exitDuration`·`staggerDelay`(10개 상한)·`cubicBezier`(곡선 계산기)·`SPRING` 프리셋. 테스트가 CSS 파일을 읽어 TS 상수와 값을 비교한다(두 벌이 어긋나면 실패).
- `references/decision-table.md` — 움직임 종류 → 토큰 → 담당 스킬 → 연결할 공개 변수 대응표(6개 절).
- 데모: 같은 시간에 이징 두 개를 나란히 움직이고 곡선을 SVG로 그림, 시간 단계 선택, 스태거 목록.

### motion-audit

- `assets/auditMotion.ts` — 순수 함수. 규칙 9개(error 3: layout-animation·transition-all·no-reduced-motion / warn 6: duration-range·linear-movement·ease-in-exit·infinite-loop·js-interval-anim·will-change-global). 각 지적에 "어느 스킬·기법으로 고치는가"를 붙인다. 파서 없이 중괄호를 세어 블록을 자르고, 주석은 줄바꿈을 남긴 채 공백으로 지운다. `motion-audit-ignore: {규칙} — {이유}` 주석으로 의도적 예외.
- `assets/audit.mjs` — CLI. 폴더 재귀, `--json`, `--warn-only`, error가 있으면 exit 1. Node 22.18+에서 `.ts`를 그대로 import.
- 데모: CSS·TS를 붙여 넣으면 즉시 결과. 예시 3종(문제 CSS → 8건, 고친 CSS → 0건, 문제 TS → 2건).

### 감사 도구를 우리 스킬에 돌린 결과 (dogfooding)

첫 실행: 163개 파일에서 error 5, warn 18. 처리:

| 발견 | 처리 |
|------|------|
| swipe-to-delete 행 접힘이 `height` transition (JS가 높이를 재서 인라인으로) | **고침** — `grid-template-rows: 1fr→0fr`(accordion 기법)로 바꿈. JS 측정 제거, transitionend 판정 속성 변경, 테스트·SKILL.md 순수 JS 예시 갱신 |
| story-progress·swipe-dismiss-viewer에 reduced-motion 블록 없음 | story-progress는 주석 속 단어("transition을 두지 않는다")를 오탐한 것 → 도구 수정. swipe-dismiss-viewer는 **블록 추가** |
| carousel 도트 전이에 reduced-motion 없음 | **블록 추가** |
| pull-to-refresh 스피너 무한 반복이 reduced-motion에서 그대로 | **2s로 느리게** (새로고침 중임은 알려야 함) |
| segmented-control thumb의 `width` transition | absolute 요소라 자기만 레이아웃 — **예외 주석**으로 이유 기록 |
| 제스처 스킬 4개의 상시 `will-change` | 계속 끌리는 요소라 정당 — **예외 주석**. card-stack은 정당하지 않아 **제거** |
| tooltip·select·hamburger의 `0ms` 전이 | 관용 표현(visibility 지연) → 도구가 0ms를 지적하지 않게 수정 |
| infinite 반복인데 reduced-motion 블록이 animation을 다루는 파일 | 도구가 지적하지 않게 수정 |

도구 자체의 버그 2건도 이 과정에서 잡았다: 여러 줄 주석을 지우며 줄바꿈까지 지워 줄 번호가 어긋난 것, 한 줄 블록(`.a { … }`)의 선언을 못 읽은 것. 둘 다 회귀 테스트를 추가했다.

최종: error 0, warn 0. `npm run validate`에 `audit.mjs plugins/ui/skills`를 넣어 앞으로 스킬을 추가할 때 자동으로 검사한다.

### 게이트 결과

| 게이트 | 결과 |
|--------|------|
| 빌드·린트·테스트 | 통과 (493 tests) |
| 스킬 구조·선택 평가·모션 검사 | 통과 (395/395, error 0 warn 0) |
| 브라우저 실동작 | Chromium — 토큰이 `:root`에 실림(250ms), 곡선 2개, 두 카드가 다른 이징으로 이동, 스태거 지연 0/30/60/90ms, reduced-motion에서 base 80ms; 감사 데모 3예시 결과 일치; swipe-to-delete 접힘이 grid rows로 동작하고 행이 제거됨 |
| 모션 리뷰 | 직접 검토. 데모의 샘플 버튼이 `<label>` 안에 있어 접근성 이름이 합쳐지던 것을 `role="group"`으로 고침 |

## 3. 주의사항

- 이 브랜치는 `feat/skill-selection-evals`(PR #23) 위에 쌓였다. #23을 먼저 머지해야 한다.
- 감사 도구의 JS 규칙은 휴리스틱이다(`setInterval` 뒤 400자, 프레임 루프 앞 600자). SCSS 깊은 중첩은 한 단계만 본다.
- `no-reduced-motion`은 파일 단위 판정이라, 전역 CSS 한 곳에만 블록을 두는 프로젝트에서는 컴포넌트 파일마다 error가 난다(SKILL.md 주의사항).
- swipe-to-delete의 접힘 방식이 바뀌었다(height → grid-template-rows). 이미 복사해 쓰는 프로젝트는 CSS·TSX·순수 JS 예시를 같이 갱신해야 한다. `grid-template-rows` 전이는 Chrome 107·Safari 16·Firefox 66 이상.
- CLI는 Node 22.18 미만에서 `--experimental-strip-types`가 필요하다.
