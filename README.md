# fe-skills

프론트엔드 애니메이션/UI/UX 구현 스킬 저장소입니다. AI 에이전트에게 코딩을 맡길 때, 에이전트가 이 스킬을 읽고 검증된 패턴으로 애니메이션을 구현합니다. 각 스킬은 **사용 방법·예시 코드**와 함께 **사람이 눈으로 확인할 수 있는 라이브 데모**를 제공합니다.

## 데모

https://guksu.github.io/fe-skills/

## 설치 (Claude Code)

```
/plugin marketplace add Guksu/fe-skills
/plugin install fe-skills@fe-skills
```

## 스킬 목록

| 스킬 | 설명 | 데모 |
|------|------|------|
| [enter-exit](plugin/skills/enter-exit/SKILL.md) | 진입/퇴장 애니메이션 — 모달·토스트의 나타남/사라짐 전환(퇴장까지 CSS로) | [보기](https://guksu.github.io/fe-skills/#/enter-exit) |
| [scroll-reveal](plugin/skills/scroll-reveal/SKILL.md) | 스크롤 리빌 — 뷰포트 진입 시 콘텐츠 순차 공개 | [보기](https://guksu.github.io/fe-skills/#/scroll-reveal) |
| [skeleton](plugin/skills/skeleton/SKILL.md) | 스켈레톤 시머 — 로딩 뼈대 + 반짝임(CSS-only) | [보기](https://guksu.github.io/fe-skills/#/skeleton) |
| [count-up](plugin/skills/count-up/SKILL.md) | 숫자 카운트업 — 잔액·지표가 목표값까지 굴러 올라감 | [보기](https://guksu.github.io/fe-skills/#/count-up) |
| [like-pop](plugin/skills/like-pop/SKILL.md) | 좋아요 팝 + 더블탭 하트 버스트 | [보기](https://guksu.github.io/fe-skills/#/like-pop) |
| [tab-indicator](plugin/skills/tab-indicator/SKILL.md) | 탭 인디케이터 슬라이드 — 밑줄이 미끄러져 이동 | [보기](https://guksu.github.io/fe-skills/#/tab-indicator) |
| [bottom-sheet](plugin/skills/bottom-sheet/SKILL.md) | 바텀시트 — 드래그로 끌어내려 닫기(라이브러리 0) | [보기](https://guksu.github.io/fe-skills/#/bottom-sheet) |
| [sticky-header](plugin/skills/sticky-header/SKILL.md) | 스티키 헤더 전환 — 큰 제목이 나가면 컴팩트 제목 페이드 인 | [보기](https://guksu.github.io/fe-skills/#/sticky-header) |
| [carousel](plugin/skills/carousel/SKILL.md) | 스냅 캐러셀 — CSS scroll-snap + 도트 내비게이션 | [보기](https://guksu.github.io/fe-skills/#/carousel) |
| [story-progress](plugin/skills/story-progress/SKILL.md) | 스토리 프로그레스 — 자동 재생·길게 눌러 멈춤·탭 이동 | [보기](https://guksu.github.io/fe-skills/#/story-progress) |
| [flip-list](plugin/skills/flip-list/SKILL.md) | 리스트 재배치(FLIP) — 정렬 시 항목이 미끄러져 이동 | [보기](https://guksu.github.io/fe-skills/#/flip-list) |
| [cart-fly](plugin/skills/cart-fly/SKILL.md) | 카트 플라이 — 상품이 장바구니로 포물선 비행 | [보기](https://guksu.github.io/fe-skills/#/cart-fly) |
| [pull-to-refresh](plugin/skills/pull-to-refresh/SKILL.md) | 당겨서 새로고침 — 고무줄 저항·스피너·복귀 | [보기](https://guksu.github.io/fe-skills/#/pull-to-refresh) |

## 구조

```
plugin/skills/{skill}/   스킬 정본 — SKILL.md(사용법) + assets/(예시 컴포넌트)
demo/                    데모 사이트(Vite+React) — assets/를 import해 렌더링만 한다
```

- **정본은 스킬 문서다.** 데모는 `plugin/skills/*/assets/`의 컴포넌트를 그대로 import한다(복사본 없음).
- 기술 기준: **CSS 우선** — CSS로 되는 것은 의존성 없이, 어려운 것만 라이브러리.
- 모든 스킬은 `prefers-reduced-motion`을 지원합니다.

## 개발

```bash
npm install
npm run dev    # 데모 개발 서버
npm test       # 단위 테스트
npm run build  # 배포 빌드
```
