# 단일 진입 스킬 suta로 재구성 (전환 3단계)

| 항목 | 내용 |
|------|------|
| 날짜 | 2026-10-06 |
| 작성 | 에이전트 (Claude Code) |
| 관련 경로 | `skills/suta/`, `.claude-plugin/`, `scripts/`(`lib/`·`buildCatalog.mjs`·`validateSkills.mjs`·`evalSelection.mjs`·`install-skills.sh`), `evals/trigger.json`, `demo/`(경로·문구), `README.md`·`README.en.md`, `AGENTS.md`, `.agents/skills/add-skill/`, `CLAUDE.md`, `docs/design/2026-08-19-fe-skills.md` |

## 1. 개요

suta 전환 3단계 중 마지막이다. 목표는 impeccable처럼 한 번 설치하면 Claude Code·Codex가 UI 요청마다 자동으로 읽는 스킬이다. 그래서 기존 UI 스킬 53개를 진입 스킬 `suta` 아래의 패턴으로 재구성했다.

바꾼 이유는 둘이다.
- 53개가 각자 description으로 경쟁하면 "로그인 화면 만들어줘" 같은 일반 UI 요청에는 아무것도 걸리지 않는다.
- 스킬 목록에는 길이 예산이 있다(Claude Code는 컨텍스트의 1%, Codex는 2%). 53개 설명을 합치면 약 12,100자라 예산을 넘는다.

범위는 사용자 결정대로 재구성까지다. README 첫머리에는 사용자 요청대로 "suta는 AI 슬롭으로 생기는 UI를 없앤다"는 설명을 두었다.

## 2. 작업내용

- **구조**
  - 옮긴 것: `plugins/ui/skills/*` → `skills/suta/patterns/`(git mv), 각 `SKILL.md` → `PATTERN.md`(53개), `plugin.json` → `.claude-plugin/plugin.json`. `plugins/`는 지웠다.
  - 마켓플레이스 `source: "./"` — 저장소 루트가 곧 플러그인이다.
  - 버전 0.3.0 — 버전이 올라가야 기존 설치자의 캐시가 갱신된다.
  - 레이아웃: 계획 초안의 `plugin/` 하위 폴더 대신 루트 `skills/suta`로 했다. `npx skills`가 이 폴더를 바로 찾는다(`npx skills add . --list` → "Found 1 skill: suta").
  - 시도했다가 보류한 것: 스킬 폴더 자체를 플러그인 루트로 두는 방식(`source: "./skills/suta"`, plugin.json 없음). `claude plugin validate`가 내용을 검사하지 못했고(`"contents": []`), 폴더를 직접 검사하면 "No manifest found"였다.
- **진입 스킬 `skills/suta/SKILL.md`(210줄)**
  - description: 439자·843바이트(1,024바이트 이하, `": "` 없음). 첫 문장이 "AI 슬롭으로 생기는 UI를 없앤다"이다.
  - 본문: 폴더 지도, 작업 절차 9단계, AI 슬롭 금지선, 모션 값, 마무리 체크리스트, 패턴 카탈로그(생성), 쓰지 않는 경우.
  - 금지선은 모션 9행·상호작용 6행·접근성 6행·CSS 4행이다. 모두 기존 패턴 코드·문서와 AGENTS.md 규칙에 근거가 있는 것만 넣었다. 예: `aria-live`는 toast-stack·infinite-scroll, `inert`는 modal-dialog·bottom-sheet. 새 내용은 쓰지 않았다.
- **카탈로그 생성**
  - 순수 로직은 `scripts/lib/catalog.ts`(첫 문장 요약·레지스트리 읽기·표 만들기·표시 블록 교체), 실행은 `scripts/buildCatalog.mjs`(`npm run catalog`, `--check`).
  - 행 요약은 description 첫 문장이다. 첫 문장이 100자를 넘으면 줄표(—) 앞만 쓴다. 53행 합계 3,555자(전체 description이면 10,900자).
  - 묶음은 데모 레지스트리의 카테고리 8개, 순서는 데모 사이드바와 같다.
- **선택 평가**
  - 순수 로직을 `scripts/lib/selection.ts`로 옮겼다. 기존과 같은 결과다(패턴 393/393).
  - 진입 스킬 트리거 평가 `evals/trigger.json`을 추가했다. should 10개, shouldNot 8개이고, decoys 8개는 함께 설치됐을 법한 다른 스킬 설명이다(백엔드·SQL·git·단위 테스트·CSV·문서·배포·E2E).
  - 트리거 평가는 전용 불용어를 쓴다. 기존 불용어는 `ui`·`컴포넌트`를 버리는데, 이 단어가 UI 요청을 가른다.
  - 합계 411/411.
- **검사(`validateSkills.mjs` 재작성)**
  - 진입 스킬: SKILL.md는 `skills/` 아래 하나뿐. 이름 = 폴더 = plugin.json = marketplace, 두 매니페스트의 버전이 같다.
  - description 바이트·YAML·명령문, 본문 500줄 이하, 참조 경로 실재, 카탈로그 동기.
  - 루트에 플러그인 구성 폴더(commands·agents·hooks·.mcp.json)가 없는지 본다.
  - 패턴: PATTERN.md 기준 기존 검사. 데모 레지스트리와 패턴 폴더를 양방향으로 맞춘다.
  - 배지 정규식을 `badge/{라벨}-`로 고정했다.
  - add-skill에 `metadata.internal: true`가 있는지 본다.
- **테스트(TDD, Red → Green)** — `demo/src/tests/catalog.test.ts` 9건, `selection.test.ts` 4건. 517 → 530.
- **설치 스크립트**
  - `skills/suta` 한 폴더만 복사한다.
  - `--local DIR`을 추가했다(커밋 전 작업 폴더로 시험).
  - 옛 패턴별 스킬 폴더가 남아 있으면 지우지 않고 목록만 알려 준다.
- **add-skill** — 패턴 추가 파이프라인으로 고쳤다(PATTERN.md, `npm run catalog` 단계). `metadata.internal: true`로 일반 설치 목록에서 숨겼다.
- **패턴 문서 문구**
  - "스킬" → "패턴"으로 일괄 바꿨다. 조사가 어색해지는 경우("스킬로" → "패턴로")가 없는지 먼저 확인했다.
  - `SKILL.md` 언급 3곳을 `PATTERN.md`로, 실제 수와 다른 "50종" 표기는 개수 없는 표현으로 바꿨다.
  - `@shared-core` 헤더 줄은 원본과 복사본이 똑같이 바뀌어 해시가 계속 맞는다.
- **데모**
  - 경로: `@skills` 별칭·tsconfig·eslint, `motionTokens.test.ts`의 CSS 경로(별칭 대신 `readFileSync`로 읽는다).
  - `App.tsx`: 경로 표시와 문서 링크(PATTERN.md).
  - i18n 문구: "스킬" → "패턴", 첫 화면에 AI 슬롭 소개.
- **루트 package.json `"type": "module"`** — Node가 `scripts/lib/*.ts`를 바로 실행할 때 나던 모듈 형식 경고를 없앴다. 루트에는 `.js` 파일이 없다.
- **문서**
  - README 2개 재구성: 소개, 무엇을 없애나(AI가 흔히 만드는 UI ↔ suta), 설치, 예전 버전에서 옮겨 오기, 동작 방식, 패턴 53종, 구성.
  - AGENTS.md: 저장소 설명·구조·패턴 절차·규칙 8.
  - CLAUDE.md 이력, 설계 문서 §1·§2·§3.

### 게이트 결과

| 게이트 | 결과 |
|--------|------|
| 빌드·린트·테스트 | 통과 (530 tests) |
| 구조·선택 평가·모션 검사 | 통과 (진입 스킬 + 패턴 53개, 411/411, 168개 파일 error 0) |
| 카탈로그 | `npm run catalog` 다시 실행해도 변경 없음, `--check` 동기 |
| 플러그인 형식 | `claude plugin validate .` 통과. 경고 1건 — 루트 CLAUDE.md는 플러그인 컨텍스트로 로드되지 않는다(저장소 기여자용이라 의도한 것) |
| skills CLI | `npx skills add . --list` → suta 1개만(add-skill 숨김, 패턴 53개 미등록) |
| 설치 스크립트 | `--local` 설치 시 SKILL.md 1개·PATTERN.md 53개, 옛 폴더 안내, 설치본의 `audit.mjs`가 다른 프로젝트에서 실행됨 |
| 브라우저 | 헤드리스 Chromium — 첫 화면(AI 슬롭 소개·패턴 검색), `#/bottom-sheet`(경로 `skills/suta/patterns/bottom-sheet/`, PATTERN.md 링크), `#/motion-audit` 렌더 |

## 3. 주의사항

- **자동 참조는 기계로 검증할 수 없다**(실제 모델이 판단한다). 확인 방법:
  - Claude Code: `claude --plugin-dir <저장소>`로 실행해, 스킬 이름을 말하지 않은 UI 요청 3개와 UI가 아닌 요청 2개를 보낸다.
  - Codex: `.agents/skills/suta`에 설치하고 같은 요청을 보낸다.
- `claude plugin validate . --strict`는 루트 CLAUDE.md 경고 때문에 실패한다(`--strict`는 경고를 오류로 본다). 루트가 플러그인이라 생기는 경고이고, CLAUDE.md를 옮기지 않는 한 남는다.
- 진입 스킬 본문은 약 12,400자다(카탈로그 포함). 패턴이 늘면 카탈로그도 길어진다. 500줄이나 권장 크기를 넘기 전에 요약 규칙을 다시 본다.
- **기존 설치자**
  - Claude Code: 마켓플레이스를 업데이트한다(버전 0.3.0).
  - 스크립트·skills CLI 설치자: 옛 패턴별 폴더를 지워야 같은 요청에 두 번 걸리지 않는다.
- **미룬 것(사용자 결정)** — 편집 후 자동 모션 검사 훅, 시각 디자인(글꼴·색·여백) 슬롭 규칙.
