# fe-skills — 에이전트 작업 지침

이 파일은 이 저장소에서 일하는 **모든 코딩 에이전트**(Claude Code·Codex·Cursor·Gemini CLI·GitHub Copilot 등)를 위한 공통 지침이다. 도구별 파일(`CLAUDE.md` 등)은 이 파일을 가져오고 도구 전용 내용만 덧붙인다. 규칙을 고칠 때는 이 파일 한 곳에서만 고친다.

## 이 저장소는 무엇인가

프론트엔드 스킬 저장소. 스킬 하나는 `SKILL.md`(설명서) + `assets/`(실행 가능한 예시 코드) + `references/`(상세 문서)로 된 폴더이며, 열린 표준인 Agent Skills 형식을 따른다.

| 플러그인 | 경로 | 내용 |
|---|---|---|
| fe-ui | `plugins/ui/skills/{스킬}/` | 애니메이션·UI·제스처 구현 패턴. 바닐라 코어(.ts, 의존성 0) + React 래퍼(.tsx) + CSS |
| fe-system | `plugins/system/skills/{스킬}/` | 시스템 설계 결정 가이드. 문답 절차 + 케이스별 트레이드오프 문서. 데모 없음 |

데모 사이트(`demo/`, Vite + React, GitHub Pages)는 UI 스킬만 노출한다.

**정본 원칙:** 스킬 문서와 `assets/` 코드가 정본이다. 데모는 `@skills/{스킬}/assets/...` alias로 정본을 import만 한다. 복사본을 만들지 않는다. 복사본은 한쪽만 고치는 순간 문서가 거짓말이 된다.

## 저장소 구조

```text
fe-skills/
├─ AGENTS.md                         이 파일 — 공통 작업 지침(단일 출처)
├─ CLAUDE.md                         Claude Code 전용 — AGENTS.md를 가져오고 훅·스킬 이름만 덧붙임
├─ .agents/skills/add-skill/         스킬 추가 파이프라인(모든 에이전트가 발견)
├─ .claude/                          Claude Code 전용 훅·설정. skills/add-skill은 .agents/로의 심볼릭 링크
├─ .claude-plugin/marketplace.json   Claude Code 플러그인 마켓플레이스 카탈로그
├─ plugins/ui/skills/{스킬}/         UI 스킬 정본 (SKILL.md + assets/)
├─ plugins/system/skills/{스킬}/     시스템 설계 스킬 정본 (SKILL.md + references/)
├─ demo/                             데모 사이트 (src/demos/index.ts가 목록·라우팅의 단일 출처)
├─ scripts/validateSkills.mjs        스킬 구조·공유 코드 일치·README 배지 검사
├─ scripts/install-skills.sh         다른 프로젝트에 스킬을 복사 설치하는 스크립트
└─ docs/                             설계(design/)·규칙(harness-rules.md)·작업 기록(worklog/)·템플릿
```

## 개발 명령

모두 저장소 루트에서 실행한다(npm workspaces로 `demo/`에 위임된다).

```bash
npm ci                            # 의존성 설치
npm run dev                       # 데모 개발 서버 → http://localhost:5173/fe-skills/
npm run build                     # tsc -b && vite build
npm run lint                      # eslint (demo/ 기준)
npm test                          # vitest run (jsdom)
node scripts/validateSkills.mjs   # 스킬 구조 검사 — 실패하면 exit 1
node scripts/evalSelection.mjs    # 스킬 선택 평가 — 요청 문장에 맞는 스킬이 골라지는지 검사
npm run validate                  # 위 두 검사를 한 번에
```

알려진 제약: `npm run lint`는 `plugins/**/assets`를 실제로 검사하지 않는다(ESLint flat config가 `demo/` 밖 파일을 무시). assets 코드는 `npm run build`의 타입 검사와 테스트로 검증된다.

## 작업 규칙 (요약 — 전문은 `docs/harness-rules.md`)

작업 전에 `docs/harness-rules.md`를 읽는다. 설계 단일 출처는 `docs/design/2026-08-19-fe-skills.md`다.

1. **git은 사용자 전담.** commit·push·merge·rebase·branch 삭제를 에이전트가 먼저 하지 않는다. 작업이 끝나면 검증 결과와 확인 방법(`npm run dev`)을 보고하고 멈춘다. 사용자가 "커밋해줘/PR 올려줘"라고 명시했을 때만 commit·push·PR을 한다. 그때도 merge·rebase·force push는 하지 않는다. 커밋 메시지·PR 본문에 AI 작성 표기(Co-Authored-By 등)를 넣지 않는다.
2. **보호 브랜치 `main`에서는 파일을 편집하지 않는다.** 작업 브랜치(`feat/{스킬명}` 등)에서 한다.
3. **코드를 만들면 TDD가 기본.** 로직(상태 전이·판정·제스처·타이머)은 테스트를 먼저 쓴다(Red→Green). 순수 시각 효과에 빈 테스트를 만들지 않는다.
4. **CSS 우선.** transition/animation으로 되는 것은 CSS로. JS는 측정·판정·상태만. 애니메이션은 `transform`·`opacity`만(레이아웃 속성 금지). 공개 CSS 변수 `--{스킬}-xxx` + 내부 변수 `--_xxx` 폴백 패턴.
5. **접근성은 선택이 아니다.** 모든 UI 스킬 CSS에 `@media (prefers-reduced-motion: reduce)` 블록. 키보드 조작·ARIA 역할 포함.
6. **코드 컨벤션.** 화살표 함수, `useCallback`/`useMemo` 지양, 인자 2개 이상이면 named-object `({ a, b })`, `useEffect(function 명명된함수() {}, [deps])`, TypeScript strict, 한글 주석으로 "왜"를 적는다, 한글 조판 `word-break: keep-all`.
7. **데모 콘텐츠는 국수집 테마.** 잔치국수·비빔국수·칼국수·손만두·성수동 등. 토스·당근·인스타그램·애플 앱의 실제 문구·탭 이름·구성을 복제하지 않는다. 레퍼런스 앱 언급은 SKILL.md의 "언제 쓰는가"(관례 설명)까지만.
8. **스킬은 설치된 프로젝트에서 단독으로 완결되어야 한다.** SKILL.md는 `demo/` 경로를 언급하지 않는다. 다른 스킬 코드가 필요하면 import하지 않고 파일을 복사하되 첫 줄의 `@shared-core {파일} origin: {스킬}` 헤더를 유지한다(검사 스크립트가 원본과 바이트 단위로 비교).
9. **시크릿은 읽지도 기록하지도 않는다.** `.env`·credential·키 파일을 열지 않는다.
10. **산출물은 파일로.** 작업 기록은 `docs/worklog/YYYY-MM-DD-{주제}.md`에 `docs/templates/worklog.md` 형식(1. 개요 / 2. 작업내용 / 3. 주의사항)으로 남긴다.
11. **출력은 읽는 사람이 이해할 수 있게.** 전문용어는 처음 나올 때 한 줄로 풀이하고, 한 문장에 하나의 내용만 담는다.

## 스킬 추가·수정 절차

스킬 추가·수정·재검증 요청은 `.agents/skills/add-skill/SKILL.md`의 파이프라인을 따른다(문서 → 데모 → 게이트). 요약:

1. `evals/selection/{스킬}.json` — **문서보다 먼저** 쓴다(Red). 이 스킬이 골라져야 하는 요청 3개 이상(`should`: 구어체·영어 표현 포함)과 골라지면 안 되는 이웃 요청 3개 이상(`shouldNot`: 비슷한 다른 스킬의 요청). `node scripts/evalSelection.mjs {스킬}`로 확인한다.
2. `plugins/ui/skills/{스킬}/SKILL.md` — frontmatter `name`(= 폴더명)·`description`. **description 규칙:** 3인칭으로 "무엇을 하는가 + 언제 쓰는가"만 적는다. 80~300자, 150~250자 권장. 사용자가 실제로 쓸 표현을 따옴표로 나열하고 핵심 영어 용어를 한 번 넣는다. 구현 방식 요약과 에이전트 명령문("반드시 이 스킬을 사용할 것")은 넣지 않는다 — 에이전트가 본문을 읽지 않고 description만 보고 행동할 수 있다. 본문: 언제 쓰는가 → 기술 선택(왜 이 기술인가) → 파일 표 → 사용 방법(React / 순수 JS) → 커스터마이즈 → 주의사항.
3. `assets/` — 코어 + React 래퍼 + CSS. 접근성 포함.
4. `demo/src/demos/{스킬}/` 데모 페이지 + `demo/src/demos/index.ts` 등록. 테스트는 `demo/src/tests/`.
5. `README.md`와 `README.en.md` 양쪽에 표 한 행 + 배지 숫자(fe-ui 스킬 수, tests 수) 갱신 — 검사 스크립트가 두 파일 모두 실제 수와 비교한다.
6. 워크로그.

### 완료 게이트 — 전부 통과해야 완료

| # | 게이트 | 방법 |
|---|---|---|
| 1 | 빌드·린트·테스트 | `npm run build && npm run lint && npm test` |
| 2 | 스킬 구조·선택 평가 | `npm run validate` (`validateSkills.mjs` + `evalSelection.mjs`) |
| 3 | 브라우저 실동작 | 데모 페이지를 실제 브라우저로 열어 동작·계산된 스타일·스크린샷으로 확인 (UI 스킬만) |
| 4 | 모션 리뷰 | 이징·타이밍·reduced-motion 검토. 지적 사항 반영 (UI 스킬만) |

게이트가 실패하면 고친 뒤 그 게이트부터 다시 돌린다. 시스템 설계 스킬은 2번(구조·선택 평가)만 적용한다.

선택 평가는 LLM을 부르지 않는다. description과 요청 문장의 단어 겹침(IDF 가중)으로 순위를 매기는 대리 지표라, 실제 모델의 선택과 다를 수 있다. 잡아내는 것은 두 가지다: 트리거 표현이 description에 없는 경우, 두 스킬의 description이 구별되지 않는 경우.

## 도구별 차이

- **Claude Code**는 `.claude/hooks/`로 규칙 1·2·9를 기계적으로 강제하고, 턴이 끝날 때 게이트 1·2를 자동 실행한다. `CLAUDE.md`가 이 파일을 가져온다.
- **다른 에이전트**에는 훅이 없다. 위 규칙을 스스로 지키고, 끝내기 전에 게이트 1·2를 직접 실행한다. 스킬 추가 절차는 `.agents/skills/add-skill/`에서 자동으로 발견된다(Codex·Cursor·Gemini CLI·Copilot이 `.agents/skills/`를 읽는다).
