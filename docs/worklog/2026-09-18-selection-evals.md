# 스킬 선택 평가 도입 · description 정리 · skills CLI 설치 안내

| 항목 | 내용 |
|------|------|
| 날짜 | 2026-09-18 |
| 작성 | 에이전트 (서브 에이전트 4개 병렬) |
| 관련 경로 | `scripts/evalSelection.mjs`, `evals/selection/*.json`(51개), `plugins/*/skills/*/SKILL.md`(description 51개), `scripts/validateSkills.mjs`, `AGENTS.md`, `.agents/skills/add-skill/SKILL.md`, `README.md`, `package.json`, `.github/workflows/deploy-demo.yml`, `.claude/hooks/verifierGate.config.json` |

## 1. 개요

유명 스킬 저장소(anthropics/skills, obra/superpowers, vercel-labs) 조사에서 드러난 부족한 점 1~3번을 한 묶음으로 처리했다. ① `npx skills add` 설치 안내가 없었다. ② "이 요청에 이 스킬이 골라지는가"를 재는 장치가 없었다. ③ description이 지침(3인칭, 무엇+언제만)과 어긋났고 영어 용어가 빠져 있었다.

## 2. 작업내용

- `scripts/evalSelection.mjs` 신설 — 선택 평가 실행기. LLM 없이 description과 요청 문장의 단어 겹침으로 순위를 매긴다. 특징: 공백 토큰(가중 3) + 한글 음절 2-gram(가중 1), 조사 제거 어간, 범용 요청 동사 불용어("만들어줘/넣어줘/컴포넌트" 등), IDF 가중(모든 description에 나오는 단어는 0에 가깝게). `should` 질의는 대상 스킬이 단독 1위, `shouldNot` 질의는 대상이 1위가 아니면 통과. `--verbose`(상위 3개 점수), `--margins`(2위와 차이가 작은 10개). 평가 파일이 없는 스킬은 실패.
- `evals/selection/{skill}.json` 51개 — should 206개(구어체·영어·기능 설명·수정 요청 포함), shouldNot 175개(이웃 스킬 요청). 최종 381/381 통과.
- description 51개 재작성 — 3인칭, "무엇을 하는가 + 언제 쓰는가", 영어 용어 1회, 구현 방식 요약·에이전트 명령문 제거. 길이(JS length) 중앙값 182→202자, 합계 9,561→10,114자. 줄지 않고 6% 늘었다 — 영어 용어와 기능 설명 표현을 넣어서다. 조사 전 "중앙값 407자"는 바이트 수를 잘못 센 것이었다.
- `scripts/validateSkills.mjs` — description 상한 400→300자, 에이전트 명령문("이 스킬을 사용할 것") 금지 검사.
- `npm run validate`(구조 + 선택 평가) 추가. CI 워크플로와 Claude 검증자 게이트에 `evalSelection.mjs` 등록.
- `AGENTS.md`·add-skill — 절차 0단계 "선택 평가 먼저(Red) → description(Green)", description 규칙 명문화. add-skill 자체의 description도 같은 규칙으로 고침.
- `README.md` — 설치 절에 `npx skills add Guksu/fe-skills`(skills CLI) 추가, 검증 표·기여 절차에 선택 평가 반영.

### 평가가 잡아낸 결함 (재작성 전 description 기준)

| 결함 | 스킬 수 (에이전트 보고 합산) |
|------|------|
| 영어 용어 누락 — "bottom sheet 컴포넌트 추가해줘" 같은 요청에 0점 | 약 30개 |
| 기능 설명형 요청("옆으로 넘기면 딱딱 걸리게")이 이웃 스킬에 밀림 | 약 10개 |
| 이웃과 동점·역전 — tooltip↔carousel("슬라이드"), sticky↔stretchy("스크롤 헤더"), design의 "컴포넌트"가 UI 전반과 겹침 | 6쌍 |
| 범용 동사("만들어줘/넣어줘")가 description에 있어 공짜 점수 | 5개 |

### 남은 얇은 마진 (`--margins`)

swipe-dismiss-viewer "뷰어 닫히는 드래그 거리 줄여줘"(bottom-sheet와 0.7점 차), select "셀렉트 패널 열리는 속도랑 높이"(modal-dialog와 2.9), card-expand "카드 확대 전환 속도"(page-transition과 4.0). 수정 요청형 질의는 스킬 고유 단어가 적어 본래 어렵다. 통과는 하지만 description을 바꿀 때 흔들릴 수 있다.

### 게이트 결과

| 게이트 | 결과 |
|--------|------|
| 빌드·린트·테스트 | 통과 (474 tests) |
| 스킬 구조 검증 | 통과 (새 검사 2건 포함) |
| 스킬 선택 평가 | 통과 381/381 |

## 3. 주의사항

- **선택 평가는 대리 지표다.** 실제 모델은 문맥과 의미로 고르므로 단어 겹침 순위와 다를 수 있다. 잡는 것은 "트리거 표현 누락"과 "이웃과 구별 안 됨" 두 가지다. LLM을 부르는 진짜 선택 평가는 후속 과제.
- description 총량이 줄지 않았다. 시작 시 컨텍스트 부담을 줄이려면 별도 작업(예: 유사 스킬 통합)이 필요하다.
- 병렬 작업 중 한 에이전트가 description을 바꾸면 다른 에이전트의 순위가 흔들렸다. 앞으로 description을 고칠 때는 `node scripts/evalSelection.mjs`를 전체로 돌린다.
- 스코어러의 불용어·조사 목록은 수작업이다. 새 표현이 문제를 일으키면 `STOPWORDS`·`PARTICLE`에 추가한다.
