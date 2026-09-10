# UI 스킬 4종 추가 — 드롭다운 메뉴·범위 슬라이더·수량 스테퍼·파일 업로드

| 항목 | 내용 |
|------|------|
| 날짜 | 2026-09-03 |
| 작성 | 에이전트 (add-skill 파이프라인) |
| 관련 경로 | `plugins/ui/skills/{dropdown-menu,range-slider,quantity-stepper,file-upload}/`, `demo/src/demos/`, `demo/src/tests/`, `README.md` |

## 1. 개요

PR #16·#17로 흐름 패턴과 인증·테마·검색·성능을 채운 뒤 세 번째 배치다. 남아 있던 **선택·입력 계열**(메뉴·범위·수량)과 **파일 다루기**에 하나씩 채웠다. fe-ui 37 → 41종.

## 2. 작업내용

- `plugins/ui/skills/dropdown-menu/` — ⋯ 액션 메뉴. `placeMenu.ts`(순수 위치 계산: 아래가 좁으면 위로 뒤집고, 좌우로 넘치면 화면 안으로 밀어 넣음) + `createMenu.ts`(로빙 포커스·첫 글자 점프·바깥 누름/Esc/Tab 닫기·스크롤 추종) + `DropdownMenu.tsx` + CSS. select(listbox)와 ARIA 패턴이 다르다는 점을 SKILL.md에 표로 구분했다.
- `plugins/ui/skills/range-slider/` — 두 손잡이 범위 슬라이더. `rangeValues.ts`(눈금·경계·교차·겹침 판정) + `RangeSlider.tsx` + CSS. **네이티브 `input[type=range]` 두 개를 겹쳐** 키보드·스크린 리더·터치를 그대로 쓴다. 교차 시 상대를 밀지 않고 움직인 쪽이 멈춘다.
- `plugins/ui/skills/quantity-stepper/` — 장바구니 수량 − / +. `createHoldRepeat.ts`(길게 누르면 가속 반복 — 수량 외에도 쓸 수 있는 범용 코어) + `QuantityStepper.tsx` + CSS. 수량 1에서 −를 삭제로 잇는 `onBelowMin`을 뒀다.
- `plugins/ui/skills/file-upload/` — 끌어다 놓기 업로드. `validateFiles.ts`(형식·용량·개수와 거절 사유) + `createDropZone.ts`(끌기 깊이 세기·기본 동작 차단) + `FileDropZone.tsx`(미리보기·진행률·지우기) + CSS. 업로드 자체는 범위 밖으로 두고 진행률은 값으로 받는다.
- 데모 4종과 레지스트리 등록, README 카탈로그 4행·배지(fe-ui 41, tests 371)·목차 제목 갱신.
- 테스트 66건 추가(총 371건): `placeMenu`(8) `dropdownMenu`(11) `rangeValues`(11) `rangeSlider`(6) `holdRepeatCore`(6) `quantityStepper`(9) `validateFiles`(7) `dropZoneCore`(8).

### 테스트가 잡은 버그 3건 (quantity-stepper)

작성 직후 테스트에서 드러나 고쳤다 — 모두 눈으로는 알아채기 어려운 것들이다.

1. **빠른 반복에서 값이 한 번만 올랐다.** React가 여러 변경을 묶어 처리하면 그동안의 반복이 모두 같은 값에서 출발한다. 다음 값을 즉시 기록한 뒤 알리도록 고쳤다.
2. **눈금 밖 상한이 나왔다.** 눈금에 맞춘 뒤 범위로 가두면 `step=2`인데 20이 되는 식으로 눈금에 없는 값이 남는다. 순서를 뒤집었다(가두기 → 눈금).
3. **빈 입력이 0으로 읽혔다.** `Number('')`는 0이라, "곱빼기"처럼 숫자가 없는 입력이 최솟값으로 튀었다.

### 게이트 결과

| 게이트 | 결과 |
|--------|------|
| 빌드·린트·테스트 | 통과 (371 tests) |
| 스킬 구조 검증 | 통과 |
| 브라우저 실동작 | 4종 확인 — 메뉴 아래→위 뒤집기, 슬라이더 교차 정지(10,000~10,000)·겹친 상태에서 왼쪽 끌기·트랙 클릭, 파일 드롭(2장 수락 + PDF/4MB 거절 사유 표시) |
| 모션 리뷰(fe-craft) | 2건 발견·수정 후 통과 |

### 모션 리뷰에서 고친 것

레이아웃 속성을 애니메이션하던 두 곳을 바꿨다(모션 기준 7: transform·opacity만).

- range-slider: 채움을 별도 요소의 `left`/`right`로 그리던 것을 **트랙의 그라디언트 경계**로 바꿨다 — 드래그 매 프레임의 레이아웃 재계산이 그리기만으로 줄고 요소도 하나 줄었다.
- file-upload: 진행 막대를 `width` 전이에서 **`transform: scaleX`**로 바꿨다. 둥근 모서리는 부모가 `overflow: hidden`으로 잘라 내므로 눌릴 걱정이 없다.

## 3. 주의사항

- **quantity-stepper의 "길게 누르면 가속"은 육안 확인이 남아 있다.** 자동화 중 크롬 창이 백그라운드였고, 그때 브라우저는 타이머를 초당 20회에서 2회로 억제한다(실측). 가속 규칙 자체는 `holdRepeatCore` 테스트가 가짜 타이머로 고정하고 있다.
- **file-upload은 업로드를 하지 않는다.** 진행률은 값으로 받아 그리기만 하며, SKILL.md에 XHR로 진행 이벤트를 잇는 예시를 넣었다(`fetch`로는 요청 본문의 진행률을 알 수 없다).
- **클라이언트 파일 검증은 UX이지 보안이 아니다** — 서버에서 다시 검사해야 한다는 점을 SKILL.md 주의사항에 명시했다.
- **dropdown-menu는 하위 메뉴를 다루지 않는다.** 필요해지면 메뉴가 아니라 화면 구조를 다시 볼 시점인 경우가 많다는 판단을 문서에 남겼다.
- range-slider는 손잡이 두 개·가로 배치만 다룬다. 셋 이상이거나 세로면 직접 그려야 하고, 그때는 키보드·스크린 리더 대응을 처음부터 만들어야 한다.
- 커밋·PR은 사용자가 직접 진행한다.
