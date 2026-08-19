# fe-skills 하네스 구축 + 첫 스킬 2개 (enter-exit·scroll-reveal)

| 항목 | 내용 |
|------|------|
| 날짜 | 2026-08-19 |
| 작성 | Claude Code (harness·add-skill 파이프라인) |
| 관련 경로 | `.claude/`, `plugin/`, `demo/`, `docs/design/2026-08-19-fe-skills.md` |

## 1. 개요

프론트엔드 애니메이션/UI/UX 스킬 저장소를 신규 구축했다. 4라운드 설계 문답으로 확정된 설계(플러그인 마켓플레이스 배포 + Vite+React 데모 + GitHub Pages)에 따라, 라이트 티어 하네스(add-skill 파이프라인)와 구조 검증용 첫 스킬 2개를 만들었다. 작업 브랜치는 `feat/harness-init`.

## 2. 작업내용

- **저장소 초기화** — fe-skills가 git 저장소가 아니었음(홈 디렉토리가 저장소로 잡힘). `git init -b main` + origin(Guksu/fe-skills.git) 연결 + `feat/harness-init` 생성.
- **하네스(라이트 티어)** — `.claude/settings.json`(훅 3종 등록 + 시크릿 deny + 테스트·빌드 allowlist), `.claude/hooks/`(blockGitMutation·blockSecretAccess·branchGuard, allowCommitPush=true 옵트인), `.claude/skills/add-skill/`(스킬 추가 파이프라인 도메인 스킬), `docs/harness-rules.md`, `docs/templates/`(worklog·handoff·design·predeploy), `CLAUDE.md` 포인터.
- **플러그인 골격** — `.claude-plugin/marketplace.json`(루트 카탈로그) + `plugin/.claude-plugin/plugin.json`. 설치 범위는 `plugin/`만 — 데모가 딸려가지 않는다.
- **스킬 enter-exit** — `plugin/skills/enter-exit/`: SKILL.md + references/edge-cases.md + assets/(Presence.tsx 상태 머신, enter-exit.css 변형 3종). 퇴장 애니메이션을 위한 언마운트 지연이 핵심.
- **스킬 scroll-reveal** — `plugin/skills/scroll-reveal/`: SKILL.md + assets/(useScrollReveal.ts, ScrollReveal.tsx, scroll-reveal.css). IntersectionObserver 기반.
- **데모 앱** — `demo/`(Vite+React+TS, npm workspace 루트 호이스팅). `@skills` alias로 plugin/skills/*/assets/를 직접 import(복사본 0). 해시 라우팅 + 데모 레지스트리(`demo/src/demos/index.ts`). GitHub Pages 배포 워크플로(`.github/workflows/deploy-demo.yml`, main 푸시 시).
- **게이트 통과** — ① 빌드·린트·테스트(Vitest 10/10, TDD로 Presence·ScrollReveal 로직 선테스트) ② 스킬 구조 검증(name-디렉토리 일치·링크 유효·description 176~184자) ③ 브라우저 실동작(진입/퇴장 중간 프레임·스태거·once=false 재감춤 스크린샷 확인, 콘솔 에러 0) ④ fe-craft 모션 리뷰 — 발견 4건 수정: reduced-motion 특이도 버그(미디어 쿼리가 변형 선택자에 짐), reduced-motion에서 페이드까지 죽던 것을 "이동만 제거"로 완화, 스태거 120→80ms, fx-fade 용도 안내 추가.

## 3. 주의사항

- **원격 브랜치 삭제 미완** — `claude/frontend-animation-skills-repo-ysw79q`(이전 웹 세션 작업물) 삭제는 사용자 전담: `git push origin --delete claude/frontend-animation-skills-repo-ysw79q`
- **홈 디렉토리가 git 저장소** — `/Users/kimjongmin/.git`(remote=envault.git)이 존재해 하위 모든 디렉토리가 그 저장소로 잡힌다. 의도가 아니면 정리 권장(이번 작업 범위 밖).
- **GitHub Pages 설정 필요** — 저장소 Settings → Pages → Source를 "GitHub Actions"로 한 번 설정해야 첫 배포가 된다.
- **validateHarness warn 4건은 의도됨** — 풀 티어 템플릿(retro·loop-spec·digest·report) 부재. 라이트 티어 설계라 정상.
- 데모 배포 전 점검은 `fe-predeploy` 스킬로 실행한다(아직 미실행 — 첫 Pages 배포 전 권장).
