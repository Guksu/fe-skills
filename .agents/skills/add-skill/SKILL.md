---
name: add-skill
description: fe-skills 저장소에 새 애니메이션/UI/UX 스킬을 추가하는 파이프라인(문서 작성→데모 구현→게이트 검증). "스킬 추가해줘/만들어줘", "{애니메이션} 스킬로 등록해줘", 기존 스킬의 "수정/보완/데모 다시/재검증/리뷰 다시" 요청 시 반드시 이 스킬을 사용할 것. 스킬 내용 단순 질문은 직접 응답 가능.
---

# add-skill — 스킬 추가 파이프라인

이 저장소의 반복 작업이다. 작업 전 `docs/harness-rules.md`를 읽는다. 설계 단일 출처는 `docs/design/2026-08-19-fe-skills.md`다. 플러그인이 2개이므로 먼저 어느 쪽인지 판별한다:

- **UI 스킬**(`plugins/ui/skills/`) — 애니메이션/UI/UX 구현 패턴. 아래 전체 절차(문서→데모→게이트 4종) 적용.
- **시스템 스킬**(`plugins/system/skills/`) — 설계 결정 가이드(문서+문답). 데모·브라우저 게이트 없음: SKILL.md(문답 절차와 추천 종합 방법) + references/(케이스별 트레이드오프 문서)를 쓰고, 게이트는 구조 검증(`node scripts/validateSkills.mjs`)과 트리거 검증(should/should-NOT 쿼리)만 적용한다. 문서는 "어떤 경우 이 설계가 좋고, 어떤 단점이 있는지"의 트레이드오프 중심으로 쓴다.

## 불변 구조 — 왜 이 모양인가

```
plugins/ui/skills/{skill-name}/          # UI 스킬
├─ SKILL.md          # 정본: 언제 쓰는가·사용 방법·핵심 패턴
├─ references/       # 상세(변형·엣지 케이스·접근성) — 필요할 때만 로드
└─ assets/           # 예시 컴포넌트 코드 (정본의 일부, 실행 가능한 파일)
demo/src/demos/{skill-name}/             # assets/를 import해 렌더링하는 데모 페이지

plugins/system/skills/{skill-name}/      # 시스템 스킬 (데모 없음)
├─ SKILL.md          # 문답 절차(무엇을 묻고 어떻게 종합 추천하는가)
└─ references/       # 케이스별 설계 트레이드오프 문서
```

- **assets/의 코드가 유일한 구현본이다.** 데모는 그 파일을 import만 한다 — 복사본을 만들면 한쪽만 고치는 순간 문서가 거짓말이 된다.
- **스킬 문서는 설치된 프로젝트에서 단독으로 완결되어야 한다.** SKILL.md는 사용 방법과 핵심 패턴을 담고, 전체 구현은 "assets/{파일}을 읽어라"로 가리킨다. demo/ 경로는 참조하지 않는다(설치 시 존재하지 않는다).

## 절차

### 0. 착수 확인

- 브랜치 확인(`branch` 스킬) — 작업은 `feat/{skill-name}`에서.
- `plugins/ui/skills/`에 같은/유사 스킬이 이미 있는지 확인 — 있으면 신규가 아니라 확장이다.

### 1. 스킬 문서 (정본 먼저)

1. `plugins/ui/skills/{skill-name}/SKILL.md` 작성:
   - frontmatter `name`(디렉토리명과 일치)·`description` — description은 트리거 조건이다: 무엇을 하는 스킬인지 + 사용자가 실제로 쓸 표현("페이드 인 넣어줘" 등) + 후속 키워드(수정/다시). ~350자.
   - 본문: **언제 이 패턴을 쓰는가 → 사용 방법(설치·적용 단계) → 사용 예시(최소 코드) → 커스터마이즈 포인트(duration·easing 등) → 주의사항(접근성·성능)**. 명령형, ≤500줄.
2. `assets/`에 예시 컴포넌트 작성. 기술 기준: **CSS 우선** — CSS transition/animation으로 되는 것은 CSS로, 어려운 것(제스처·레이아웃 전이)만 라이브러리를 쓰고 SKILL.md에 "왜 이 기술인가" 한 줄을 명시한다.
3. 접근성은 선택이 아니다: `prefers-reduced-motion` 대응을 모든 스킬에 포함한다.
4. 코드 컨벤션: 화살표 함수, useCallback/useMemo 지양, 인자 2개 이상이면 named-object, useEffect는 명명된 함수로.

### 2. 데모 구현

1. `demo/src/demos/{skill-name}/`에 데모 페이지 작성 — `@skills` alias로 assets/ 컴포넌트를 import해 렌더링한다.
2. `demo/src/demos/index.ts`의 데모 레지스트리에 등록한다(라우팅·목록은 레지스트리가 단일 출처).
3. 데모는 쇼케이스다: 트리거 버튼·리플레이 등 확인 장치는 데모 쪽에 두고, assets/ 컴포넌트를 데모 편의를 위해 오염시키지 않는다.
4. **데모 콘텐츠는 fe-skills 고유 브랜드(국수집 테마)로 쓴다** — 토스·당근·인스타그램 등 레퍼런스 앱의 실제 UI 문구·탭 이름·구성을 복제하지 않는다. 레퍼런스 언급은 SKILL.md의 "언제 쓰는가"(관례 설명)까지만.
5. 로직이 있는 부분(상태 전이·옵저버·제스처)은 테스트를 먼저 쓴다(Red→Green). 순수 시각 효과에 빈 테스트를 양산하지 않는다.

### 3. 게이트 검증 — 전부 통과해야 완료

| # | 게이트 | 명령/방법 |
|---|--------|----------|
| 1 | 빌드·린트·테스트 | `npm run build && npm run lint && npm test` (demo/) |
| 2 | 스킬 구조 | frontmatter name-디렉토리 일치, references/assets 링크 유효, description ~350자 |
| 3 | 브라우저 실동작 | 데모 페이지를 브라우저로 열어 스크린샷/녹화로 실제 동작 확인 |
| 4 | 모션 리뷰 | `fe-craft` 스킬로 이징·타이밍·reduced-motion 리뷰, 지적 반영 |

### 4. 종료

- 워크로그 기록(`docs` 스킬, `docs/templates/worklog.md` 형식).
- 커밋·PR은 사용자가 명시 요청한 경우에만 `pr` 스킬로(PR 베이스 main). 요청 없으면 "커밋은 직접 진행하세요"로 안내.
- 세션 중단·인계 시 `handoff` 스킬.

## 에러 핸들링

- 게이트 실패 → 수정 후 해당 게이트부터 재실행(전체 재시작 불필요).
- 모션 리뷰에서 설계 문서와 충돌하는 지적 → 임의 판단하지 말고 사용자 확인 후 설계 문서 먼저 갱신.
