# 프로젝트명 변경 — fe-skills → suta (전환 1단계)

| 항목 | 내용 |
|------|------|
| 날짜 | 2026-10-06 |
| 작성 | 에이전트 (Claude Code) |
| 관련 경로 | `.claude-plugin/marketplace.json`, `plugins/ui/.claude-plugin/plugin.json`, `package.json`·`demo/package.json`·`package-lock.json`, `README.md`·`README.en.md`, `AGENTS.md`·`CLAUDE.md`, `demo/`, `.github/workflows/deploy-demo.yml`, `scripts/`, `plugins/ui/skills/*/SKILL.md`, `docs/design/2026-08-19-fe-skills.md` |

## 1. 개요

프로젝트 성격을 "프론트엔드 스킬 모음"에서 "설치형 AI 슬롭 제거 UI 스킬"로 바꾸는 3단계 작업의 1단계다. 목표는 impeccable처럼 한 번 설치하면 Claude Code·Codex의 UI 요청에 자동으로 참조되는 것이다. 사용자 문답(설계 문답 9라운드)으로 새 이름을 `suta`(수타 — 기계가 아니라 손으로 친 UI)로 정했다. 'slop'이 든 후보(unslop·deslop·slopless·noslop·antislop)는 같은 분야의 기존 프로젝트와 이름이 겹쳐 제외했다. 2단계(설계 문답 스킬 제거)와 3단계(단일 진입 스킬로 재구성)는 사용자 확인 후 진행한다.

## 2. 작업내용

- **마켓플레이스·플러그인** — `.claude-plugin/marketplace.json` name `fe-skills` → `suta`, 플러그인 ID `fe-ui` → `suta`. 3단계의 최종 이름을 1단계에서 미리 확정했다. `plugins/ui/.claude-plugin/plugin.json`도 같은 이름. fe-system 항목은 2단계에서 지우므로 그대로 뒀다.
- **패키지** — `package.json` → `suta`, `demo/package.json` → `suta-demo`. `package-lock.json`은 `npm install`로 다시 만들었다. 이름 4곳 외에 npm 10.9.4가 다시 계산한 `peer` 표시가 바뀌었고, 의존성 버전·해시는 그대로다. `npm ci` 재설치로 확인했다.
- **URL 일괄 치환(61개 파일)** — `guksu.github.io/fe-skills` → `guksu.github.io/suta`, `Guksu/fe-skills` → `Guksu/suta`. 대상: UI 스킬 53개 SKILL.md의 `라이브 데모:` 줄, README 2개, marketplace·plugin.json, 설치 스크립트, 데모 `App.tsx`.
- **데모 배포 경로** — `demo/vite.config.ts`를 `base: process.env.VITE_BASE ?? '/suta/'`로, `deploy-demo.yml` 빌드 단계에 `VITE_BASE: /${{ github.event.repository.name }}/`를 넣었다. 저장소 이름을 바꾸기 전에 머지해도 옛 주소에서 데모가 계속 뜬다. 이름을 바꾼 뒤 다시 배포하면 새 주소로 맞춰진다. 계획의 고정값 `'/suta/'`를 보강한 것이다.
- **이름 문구**
  - README 2개: 제목, 소개 첫 문장(이름 뜻 풀이), 배지 `suta-53%20skills`, 목차 앵커, 플러그인 표, 설치 명령, 수동 복사 경로, 구조도, 로컬 데모 주소. 옛 이름 설치자를 위한 이전 안내도 넣었다.
  - AGENTS.md: 제목, 표, 구조도, 데모 주소.
  - 데모: `index.html` title, `App.tsx` 브랜드·h1.
  - add-skill: description, 데모 브랜드 문구.
- **설치 스크립트** — 환경 변수 `FE_SKILLS_REPO` → `SUTA_REPO`, 임시 폴더 이름과 안내 문구.
- **검사 스크립트** — `validateSkills.mjs`의 배지 라벨 `fe--ui` → `suta`. README 배지와 같이 바꿔야 통과한다.
- **스킬 문서 속 `fe-ui`**
  - motion-principles: description, 본문, `references/decision-table.md`, `motion-tokens.css` 머리말. "50종"은 실제 수와 달라 개수 없이 "suta 스킬들"로 바꿨다.
  - motion-audit: 본문 2곳, `auditMotion.ts`의 수정 안내 문구.
  - design 스킬 문서 4곳: 2단계에서 지울 예정이지만, 1단계 시점의 일관성을 위해 바꿨다.
- **데모 localStorage 키** — `fe-skills-lang` → `suta-lang`, `fe-skills-demo-theme` → `suta-demo-theme`.
- **테스트 이름 1건** — `auditMotion.test.ts`의 "(fe-ui 스킬 CSS 스타일)" → "(suta 스킬 CSS 스타일)".
- **설계 문서**
  - 제목에 "(구 fe-skills)"를 붙이고 최종 갱신일, 저장소 주소, 구조도를 고쳤다.
  - §6에 9라운드(이번 문답 결정 4개)를 추가했다.
  - §7을 현재 상태로 정리했다(저장소 이름 변경 대기, remote 오설정은 해결됨).
  - 파일명은 날짜 기록이라 유지했다.
- **지나가며 고친 문서 오류**
  - CLAUDE.md의 게이트 "4종" → "5종"(선택 평가 포함).
  - AGENTS.md의 `npm run validate` 설명 "위 두 검사" → "위 두 검사 + 모션 검사".
  - README 2개의 휴대폰 확인 안내 `npm run dev -- --host` → `npm run dev -- -- --host`. 루트 스크립트가 `npm run dev -w demo`를 한 번 더 부르므로, `--`가 하나면 `--host`가 vite까지 가지 않는다(실행해서 "Network: use --host to expose"로 확인). `--`를 두 번 쓰면 `vite --host`로 전달된다.
- **CLAUDE.md** — 변경 이력 행 추가.

### 게이트 결과

| 게이트 | 결과 |
|--------|------|
| 빌드·린트·테스트 | 통과 (517 tests) |
| 스킬 구조·선택 평가·모션 검사 | 통과 (404/404, 168개 파일 error 0 warn 0) |
| 플러그인 형식 | `claude plugin validate . --strict`, `claude plugin validate ./plugins/ui` 통과 |
| 배포 경로 | 기본 빌드는 `/suta/assets/…`, `VITE_BASE=/fe-skills/` 빌드는 `/fe-skills/assets/…` |
| 브라우저 | 헤드리스 Chromium — `http://localhost:5173/suta/` 첫 화면(사이드바·h1 "suta")과 `#/bottom-sheet` 렌더 확인 |

## 3. 주의사항

- **GitHub 저장소 이름 변경은 사용자가 직접 한다.**
  1. 1단계를 main에 머지한 뒤 Settings → General에서 저장소 이름을 `suta`로 바꾼다.
  2. Actions의 "Deploy demo to GitHub Pages"를 수동 실행한다.
  - git·웹 주소는 GitHub가 새 주소로 넘겨준다. Pages 옛 주소(`guksu.github.io/fe-skills/`)는 404가 된다.
  - `fe-skills`라는 이름으로 새 저장소를 만들면 넘겨주기가 끊긴다. 만들지 않는다.
- 스킬 문서의 새 데모 링크(`guksu.github.io/suta/#/…`)는 저장소 이름 변경과 재배포 전까지 404다.
- 기존 Claude Code 설치자는 `/plugin marketplace remove fe-skills` 후 다시 설치해야 한다(README 안내).
- 루트에서 vite 옵션을 넘길 때는 `--`를 두 번 쓴다(`npm run dev -- -- --port 5174`). 한 번만 쓰면 바깥 npm이 옵션을 먹고 값만 남는다. 예를 들어 `npm run dev -- --port 5173`은 `vite 5173`이 되어 `5173`을 루트 폴더로 잡은 엉뚱한 서버가 뜬다.
- 남은 `fe-skills`·`fe-ui` 표기는 모두 의도한 것이다.
  - 설계 문서 파일명과 그 경로를 가리키는 링크.
  - "(구 fe-skills)" 표기와 이전 안내.
  - CLAUDE.md·설계 문서의 과거 이력 행, 과거 워크로그.
- 다음 작업: 2단계(설계 문답 제거)는 사용자 확인 후 진행한다.
