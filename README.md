<div align="center">

# fe-skills

**AI 에이전트에게 주는 프론트엔드 설명서 모음** — 애니메이션·UI 구현 패턴과 시스템 설계 문답을, AI가 읽고 바로 적용할 수 있는 형태로 정리했습니다.

[![Deploy demo](https://github.com/Guksu/fe-skills/actions/workflows/deploy-demo.yml/badge.svg)](https://github.com/Guksu/fe-skills/actions/workflows/deploy-demo.yml)
![UI skills](https://img.shields.io/badge/fe--ui-29%20skills-6ea8fe)
![System skills](https://img.shields.io/badge/fe--system-1%20skill-a78bfa)
![Dependencies](https://img.shields.io/badge/runtime%20deps-0-34c759)
![Tests](https://img.shields.io/badge/tests-202%20passing-34c759)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

[**라이브 데모**](https://guksu.github.io/fe-skills/) · [설치](#설치) · [UI 스킬 목록](#ui-스킬-29종--fe-ui) · [설계 스킬](#설계-스킬--fe-system) · [기여하기](#기여하기) · [라이선스](#라이선스)

</div>

---

## 이게 뭔가요

AI에게 "바텀시트 만들어줘"라고 하면 **매번 다른 코드가 나옵니다.** 어떤 날은 손가락으로 끌어내려 닫는 동작이 빠지고, 어떤 날은 닫힐 때 애니메이션이 없고, 어떤 날은 "애니메이션 줄이기" 설정을 켠 사용자를 무시합니다. 사람이 매번 지적해야 하죠.

fe-skills는 **그 판단을 미리 문서로 고정해둔 것**입니다. "이 패턴은 언제 쓰는지, 왜 이 방식인지, 어디를 바꿔도 되고 무엇을 조심해야 하는지, 그리고 복사해 쓸 코드"까지 한 세트로 들어 있습니다. AI가 코드를 짜기 전에 이 문서를 읽으므로 결과가 일정해집니다.

<details>
<summary><b>용어 세 개만 먼저</b></summary>

- **스킬(skill)** — AI가 읽는 설명서 한 편. 폴더 하나에 문서 + 코드가 들어 있습니다.
- **플러그인(plugin)** — 스킬을 묶은 꾸러미. 이 저장소에는 두 개가 있습니다: `fe-ui`(화면 구현), `fe-system`(설계).
- **마켓플레이스(marketplace)** — 플러그인을 설치할 수 있게 등록해둔 곳. 이 저장소 자체가 마켓플레이스입니다.

</details>

이 저장소가 지키는 원칙 네 가지:

- **CSS로 되는 건 CSS로, 외부 라이브러리는 쓰지 않습니다.** 설치하면 늘어나는 용량이 0입니다. 손가락 제스처나 물리 움직임처럼 CSS로 안 되는 것만 순수 TypeScript로 직접 만들었습니다.
- **코드가 2층입니다.** 아래층은 프레임워크와 무관한 순수 로직(`.ts`), 위층은 얇은 React 껍데기. Vue나 Svelte를 쓴다면 아래층만 가져가면 됩니다.
- **접근성은 옵션이 아닙니다.** 모든 UI 스킬이 "애니메이션 줄이기" 설정을 존중하고, 체크박스·다이얼로그 같은 것은 브라우저 기본 요소 위에 얹어 만듭니다 — 키보드 조작과 스크린 리더가 저절로 동작합니다.
- **눈으로 확인한 것만 올라갑니다.** 빌드·테스트·구조 검사·브라우저 실동작·모션 리뷰를 통과해야 등록됩니다. 데모 사이트는 문서 속 코드를 그대로 불러다 쓰므로, 데모에서 보이는 동작이 곧 여러분이 받는 코드입니다.

## 설치

Claude Code에서 아래 세 줄을 입력하면 끝입니다.

```
/plugin marketplace add Guksu/fe-skills
/plugin install fe-ui@fe-skills        # 화면 구현 — 애니메이션·UI
/plugin install fe-system@fe-skills    # 설계 — 코드 짜기 전 구조 잡기
```

설치 후에는 **평소처럼 말하면 됩니다.** 어떤 스킬을 쓸지는 AI가 알아서 고릅니다.

```
"바텀시트로 메뉴 옵션 고르게 해줘"          → bottom-sheet 스킬로 구현
"피드 사진 핀치줌 되게 해줘"                → pinch-zoom 스킬로 구현
"상품 목록 + 필터 + 상세 화면 만들려고 해"   → design 스킬로 설계 문답 후 구현
```

## 스킬 하나에 뭐가 들어 있나

```
plugins/ui/skills/bottom-sheet/
├─ SKILL.md                 언제 쓰나 · 왜 이 방식인가 · 사용법 · 바꿔도 되는 것 · 주의사항
└─ assets/
   ├─ createSheetDrag.ts    끌어내리는 동작 로직 (React 없이도 동작)
   ├─ bottom-sheet.css      움직임과 상태 정의
   └─ BottomSheet.tsx       React용 껍데기
```

`assets/` 안의 파일은 예시가 아니라 **그대로 쓰는 실제 코드**입니다. 프로젝트에 복사해 넣으면 됩니다(TypeScript를 안 쓴다면 타입만 지우면 동작합니다).

여러 스킬이 같은 로직을 쓰는 경우(예: 용수철 움직임), 각 스킬 폴더에 복사본을 넣어뒀습니다 — 스킬 하나만 설치해도 그것만으로 완결되게 하려고요. 복사본이 원본과 달라지지 않도록 저장소 검사 스크립트가 두 파일을 대조합니다.

## UI 스킬 29종 — fe-ui

이름을 누르면 설명서, 오른쪽 데모를 누르면 실제로 움직이는 화면을 볼 수 있습니다.

### 나타나고 사라지기

| 스킬 | 이름(slug) | 무엇을 하나 | |
|---|---|---|---|
| [진입/퇴장 애니메이션](plugins/ui/skills/enter-exit/SKILL.md) | `enter-exit` | 나타날 때뿐 아니라 **사라질 때도** 부드럽게 — 보통 빼먹는 퇴장 처리까지 CSS로 | [데모](https://guksu.github.io/fe-skills/#/enter-exit) |
| [스크롤 리빌](plugins/ui/skills/scroll-reveal/SKILL.md) | `scroll-reveal` | 스크롤을 내리면 콘텐츠가 차례로 나타남 | [데모](https://guksu.github.io/fe-skills/#/scroll-reveal) |
| [스티키 헤더 전환](plugins/ui/skills/sticky-header/SKILL.md) | `sticky-header` | 큰 제목이 위로 사라지면 상단 고정 바에 작은 제목이 대신 등장 | [데모](https://guksu.github.io/fe-skills/#/sticky-header) |
| [리스트 재배치](plugins/ui/skills/flip-list/SKILL.md) | `flip-list` | 목록 순서가 바뀔 때 항목이 순간이동하지 않고 미끄러져 이동 | [데모](https://guksu.github.io/fe-skills/#/flip-list) |
| [확대 전환 라이트박스](plugins/ui/skills/zoom-lightbox/SKILL.md) | `zoom-lightbox` | 썸네일을 누르면 그 자리에서 화면 중앙으로 커지며 열림 | [데모](https://guksu.github.io/fe-skills/#/zoom-lightbox) |
| [모달 다이얼로그](plugins/ui/skills/modal-dialog/SKILL.md) | `modal-dialog` | 배경이 어두워지며 창이 열림 — 브라우저 기본 `<dialog>`를 써서 Esc 닫기·포커스 가두기가 공짜 | [데모](https://guksu.github.io/fe-skills/#/modal-dialog) |
| [스프링 물리 모션](plugins/ui/skills/spring-physics/SKILL.md) | `spring-physics` | "0.3초 동안" 대신 **용수철처럼** 움직이기 — 손가락으로 던진 속도를 그대로 이어받음 | [데모](https://guksu.github.io/fe-skills/#/spring-physics) |

### 기다리는 동안

| 스킬 | 이름(slug) | 무엇을 하나 | |
|---|---|---|---|
| [스켈레톤 시머](plugins/ui/skills/skeleton/SKILL.md) | `skeleton` | 로딩 중 회색 뼈대와 반짝임으로 자리를 잡아둠 — 데이터가 오면 화면이 덜컹이지 않음 | [데모](https://guksu.github.io/fe-skills/#/skeleton) |
| [숫자 카운트업](plugins/ui/skills/count-up/SKILL.md) | `count-up` | 잔액·포인트 숫자가 목표값까지 굴러 올라감 | [데모](https://guksu.github.io/fe-skills/#/count-up) |
| [스토리 프로그레스](plugins/ui/skills/story-progress/SKILL.md) | `story-progress` | 인스타 스토리식 진행 바 — 길게 누르면 멈추고, 탭하면 다음으로 | [데모](https://guksu.github.io/fe-skills/#/story-progress) |

### 누르면 반응하기

| 스킬 | 이름(slug) | 무엇을 하나 | |
|---|---|---|---|
| [프레스 피드백](plugins/ui/skills/press-feedback/SKILL.md) | `press-feedback` | 누르는 순간 살짝 눌렸다가 튕기듯 돌아옴 | [데모](https://guksu.github.io/fe-skills/#/press-feedback) |
| [토스트 스택](plugins/ui/skills/toast-stack/SKILL.md) | `toast-stack` | 알림이 여러 개 쌓이고 각자 시간이 되면 사라짐 | [데모](https://guksu.github.io/fe-skills/#/toast-stack) |
| [좋아요 팝](plugins/ui/skills/like-pop/SKILL.md) | `like-pop` | 하트를 누르면 톡 튀고, 사진을 두 번 탭하면 하트가 퍼짐 | [데모](https://guksu.github.io/fe-skills/#/like-pop) |
| [카트 플라이](plugins/ui/skills/cart-fly/SKILL.md) | `cart-fly` | 담기를 누르면 상품이 장바구니 아이콘으로 포물선을 그리며 날아감 | [데모](https://guksu.github.io/fe-skills/#/cart-fly) |
| [툴팁](plugins/ui/skills/tooltip/SKILL.md) | `tooltip` | 마우스는 잠깐 기다렸다가, 키보드 포커스는 즉시 — 공간에 맞춰 4방향 배치 | [데모](https://guksu.github.io/fe-skills/#/tooltip) |
| [폼 에러 흔들림](plugins/ui/skills/form-shake-error/SKILL.md) | `form-shake-error` | 잘못 입력한 칸이 좌우로 흔들리고 에러 문구가 올라옴 — 연타해도 처음부터 다시 흔들림 | [데모](https://guksu.github.io/fe-skills/#/form-shake-error) |

### 화면 이동

| 스킬 | 이름(slug) | 무엇을 하나 | |
|---|---|---|---|
| [탭 인디케이터 슬라이드](plugins/ui/skills/tab-indicator/SKILL.md) | `tab-indicator` | 선택한 탭의 밑줄이 미끄러져 이동 | [데모](https://guksu.github.io/fe-skills/#/tab-indicator) |
| [스냅 캐러셀](plugins/ui/skills/carousel/SKILL.md) | `carousel` | 옆으로 밀면 한 장씩 딱 맞춰 멈추는 배너·카드 슬라이더 | [데모](https://guksu.github.io/fe-skills/#/carousel) |
| [햄버거 메뉴](plugins/ui/skills/hamburger-menu/SKILL.md) | `hamburger-menu` | ≡ 버튼이 X로 변하고 메뉴가 옆에서 밀려 나옴 | [데모](https://guksu.github.io/fe-skills/#/hamburger-menu) |

### 손가락 제스처 (모바일)

| 스킬 | 이름(slug) | 무엇을 하나 | |
|---|---|---|---|
| [바텀시트](plugins/ui/skills/bottom-sheet/SKILL.md) | `bottom-sheet` | 아래에서 올라오는 시트 — 끌어내려 닫고, 중간 높이에 걸림 | [데모](https://guksu.github.io/fe-skills/#/bottom-sheet) |
| [당겨서 새로고침](plugins/ui/skills/pull-to-refresh/SKILL.md) | `pull-to-refresh` | 맨 위에서 아래로 당기면 새로고침 — 고무줄처럼 저항이 걸림 | [데모](https://guksu.github.io/fe-skills/#/pull-to-refresh) |
| [밀어서 삭제](plugins/ui/skills/swipe-to-delete/SKILL.md) | `swipe-to-delete` | 왼쪽으로 밀면 삭제 버튼이 나오고, 끝까지 밀면 바로 삭제 | [데모](https://guksu.github.io/fe-skills/#/swipe-to-delete) |
| [피드 핀치줌](plugins/ui/skills/pinch-zoom/SKILL.md) | `pinch-zoom` | 두 손가락으로 벌리면 그 자리에서 확대, 놓으면 제자리 — 인스타그램 방식 | [데모](https://guksu.github.io/fe-skills/#/pinch-zoom) |
| [끌어내려 닫는 뷰어](plugins/ui/skills/swipe-dismiss-viewer/SKILL.md) | `swipe-dismiss-viewer` | 사진을 아래로 끌면 작아지며 뒤 화면이 비치고, 놓으면 원래 자리로 — iOS 사진 앱 방식 | [데모](https://guksu.github.io/fe-skills/#/swipe-dismiss-viewer) |

### 입력 요소

| 스킬 | 이름(slug) | 무엇을 하나 | |
|---|---|---|---|
| [커스텀 셀렉트](plugins/ui/skills/select/SKILL.md) | `select` | 직접 만든 드롭다운 — 키보드 조작과 스크린 리더 대응이 들어 있음 | [데모](https://guksu.github.io/fe-skills/#/select) |
| [아코디언](plugins/ui/skills/accordion/SKILL.md) | `accordion` | 접었다 펴는 영역 — 높이를 JS로 재지 않고 CSS만으로 부드럽게 | [데모](https://guksu.github.io/fe-skills/#/accordion) |
| [토글 스위치](plugins/ui/skills/switch/SKILL.md) | `switch` | 켜고 끄는 스위치 — 기본 체크박스 위에 얹어 접근성 유지 | [데모](https://guksu.github.io/fe-skills/#/switch) |
| [플로팅 라벨 입력](plugins/ui/skills/floating-label/SKILL.md) | `floating-label` | 입력을 시작하면 안내 문구가 위로 떠올라 라벨이 됨 | [데모](https://guksu.github.io/fe-skills/#/floating-label) |
| [체크박스 · 라디오](plugins/ui/skills/checkbox-radio/SKILL.md) | `checkbox-radio` | 체크 표시가 그려지듯 나타나고 라디오 점이 톡 맺힘 | [데모](https://guksu.github.io/fe-skills/#/checkbox-radio) |

## 설계 스킬 — fe-system

UI 스킬이 "어떻게 보이게 할까"라면, 설계 스킬은 **"코드를 짜기 전에 무엇을 정해야 하나"**를 다룹니다.

예를 들어 상품 목록 화면 하나에도 이런 결정이 숨어 있습니다. 필터를 주소창(URL)에 넣을 것인가(넣으면 링크 공유·새로고침에 살아남습니다), 상세 페이지에 갔다 돌아왔을 때 스크롤 위치를 되살릴 것인가, 데이터를 서버에서 미리 그려 보낼 것인가. **이걸 안 정하고 짜면 나중에 "뒤로가기가 이상해요"가 됩니다.**

### 어떻게 동작하나

`design` 스킬은 답을 정해주지 않고 **같이 정합니다.** 순서는 셋입니다.

1. **알아낼 수 있는 건 AI가 직접 찾습니다.** 어떤 프레임워크를 쓰는지, 라우터가 뭔지, 기존 API가 어떻게 생겼는지는 코드를 뒤져서 파악하고 "이렇게 파악했다"고 확인만 받습니다. 이런 걸 사용자에게 묻지 않습니다.
2. **남은 것만 묶어서 묻습니다.** 지금 답할 수 있는 질문을 한 번에 모아서 내고, **질문마다 추천안과 그 선택의 대가를 붙입니다.** 하나씩 물어보며 핑퐁하지 않습니다.
3. **결과를 파일로 남깁니다.** 여러분 프로젝트의 `docs/design/`에 "무엇을 왜 그렇게 정했고, 무엇을 포기했고, 어떤 상황이 되면 이 결정을 다시 봐야 하는지"를 기록합니다.

질문은 세 가지 강도로 나뉩니다.

| 강도 | 뜻 | 예 |
|---|---|---|
| **확정형** | 정답이 정해져 있어 묻지 않고 못박음 | 피드 목록은 커서 방식 페이지네이션, 카드번호는 어디에도 저장 금지 |
| **추천형** | 상황에 따라 갈리므로 추천안을 붙여 물어봄 | 입력값을 브라우저에 둘지 서버에 둘지 |
| **필수 확인형** | 틀리면 손해가 커서 추측 금지, 반드시 물어봄 | 결제사 정책, 개인정보 보관 요건 |

| 스킬 | 하는 일 |
|---|---|
| [design](plugins/system/skills/design/SKILL.md) | 설계 문답 진행 — 사실 조사 → 추천안을 붙인 라운드 문답 → 결정 기록 남기기 |

### 어떤 화면을 다루나

스킬 안에 화면 유형별 질문 목록이 들어 있습니다. **목록에 없는 화면이어도 공통 질문으로 진행**하므로 "이건 못 한다"고 거절하지 않습니다.

| 참고 문서 | 다루는 것 |
|---|---|
| [공통 질문](plugins/system/skills/design/references/core-questions.md) | 모든 화면에 해당하는 8가지 — 요구사항, 데이터 성격, 실행 환경, 상태를 어디 둘까, 데이터를 언제 가져올까, 새로고침·뒤로가기에서 뭐가 살아야 할까, 실패하면 어떻게 될까, 무엇을 포기할까 |
| [목록 + 필터 + 상세](plugins/system/skills/design/references/cases/list-and-detail.md) | 상품 목록·검색 결과 — 필터를 URL에 두기, 데이터 가져오는 방식 고르기, 페이지네이션 vs 무한스크롤, 돌아왔을 때 스크롤 복원 |
| [무한 피드](plugins/system/skills/design/references/cases/feed.md) | 타임라인·추천 피드 — 커서 페이지네이션, 화면 밖 항목 처리, 복귀 복원, 새 글이 끼어들 때, 다음 페이지 부르는 시점 |
| [퍼널 폼](plugins/system/skills/design/references/cases/funnel-form.md) | 여러 단계로 나뉜 입력(주문·회원가입·온보딩·설문) — 도메인 4갈래, 입력값 보관 위치, 단계별 URL, 검사 시점, 이어서 하기, 중복 제출 막기 |

각 결정의 "왜 그런가"는 [`references/topics/`](plugins/system/skills/design/references/topics/)에 따로 정리돼 있습니다.

## 저장소 구조

```
fe-skills/
├─ .claude-plugin/marketplace.json   플러그인 2개를 등록해둔 파일
├─ plugins/
│  ├─ ui/skills/{스킬}/              fe-ui 원본 — SKILL.md + assets/(로직·CSS·React)
│  └─ system/skills/design/          fe-system 원본 — SKILL.md(문답 규칙) + references/(질문·근거)
├─ demo/                             데모 사이트 (Vite + React) — 원본 코드를 그대로 불러 씀
├─ scripts/validateSkills.mjs        스킬 구조 검사 스크립트
└─ docs/                             설계 문서 · 계획 · 작업 기록 · 작업 규칙
```

## 개발

```bash
npm install
npm run dev      # 데모 서버 (localhost:5173/fe-skills/) — 휴대폰에서 보려면 npm run dev -- --host
npm test         # 테스트 (vitest + jsdom)
npm run lint
npm run build    # 배포용 빌드 — main에 올라가면 GitHub Pages로 자동 배포
node scripts/validateSkills.mjs   # 스킬 구조 검사
```

## 기여하기

스킬을 추가하는 순서는 정해져 있습니다. **원본이 먼저, 데모는 원본을 불러다 쓰기만 합니다**(복사 금지).

1. `plugins/ui/skills/{이름}/SKILL.md` — 맨 위 `name`은 폴더명과 같게, `description`에는 **사용자가 실제로 쓸 법한 표현**을 넣습니다(AI가 이걸 보고 스킬을 고릅니다). 본문 순서: 언제 쓰나 → 왜 이 방식인가 → 사용법(React / 순수 JS) → 바꿔도 되는 것 → 주의사항.
2. `assets/` — CSS로 되는 건 CSS로. 로직(상태 전환·제스처·물리)은 프레임워크 없이 동작하게 분리하고 테스트를 먼저 씁니다. "애니메이션 줄이기" 설정 대응은 필수입니다.
3. `demo/src/demos/{이름}/` — `@skills/{이름}/assets/...`를 불러와 화면을 만들고 `demo/src/demos/index.ts`에 등록합니다.
4. 검사 4종을 통과시킵니다: `npm run build && npm run lint && npm test` → `node scripts/validateSkills.mjs` → 브라우저에서 직접 동작 확인 → 움직임 리뷰(속도·감속 곡선·접근성 설정).

자세한 규칙은 [`docs/harness-rules.md`](docs/harness-rules.md)와 [`docs/design/2026-08-19-fe-skills.md`](docs/design/2026-08-19-fe-skills.md)에 있습니다. 앞으로 추가할 스킬 목록은 [`docs/plans/`](docs/plans/)에서 볼 수 있습니다.

맨 위 배지의 스킬 수·테스트 수는 검사 스크립트가 실제 값과 대조합니다 — 스킬을 추가했으면 README 숫자도 같이 고쳐야 통과합니다.

## 라이선스

[MIT](LICENSE) © 2026 Guksu
