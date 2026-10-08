@AGENTS.md

# Claude Code 전용 보충

공통 지침은 위에서 가져온 `AGENTS.md`가 단일 출처다. 이 파일에는 Claude Code에서만 동작하는 것만 적는다.

**스킬 트리거:** 패턴(스킬) 추가·수정·재검증 요청 시 `add-skill` 스킬(`.claude/skills/add-skill` → `.agents/skills/add-skill` 심볼릭 링크)을 사용하라. UI 구현·수정에는 `fe-craft`, 데모 사이트 배포 전에는 `fe-predeploy`. 단순 질문은 직접 응답 가능.

**훅(`.claude/settings.json`):** PreToolUse에서 git 변경 명령 차단(`blockGitMutation`, commit·push는 `allowCommitPush` 옵트인 시에만)·시크릿 접근 차단(`blockSecretAccess`)·보호 브랜치 편집 차단(`branchGuard`). Stop에서 검증자 게이트(`verifierGate`)가 build·lint·test·스킬 구조·선택 평가 5종을 실행한다.

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
| 2026-10-06 | 프로젝트명 fe-skills → suta, 플러그인 fe-ui → suta. 데모 배포 경로를 저장소 이름에서 만들도록 변경(`VITE_BASE`) | 이름·URL 전체·demo·deploy-demo.yml | 사용자 결정 — 설치형 "AI 슬롭 제거" UI 스킬로 성격 전환, 1단계 이름 변경(설계 문답 9) |
| 2026-10-06 | 설계 문답 스킬(fe-system 플러그인 `design`) 완전 제거 — plugins/system·평가 파일·시스템 전용 과거 기록 4개 삭제, 검사·평가·설치 스크립트를 UI 스킬 하나로 단순화 | plugins/system·evals·scripts/·README·AGENTS.md·add-skill·docs | 사용자 결정 — 설치형 UI 스킬로 전환, 2단계(설계 문답 9) |
| 2026-10-06 | 단일 진입 스킬로 재구성 — UI 스킬 53개를 `skills/suta/patterns/{패턴}/PATTERN.md`로 옮기고 진입 스킬 `skills/suta/SKILL.md`(AI 슬롭 금지선 + 자동 생성 카탈로그) 신설. 저장소 루트가 플러그인(source "./"), add-skill은 metadata.internal로 숨김. 트리거 평가(evals/trigger.json)·카탈로그 생성(npm run catalog) 추가 | skills/·scripts/·evals/·demo 경로·README·AGENTS.md·add-skill | 사용자 결정 — impeccable처럼 설치하면 UI 요청에 자동 적용, 3단계(설계 문답 9) |
| 2026-10-07 | 레이아웃 스킬과 편집 후 검사 훅 — 패턴 `layout-principles`·`layout-audit` 추가(53→55), motion-audit의 공통 코어 `auditCore.ts` 분리, 통합 검사 `skills/suta/scripts/audit.mjs`, 편집 후 검사 훅(Claude Code·Codex 매니페스트 인라인), Codex 플러그인 매니페스트, 버전 0.4.0 | skills/·.claude-plugin·.codex-plugin·.agents/plugins·scripts/validateSkills·README·AGENTS.md·docs | 사용자 결정 — error만 돌려보내기, Codex 플러그인 형식까지, PR 1개(설계 문답 10) |
| 2026-10-07 | 화면 유형별 관례와 훅 소음 줄이기 — 앱 화면 1,116장·웹사이트 19곳 분석으로 `layout-principles`에 화면 유형별 관례(references/screen-conventions.md)·넓은 화면 값 추가, 진입 스킬 절차·금지선·값 반영, 편집 후 훅이 이번 편집이 바꾼 줄만 판정, tiny-text 아이콘 글꼴 제외·rem 루트 기준, 데모 ⑥ 메뉴 상세, 버전 0.5.0 | skills/suta·demo·evals·README·docs | 사용자 결정 — 디자인 레퍼런스를 분석해 레이아웃 스킬·훅에 결합(설계 문답 11) |
| 2026-10-07 | README 간결화(314줄 → 73줄) — 설치·소개만 남기고 나머지는 상세 안내(`docs/guide.md`·`guide.en.md`)로 옮김. 패턴 표는 상세 안내에 둔다 | README 2벌·docs/guide·AGENTS.md·add-skill | 사용자 요청 — 텍스트가 많아 읽기 어려움 |
| 2026-10-07 | 데모 사이트를 suta 검사로 점검·개선 — 셸 토큰화·좁은 화면 넘침 수정·모바일 메뉴 접기·조절 막대와 목록 행의 상자 걷기(error 5·warn 96 → 0). motion-audit 오탐(주석·템플릿 문자열) 수정, OTP 칸 320px 대응, 버전 0.5.1 | demo/·motion-audit·otp-input·매니페스트 3개 | 사용자 요청 |
| 2026-10-07 | 퍼블리싱 벤치마크 — 같은 요청 8개를 일반 Claude Code와 suta 설치 Claude Code에 2회씩(32회), 렌더 지표·axe·블라인드 판정으로 비교. README 맨 위에 요약 | scripts/benchmark·evals/benchmark·docs/benchmark(.en).md·README 2벌 | 사용자 요청 |
| 2026-10-07 | 글자·색·면 기준 — 레퍼런스(앱 1,104장·웹 19곳·피드백 사례) 재분석으로 색 역할 토큰 11개·본문 행간 1.5·구역 사이 32/48·띠 8, 진입 스킬 "글자·색·면" 금지선과 톤 단계(근거 없으면 거의 검정), 관례 문서(로그인·설정·장바구니 세부, 대시보드·랜딩), 데모 ⑦·⑧, 벤치마크 2차와 톤 지표, 버전 0.6.0 | skills/suta·demo·evals·scripts/benchmark·docs·README | 사용자 요청 — 벤치마크의 suta 화면이 아직 AI 티가 난다, 레퍼런스 우선 |
| 2026-10-08 | 실사용 점검 — NoodleLens 적용 결과로 색의 수·덜어내기·AI 채팅 관례 추가. 레퍼런스 31곳 1,116장 색 실측(UI 체계 색 2종 이하 81%, 옅은 색 면 13%), SKILL.md 덜어내기 단계·색 금지선, tone.md 색의 수, 화면 유형 14종(AI 채팅), layout-audit `tinted-surface`·`hue-count`, `--color-warning` 제거, 패턴 기본 파랑 제거, 데모 ⑨, 버전 0.7.0 | skills/suta·demo·evals·docs·README | 사용자 요청 — 실제 서비스(NoodleLens)에 적용해 보니 구조가 난잡하고 AI 색이 남았다 |
