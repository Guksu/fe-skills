# fe-skills

프론트엔드 스킬 저장소입니다 — 플러그인 2개로 구성됩니다. AI 에이전트에게 코딩을 맡길 때, 에이전트가 이 스킬을 읽고 검증된 패턴으로 구현·설계합니다.

| 플러그인 | 내용 |
|----------|------|
| **fe-ui** | 애니메이션/UI/UX 구현 스킬 — 사용 방법·예시 코드 + 라이브 데모 |
| **fe-system** | 프론트엔드 시스템 설계 스킬 — 케이스별 트레이드오프 문서 + 문답 기반 추천 |

## 데모

https://guksu.github.io/fe-skills/

## 설치 (Claude Code)

```
/plugin marketplace add Guksu/fe-skills
/plugin install fe-ui@fe-skills        # UI/애니메이션
/plugin install fe-system@fe-skills    # 시스템 설계
```

## 스킬 목록 — fe-ui (16종)

| 스킬 | 설명 | 데모 |
|------|------|------|
| [enter-exit](plugins/ui/skills/enter-exit/SKILL.md) | 진입/퇴장 애니메이션 — 모달·토스트의 나타남/사라짐 전환(퇴장까지 CSS로) | [보기](https://guksu.github.io/fe-skills/#/enter-exit) |
| [scroll-reveal](plugins/ui/skills/scroll-reveal/SKILL.md) | 스크롤 리빌 — 뷰포트 진입 시 콘텐츠 순차 공개 | [보기](https://guksu.github.io/fe-skills/#/scroll-reveal) |
| [skeleton](plugins/ui/skills/skeleton/SKILL.md) | 스켈레톤 시머 — 로딩 뼈대 + 반짝임(CSS-only) | [보기](https://guksu.github.io/fe-skills/#/skeleton) |
| [count-up](plugins/ui/skills/count-up/SKILL.md) | 숫자 카운트업 — 잔액·지표가 목표값까지 굴러 올라감 | [보기](https://guksu.github.io/fe-skills/#/count-up) |
| [like-pop](plugins/ui/skills/like-pop/SKILL.md) | 좋아요 팝 + 더블탭 하트 버스트 | [보기](https://guksu.github.io/fe-skills/#/like-pop) |
| [tab-indicator](plugins/ui/skills/tab-indicator/SKILL.md) | 탭 인디케이터 슬라이드 — 밑줄이 미끄러져 이동 | [보기](https://guksu.github.io/fe-skills/#/tab-indicator) |
| [bottom-sheet](plugins/ui/skills/bottom-sheet/SKILL.md) | 바텀시트 — 드래그로 끌어내려 닫기(라이브러리 0) | [보기](https://guksu.github.io/fe-skills/#/bottom-sheet) |
| [sticky-header](plugins/ui/skills/sticky-header/SKILL.md) | 스티키 헤더 전환 — 큰 제목이 나가면 컴팩트 제목 페이드 인 | [보기](https://guksu.github.io/fe-skills/#/sticky-header) |
| [carousel](plugins/ui/skills/carousel/SKILL.md) | 스냅 캐러셀 — CSS scroll-snap + 도트 내비게이션 | [보기](https://guksu.github.io/fe-skills/#/carousel) |
| [story-progress](plugins/ui/skills/story-progress/SKILL.md) | 스토리 프로그레스 — 자동 재생·길게 눌러 멈춤·탭 이동 | [보기](https://guksu.github.io/fe-skills/#/story-progress) |
| [flip-list](plugins/ui/skills/flip-list/SKILL.md) | 리스트 재배치(FLIP) — 정렬 시 항목이 미끄러져 이동 | [보기](https://guksu.github.io/fe-skills/#/flip-list) |
| [cart-fly](plugins/ui/skills/cart-fly/SKILL.md) | 카트 플라이 — 상품이 장바구니로 포물선 비행 | [보기](https://guksu.github.io/fe-skills/#/cart-fly) |
| [pull-to-refresh](plugins/ui/skills/pull-to-refresh/SKILL.md) | 당겨서 새로고침 — 고무줄 저항·스피너·복귀 | [보기](https://guksu.github.io/fe-skills/#/pull-to-refresh) |
| [press-feedback](plugins/ui/skills/press-feedback/SKILL.md) | 프레스 피드백 — 눌림 스케일+스프링 복귀(CSS-only) | [보기](https://guksu.github.io/fe-skills/#/press-feedback) |
| [toast-stack](plugins/ui/skills/toast-stack/SKILL.md) | 토스트 스택 — 알림이 쌓이고 각자 소멸 | [보기](https://guksu.github.io/fe-skills/#/toast-stack) |
| [zoom-lightbox](plugins/ui/skills/zoom-lightbox/SKILL.md) | 확대 전환 라이트박스 — 썸네일이 중앙으로 커지는 공유 요소 전환 | [보기](https://guksu.github.io/fe-skills/#/zoom-lightbox) |

## 스킬 목록 — fe-system

문서+문답 기반 설계 스킬 (준비 중 — 첫 스킬 추가 예정)

## 구조

```
plugins/ui/skills/{skill}/      fe-ui 정본 — SKILL.md(사용법) + assets/(예시 컴포넌트)
plugins/system/skills/{skill}/  fe-system 정본 — SKILL.md(문답 절차) + references/(설계 문서)
demo/                           데모 사이트(Vite+React) — UI 스킬만 노출, assets를 import해 렌더링만 한다
```

- **정본은 스킬 문서다.** 데모는 `plugins/ui/skills/*/assets/`의 컴포넌트를 그대로 import한다(복사본 없음).
- 기술 기준: **CSS 우선** — CSS로 되는 것은 의존성 없이, 어려운 것만 라이브러리.
- 모든 UI 스킬은 바닐라 코어(.ts, 의존성 0) + React 래퍼 2층이며 `prefers-reduced-motion`을 지원합니다.

## 개발

```bash
npm install
npm run dev    # 데모 개발 서버
npm test       # 단위 테스트
npm run build  # 배포 빌드
```
