# 출시 준비 — README·데모 점검(Show GN·Show HN)

| 항목 | 내용 |
|------|------|
| 날짜 | 2026-10-08 |
| 작성 | 에이전트 (Claude Code) |
| 관련 경로 | `README.md`, `README.en.md`, `docs/guide*.md`, `docs/benchmark*.md`, `docs/assets/CREDITS.md`, `demo/`, `skills/suta/patterns/*`(문구 prop), 매니페스트 3곳, `AGENTS.md`, `.agents/skills/add-skill/` |

## 1. 개요

사용자는 suta를 긱뉴스(Show GN)와 해커뉴스(Show HN)에 올리려 한다. 그 전에 README 설명과 데모 페이지를 점검해 달라고 했다. 데모 사이드바는 묶음 제목과 항목이 잘 구별되지 않는다고 따로 짚었다. 점검 뒤 사용자는 세 가지를 골랐다: 데모를 밝은 테마로 바꾸기, 데모 안 문구를 영어로 옮기기, 게시글 초안 쓰기. 밝은 테마는 적용해 본 뒤 "예시가 검정 위주라 예전 색이 낫다"는 확인을 받고 예전 색으로 되돌렸다(아래 "데모 색").

## 2. 작업내용

- **점검에서 찾은 것**
  - 데모 사이트가 suta의 금지선을 스스로 어기고 있었다.
    - 사이드바·홈 카드·데모 제목에 이모지 아이콘이 있었다.
    - 셸 강조색이 Bootstrap 파랑(`#6ea8fe`)이었다.
    - 패턴 강조색은 Tailwind blue-600(`#2563eb`)에 연결돼 있었다.
  - README 비교 표의 TO-BE는 suta 0.8 실행 4회 중 C였다.
    - "갈색 강조색 하나"와 "axe 0곳"은 C에만 맞았다. 다른 실행은 초록이었고, axe 결과는 1·0·0·2곳이었다.
    - README에 실행 횟수를 적지 않았다.
  - 벤치마크 판정 "11번과 19번"이 무엇을 뜻하는지 README에 없었다.
    - 같은 모델 판정은 suta를 덜 골랐다(11 : 21).
    - 다른 모델 판정은 suta를 더 골랐다(19 : 13).
  - 영어 상세 안내에 "55 tested patterns"·줄표 23개가 남아 있었다. 벤치마크 한계 절에는 1차 판정 숫자가 남아 있었다.
  - 플러그인 설명이 한국어였다. 그 안에 README에서 걷어 낸 표현("AI 슬롭 없는 UI —", "검증된")이 남아 있었다.
- **데모 셸** (`demo/src/styles.css`, `App.tsx`, `i18n.ts`, `index.html`)
  - 사이드바 위계는 크기 대신 밝기·굵기·들여쓰기로 나눴다.
    - 묶음 제목은 주 글자색·600이다.
    - 항목은 보조 글자색·400이고, 왼쪽 세로선 안으로 들여 썼다.
    - 현재 항목은 주 글자색·600에, 세로선 그 자리를 2px 강조색으로 그린다(`aria-current="page"`).
  - 주소로 바로 들어오면 현재 항목을 사이드바 안으로 끌어온다.
  - `DemoEntry.emoji`와 56개 값을 지웠다.
  - 홈에 GitHub·README 링크와 Claude Code 설치 명령(복사 단추)을 두었다.
  - `index.html`에 설명·공유 미리보기·SVG 파비콘을 더했다. 미리보기 그림은 `demo/public/og.jpg`이고 README 비교 이미지와 같다.
  - 데모 설명 40곳의 줄표를 걷었다. 실제 앱 이름(인스타·애플·iOS)도 뺐다(AGENTS.md 규칙 7).
  - 사용 예시 코드 블록은 키보드로도 스크롤되게 했다(axe `scrollable-region-focusable`).
- **데모 색 — 밝은 테마를 시도했다가 되돌렸다**
  - 처음에는 셸을 suta 색 역할 토큰(밝은 테마)에 연결하고, 패턴 강조색 연결(파랑)을 지워 패턴 기본값(거의 검정)을 보이게 했다.
  - 사용자 확인: 예시가 검정 위주라 예전 색 조합이 낫다.
  - 강조색 후보 넷을 데모 4개에 입혀 보여 드렸다: 육수 갈색 `#a35a14`, 김 청록 `#1d5e5a`, 밀 금색 `#8a5a00`, 어두운 바탕 + 호박색.
    - 참고한 UI 라이브러리 데모: Radix·Headless UI·Mantine·React Aria·shadcn·Base UI.
  - 결정: 데모 색은 main(어두운 바탕, 셸 `#6ea8fe`, 패턴 연결 `#2563eb`) 그대로 두고, 사이드바 묶음 제목만 잘 보이게 한다.
  - 그래서 `styles.css`의 `:root`·버튼 호버·홈 카드 색과, 밝은 테마 때문에 고쳤던 데모 CSS 4곳(press-feedback·layout-principles·loading-button·theme-toggle)을 main과 같게 되돌렸다.
  - 남긴 것
    - 사이드바 위계
    - `body`의 `accent-color: var(--accent)`(네이티브 컨트롤이 셸 강조색을 따른다)
    - card-stack 카드 위 작은 글자 대비 고침(테마와 무관)
- **패턴 문구 prop** (TDD, `demo/src/tests/patternLabels.test.tsx` 13개)
  - 한국어 문구가 박혀 있던 패턴 8종에 선택 prop을 더했다. 기본값은 지금 한국어 그대로다.
    - like-pop `labels`, theme-toggle `label`, swipe-dismiss-viewer `closeLabel`
    - file-upload `labels`, drag-to-reorder `messages`, otp-input `digitLabel`
    - quantity-stepper `buttonLabels`, bottom-nav `badgeLabels`
  - bottom-nav의 `badgeLabel`은 인자를 named-object(`{ badge, labels }`)로 바꿨다.
  - 접근성 위반 세 곳을 고쳤다.
    - select: 콤보박스에 이름이 없었다. `label`·`labelledBy`를 더했고, 둘 다 없으면 placeholder를 이름으로 쓴다.
    - long-press-menu: 트리거에 `role="button"`을 줬다. 역할 없는 div에는 `aria-expanded`가 허용되지 않는다.
    - range-slider: 손잡이 기본 크기를 22 → 24px로 늘렸다(WCAG 2.2 누르는 영역 최소).
  - 각 PATTERN.md 커스터마이즈 표에 한 행씩 더했다.
- **데모 안 문구 영어화**
  - `demo/src/demoLang.ts`를 새로 만들었다(`useDemoLang`, `defineCopy`). 영어판의 키가 한국어판과 다르면 타입 검사가 막는다.
  - bottom-nav를 기준으로 옮긴 뒤, 나머지 54개는 에이전트 6개에 나눠 옮겼다.
  - 회귀 테스트 `demo/src/tests/demoCopy.test.tsx`
    - 모든 데모를 'en'으로 렌더해 보이는 글자와 읽히는 속성에 한글이 없는지 본다.
    - 기본('ko')에는 한국어가 그대로인지 본다.
    - 검사 데모 2종(layout-audit·motion-audit)은 결과 메시지가 한국어라 영어 검사에서 뺐다. 셸이 그 둘에만 안내 문구를 붙인다.
- 에이전트가 맞춘 것과 내가 마지막에 손본 것:
    - 언어를 바꾸면 이미 보이는 결과(로그·상태 줄·받은 목록)도 따라 바뀌게, 완성된 문장 대신 id·상태를 저장하고 그릴 때 문구를 고르게 했다.
    - 용어집에 없는 메뉴는 뜻을 옮겼다(냉모밀 Cold soba, 만둣국 Dumpling soup 등). 잔치국수와 멸치국수가 한 목록에 함께 나오는 곳은 잔치국수를 "Feast noodles"로 나눴다.
    - "성수동 손칼국수"는 묶음마다 세 가지로 옮겨져 있어 "Seongsu-dong Knife-cut Noodles" 하나로 맞췄다.
    - 소셜 로그인 버튼은 한국어판처럼 제공자 이름을 그대로 썼다(Continue with Kakao·Naver).
    - TV 프로그램 이름(수요미식회)처럼 실제 이름이 든 문구는 영어에서 뜻만 옮겼다.
  - 데모 안 접근성 고침(에이전트): 스크롤 상자 5곳(sticky-header·stretchy-header·virtual-list·infinite-scroll·carousel)에 초점·이름·초점 링, carousel 점은 `role="group"`·`aria-current`·누르는 영역 24px, select에 이름.
  - pull-to-refresh: 스크롤 상자가 초점을 받게 하고 `label` prop을 더했다(테스트 먼저). 데모가 쓰던 "그린 뒤 DOM을 직접 고치는" 우회를 걷었다.
- **README 두 벌**
  - AS-IS / TO-BE 절에 실행 횟수, 네 번 모두 같았던 것, 실행마다 달랐던 것(강조색·axe 0~2곳), 시간을 적었다.
  - "어떻게 동작하나" 절을 새로 두었다: 진입 스킬, 패턴 56종, 편집 후 검사. 지시문이 한국어라는 점과 이름의 뜻을 적었다.
  - 순서를 바꿨다: 전후 비교 → 동작 → 설치 → 쓰는 법 → 벤치마크 → 무엇을 막나 → 한계.
  - 벤치마크에 측정 버전(0.6.0)을 적었다. 판정 문장은 두 판정이 갈렸다는 사실 그대로 적었다.
  - "한계" 절을 새로 두었다.
  - 영어판의 한국어 전용 링크에 "(Korean)"을 붙였다.
- **영어 요청 실측**: "Build a settings screen for a mobile web app" 한 번을 suta를 설치한 `claude -p`에 맡겼다.
  - 에이전트는 suta 스킬을 읽었다.
  - 편집 후 검사가 잡은 반경 종류 경고 하나를 고쳤다.
  - 영어 화면과 영어 답을 냈다. 강조색은 근거가 없다며 거의 검정을 골랐다.
  - 결과 파일의 suta 검사는 0/0이었다. 47초, 0.24달러였다.
- **문서**
  - guide·benchmark 네 벌: 줄표·굵은 머리말·뭉뚱그린 말을 걷고 사실을 고쳤다(에이전트 1개).
  - `docs/assets/CREDITS.md`: 영어 절을 두었다.
  - 매니페스트 3곳의 설명을 영어로 바꿨다. SKILL.md description은 트리거 평가에 맞춰 둔 값이라 그대로 두었다.
  - AGENTS.md 규칙 7과 add-skill 데모 단계에 "데모 문구는 두 벌"을 적었다.
- **게시글 초안**: 저장소 밖(스크래치패드)에 두고 사용자에게 보냈다.
  - Show HN: 제목, 작성자 첫 댓글
  - Show GN: 제목, 본문
  - 게시 전 점검표, 소셜 미리보기 그림(1280×640)

- **검증**
  - `npm run build`·`lint`·`test`(738개 통과)·`validate`(구조 통과, 선택 평가 457/457) 통과. 데모 `audit.mjs demo/src`는 error 0·warn 0.
  - 테스트 배지는 628이다. 검사 스크립트가 코드의 `it(` 개수로 세기 때문이다. 데모 56개를 도는 `it.each` 두 줄이 실행에서는 112개가 된다.
  - 56개 데모를 영어(1440px)와 한국어(390px)로 다시 찍어 접촉 시트로 봤다. 레이아웃이 깨진 곳은 없었다.
  - axe(영어, 57쪽, 예전 색으로 되돌린 뒤): 남은 위반은 glass-surface 1곳과 layout-principles의 "고치기 전" 예시 17곳이다. 둘 다 예전부터 있던 것이고 일부러 둔 것이다. 스크롤 영역·이름 없는 콤보박스·ARIA·누르는 영역 위반은 고쳐서 사라졌다.
  - 넓은 화면에서 `#/bottom-nav`로 바로 들어가면 현재 항목이 사이드바 안에 보인다.

## 3. 주의사항

- **Pages 배포**: 데모는 main에서 배포된다. 이 브랜치를 병합하기 전에는 `guksu.github.io/suta`에 옛 어두운 데모가 보인다. 게시 전에 병합과 배포를 확인한다.
- **영어 실측은 한 번이다**: README 문장도 "한 번 확인했다"로만 적었다.
- **남은 접근성 위반**
  - glass-surface: 브랜드 글자가 뒤의 주황 덩어리 위에 놓여 대비가 1.64다. 유리 효과를 보이려는 그림이라 그대로 두었다.
  - layout-principles: "고치기 전" 화면(AI가 흔히 만드는 화면 예시) 17곳. 일부러 나쁜 예라 그대로 두었다.
- **PR #40과 합치기**: 이 작업 중에 main에 PR #40(데모 이모지 → 음식 사진·선 아이콘, 0.8.1)이 먼저 들어왔다.
  - 같은 데모 파일 약 40개를 양쪽이 고쳤다. git merge 없이, 새 main 위에 이 작업을 파일 단위 3-way 병합(`diff3 -m`)으로 다시 얹었다.
  - 원칙은 둘 다 살리는 것이다: PR #40의 사진·아이콘·CSS와 이 작업의 두 벌 문구·접근성 고침.
  - PR #40이 더한 공용 메뉴 데이터(`demo/src/shared/dishes.ts`)에 영어 이름(`nameEn`)과 `dishName({ id, lang })`을 더했다. 사진 alt와 출처 페이지(`#/credits`)가 고른 언어로 나온다.
  - 출처 페이지 문구도 두 벌로 맞췄다.
  - 버전은 0.8.1 → 0.9.0이다(패턴 9종에 선택 prop이 늘었다).
