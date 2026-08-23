# 스킬 3종 추가: sticky-header · carousel · story-progress

| 항목 | 내용 |
|------|------|
| 날짜 | 2026-08-22 |
| 작성 | Claude Code (add-skill 파이프라인) |
| 관련 경로 | `plugin/skills/{sticky-header,carousel,story-progress}/`, `demo/src/demos/`, `demo/src/tests/` |

## 1. 개요

로드맵 후반 3종을 구현했다(총 10종). **커밋·PR은 하지 않았다** — 사용자 육안 확인 대기. 배치 2(tab-indicator·bottom-sheet)와 리브랜딩도 함께 미커밋 상태다.

## 2. 작업내용

- **sticky-header** — 높이 애니메이션(레이아웃) 대신 "큰 제목은 콘텐츠로 두고 이탈을 IO로 감지 → 고정 헤더 컴팩트 제목 페이드 인" 구조. 코어 `observeHeaderCollapse.ts`(TDD 4건) + React 훅(제네릭 요소 타입).
- **carousel** — CSS scroll-snap이 스크롤·스냅 전담, JS는 활성 추적(IO 60%)과 도트 이동만. 코어 `carouselCore.ts`(TDD 6건).
- **story-progress** — rAF로 구간 막대 scaleX 구동(일시정지·재개·이동을 프레임 정확도로). 코어 `createStoryProgress.ts`(TDD 5건). reduced-motion에서도 진행 막대는 유지(상태 표시 — 문서에 사유 명시).
- **브라우저 검증 중 발견·수정 3건**:
  1. (carousel) 트랙 CSS `scroll-behavior: smooth` + snap mandatory 조합에서 크롬이 프로그램적 scrollTo/scrollLeft를 무시 → CSS smooth 제거, 코어가 rAF 보간으로 이동(이동 중 스냅 일시 해제, reduced-motion은 즉시 점프). SKILL.md에 금지 사항으로 명시.
  2. (carousel) 슬라이드 offsetLeft가 페이지 좌표로 나옴(offsetParent=BODY) → `.carousel-track { position: relative }` + snap-align: center에 맞는 중앙 정렬 목표 좌표 계산.
  3. (story 데모) `<button>`은 절대배치에서 top+bottom만으로 높이가 늘어나지 않음(폼 컨트롤 특례) → 명시 `height: calc(100% - 40px)`.
- 게이트: 빌드·린트·테스트 **58/58**, 구조 검증 3종 OK, 브라우저 실동작(헤더 전환 중간 프레임·도트 이동/복귀·스토리 재생/탭 이동, 콘솔 에러 0), 모션 리뷰 통과.

## 3. 주의사항

- **커밋 안 됨** — 배치 2 + 리브랜딩 + 배치 3이 `feat/skills-batch-1` 워킹 트리에 누적. 확인 후 커밋 시 배치별 분리 권장.
- **자동화 검증 시 탭 스로틀링 주의** — 백그라운드 탭에서는 rAF·타이머가 멈춰 rAF 기반 애니메이션이 죽은 것처럼 보인다. 브라우저 게이트는 반드시 탭 활성 상태(스크린샷 경유)에서 판정할 것.
- carousel 자동재생·story 배경 콘텐츠 프리로드는 스킬 범위 밖(문서 명시).
