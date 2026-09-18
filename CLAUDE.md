@AGENTS.md

# Claude Code 전용 보충

공통 지침은 위에서 가져온 `AGENTS.md`가 단일 출처다. 이 파일에는 Claude Code에서만 동작하는 것만 적는다.

**스킬 트리거:** 스킬 추가·수정·재검증 요청 시 `add-skill` 스킬(`.claude/skills/add-skill` → `.agents/skills/add-skill` 심볼릭 링크)을 사용하라. UI 구현·수정에는 `fe-craft`, 데모 사이트 배포 전에는 `fe-predeploy`. 단순 질문은 직접 응답 가능.

**훅(`.claude/settings.json`):** PreToolUse에서 git 변경 명령 차단(`blockGitMutation`, commit·push는 `allowCommitPush` 옵트인 시에만)·시크릿 접근 차단(`blockSecretAccess`)·보호 브랜치 편집 차단(`branchGuard`). Stop에서 검증자 게이트(`verifierGate`)가 build·lint·test·스킬 구조 4종을 실행한다.

**커밋·PR:** 자동으로 하지 않는다. 사용자가 "커밋해줘/PR 올려줘"를 명시했을 때만 `pr` 스킬로 수행한다.

**변경 이력:**
| 날짜 | 변경 내용 | 대상 | 사유 |
|------|----------|------|------|
| 2026-08-19 | 초기 구성 (라이트 티어: add-skill 스킬 + 훅 3종 + PR 옵트인) | 전체 | - |
| 2026-08-20 | 커밋·PR 자동 실행 금지 명시 (사용자 육안 확인 후 직접) | CLAUDE.md | 사용자 지시 — 시각 결과물은 육안 확인이 커밋 게이트 |
| 2026-08-24 | 검증자 게이트(Stop 훅) 상시 등록 — build·lint·test·스킬 구조 4종 | settings.json·hooks·scripts/ | 사용자 승인 루프(docs/loops/goals-verification.md), 턴 종료마다 기계 강제 |
| 2026-08-24 | 플러그인 2개 분리 — plugins/ui(fe-ui)·plugins/system(fe-system), 시스템 스킬은 문서+문답(데모·브라우저 게이트 제외) | 전체 구조·add-skill·validateSkills | 사용자 결정 — UI 외 시스템 설계 스킬 추가(설계 문답 7) |
| 2026-08-25 | 검증자 게이트 maxTokens 400000→20000000 상향 | verifierGate.config.json | 사용자 승인 — 게이트가 세션 누적 transcript 기준으로 판정하므로 루프 1회분 예산이면 장기 세션에서 매 턴 안전장치 발동(08-25 세션 강제 종료 원인) |
| 2026-09-18 | 공통 지침을 AGENTS.md로 분리, CLAUDE.md는 `@AGENTS.md` 가져오기 + Claude 전용만. add-skill을 `.agents/skills/`로 이동(`.claude/skills/`는 심볼릭 링크). 설치 스크립트 추가 | AGENTS.md·CLAUDE.md·.agents/·scripts/install-skills.sh·README | 사용자 결정 — Claude 외 에이전트(Codex·Cursor·Gemini CLI·Copilot)도 사용·기여 가능하게(설계 문답 8) |
