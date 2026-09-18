# 다중 에이전트 지원 — AGENTS.md 분리·설치 스크립트

| 항목 | 내용 |
|------|------|
| 날짜 | 2026-09-18 |
| 작성 | 에이전트 |
| 관련 경로 | `AGENTS.md`, `CLAUDE.md`, `.agents/skills/add-skill/`, `.claude/skills/add-skill`(심볼릭 링크), `scripts/install-skills.sh`, `scripts/validateSkills.mjs`, `README.md`, `docs/design/2026-08-19-fe-skills.md` |

## 1. 개요

저장소가 Claude Code 전용(마켓플레이스 + CLAUDE.md + `.claude/skills`)으로 되어 있어 다른 코딩 에이전트(Codex·Cursor·Gemini CLI·GitHub Copilot)가 스킬을 쓰거나 기여할 길이 없었다. 사용자 문답으로 범위를 "사용자 쪽(설치) + 기여자 쪽(AGENTS.md)" 둘 다로 정했다(설계 문답 8라운드).

조사 근거(검색 결과 요약. 공식 문서 페이지는 작업 환경의 네트워크 정책에 막혀 직접 열지 못했다):
- AGENTS.md는 코딩 에이전트용 열린 지침 형식. Codex·Cursor·Gemini CLI·Copilot이 읽는다. Claude Code는 읽지 않고 CLAUDE.md만 읽으며, `@AGENTS.md` 가져오기가 권장 방식이다.
- SKILL.md는 열린 표준(Agent Skills) 형식. 우리 스킬은 이미 이 형식이라 문서 자체는 고칠 것이 없다.
- 다른 에이전트가 프로젝트 스킬을 찾는 공통 폴더는 `.agents/skills/`. Cursor는 `.cursor/skills/`, Gemini CLI는 `.gemini/skills/`, Copilot은 `.github/skills/`·`.claude/skills/`도 읽는다.

## 2. 작업내용

- `AGENTS.md` 신설 — 공통 작업 지침의 단일 출처. 저장소 구조, 개발 명령, 작업 규칙 11개(harness-rules 요약 + add-skill 컨벤션), 스킬 추가 절차와 게이트 4종, 도구별 차이(Claude는 훅이 강제, 다른 도구는 글로 지키고 게이트를 직접 실행).
- `CLAUDE.md` — 첫 줄 `@AGENTS.md`로 가져오고 Claude 전용(스킬 트리거 이름, 훅 4종, 커밋·PR 규칙, 변경 이력)만 남김.
- `.claude/skills/add-skill` → `.agents/skills/add-skill`로 이동. `.claude/skills/add-skill`은 `../../.agents/skills/add-skill` 심볼릭 링크. 파일 내용은 변경 없음.
- `scripts/install-skills.sh` 신설 — POSIX sh, git만 필요. 얕은 clone 후 `plugins/{ui,system}/skills/*`를 `.agents/skills/`(기본)에 복사. 옵션 `ui|system|all`, `--dest`, `--ref`, 환경 변수 `FE_SKILLS_REPO`. 같은 이름 폴더만 교체(업데이트). 로컬 저장소로 테스트: all 51개, ui만 `.claude/skills`로 50개, 잘못된 인자 exit 2.
- `scripts/validateSkills.mjs` — 검사 3건 추가: AGENTS.md 존재, CLAUDE.md의 `@AGENTS.md` 줄, `.agents/skills/add-skill`과 `.claude/skills/add-skill` 내용 일치(링크 끊김 감지).
- `README.md` — 설치 절을 Claude Code / 다른 에이전트로 나눔. 한 줄 설치 명령, 옵션 표, 수동 복사 방법, 도구별 스킬 폴더 표. 저장소 구조 트리·기여하기·관련 문서에 AGENTS.md 추가.
- `docs/design/2026-08-19-fe-skills.md` — 레이아웃 트리 갱신, 문답 기록 8라운드 추가.

### 게이트 결과

| 게이트 | 결과 |
|--------|------|
| 빌드·린트·테스트 | 통과 (코드 변경 없음, 474 tests) |
| 스킬 구조 검증 | 통과 (새 검사 3건 포함) |
| 설치 스크립트 | 로컬 저장소 대상 3가지 경로 확인 |

## 3. 주의사항

- **Claude Code가 `.claude/skills/` 안의 심볼릭 링크를 따라가는지는 이 세션에서 직접 확인하지 못했다.** 다음 Claude Code 세션에서 `add-skill` 스킬이 목록에 뜨는지 확인하고, 안 뜨면 링크 대신 복사본 + validateSkills의 해시 비교로 바꾼다(검사는 이미 내용 일치를 보므로 그대로 동작한다).
- 도구별 스킬 폴더 경로는 2026-09 기준 검색 결과에서 가져왔다. 도구 문서가 바뀌면 README 표를 갱신한다.
- 훅은 Claude 전용이다. 다른 에이전트는 git 규칙·게이트 실행을 스스로 지켜야 하며, AGENTS.md에 그 점을 명시했다.
- 마켓플레이스(`.claude-plugin/`)는 그대로 유지했다. 두 설치 경로가 공존한다.
- `curl | sh` 한 줄 설치는 편하지만 원격 스크립트 실행이라는 점에서 보안상 꺼리는 사용자가 있다. README에 수동 복사 방법을 같이 두었다.
