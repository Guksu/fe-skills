# UI 스킬 4종 추가 — modal-dialog · checkbox-radio · form-shake-error · swipe-to-delete

| 항목 | 내용 |
|------|------|
| 날짜 | 2026-08-28 |
| 작성 | Claude (add-skill 파이프라인) |
| 관련 경로 | plugins/ui/skills/{modal-dialog,checkbox-radio,form-shake-error,swipe-to-delete}/ · demo/src/demos/(동일 4종)/ · demo/src/demos/index.ts · demo/src/tests/ |

## 1. 개요

"다음 애니메이션 스킬" 요청으로 후보 4종을 제안했고 사용자가 전부 선택했다. 브랜치는 `feat/ui-dialog-forms-swipe` — 아직 머지되지 않은 `feat/ui-basic-controls`에서 분기했다('컨트롤' 카테고리 재사용, 사용자 승인). 넷 다 CSS 우선 원칙(라이브러리 0)이며, 제스처(swipe)와 흔들림 재시작(shake)만 프레임워크 무관 TS 코어로 분리했다.

## 2. 작업내용

- **modal-dialog** — 네이티브 `<dialog>.showModal()` 기반(포커스 트랩·배경 inert·Esc·포커스 복귀는 브라우저 몫). 진입은 transition이 아닌 **animation**(display 전환 순간 transition 불가), 닫힘은 `data-closing` 애니메이션 뒤 `close()`(animationend + 500ms 폴백). `cancel` 이벤트를 preventDefault해 Esc도 onClose 경유. 백드롭 판정은 `event.target === dialog`(padding을 `.modal-body`에 둔 이유). reduced-motion은 100ms 페이드 유지(애니메이션 0이면 닫힘 훅이 안 온다).
- **checkbox-radio** — 네이티브 input 시각 숨김 + SVG 체크마크 `stroke-dashoffset` 드로잉(박스 채움보다 30% 지연 시작, 해제는 절반 시간), 라디오 도트 오버슈트 스케일. `Checkbox.tsx`·`Radio.tsx`가 나머지 props를 input에 전달.
- **form-shake-error** — `shakeCore.ts`: `data-shake` 부착 + animationend 해제, 재호출 시 속성 제거→강제 리플로우→재부착으로 **재시작 보장**. 감쇠 translateX 키프레임(400ms), `[aria-invalid]` 테두리 이중 신호, `FieldError`(grid 0fr↔1fr + role=alert). `useShake` 훅으로 ref·트리거 제공.
- **swipe-to-delete** — `createSwipeDelete.ts`: 처음 6px 방향으로 축 잠금(세로면 포기, `touch-action: pan-y`와 한 쌍), 놓을 때 열림(절반 이상·왼쪽 튕김)/닫힘/끝까지 밀어 삭제(액션 폭 2.5배·0.8px/ms) 3갈래 판정, swipedOut 후 open/close 무시. `SwipeToDelete.tsx`: 삭제는 내용 이탈→높이 측정값 고정→0 접힘→transitionend(height)에 onDelete(600ms 폴백). 삭제 버튼은 항상 DOM에 있고 포커스 시 행이 열린다.
- **테스트(TDD)** — 6파일 27케이스 추가(modal·checkboxRadio·shakeCore·shakeField·swipeDeleteCore·swipeToDelete). jsdom에 showModal/close·TransitionEvent가 없어 프로토타입 스텁·propertyName 수동 정의로 대체. 전체 31파일 **164테스트**.
- **데모 4종 + 레지스트리** — 국수공방 테마. 카테고리: modal→등장과 전환, checkbox-radio→컨트롤, form-shake-error→피드백, swipe-to-delete→제스처.
- **게이트 결과** — ① build·lint·test 통과 ② validateSkills 통과 ③ 브라우저 실동작: 모달 열림/Esc/포커스 복귀, 체크·라디오 배타 선택, 제출 실패 흔들림+alert 2건+포커스 이동, 스와이프 열림(-88px)·버튼 삭제·합계 갱신, 콘솔 에러 0 ④ fe-craft 모션 리뷰 — 모달 퇴장 `ease-in`→ease-out 커브(UI ease-in 금지)로 교정, shake 400ms·grid/height 전이는 사유 명시로 유지.
- **브라우저 게이트에서 잡은 결함** — 행 높이가 소수 px(54.39)일 때 행 아래 깔린 빨간 배경이 경계 안티앨리어싱 틈으로 1px 비침 → 액션 영역을 `.swipe-content` 안 오른쪽 바깥(`left: 100%`)으로 옮겨 내용과 함께 움직이게 구조 변경(정본 CSS·TSX·SKILL.md 순수 JS 마크업 동기 수정). 수정 후 게이트 전체 재통과.

## 3. 주의사항

- **modal-dialog는 페이지 스크롤 잠금 미포함** — 배경은 inert지만 스크롤은 된다(`body:has(dialog[open]) { overflow: hidden }` 안내). 첫 포커스는 브라우저가 첫 포커스 가능 요소에 주므로 안전 버튼을 앞에 둘 것.
- **checkbox `stroke-dasharray: 24`는 제공 path 길이 기준** — path 변경 시 값 재조정 필요. indeterminate 미포함.
- **shake의 animationend 해제는 탭이 hidden이면 지연된다**(Chrome이 백그라운드 탭에서 애니메이션 이벤트 보류) — 브라우저 검증 중 관찰. 남은 `data-shake`는 다음 `shake()`가 걷어내므로 무해하나, 필요 시 duration 기반 폴백 타이머 추가가 확장 후보.
- **swipe-to-delete는 단일 행 단위** — "한 번에 한 행만 열림" 조율은 부모 몫(코어 반환값 `close()`). 데스크톱 발견성이 낮아 호버 삭제 경로 병행 권장. Vite HMR로 컴포넌트가 교체되면 코어가 옛 요소에 묶여 드래그가 죽을 수 있다(새로고침으로 해소, 런타임 결함 아님).
- 데모 전역 `button` 스타일이 `.swipe-action`에 묻지 않도록 데모 CSS에서 되돌림 — 스킬 assets는 오염시키지 않았다.
- 커밋·PR은 사용자 육안 확인 후 직접(CLAUDE.md 규칙). dev 서버가 localhost:5173에 떠 있다(백그라운드 nohup).
