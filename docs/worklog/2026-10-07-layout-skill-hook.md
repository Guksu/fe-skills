# 레이아웃 스킬과 편집 후 검사 훅 (Claude Code·Codex)

| 항목 | 내용 |
|------|------|
| 날짜 | 2026-10-07 |
| 작성 | 에이전트 (Claude Code) |
| 관련 경로 | `skills/suta/patterns/layout-principles/`, `skills/suta/patterns/layout-audit/`, `skills/suta/scripts/`, `skills/suta/SKILL.md`, `.claude-plugin/`, `.codex-plugin/`, `.agents/plugins/`, `scripts/validateSkills.mjs` |

## 1. 개요

레이아웃 원칙 정립 문서(`docs/research/2026-10-06-layout-principles.md`)를 근거로 suta에 레이아웃을 넣었다. 패턴 2종(원칙·토큰, 정적 검사)을 더하고 진입 스킬의 금지선·작업 절차에 레이아웃을 넣었다. 그리고 에이전트가 파일을 고칠 때마다 레이아웃·모션 검사를 돌리는 훅을 Claude Code와 Codex 플러그인으로 붙였다.

사용자 결정은 세 가지다.

- 훅은 error만 에이전트에게 돌려보내고 warn은 알리기만 한다.
- Codex 플러그인 형식까지 추가한다.
- 끝까지 진행한 뒤 PR 하나로 올린다.

## 2. 작업내용

- **패턴 `layout-principles`**(원칙과 토큰)
  - 원칙 12개와 판단 기준 8쌍은 `PATTERN.md`에 표로 담았다.
  - 원칙별 상세와 AI 슬롭 대응표 21행은 `references/principles.md`에 옮겼다. 출처는 적지 않았다.
  - `assets/layout-tokens.css`: 간격 8단계(`--space-1`~`--space-16`, 이름 × 4 = px로 Tailwind와 같다), 간격 역할 3개, 글자 7단계, 굵기 3종, 반경 3종 + full, 폭·누르는 영역·비율.
  - 글자·반경 토큰은 역할 이름(`--text-caption`·`--radius-card` 등)으로 지었다. Tailwind의 `text-lg`·`rounded-lg`와 값이 달라 헷갈리지 않게 하기 위해서다.
  - `assets/layoutTokens.ts`: 같은 값의 TS 상수와 판정 함수(`toPx`·`isOnGrid`·`nearestSpace`·`groupGapOk`). layout-audit에 `@shared-core`로 복사했다.
  - 데모: 국수집 화면 5개를 고치기 전과 후로 나란히 비교하고, 토큰 표를 붙였다. 고친 쪽은 토큰만 쓴다.
- **패턴 `layout-audit`**(정적 검사)
  - 규칙 10개를 둔다. error는 `tiny-text`(11px 미만) 하나다.
  - warn은 나머지 9개다: `nested-card`·`effect-overuse`·`gradient-text`·`font-size-variety`·`font-weight-variety`·`radius-variety`·`spacing-off-scale`·`centered-text-block`·`image-distort`.
  - CSS는 선택자 블록으로, JSX·HTML은 태그 단위로 읽는다.
  - 한 번에 넘긴 파일끼리는 클래스를 공유한다. CSS의 `.card`를 TSX의 `className="card"`가 쓰면 상자로 안다.
  - 예외 주석은 두 가지다. `layout-audit-ignore`는 그 줄에, `layout-audit-ignore-file`은 파일 전체의 그 규칙에 적용된다.
  - 저장소 패턴 코드로 돌려 오탐을 줄였다.
    - 컨트롤 부속(thumb·track)은 상자로 보지 않는다.
    - `calc()` 파생 반경은 종류로 세지 않는다.
    - 짧은 상태 문구(`message`)는 문단으로 보지 않는다.
    - 회색 스크림·반짝임 그라데이션은 효과로 세지 않는다.
    - TSX 안 여러 줄 템플릿 문자열 속 예시 마크업은 검사하지 않는다.
- **공통 코어 `auditCore.ts`**
  - motion-audit에서 결과 형식(`Finding`)·CSS 블록 자르기·선언 읽기·예외 줄·출력 함수를 떼어 냈다. 원본은 motion-audit, 복사본은 layout-audit다.
  - 블록 파서는 SCSS 중첩 선택자를 풀어 `fullSelector`·`ownBody`를 함께 준다.
  - 리팩터링 전후의 motion 검사 결과가 저장소 367개 파일에서 같음을 확인했다.
  - Node가 `.ts`를 바로 실행하도록 import에 확장자를 붙였다. 그래서 `demo/tsconfig.json`에 `allowImportingTsExtensions`를 켰다(`noEmit`이라 안전하다).
- **통합 검사와 훅**(`skills/suta/scripts/`)
  - `audit.mjs`: 모션과 레이아웃을 한 번에 검사한다. `--json`·`--warn-only`·`--errors-only`를 받는다. `npm run validate`가 이것으로 `skills/suta` 전체를 검사한다.
  - `post-edit-hook.mjs`: 고친 파일을 찾는다. Claude는 `tool_input.file_path`, Codex는 apply_patch 본문의 Add·Update·Move 줄에서 찾는다.
    - error면 종료 2와 stderr, warn만 있으면 종료 0과 `additionalContext`(최대 5줄)를 낸다. 문제가 없으면 조용하다.
    - `SUTA_HOOK=off`, 잘못된 입력, Node가 `.ts`를 못 읽는 환경에서는 조용히 종료 0이다.
  - 순수 로직은 `hookCore.ts`·`auditAll.ts`에 두고 테스트를 먼저 썼다.
- **매니페스트**
  - `.claude-plugin/plugin.json`: 인라인 `hooks`를 두었다(PostToolUse, `Write|Edit|MultiEdit`). 루트 `hooks/` 폴더 없이 루트 가드를 유지한다.
  - `.codex-plugin/plugin.json`: skills `./skills/`, 인라인 훅(`apply_patch|Edit|Write`, `${PLUGIN_ROOT}`), interface.
  - `.agents/plugins/marketplace.json`: Codex 저장소 마켓플레이스(local `./`).
  - 버전은 0.3.0에서 0.4.0으로 올렸다.
  - `validateSkills.mjs`가 새로 확인하는 것: 네 매니페스트의 이름·버전, 훅이 검사 스크립트 하나만 가리키는지, SKILL.md의 `scripts/` 경로가 실재하는지.
- **진입 스킬 `SKILL.md`**
  - 금지선 맨 앞에 레이아웃 10행을 넣고, "레이아웃 값" 표를 더했다.
  - 작업 절차에 2번 "순서부터 정한다"를 넣고, 검사 단계는 통합 검사로 바꿨다.
  - 체크리스트에 레이아웃 4항목을 넣고, 한계 문구를 고쳤다.
  - description에 레이아웃 트리거를 넣었다(968바이트). `evals/trigger.json`에도 레이아웃 요청 2개를 더했다.
  - motion-audit description의 "레이아웃 속성"을 "크기·위치 속성"으로 바꿨다. "레이아웃 검사" 요청이 motion-audit로 가지 않게 하기 위해서다.
- **문서**: README 두 벌(패턴 55·tests 568 배지, 무엇을 없애나 3행, Codex 설치, 편집 후 검사 절, 구조도), AGENTS.md, add-skill 게이트 표, 설계 문서 §1·§2·§3·§6(10라운드)·§7, CLAUDE.md 변경 이력, 설치 스크립트 주석.

## 3. 주의사항

- **검증한 것**
  - 게이트: `npm run build`·`npm run lint`·`npm test`(568개)·`npm run validate`(구조, 선택 평가 429/429, 통합 검사 error 0)가 모두 통과했다.
  - `claude plugin validate .`가 통과했다. 경고는 루트 CLAUDE.md 안내 하나로, 전부터 있던 것이다.
  - Claude Code 실동작: `claude -p --plugin-dir`로 플러그인을 실제로 불러 Write를 시켰다.
    - 9px 글자는 훅이 종료 2로 막고 목록을 모델에게 돌려보냈다.
    - 10px 여백은 additionalContext로 전달됐다.
  - Codex CLI 0.160.1: `codex plugin marketplace add`(로컬 경로)·`codex plugin add suta@suta`·스킬 인식(`suta:suta`)을 확인했다.
  - 훅 입력 모의: Codex apply_patch(Add·Update·Move), 지운 파일, 대상 아닌 파일, 테스트 파일, 잘못된 JSON, `SUTA_HOOK=off`, 타입 제거가 꺼진 Node.
  - 설치 모의: `install-skills.sh --local`로 설치한 사본에서 통합 검사와 훅이 돈다.
  - 브라우저: 두 데모의 렌더, 전후 토글, 붙여 넣기 검사, 계산된 스타일(토큰 값)을 확인했다. 콘솔 오류는 없었다.
- **사용자 확인이 필요한 것**
  - Codex 훅 승인(`/hooks`)과 승인 뒤 실제 실행은 대화형 화면이 필요해 확인하지 못했다.
  - Codex는 훅이 든 플러그인을 공개 플러그인 목록에 올리지 않는다. 저장소 마켓플레이스(`codex plugin marketplace add Guksu/suta`)로는 설치된다.
- **알려진 한계**
  - 데모 사이트 셸이 320px 폭에서 가로로 넘친다. 모든 데모 페이지에서 같고(모션 데모 785px), 이번 변경 전부터 있었다. 원인은 `.layout` 격자 열의 최소 폭이다.
  - 패턴 assets에는 warn 22건이 남아 있다. 대부분 4px 격자 밖 간격(0.6rem 등)이다. 패턴 디자인을 바꾸는 일이라 이번 범위에서 고치지 않았다.
  - 훅의 warn 알림은 편집할 때마다 같은 파일의 기존 warn을 다시 알린다. 소음이 크면 다음 단계에서 "편집 전후 차이만 알리기"를 검토한다.
  - 렌더가 필요한 검사(글자 대비·누르는 영역·좁은 폭 넘침)는 범위 밖이다.
