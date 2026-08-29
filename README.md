<div align="center">

# fe-skills

**AI 에이전트를 위한 프론트엔드 스킬 라이브러리** — 애니메이션·UI/UX 구현 패턴과 시스템 설계 판정을, 에이전트가 읽고 바로 적용할 수 있는 형태로.

[![Deploy demo](https://github.com/Guksu/fe-skills/actions/workflows/deploy-demo.yml/badge.svg)](https://github.com/Guksu/fe-skills/actions/workflows/deploy-demo.yml)
![UI skills](https://img.shields.io/badge/fe--ui-29%20skills-6ea8fe)
![System skills](https://img.shields.io/badge/fe--system-2%20skills-a78bfa)
![Dependencies](https://img.shields.io/badge/runtime%20deps-0-34c759)
![Tests](https://img.shields.io/badge/tests-202%20passing-34c759)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

[**라이브 데모**](https://guksu.github.io/fe-skills/) · [설치](#설치) · [스킬 카탈로그](#스킬-카탈로그--fe-ui) · [설계 스킬](#설계-스킬--fe-system) · [기여하기](#기여하기) · [라이선스](#라이선스)

</div>

---

## 왜 필요한가

AI 에이전트에게 "바텀시트 만들어줘"라고 하면 매번 다른 품질의 코드가 나옵니다. 드래그 판정이 빠지거나, 닫힘 애니메이션이 없거나, `prefers-reduced-motion`을 무시하거나. **fe-skills는 그 판단을 스킬 문서로 고정합니다** — 언제 이 패턴을 쓰는지, 왜 이 기술인지, 어디를 커스터마이즈하고 무엇을 조심해야 하는지, 그리고 바로 복사해 쓰는 구현 코드까지.

- **CSS 우선, 의존성 0** — CSS로 되는 것은 CSS로. 제스처·물리처럼 어려운 것만 순수 TS 코어로, 라이브러리는 쓰지 않습니다.
- **바닐라 코어 + React 래퍼 2층** — 코어는 프레임워크 무관(`.ts`, DOM API), React 래퍼는 얇게. 다른 프레임워크에서는 코어만 가져갑니다.
- **접근성이 기본** — 모든 UI 스킬이 `prefers-reduced-motion`을 지원하고, 컨트롤은 네이티브 요소(`<dialog>`·`<input>`) 위에 얹어 키보드·스크린 리더를 재구현하지 않습니다.
- **눈으로 검증된 패턴** — 모든 스킬은 빌드·테스트·구조 검증·브라우저 실동작·모션 리뷰 게이트를 통과해야 등록됩니다. 데모는 정본 코드를 그대로 import합니다(복사본 없음).

## 설치

Claude Code 플러그인 마켓플레이스에서 설치합니다.

```
/plugin marketplace add Guksu/fe-skills
/plugin install fe-ui@fe-skills        # 애니메이션 · UI/UX 구현
/plugin install fe-system@fe-skills    # 프론트엔드 시스템 설계
```

설치 후에는 평소처럼 요청하면 됩니다 — 에이전트가 요청에 맞는 스킬을 골라 문서와 예시 코드를 읽고 구현합니다.

```
바텀시트로 메뉴 옵션 고르게 해줘            → bottom-sheet
피드 사진 핀치줌 되게 해줘                  → pinch-zoom
상품 목록 + 필터 + 상세 화면 설계해줘        → list-filter-detail (설계 문답 후 구현)
```

## 스킬 하나에 들어 있는 것

```
plugins/ui/skills/bottom-sheet/
├─ SKILL.md                 언제 쓰는가 · 왜 이 기술인가 · 사용법(React / 순수 JS) · 커스터마이즈 · 주의사항
└─ assets/
   ├─ createSheetDrag.ts    프레임워크 무관 코어 (의존성 0)
   ├─ bottom-sheet.css      모션·상태 정의, reduced-motion 포함
   └─ BottomSheet.tsx       React 래퍼
```

`assets/`는 문서의 일부가 아니라 **실행 가능한 정본**입니다. 프로젝트에 복사해 그대로 쓰고, TS가 아니면 타입만 벗겨 저장합니다. 여러 스킬이 공유하는 코어(스프링 등)는 각 스킬에 복사본으로 들어 있어 스킬 하나만 설치해도 완결되며, 저장소 검증이 복사본과 원본의 해시를 비교해 드리프트를 막습니다.

## 스킬 카탈로그 — fe-ui

29종. 이름을 누르면 스킬 문서, 데모를 누르면 실제 동작을 볼 수 있습니다.

### 등장과 전환

| 스킬 | slug | 설명 | |
|---|---|---|---|
| 🎭 [진입/퇴장 애니메이션](plugins/ui/skills/enter-exit/SKILL.md) | `enter-exit` | 모달·토스트처럼 나타나고 사라지는 요소의 전환 — 퇴장까지 CSS로 | [데모](https://guksu.github.io/fe-skills/#/enter-exit) |
| 📜 [스크롤 리빌](plugins/ui/skills/scroll-reveal/SKILL.md) | `scroll-reveal` | 스크롤로 뷰포트에 들어올 때 콘텐츠를 순차 공개 | [데모](https://guksu.github.io/fe-skills/#/scroll-reveal) |
| 📌 [스티키 헤더 전환](plugins/ui/skills/sticky-header/SKILL.md) | `sticky-header` | 큰 제목이 밀려 나가면 고정 바에 컴팩트 제목이 나타남 | [데모](https://guksu.github.io/fe-skills/#/sticky-header) |
| 🔀 [리스트 재배치 (FLIP)](plugins/ui/skills/flip-list/SKILL.md) | `flip-list` | 정렬·재배치 시 항목이 순간이동 대신 미끄러져 이동 | [데모](https://guksu.github.io/fe-skills/#/flip-list) |
| 🔍 [확대 전환 라이트박스](plugins/ui/skills/zoom-lightbox/SKILL.md) | `zoom-lightbox` | 썸네일이 화면 중앙으로 커지는 공유 요소 전환 | [데모](https://guksu.github.io/fe-skills/#/zoom-lightbox) |
| 🪟 [모달 다이얼로그](plugins/ui/skills/modal-dialog/SKILL.md) | `modal-dialog` | 백드롭 페이드 + 패널 스케일 진입 — 네이티브 `<dialog>`라 포커스 트랩·Esc 공짜 | [데모](https://guksu.github.io/fe-skills/#/modal-dialog) |
| 🪀 [스프링 물리 모션](plugins/ui/skills/spring-physics/SKILL.md) | `spring-physics` | duration 대신 강성·감쇠로 — 던진 속도를 이어받고 목표가 바뀌어도 끊기지 않음 | [데모](https://guksu.github.io/fe-skills/#/spring-physics) |

### 로딩과 진행

| 스킬 | slug | 설명 | |
|---|---|---|---|
| 💀 [스켈레톤 시머](plugins/ui/skills/skeleton/SKILL.md) | `skeleton` | 로딩 중 콘텐츠 자리를 잡아주는 뼈대 + 반짝임 (CSS-only) | [데모](https://guksu.github.io/fe-skills/#/skeleton) |
| 🔢 [숫자 카운트업](plugins/ui/skills/count-up/SKILL.md) | `count-up` | 잔액·포인트가 목표값까지 굴러 올라가는 연출 | [데모](https://guksu.github.io/fe-skills/#/count-up) |
| ⏯️ [스토리 프로그레스](plugins/ui/skills/story-progress/SKILL.md) | `story-progress` | 자동 재생 진행바 — 길게 눌러 멈춤, 탭으로 이동 | [데모](https://guksu.github.io/fe-skills/#/story-progress) |

### 피드백

| 스킬 | slug | 설명 | |
|---|---|---|---|
| 👆 [프레스 피드백](plugins/ui/skills/press-feedback/SKILL.md) | `press-feedback` | 눌리는 순간 움츠렸다 스프링처럼 복귀 (CSS-only) | [데모](https://guksu.github.io/fe-skills/#/press-feedback) |
| 🍞 [토스트 스택](plugins/ui/skills/toast-stack/SKILL.md) | `toast-stack` | 알림이 쌓이고 각자 시간이 되면 사라짐 | [데모](https://guksu.github.io/fe-skills/#/toast-stack) |
| ❤️ [좋아요 팝 + 더블탭 버스트](plugins/ui/skills/like-pop/SKILL.md) | `like-pop` | 하트 토글 팝과 더블탭 하트 버스트 | [데모](https://guksu.github.io/fe-skills/#/like-pop) |
| 🛒 [카트 플라이](plugins/ui/skills/cart-fly/SKILL.md) | `cart-fly` | 담기를 누르면 상품이 장바구니로 포물선을 그리며 날아감 | [데모](https://guksu.github.io/fe-skills/#/cart-fly) |
| 💬 [툴팁](plugins/ui/skills/tooltip/SKILL.md) | `tooltip` | 호버는 지연 후·포커스는 즉시 — 4방향 배치 | [데모](https://guksu.github.io/fe-skills/#/tooltip) |
| 🚫 [폼 에러 흔들림](plugins/ui/skills/form-shake-error/SKILL.md) | `form-shake-error` | 틀린 입력을 흔들고 에러 메시지가 밀려 올라옴 — 연타해도 재시작 보장 | [데모](https://guksu.github.io/fe-skills/#/form-shake-error) |

### 내비게이션

| 스킬 | slug | 설명 | |
|---|---|---|---|
| 🗂️ [탭 인디케이터 슬라이드](plugins/ui/skills/tab-indicator/SKILL.md) | `tab-indicator` | 활성 탭 밑줄이 미끄러져 이동 | [데모](https://guksu.github.io/fe-skills/#/tab-indicator) |
| 🎠 [스냅 캐러셀](plugins/ui/skills/carousel/SKILL.md) | `carousel` | 스와이프 스냅 배너·카드 슬라이더 (CSS scroll-snap) | [데모](https://guksu.github.io/fe-skills/#/carousel) |
| 🍔 [햄버거 메뉴](plugins/ui/skills/hamburger-menu/SKILL.md) | `hamburger-menu` | ≡가 X로 모핑하는 버튼 + 옆에서 밀려 나오는 드로어 | [데모](https://guksu.github.io/fe-skills/#/hamburger-menu) |

### 제스처

| 스킬 | slug | 설명 | |
|---|---|---|---|
| 📋 [바텀시트](plugins/ui/skills/bottom-sheet/SKILL.md) | `bottom-sheet` | 아래에서 올라오는 시트 — 드래그로 끌어내려 닫기, 스냅 포인트 | [데모](https://guksu.github.io/fe-skills/#/bottom-sheet) |
| 🔄 [당겨서 새로고침](plugins/ui/skills/pull-to-refresh/SKILL.md) | `pull-to-refresh` | 최상단에서 끌어내려 갱신 — 고무줄 저항과 스피너 | [데모](https://guksu.github.io/fe-skills/#/pull-to-refresh) |
| 🗑️ [밀어서 삭제](plugins/ui/skills/swipe-to-delete/SKILL.md) | `swipe-to-delete` | 왼쪽으로 밀면 삭제 버튼, 끝까지 밀면 바로 삭제 — 행이 접히며 사라짐 | [데모](https://guksu.github.io/fe-skills/#/swipe-to-delete) |
| 🤏 [피드 핀치줌](plugins/ui/skills/pinch-zoom/SKILL.md) | `pinch-zoom` | 두 손가락으로 벌리면 그 자리에서 커지고 놓으면 제자리로 — 인스타그램 피드 관례 | [데모](https://guksu.github.io/fe-skills/#/pinch-zoom) |
| 🖼️ [끌어내려 닫는 뷰어](plugins/ui/skills/swipe-dismiss-viewer/SKILL.md) | `swipe-dismiss-viewer` | 이미지를 끌면 작아지며 뒤가 비치고, 놓으면 썸네일 자리로 스프링 복귀 — iOS 사진 관례 | [데모](https://guksu.github.io/fe-skills/#/swipe-dismiss-viewer) |

### 컨트롤

| 스킬 | slug | 설명 | |
|---|---|---|---|
| 🔽 [커스텀 셀렉트](plugins/ui/skills/select/SKILL.md) | `select` | 패널이 드롭되는 셀렉트 — 키보드 내비게이션·ARIA 콤보박스 내장 | [데모](https://guksu.github.io/fe-skills/#/select) |
| 🪗 [아코디언](plugins/ui/skills/accordion/SKILL.md) | `accordion` | JS 측정 없는 높이 애니메이션 — `grid-template-rows 0fr↔1fr` | [데모](https://guksu.github.io/fe-skills/#/accordion) |
| 🎚️ [토글 스위치](plugins/ui/skills/switch/SKILL.md) | `switch` | 썸 슬라이드 + 누름 스퀴시 — 네이티브 체크박스 기반이라 접근성 공짜 | [데모](https://guksu.github.io/fe-skills/#/switch) |
| 🏷️ [플로팅 라벨 입력](plugins/ui/skills/floating-label/SKILL.md) | `floating-label` | 라벨이 플레이스홀더 자리에서 떠오르는 입력 — 판정은 CSS만으로 | [데모](https://guksu.github.io/fe-skills/#/floating-label) |
| ☑️ [체크박스 · 라디오](plugins/ui/skills/checkbox-radio/SKILL.md) | `checkbox-radio` | 체크마크가 획으로 그려지고 라디오 도트가 튀어 맺힘 — 네이티브 input 기반 | [데모](https://guksu.github.io/fe-skills/#/checkbox-radio) |

## 설계 스킬 — fe-system

코드를 쓰기 전에 **설계를 판정**하는 스킬입니다. 화면·데이터의 신호를 읽어 결정하고(읽을 수 없으면 짧은 문답), 케이스별 트레이드오프 문서를 근거로 설계 틀을 제시합니다. 데모 없이 문서만으로 동작합니다.

| 스킬 | 결정하는 것 |
|---|---|
| [list-filter-detail](plugins/system/skills/list-filter-detail/SKILL.md) | 목록 + 필터/정렬/검색 + 상세 — 상태 위치(URL 단일 진실) · 데이터 페칭 5분기 · 목록 넘김 · 상세 진입 · 복귀 복원 |
| [infinite-feed](plugins/system/skills/infinite-feed/SKILL.md) | 무한 피드 — 커서 페이지네이션(불투명 토큰) · 렌더 윈도우 3단 · 복귀 복원 · 새 글 병합 · 페칭 트리거 |

## 저장소 구조

```
fe-skills/
├─ .claude-plugin/marketplace.json   마켓플레이스 정의 (플러그인 2개)
├─ plugins/
│  ├─ ui/skills/{skill}/             fe-ui 정본 — SKILL.md + assets/ (코어·CSS·React 래퍼)
│  └─ system/skills/{skill}/         fe-system 정본 — SKILL.md(판정 절차) + references/(설계 문서)
├─ demo/                             데모 사이트 (Vite + React) — @skills 별칭으로 정본을 import
├─ scripts/validateSkills.mjs        스킬 구조 검증 게이트 (frontmatter · 링크 · 레지스트리 · 공유 코어 해시)
└─ docs/                             설계 · 플랜 · 워크로그 · 하네스 규칙
```

## 개발

```bash
npm install
npm run dev      # 데모 개발 서버 (localhost:5173/fe-skills/) — 휴대폰 테스트는 npm run dev -- --host
npm test         # 단위 테스트 (vitest + jsdom)
npm run lint
npm run build    # 배포 빌드 — main 푸시 시 GitHub Pages로 자동 배포
node scripts/validateSkills.mjs   # 스킬 구조 검증
```

## 기여하기

스킬 하나를 추가하는 절차는 정해져 있습니다 — 정본 먼저, 데모는 정본을 import만.

1. `plugins/ui/skills/{slug}/SKILL.md` — frontmatter `name`은 디렉토리명과 같게, `description`은 트리거 조건(무엇을 하는가 + 사용자가 실제로 쓸 표현). 본문은 **언제 쓰는가 → 왜 이 기술인가 → 사용법(React / 순수 JS) → 커스터마이즈 → 주의사항**.
2. `assets/` — CSS 우선. 로직(상태 전이·제스처·물리)은 프레임워크 무관 코어로 분리하고 테스트를 먼저 씁니다. `prefers-reduced-motion`은 필수입니다.
3. `demo/src/demos/{slug}/` — `@skills/{slug}/assets/...`를 import해 렌더링하고 `demo/src/demos/index.ts` 레지스트리에 등록합니다.
4. 게이트 4종을 통과합니다: `npm run build && npm run lint && npm test` → `node scripts/validateSkills.mjs` → 브라우저 실동작 확인 → 모션 리뷰(이징·타이밍·reduced-motion).

자세한 규칙은 [`docs/harness-rules.md`](docs/harness-rules.md)와 [`docs/design/2026-08-19-fe-skills.md`](docs/design/2026-08-19-fe-skills.md)에 있습니다. 다음에 추가될 스킬은 [`docs/plans/`](docs/plans/)에서 볼 수 있습니다.

배지의 스킬 수·테스트 수는 `node scripts/validateSkills.mjs`가 실제 값과 대조합니다 — 스킬을 추가하면 README 숫자도 함께 올려야 게이트를 통과합니다.

## 라이선스

[MIT](LICENSE) © 2026 Guksu
