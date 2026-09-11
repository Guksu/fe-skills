<div align="center">

# fe-skills

**AI 에이전트를 위한 프론트엔드 스킬 모음**

애니메이션·UI 구현 패턴과 시스템 설계 가이드를 문서와 코드로 제공합니다.

[![Deploy demo](https://github.com/Guksu/fe-skills/actions/workflows/deploy-demo.yml/badge.svg)](https://github.com/Guksu/fe-skills/actions/workflows/deploy-demo.yml)
![UI skills](https://img.shields.io/badge/fe--ui-41%20skills-6ea8fe)
![System skills](https://img.shields.io/badge/fe--system-1%20skill-a78bfa)
![Dependencies](https://img.shields.io/badge/runtime%20deps-0-34c759)
![Tests](https://img.shields.io/badge/tests-371%20passing-34c759)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

[**라이브 데모**](https://guksu.github.io/fe-skills/) · [설치](#설치) · [UI 스킬](#ui-스킬-41종--fe-ui) · [설계 스킬](#설계-스킬--fe-system) · [개발](#개발) · [기여하기](#기여하기)

</div>

## 소개

fe-skills는 AI가 구현 전에 읽고 적용하는 설명서입니다. 패턴별 사용 시점, 구현 이유, 코드, 변경 가능한 옵션과 주의사항을 한곳에 정리했습니다.

| 플러그인 | 용도 | 구성 |
|---|---|---|
| **fe-ui** | 애니메이션·UI·제스처 구현 | 스킬 41종, 구현 코드, 라이브 데모 |
| **fe-system** | 구현 전 구조와 설계 결정 | `design` 스킬, 화면 유형별 질문과 선택 기준 |

- **CSS 우선:** CSS로 가능한 동작은 CSS로 구현합니다. 제스처·물리 모션은 별도 런타임 라이브러리 없이 TypeScript로 처리합니다.
- **로직과 React 분리:** 프레임워크에 독립적인 로직과 React 컴포넌트를 분리합니다. Vue·Svelte에서는 로직을 가져와 연결할 수 있습니다.
- **접근성 고려:** 동작 줄이기 설정을 반영하고, 기본 HTML 요소를 활용해 키보드·스크린 리더 사용을 지원합니다.
- **원본과 데모 연결:** 데모는 스킬의 구현 코드를 직접 불러옵니다. UI 스킬은 빌드·테스트·구조 검사·브라우저 동작·모션 리뷰로 검증합니다.

## 설치

Claude Code에서 마켓플레이스를 등록한 뒤 필요한 플러그인을 설치합니다.

```text
/plugin marketplace add Guksu/fe-skills
/plugin install fe-ui@fe-skills
/plugin install fe-system@fe-skills
```

> **스킬**은 AI가 읽는 설명서 한 편, **플러그인**은 스킬 묶음입니다. 이 저장소는 두 플러그인을 제공하는 **마켓플레이스**입니다.

### 사용 예시

설치 후에는 원하는 작업을 평소처럼 요청하면 됩니다. AI가 요청에 맞는 스킬을 선택합니다.

| 요청 | 적용 스킬 |
|---|---|
| “바텀시트로 메뉴 옵션을 고르게 해줘” | `bottom-sheet` |
| “피드 사진을 핀치줌할 수 있게 해줘” | `pinch-zoom` |
| “상품 목록 + 필터 + 상세 화면을 만들려고 해” | `design`으로 설계 문답 후 구현 |

## UI 스킬 41종 — fe-ui

이름을 누르면 설명서, 오른쪽 데모를 누르면 실제로 움직이는 화면을 볼 수 있습니다.

### 나타나고 사라지기

| 스킬 | 주요 동작 | 데모 |
|---|---|---|
| [진입/퇴장 애니메이션](plugins/ui/skills/enter-exit/SKILL.md) | 요소가 나타나고 사라질 때 CSS 애니메이션 적용 | [데모](https://guksu.github.io/fe-skills/#/enter-exit) |
| [스크롤 리빌](plugins/ui/skills/scroll-reveal/SKILL.md) | 스크롤 위치에 따라 콘텐츠가 차례로 등장 | [데모](https://guksu.github.io/fe-skills/#/scroll-reveal) |
| [스티키 헤더 전환](plugins/ui/skills/sticky-header/SKILL.md) | 큰 제목이 사라지면 고정 헤더에 작은 제목 표시 | [데모](https://guksu.github.io/fe-skills/#/sticky-header) |
| [리스트 재배치](plugins/ui/skills/flip-list/SKILL.md) | 목록 순서가 바뀔 때 항목이 부드럽게 이동 | [데모](https://guksu.github.io/fe-skills/#/flip-list) |
| [확대 전환 라이트박스](plugins/ui/skills/zoom-lightbox/SKILL.md) | 썸네일 위치에서 화면 중앙으로 확대하며 열기 | [데모](https://guksu.github.io/fe-skills/#/zoom-lightbox) |
| [모달 다이얼로그](plugins/ui/skills/modal-dialog/SKILL.md) | 기본 `<dialog>` 기반으로 열기·닫기, Esc 키와 포커스 처리 | [데모](https://guksu.github.io/fe-skills/#/modal-dialog) |
| [스프링 물리 모션](plugins/ui/skills/spring-physics/SKILL.md) | 드래그 속도를 이어받아 용수철처럼 움직이는 모션 | [데모](https://guksu.github.io/fe-skills/#/spring-physics) |
| [다크모드 전환](plugins/ui/skills/theme-toggle/SKILL.md) | 누른 위치에서 원형으로 테마 전환, 선택 저장 및 기기 설정 반영 | [데모](https://guksu.github.io/fe-skills/#/theme-toggle) |

### 기다리는 동안

| 스킬 | 주요 동작 | 데모 |
|---|---|---|
| [스켈레톤 시머](plugins/ui/skills/skeleton/SKILL.md) | 로딩 중 콘텐츠 자리를 채우는 뼈대와 반짝임 효과 | [데모](https://guksu.github.io/fe-skills/#/skeleton) |
| [숫자 카운트업](plugins/ui/skills/count-up/SKILL.md) | 잔액·포인트 등의 숫자를 목표값까지 점진적으로 변경 | [데모](https://guksu.github.io/fe-skills/#/count-up) |
| [스토리 프로그레스](plugins/ui/skills/story-progress/SKILL.md) | 스토리 진행 표시, 길게 눌러 일시 정지, 탭으로 이동 | [데모](https://guksu.github.io/fe-skills/#/story-progress) |
| [로딩 버튼](plugins/ui/skills/loading-button/SKILL.md) | 전송 중·완료 상태를 표시하고 중복 제출 방지 | [데모](https://guksu.github.io/fe-skills/#/loading-button) |
| [무한 스크롤](plugins/ui/skills/infinite-scroll/SKILL.md) | 목록 끝에 도달하기 전에 다음 페이지를 불러오고 중복 추가 방지 | [데모](https://guksu.github.io/fe-skills/#/infinite-scroll) |
| [가상 스크롤](plugins/ui/skills/virtual-list/SKILL.md) | 화면에 보이는 항목 중심으로 렌더링해 긴 목록 처리 | [데모](https://guksu.github.io/fe-skills/#/virtual-list) |

### 누르면 반응하기

| 스킬 | 주요 동작 | 데모 |
|---|---|---|
| [프레스 피드백](plugins/ui/skills/press-feedback/SKILL.md) | 누르는 순간 축소되고 손을 떼면 복원되는 효과 | [데모](https://guksu.github.io/fe-skills/#/press-feedback) |
| [토스트 스택](plugins/ui/skills/toast-stack/SKILL.md) | 여러 알림을 쌓고 각각의 표시 시간이 지나면 닫기 | [데모](https://guksu.github.io/fe-skills/#/toast-stack) |
| [좋아요 팝](plugins/ui/skills/like-pop/SKILL.md) | 하트 클릭·사진 더블 탭에 반응하는 팝 효과 | [데모](https://guksu.github.io/fe-skills/#/like-pop) |
| [카트 플라이](plugins/ui/skills/cart-fly/SKILL.md) | 상품이 장바구니 아이콘으로 날아가는 효과 | [데모](https://guksu.github.io/fe-skills/#/cart-fly) |
| [툴팁](plugins/ui/skills/tooltip/SKILL.md) | 마우스·키보드 입력에 맞춰 표시하고 여유 공간에 따라 배치 | [데모](https://guksu.github.io/fe-skills/#/tooltip) |
| [폼 에러 흔들림](plugins/ui/skills/form-shake-error/SKILL.md) | 입력 오류가 있는 필드를 흔들고 오류 메시지 표시 | [데모](https://guksu.github.io/fe-skills/#/form-shake-error) |

### 화면 이동

| 스킬 | 주요 동작 | 데모 |
|---|---|---|
| [탭 인디케이터 슬라이드](plugins/ui/skills/tab-indicator/SKILL.md) | 선택한 탭으로 밑줄이 부드럽게 이동 | [데모](https://guksu.github.io/fe-skills/#/tab-indicator) |
| [스냅 캐러셀](plugins/ui/skills/carousel/SKILL.md) | 옆으로 밀면 카드 단위로 정렬되는 슬라이더 | [데모](https://guksu.github.io/fe-skills/#/carousel) |
| [햄버거 메뉴](plugins/ui/skills/hamburger-menu/SKILL.md) | 메뉴 아이콘을 닫기 아이콘으로 바꾸고 패널 표시 | [데모](https://guksu.github.io/fe-skills/#/hamburger-menu) |
| [화면 전환](plugins/ui/skills/page-transition/SKILL.md) | 헤더·탭바를 유지하며 이동 방향에 맞춰 화면 전환 | [데모](https://guksu.github.io/fe-skills/#/page-transition) |
| [드롭다운 메뉴](plugins/ui/skills/dropdown-menu/SKILL.md) | 공간에 맞춰 위치를 바꾸고 방향키·첫 글자로 이동하는 액션 메뉴 | [데모](https://guksu.github.io/fe-skills/#/dropdown-menu) |

### 손가락 제스처 (모바일)

| 스킬 | 주요 동작 | 데모 |
|---|---|---|
| [바텀시트](plugins/ui/skills/bottom-sheet/SKILL.md) | 아래에서 시트를 열고 드래그로 높이 조절·닫기 | [데모](https://guksu.github.io/fe-skills/#/bottom-sheet) |
| [당겨서 새로고침](plugins/ui/skills/pull-to-refresh/SKILL.md) | 목록 상단을 당기면 저항감과 함께 새로고침 | [데모](https://guksu.github.io/fe-skills/#/pull-to-refresh) |
| [밀어서 삭제](plugins/ui/skills/swipe-to-delete/SKILL.md) | 옆으로 밀어 삭제 버튼 표시, 끝까지 밀어 삭제 | [데모](https://guksu.github.io/fe-skills/#/swipe-to-delete) |
| [피드 핀치줌](plugins/ui/skills/pinch-zoom/SKILL.md) | 두 손가락으로 사진을 확대하고 놓으면 복원 | [데모](https://guksu.github.io/fe-skills/#/pinch-zoom) |
| [끌어내려 닫는 뷰어](plugins/ui/skills/swipe-dismiss-viewer/SKILL.md) | 사진을 아래로 끌어 축소하며 닫고 원래 위치로 복귀 | [데모](https://guksu.github.io/fe-skills/#/swipe-dismiss-viewer) |
| [끌어서 순서 바꾸기](plugins/ui/skills/drag-to-reorder/SKILL.md) | 드래그 또는 방향키로 목록 순서 변경 | [데모](https://guksu.github.io/fe-skills/#/drag-to-reorder) |

### 입력 요소

| 스킬 | 주요 동작 | 데모 |
|---|---|---|
| [커스텀 셀렉트](plugins/ui/skills/select/SKILL.md) | 키보드 조작과 스크린 리더를 지원하는 드롭다운 | [데모](https://guksu.github.io/fe-skills/#/select) |
| [아코디언](plugins/ui/skills/accordion/SKILL.md) | CSS로 높이를 전환하며 콘텐츠 펼치기·접기 | [데모](https://guksu.github.io/fe-skills/#/accordion) |
| [토글 스위치](plugins/ui/skills/switch/SKILL.md) | 기본 체크박스를 활용한 켜기·끄기 스위치 | [데모](https://guksu.github.io/fe-skills/#/switch) |
| [플로팅 라벨 입력](plugins/ui/skills/floating-label/SKILL.md) | 입력 상태에 따라 안내 문구를 상단 라벨로 전환 | [데모](https://guksu.github.io/fe-skills/#/floating-label) |
| [체크박스 · 라디오](plugins/ui/skills/checkbox-radio/SKILL.md) | 선택 상태에 맞춰 체크 표시와 라디오 점에 모션 적용 | [데모](https://guksu.github.io/fe-skills/#/checkbox-radio) |
| [인증번호 입력](plugins/ui/skills/otp-input/SKILL.md) | 입력·삭제 시 칸 이동, 인증번호 붙여넣기 지원 | [데모](https://guksu.github.io/fe-skills/#/otp-input) |
| [검색어 자동완성](plugins/ui/skills/search-suggest/SKILL.md) | 입력이 멈추면 검색하고 이전 응답이 최신 결과를 덮지 않도록 처리 | [데모](https://guksu.github.io/fe-skills/#/search-suggest) |
| [범위 슬라이더](plugins/ui/skills/range-slider/SKILL.md) | 두 손잡이로 최솟값·최댓값을 조절하는 범위 입력 | [데모](https://guksu.github.io/fe-skills/#/range-slider) |
| [수량 스테퍼](plugins/ui/skills/quantity-stepper/SKILL.md) | 버튼으로 수량 조절, 길게 눌러 가속, 최솟값에서 삭제 전환 | [데모](https://guksu.github.io/fe-skills/#/quantity-stepper) |
| [파일 업로드](plugins/ui/skills/file-upload/SKILL.md) | 파일 드롭, 미리보기·진행률 표시, 거절 사유 안내 | [데모](https://guksu.github.io/fe-skills/#/file-upload) |


## 설계 스킬 — fe-system

[`design`](plugins/system/skills/design/SKILL.md)은 구현 전에 결정할 사항을 정리합니다. 필터를 URL에 저장할지, 상세 화면에서 돌아왔을 때 스크롤을 복원할지, 데이터를 언제 가져올지 등을 함께 결정합니다.

### 진행 방식

1. **기존 코드 조사:** 프레임워크, 라우터, API 등 코드에서 확인할 수 있는 사실을 먼저 파악합니다.
2. **설계 문답:** 남은 질문을 묶어 제시하고, 각 선택의 추천안과 장단점을 설명합니다.
3. **결정 기록:** 프로젝트의 `docs/design/`에 결정, 근거, 감수할 단점과 재검토 조건을 남깁니다.

| 질문 유형 | 처리 방식 |
|---|---|
| **확정형** | 정해진 원칙을 질문 없이 적용 |
| **추천형** | 상황에 맞는 추천안과 장단점을 제시하고 선택 확인 |
| **필수 확인형** | 결제사 정책·개인정보 보관 요건 등은 추측하지 않고 확인 |

### 화면 유형별 가이드

목록에 없는 화면도 공통 질문을 바탕으로 설계할 수 있습니다.

| 가이드 | 주요 결정 사항 |
|---|---|
| [공통 질문](plugins/system/skills/design/references/core-questions.md) | 요구사항, 데이터, 실행 환경, 상태 관리, 데이터 로딩, 복원, 실패 대응, 장단점 |
| [목록 + 필터 + 상세](plugins/system/skills/design/references/cases/list-and-detail.md) | URL 필터, 데이터 로딩, 페이지네이션·무한 스크롤, 스크롤 복원 |
| [무한 피드](plugins/system/skills/design/references/cases/feed.md) | 커서 페이지네이션, 화면 밖 항목 처리, 복귀 복원, 새 글 삽입, 추가 로딩 시점 |
| [퍼널 폼](plugins/system/skills/design/references/cases/funnel-form.md) | 여러 단계 입력의 값 보관, 단계별 URL, 검증 시점, 이어서 작성, 중복 제출 방지 |

선택의 근거는 [`references/topics/`](plugins/system/skills/design/references/topics/)에서 확인할 수 있습니다.

## 스킬 구성

UI 스킬은 설명서와 실제 구현 코드를 함께 제공합니다.

```text
plugins/ui/skills/bottom-sheet/
├─ SKILL.md                 사용 시점 · 구현 이유 · 사용법 · 옵션 · 주의사항
└─ assets/
   ├─ createSheetDrag.ts    프레임워크에 독립적인 드래그 로직
   ├─ bottom-sheet.css      움직임과 상태 정의
   └─ BottomSheet.tsx       React 컴포넌트
```

`assets/`의 코드를 프로젝트에 복사해 사용할 수 있습니다. 공유 로직도 각 스킬에 포함하므로 스킬 단위로 가져올 수 있습니다. 저장소 검사 스크립트가 공유 파일과 원본의 일치 여부를 확인합니다.

시스템 설계 스킬은 구현 코드 대신 `SKILL.md`와 `references/`의 질문·근거 문서로 구성됩니다.

## 저장소 구조

```text
fe-skills/
├─ .claude-plugin/marketplace.json   플러그인 등록 정보
├─ plugins/
│  ├─ ui/skills/{스킬}/             UI 스킬 원본 문서와 코드
│  └─ system/skills/design/         설계 문답 규칙과 참고 문서
├─ demo/                            Vite + React 데모 사이트
├─ scripts/validateSkills.mjs        스킬 구조·배지 검사
└─ docs/                            설계 · 계획 · 작업 기록 · 규칙
```

## 개발

### 데모 실행

```bash
npm install
npm run dev
```

브라우저에서 [로컬 데모](http://localhost:5173/fe-skills/)를 엽니다. 같은 네트워크의 휴대폰에서 확인하려면 `npm run dev -- --host`로 실행합니다.

### 검증

| 명령어 | 확인 항목 |
|---|---|
| `npm test` | Vitest + jsdom 테스트 |
| `npm run lint` | 코드 린트 |
| `npm run build` | 배포용 빌드 |
| `node scripts/validateSkills.mjs` | 스킬 구조, 공유 코드 일치 여부, README 배지 숫자 |

`main`에 변경이 올라가면 GitHub Pages로 데모가 자동 배포됩니다.

## 기여하기

**스킬 문서와 코드가 원본입니다.** 데모는 `assets/`를 직접 불러오며, 코드를 복사하지 않습니다.

### UI 스킬 추가

1. **설명서 작성:** `plugins/ui/skills/{이름}/SKILL.md`를 만듭니다. `name`은 폴더명과 맞추고, `description`에는 사용자가 요청할 법한 표현을 넣습니다. 본문은 사용 시점 → 구현 이유 → 사용법(React / 순수 JS) → 옵션 → 주의사항 순서로 작성합니다.
2. **구현 코드 추가:** `assets/`에 CSS와 프레임워크 독립 로직을 작성합니다. 로직은 테스트부터 작성하고, 동작 줄이기 설정을 반영합니다.
3. **데모 등록:** `demo/src/demos/{이름}/`에서 `@skills/{이름}/assets/...`를 불러오고, `demo/src/demos/index.ts`에 등록합니다.
4. **검증:** 빌드·린트·테스트·구조 검사를 실행합니다. 브라우저에서 동작을 확인하고 모션의 속도·감속·접근성 설정을 검토합니다.

스킬이나 테스트 수가 바뀌면 README 배지도 갱신해야 구조 검사를 통과합니다. 시스템 설계 스킬은 문서와 참고 자료를 검증하며, 데모·브라우저 검사는 적용하지 않습니다.

### 관련 문서

- [작업 규칙](docs/harness-rules.md)
- [저장소 설계](docs/design/2026-08-19-fe-skills.md)
- [추가 예정 스킬과 작업 계획](docs/plans/)

## 라이선스

[MIT](LICENSE) © 2026 Guksu
