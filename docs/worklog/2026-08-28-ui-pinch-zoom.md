# UI 스킬 추가 — pinch-zoom (피드 핀치줌)

| 항목 | 내용 |
|------|------|
| 날짜 | 2026-08-28 |
| 작성 | Claude (add-skill 파이프라인) |
| 관련 경로 | plugins/ui/skills/pinch-zoom/ · demo/src/demos/pinch-zoom/ · demo/src/demos/index.ts · demo/src/tests/{pinchCore,pinchZoom}.test.ts |

## 1. 개요

"인스타그램 피드에서 핀치줌하면 그 자리에서 사진이 커지는 기능"을 난이도 높인 다음 과제로 요청받아 `pinch-zoom` 스킬로 구현했다. 브랜치 `feat/ui-pinch-zoom`은 미머지 PR #10(`feat/ui-dialog-forms-swipe`) 위에서 분기했다(데모 레지스트리 충돌 회피, 사용자 승인). 관례 정의: 두 손가락 중점이 확대 원점, 손가락 이동을 따라 평행이동, 배경 딤, 손을 떼면 제자리 복귀(확대 유지 없음). 기존 `zoom-lightbox`(탭→확대 고정)와는 다른 패턴이라 신규로 판단했다.

## 2. 작업내용

- **pinchCore.ts** — DOM 없는 순수 계산: `distance`·`midpoint`·`computePinch`(거리 비율=배율, 중점 이동=평행이동, min 1~max 4 클램프, 시작 거리 0 가드)·`dimProgress`(dimAtScale에서 최대 딤).
- **createPinchZoom.ts** — 터치 이벤트 코어. 두 손가락 `touchstart`에서 시작 중점을 `transform-origin`으로 잡고 transition을 끈 뒤 `touchmove`마다 인라인 transform·`--pinch-progress`를 쓴다. 두 손가락 `touchmove`만 `preventDefault`(passive:false — 페이지 확대 차단), 한 손가락은 무시(`touch-action: pan-y`로 세로 스크롤 유지). 상태는 래퍼 `data-zooming` 하나: `active`(추종) → `settling`(복귀 전이) → 제거(transitionend + 500ms 폴백, 움직임 없으면 즉시). 포인터 이벤트 대신 터치 이벤트를 쓴 이유(브라우저의 두 손가락 가로채기→pointercancel)를 SKILL.md에 명시.
- **pinch-zoom.css** — 복귀 전이 300ms ease-out 커브, `[data-zooming]`에서 z-index 승격(`--pinch-z`), 고정 배경 딤(`--pinch-progress × --pinch-dim`, active 중 즉시·settling 중 페이드), reduced-motion은 추종 유지·복귀/딤 페이드만 즉시.
- **PinchZoom.tsx** — 자식을 `.pinch-target`으로 감싸고 백드롭을 붙이는 래퍼. 배율을 React state로 올리지 않는다(매 touchmove 렌더 회피), `onChange`로만 통지.
- **테스트(TDD)** — 2파일 13케이스: 순수 계산 5, 코어 8(한 손가락 무시·origin·preventDefault·추종 transform·settling→해제·폴백 타이머·무이동 즉시 해제·한 손가락 이탈 복귀·destroy). jsdom에 TouchEvent가 없어 `touches`만 얹은 일반 이벤트로 대체. 전체 33파일 **177테스트**.
- **데모** — 국수공방 피드 3장(그라디언트 사진). 데스크톱 확인용 "핀치 제스처 재생" 버튼이 합성 터치 이벤트를 코어에 흘린다(벌리기→이동→놓기 1.6s, rAF) — 스킬 assets는 건드리지 않음. 카테고리 '제스처'.
- **게이트 결과** — ① build·lint·test 통과 ② validateSkills 통과 ③ 브라우저: 재생 중 사진 3.17× 제자리 확대·origin 중점·백드롭 0.8·z-index 50 확인, 놓은 뒤 transform/origin/progress 초기화·data-zooming 제거·상태 문구 갱신, 콘솔 에러 0 ④ fe-craft 모션 리뷰 — 상시 `will-change: transform`을 `[data-zooming]` 중으로 한정(피드 전체 레이어 메모리 회피). 이징·타이밍·GPU 속성·reduced-motion 위반 없음.

## 3. 주의사항

- **조상 `overflow: hidden`·`transform`·`filter` 금지** — 확대된 사진이 잘리거나 형제 카드 위로 못 올라오고 고정 백드롭이 어긋난다. 둥근 모서리는 사진 자신에 준다(SKILL.md 명시, 데모도 그렇게 구성).
- 데모 재생 버튼은 `requestAnimationFrame` 기반이라 **백그라운드 탭에서는 멈춘다**(브라우저 정상 동작) — 브라우저 게이트 중 관찰. 복귀 경로는 JS로 `touchend`를 흘려 폴백 타이머로 확인했고, transitionend 경로는 단위 테스트가 보장한다.
- 실기기 두 손가락 검증은 못 했다(에뮬레이터·합성 이벤트 기준). 사용자 육안 확인 시 모바일에서 한 손가락 스크롤 공존·페이지 확대 차단을 함께 봐 주면 좋다.
- 핀치 중 스크롤은 preventDefault로 막힌다 — 이를 빼면 페이지 확대와 사진 확대가 동시에 일어난다(SKILL.md 주의사항).
- 커밋·PR은 사용자 육안 확인 후 직접 또는 명시 요청 시 `pr` 스킬. dev 서버는 localhost:5173에 떠 있다.
