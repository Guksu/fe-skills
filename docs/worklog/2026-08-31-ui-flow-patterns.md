# UI 스킬 4종 추가 — 흐름 패턴(로딩 버튼·무한 스크롤·순서 바꾸기·화면 전환)

| 항목 | 내용 |
|------|------|
| 날짜 | 2026-08-31 |
| 작성 | 에이전트 (add-skill 파이프라인) |
| 관련 경로 | `plugins/ui/skills/{loading-button,infinite-scroll,drag-to-reorder,page-transition}/`, `demo/src/demos/`, `demo/src/tests/`, `README.md` |

## 1. 개요

기존 UI 스킬 29종은 제스처와 개별 폼 컨트롤이 촘촘한 반면, **화면의 흐름**을 다루는 패턴이 비어 있었다. 사용자가 후보 4갈래(순서 조작·폼 제출 흐름·데이터 로딩 흐름·화면 전환)를 모두 선택해, 각 갈래에 하나씩 스킬을 추가했다. 브랜치는 기존 `feat/ui-*` 묶음 관례에 따라 `feat/ui-flow-patterns` 하나로 묶었다.

## 2. 작업내용

- `plugins/ui/skills/loading-button/` — 제출 버튼 진행 표시. `createAsyncAction.ts`(상태 기계: 진행 중 재실행 차단·최소 로딩 유지·결과 표시 유지) + `useAsyncAction.ts` + `LoadingButton.tsx` + CSS. 상태 레이어 4개를 grid 한 칸에 겹쳐 버튼 폭이 출렁이지 않게 했다.
- `plugins/ui/skills/infinite-scroll/` — 감시 요소(IntersectionObserver) 기반 다음 페이지 로딩. `createInfiniteScroll.ts`(중복 호출 차단·연쇄 로딩·실패 시 정지) + `useInfiniteScroll.ts` + CSS.
- `plugins/ui/skills/drag-to-reorder/` — 끌어서 순서 바꾸기. `createDragReorder.ts`(포인터 드래그·이웃 비키기·정착 후 커밋·방향키 이동) + `useDragReorder.ts` + CSS. 드래그 중 DOM 순서를 건드리지 않고 transform으로만 자리를 비운다.
- `plugins/ui/skills/page-transition/` — 화면 전환. `runPageTransition.ts`(View Transitions API + 방향 표시 + 미지원 폴백) + `usePageStack.ts`(화면 스택·스크롤 기억) + CSS. `:root`의 전환 이름을 끄고 `[data-page-view]`만 전환해 헤더·탭바가 제자리를 지킨다.
- 데모 4종(`demo/src/demos/{slug}/`)과 레지스트리(`demo/src/demos/index.ts`) 등록, README 카탈로그 4행·배지(fe-ui 33, tests 245) 갱신.
- 테스트 43건 추가(총 245건): `asyncActionCore`(7) `loadingButton`(5) `infiniteScrollCore`(9) `dragReorderCore`(12) `pageTransitionCore`(5) `pageStack`(5).
- 데모 공통 스타일 보정 — `.controls label.controls-inline`에 `flex-direction: row`를 추가했다. `.controls label`의 세로 배치가 이겨서 체크박스가 문구 위에 얹혀 있었다(기존 form-shake-error 등도 함께 고쳐진다).

### 게이트 결과

| 게이트 | 결과 |
|--------|------|
| 빌드·린트·테스트 | 통과 (245 tests) |
| 스킬 구조 검증 | 통과 |
| 브라우저 실동작 | loading-button·infinite-scroll·drag-to-reorder 육안 확인 완료. page-transition은 구조·API·스크롤 복원까지 확인, 슬라이드 연출은 미확인(아래) |
| 모션 리뷰(fe-craft) | 4건 발견·수정 후 통과 |

### 모션 리뷰에서 고친 것

- loading-button: 레이어 교차 총 시간 330ms → 290ms(예산 300ms 초과), 누름 피드백을 상태 전환과 분리해 140ms로.
- loading-button: 두 문구가 반쯤 겹쳐 뭉개지던 크로스페이드를 "나감 90ms → 들어옴 200ms" 순차로.
- infinite-scroll: 새 항목 등장 320ms → 260ms, 한 페이지가 통째로 뜨던 것을 `--infinite-item-order` 기반 40ms 스태거로.

## 3. 주의사항

- **page-transition의 슬라이드 연출은 육안 확인이 남아 있다.** 자동화 중 Chrome 창이 백그라운드였고(`document.visibilityState === 'hidden'`), 브라우저는 보이지 않는 문서의 View Transition을 통째로 건너뛴다. API 지원·CSS 규칙 파싱(8건)·`view-transition-name` 적용(root=none, view=page)·push/back·스크롤 복원(76.5 → 0 → 76.5)까지는 실제 브라우저에서 확인했다. `npm run dev`로 창을 띄운 상태에서 한 번 눌러 보면 된다.
- **page-transition의 커스터마이즈 변수는 `:root`에 선언해야 한다.** `::view-transition-*` 가상 요소는 전환되는 요소가 아니라 문서 루트에 붙는다 — 컨테이너에 선언하면 조용히 무시된다(데모에서 실제로 발생해 수정했다). SKILL.md 주의사항에 명시했다.
- **page-transition CSS는 `:root { view-transition-name: none }`이라는 전역 선언을 포함한다.** 의도된 것이지만(전환 범위를 컨테이너로 좁히는 수단), 같은 문서에서 전체 페이지 전환을 쓰려는 프로젝트와는 충돌한다.
- drag-to-reorder는 항목 간 간격이 균일하다고 가정하고(첫 두 항목 사이로 측정), 가로 목록·드래그 중 자동 스크롤은 범위 밖이다.
- 커밋·PR은 사용자가 직접 진행한다.
