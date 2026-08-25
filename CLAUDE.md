# fe-skills

프론트엔드 스킬 저장소 — 마켓플레이스 하나에 플러그인 2개: **fe-ui**(애니메이션/UI/UX 구현, 데모 사이트로 육안 확인)와 **fe-system**(시스템 설계 — 케이스별 트레이드오프 문서+문답 추천). 데모(Vite+React, GitHub Pages)는 UI 스킬만 노출한다.

- 설계 단일 출처: `docs/design/2026-08-19-fe-skills.md`
- 작업 규칙: `docs/harness-rules.md` (작업 전 읽기)
- 정본 원칙: 스킬 문서(`plugins/{ui,system}/skills/*/SKILL.md` + assets/references)가 정본, 데모는 UI assets/를 import만 한다(복사 금지)

## 하네스: 스킬 추가 파이프라인

**목표:** 애니메이션/UI/UX 패턴을 스킬 문서 + 데모로 추가하고 게이트(빌드·린트·구조·브라우저·모션 리뷰)로 검증한다.

**트리거:** 스킬 추가·수정·재검증 요청 시 `add-skill` 스킬을 사용하라. UI 구현·수정에는 `fe-craft`, 데모 사이트 배포 전에는 `fe-predeploy`. 단순 질문은 직접 응답 가능.

**커밋·PR:** 자동으로 하지 않는다 — 작업 완료 후 검증 결과와 확인 방법(`npm run dev`)을 보고하고 멈춘다. 사용자가 육안 확인 후 직접 커밋·PR하며, "커밋해줘/PR 올려줘" 명시 요청 시에만 `pr` 스킬로 수행한다.

**변경 이력:**
| 날짜 | 변경 내용 | 대상 | 사유 |
|------|----------|------|------|
| 2026-08-19 | 초기 구성 (라이트 티어: add-skill 스킬 + 훅 3종 + PR 옵트인) | 전체 | - |
| 2026-08-20 | 커밋·PR 자동 실행 금지 명시 (사용자 육안 확인 후 직접) | CLAUDE.md | 사용자 지시 — 시각 결과물은 육안 확인이 커밋 게이트 |
| 2026-08-24 | 검증자 게이트(Stop 훅) 상시 등록 — build·lint·test·스킬 구조 4종 | settings.json·hooks·scripts/ | 사용자 승인 루프(docs/loops/goals-verification.md), 턴 종료마다 기계 강제 |
| 2026-08-24 | 플러그인 2개 분리 — plugins/ui(fe-ui)·plugins/system(fe-system), 시스템 스킬은 문서+문답(데모·브라우저 게이트 제외) | 전체 구조·add-skill·validateSkills | 사용자 결정 — UI 외 시스템 설계 스킬 추가(설계 문답 7) |
| 2026-08-25 | 검증자 게이트 maxTokens 400000→20000000 상향 | verifierGate.config.json | 사용자 승인 — 게이트가 세션 누적 transcript 기준으로 판정하므로 루프 1회분 예산이면 장기 세션에서 매 턴 안전장치 발동(08-25 세션 강제 종료 원인) |
