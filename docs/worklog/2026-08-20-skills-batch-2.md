# 스킬 2종 추가: tab-indicator · bottom-sheet

| 항목 | 내용 |
|------|------|
| 날짜 | 2026-08-20 |
| 작성 | Claude Code (add-skill 파이프라인) |
| 관련 경로 | `plugin/skills/{tab-indicator,bottom-sheet}/`, `demo/src/demos/`, `demo/src/tests/` |

## 1. 개요

로드맵 4·5번(탭 인디케이터 슬라이드, 바텀시트)을 구현했다. 바텀시트는 제스처가 필요한 첫 스킬로, 라이브러리 없이 포인터 이벤트 직접 구현을 택했다 — "복사해 쓰는 스킬에 의존성을 들이지 않는다"는 저장소 철학, JS는 판정만 하고 이동은 CSS transition이 담당하는 분업. **커밋·PR은 하지 않았다** — 사용자 육안 확인 대기.

## 2. 작업내용

- **tab-indicator** — 코어 `moveTabIndicator.ts`: 활성 탭의 offsetLeft/offsetWidth를 인디케이터(폭 1px)의 `translateX + scaleX`로 적용 — left/width 애니메이션(레이아웃) 대신 transform(GPU)만. `immediate` 옵션으로 첫 배치의 가짜 슬라이드 방지. React 훅 `useTabIndicator.ts`(첫 배치 immediate + ResizeObserver 재측정). TDD 3건. reduced-motion은 즉시 점프.
- **bottom-sheet** — 코어 `createSheetDrag.ts`: pointerdown/move/up으로 드래그 추적(위 방향 클램프), 놓는 순간 거리(120px)·속도(0.5px/ms) 판정 → 닫기/스냅백. 드래그 중 transition off, 놓으면 CSS가 이동 처리(닫기는 rAF 한 프레임 뒤 인라인 transform 정리로 현재 위치→화면 밖 연속 이동). TDD 7건. `bottom-sheet.css`: 시트를 언마운트하지 않고 data-open 토글(닫힘 애니메이션 공짜), 드로어 커브 cubic-bezier(0.32,0.72,0,1), touch-action: none, reduced-motion 페이드 완화. React `BottomSheet.tsx`: 드래그+백드롭 클릭+Esc 3경로 닫기, body 스크롤 잠금, role=dialog.
- **브라우저 검증 중 발견·수정**: 드래그 시 시트 안 텍스트가 선택되는 부작용 → 코어가 드래그 중 `selectstart`를 preventDefault(테스트 추가, 총 44건).
- 게이트: 빌드·린트·테스트 **44/44**, 구조 검증 OK, 브라우저 실동작(인디케이터 폭 다른 탭 간 이동·시트 열림/스냅백/드래그 닫힘, 콘솔 에러 0), 모션 리뷰 통과.

## 3. 주의사항

- **커밋 안 됨** — `feat/skills-batch-1` 브랜치에 배치 1(커밋됨) 위 워킹 트리 상태.
- 바텀시트 미포함 기능(스킬 문서에 명시): 포커스 트랩, iOS 고무줄 스크롤 완전 차단, 다중 스냅 포인트 — 필요 시 확장.
- 시트 내부에 스크롤 콘텐츠를 넣을 때는 `handle` 옵션으로 드래그 영역을 핸들로 한정해야 한다(제스처 충돌).
- 탭 인디케이터는 scaleX 방식이라 둥근 모서리·그라데이션 장식과는 안 맞는다(늘어나 보임) — 문서에 명시.
