# 구조 변경: 플러그인 2개 분리 (fe-ui / fe-system)

| 항목 | 내용 |
|------|------|
| 날짜 | 2026-08-24 |
| 작성 | Claude Code |
| 관련 경로 | `.claude-plugin/`, `plugins/`, `demo/`(설정), `scripts/validateSkills.mjs`, `.claude/skills/add-skill/` |

## 1. 개요

UI 스킬만 있던 저장소에 프론트엔드 시스템 설계 스킬을 추가하기 위한 구조 변경(사용자 결정, 설계 문답 7라운드). 별도 레포 분리는 보류 — 하네스·마켓플레이스 공유 이득이 크고 분리는 되돌리기 쉬운 결정. 플러그인 스킬 탐색이 1단계 평면(skills/{name})이라 중첩 대신 **플러그인 2개**로 분리했다. 브랜치 `feat/plugin-split`, 커밋 안 함.

## 2. 작업내용

- **디렉토리 이전** — `git mv plugin plugins/ui`(이력 보존) + `plugins/system/` 골격 생성.
- **마켓플레이스** — 플러그인 2개 등록: `fe-ui`(0.2.0, 기존 16종) + `fe-system`(0.1.0, 문서+문답 설계 스킬). 기존 `fe-skills` 플러그인명은 소멸 — 설치자는 재설치 필요.
- **경로 참조 갱신** — demo(vite/tsconfig/eslint의 @skills alias), App.tsx(GitHub 링크·경로 표기), 레지스트리, README(플러그인 표·설치 명령·구조), CLAUDE.md(포인터·변경 이력), add-skill 파이프라인(UI/시스템 분기 판별 절차 추가).
- **게이트 확장** — `validateSkills.mjs`가 두 플러그인을 검사하되, 데모 레지스트리 등록은 UI만 요구(시스템 스킬은 구조만). 시스템 스킬 게이트 = 구조 + 트리거 검증(브라우저·데모 제외, add-skill에 명시).
- **감사 추적 보존** — 워크로그·설계 문답 2라운드 기록의 옛 경로(`plugin/skills`)는 당시 사실이므로 수정하지 않음(7라운드가 변경을 기록).
- 게이트: 빌드·린트·테스트 95/95·구조 검증(2플러그인) 통과.

## 3. 주의사항

- **기존 설치 마이그레이션**: `/plugin uninstall fe-skills` 후 `/plugin install fe-ui@fe-skills`(+선택 `fe-system@fe-skills`). 마켓플레이스 add는 그대로.
- 시스템 스킬의 정본 구조: SKILL.md(문답 절차+추천 종합) + references/(케이스별 트레이드오프 문서). assets 없음이 정상 — 구조 게이트도 그렇게 검사한다.
- fe-system은 현재 빈 골격 — 첫 스킬(예: 상태 위치 결정 — URL/세션/스토어)부터 add-skill 시스템 분기로 추가한다.
