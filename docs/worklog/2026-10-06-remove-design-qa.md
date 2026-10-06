# 설계 문답 스킬 완전 제거 — fe-system 플러그인·`design` 스킬 (전환 2단계)

| 항목 | 내용 |
|------|------|
| 날짜 | 2026-10-06 |
| 작성 | 에이전트 (Claude Code) |
| 관련 경로 | `plugins/system/`(삭제), `evals/selection/design.json`(삭제), `scripts/validateSkills.mjs`·`evalSelection.mjs`·`install-skills.sh`, `.claude-plugin/marketplace.json`, `README.md`·`README.en.md`, `AGENTS.md`·`CLAUDE.md`, `.agents/skills/add-skill/SKILL.md`, `docs/design/2026-08-19-fe-skills.md` |

## 1. 개요

suta를 설치형 "AI 슬롭 제거" UI 스킬로 바꾸는 3단계 작업의 2단계다. 사용자 결정(설계 문답 9라운드)에 따라 설계 문답 기능을 완전히 지웠다. 설계 문답 기능은 fe-system 플러그인의 `design` 스킬로, 구현 전에 화면 설계를 라운드 문답으로 정하는 스킬이었다. 이 스킬만 다룬 과거 기록 4개도 함께 지웠다(git 이력에는 남는다). 이 저장소를 만드는 과정에서 남긴 설계 문서의 "문답 기록"(`docs/design/`·`docs/templates/design.md`)은 다른 것이라 그대로 뒀다. 1단계(이름 변경, PR #29)는 머지된 뒤 같은 브랜치를 최신 main으로 빨리 감기(fast-forward)해 이어서 작업했다.

## 2. 작업내용

- **삭제(18개 파일)**
  - `plugins/system/` 전체 13개: plugin.json, `skills/design/` SKILL.md·references 11개.
  - `evals/selection/design.json`.
  - 시스템 전용 과거 기록 4개: `docs/handoff/2026-08-25-system-skill-session.md`, 워크로그 `2026-08-25-system-list-filter-detail.md`·`2026-08-27-system-infinite-feed.md`·`2026-08-29-system-design-skill.md`. 현행 문서에서 이 파일들을 가리키는 링크는 없었다.
- **검사 스크립트** — `validateSkills.mjs`는 플러그인 배열(ui·system)과 `requiresDemo` 분기를 없애고 `plugins/ui/skills` 한 폴더만 검사한다. 데모 등록 검사는 이제 모든 스킬에 적용된다. `fe--system` 배지 검사도 지웠다. README 배지와 같이 지워야 "1로 표기, 실제 0"으로 실패하지 않는다.
- **선택 평가** — `evalSelection.mjs`는 UI 폴더 하나에서만 description을 모은다. 쓰이지 않던 `plugin` 필드도 지웠다. 결과는 404 → 393건, 전부 통과다.
- **설치 스크립트** — `install-skills.sh`를 그대로 두면 기본값 `all`이 사라진 `plugins/system`을 복사하려다 exit 1로 끝난다. 그래서 인자 없이 UI 스킬만 복사하게 바꿨다.
  - 예전 명령(`sh -s -- ui`·`all`)은 받아서 무시한다.
  - `system`을 주면 "제거되었습니다" 안내와 함께 exit 2로 끝난다.
  - 로컬 저장소에서 복제해 53개 설치, `design` 없음, `ui` 인자 호환, `system` 오류, `--help` 출력을 확인했다.
- **마켓플레이스** — fe-system 항목을 지우고 설명을 "프론트엔드 UI/애니메이션 구현 스킬 모음"으로 바꿨다.
- **README 2개(같은 구조)**
  - 지운 것: 소개 문구의 "시스템 설계 가이드", fe-system 배지, 목차 링크, 플러그인 표(문장 한 줄로 대체), 설치 명령, "UI 스킬만·설계 스킬만" 행, 수동 복사 경로의 `plugins/system`, `design` 사용 예시, "설계 스킬 — fe-system" 절 전체, 스킬 구성·저장소 구조·기여 절의 시스템 문장.
  - 추가한 것: 이전 안내. Claude Code 설치자는 `/plugin uninstall fe-system@suta`(예전 이름이면 `@fe-skills`)로 지운다. 스크립트·skills CLI 설치자는 `design` 폴더를 직접 지운다.
- **AGENTS.md** — 플러그인 표의 fe-system 행과 구조도 줄을 지웠다. "UI 스킬만 노출" 문구, 게이트 표의 "(UI 스킬만)", "시스템 설계 스킬은 2번만 적용" 문장도 정리했다.
- **add-skill** — UI/시스템 판별 분기와 구조도의 시스템 부분을 지웠다. 이제 스킬은 모두 `plugins/ui/skills/`다.
- **infinite-scroll SKILL.md** — 사라진 fe-system 문서를 가리키던 문장을 "스크롤 복원은 데이터 설계 문제라 범위 밖"까지만 남겼다.
- **설계 문서** — §3 구조도에서 system 하위 트리를 지우고 "플러그인 1개 등록"으로 고쳤다. 7라운드(플러그인 분리 결정)는 당시 결정이라 그대로 두었고, 제거 결정은 9라운드에 이미 있다.
- **CLAUDE.md** — 변경 이력 행을 추가했다. 08-24 과거 행은 유지했다.

### 게이트 결과

| 게이트 | 결과 |
|--------|------|
| 빌드·린트·테스트 | 통과 (517 tests) |
| 스킬 구조·선택 평가·모션 검사 | 통과 (393/393, 스킬 53개, 168개 파일 error 0 warn 0) |
| 플러그인 형식 | `claude plugin validate . --strict` 통과 |
| 설치 스크립트 | 로컬 복제 설치 53개·`design` 없음, 예전 인자 `ui` 호환, `system` exit 2 |
| 데모 | 코드 변경 없음(빌드 통과). 1단계 머지 후 `guksu.github.io/suta/`가 `/suta/assets/…`로 복구된 것을 확인 |

## 3. 주의사항

- 남은 "설계 문답"·"fe-system" 표기는 모두 의도한 것이다.
  - README 이전 안내.
  - 설치 스크립트의 `system` 안내 문구.
  - CLAUDE.md·설계 문서의 과거 이력 행.
  - 이 저장소의 설계 문서 템플릿(`docs/templates/design.md`) — 저장소 운영용 "설계 문답"이라 다른 것이다.
  - 다른 과거 워크로그 속 지나가는 언급.
- 이미 설치된 `design` 스킬은 설치 도구가 지우지 않는다. 사용자가 직접 지워야 한다(README 안내).
- GitHub 저장소 설명이 아직 "애니메이션·UI 구현 패턴과 시스템 설계 문답 스킬"이다. 저장소 설정이라 사용자가 직접 바꿔야 한다.
- 다음 작업: 3단계(단일 진입 스킬 `suta`로 재구성)는 사용자 확인 후 진행한다.
