# UI 스킬 2종 추가 — 배치 A 물리 코어: spring-physics · swipe-dismiss-viewer (momentum-drag는 실기기 실패로 제거)

| 항목 | 내용 |
|------|------|
| 날짜 | 2026-08-29 |
| 작성 | Claude (add-skill 파이프라인) |
| 관련 경로 | plugins/ui/skills/{spring-physics,swipe-dismiss-viewer}/ · demo/src/demos/(동일 2종)/ · demo/src/demos/index.ts · demo/src/tests/ · scripts/validateSkills.mjs · docs/plans/2026-08-29-advanced-skills-plan.md |

## 1. 개요

심화 스킬 플랜(`docs/plans/2026-08-29-advanced-skills-plan.md`, 후보 14종·4배치)에서 사용자가 배치 A를 선택했다. 설계 결정 3건(사용자 확정): rAF 스프링 + `linear()` 생성기 병행 / 공유 코어는 각 스킬 assets에 복사본 포함 / 브랜치 `feat/ui-physics-core`(origin/main 분기). 세 스킬은 의존 순서다 — 스프링 코어를 먼저 만들고, 관성 드래그가 경계 정착에, 뷰어가 열기/닫기/취소 복귀에 그 코어를 쓴다.

## 2. 작업내용

- **spring-physics** — `spring.ts`: 감쇠 조화진동 닫힌 해(under/critical/over 세 경우), `springState`(중앙 차분 속도·정착 판정), `springDuration`(16ms 스캔), `springToLinear`(CSS `linear()` 사전 샘플링 + duration). `animateSpring.ts`: rAF 재생, `retarget`(현재 위치·속도에서 재출발), `current`. `useSpring.ts`: 값을 state로 올리지 않는 훅(`to`/`set`/`get`). 정착 기준 기본값은 px용(0.1px·1px/s), `springToLinear`는 진행도용(0.001·0.01)을 내부 고정 — 처음 0.01px 기준이라 100px 복귀가 1104ms로 잡히던 것을 교정.
- **momentum-drag** — `momentumCore.ts`: iOS 러버밴드 공식 `(1−1/(d·c/D+1))·D`, 지수 감쇠 `v·e^(−t/τ)`(τ 0.325s), 투영. `createMomentumDrag.ts`: 포인터 추종 + 경계 밖 저항 + 놓으면 rAF 감쇠 → 경계 닿으면 스프링 인계, 드래그 시작 시 진행 중 모션 인터럽트, 놓기 전 80ms 정지면 속도 0. `MomentumDrag.tsx`: reduced-motion이면 τ 0.05·임계 스프링.
- **swipe-dismiss-viewer** — `dismissCore.ts`: 진행도/배율/닫기 판정(거리 120px 또는 800px/s)/가장자리 24px 무시/프레임 보간/`frameFromRect`(썸네일 FLIP). `createSwipeDismiss.ts`: 열기·취소·닫기가 전부 "현재 프레임→목표 프레임을 스프링 t로 보간"이라 어느 순간 끊어도 이어진다. `--dismiss-progress`로 배경 딤·크롬 페이드는 CSS 담당. `SwipeDismissViewer.tsx`: 마운트=열림, Esc·✕ 닫기.
- **공유 코어 검증** — `spring.ts`·`animateSpring.ts` 첫 줄에 `@shared-core {파일} origin: spring-physics` 헤더. `scripts/validateSkills.mjs`에 복사본↔원본 sha256 비교를 추가해 드리프트를 게이트에서 잡는다.
- **테스트(TDD)** — 6파일 27케이스 추가(springCore 7·animateSpring 4·momentumCore 5·momentumDrag 8·dismissCore 6·swipeDismiss 8). jsdom에 레이아웃이 없어 clientWidth/scrollWidth/getBoundingClientRect를 고정값으로 정의. 전체 39파일 **215테스트**.
- **데모 3종** — 스프링: 공 던지기(속도 이어받기) + 300ms ease-out 비교 고스트 + `linear()` 팝 버튼·프리셋 4종. 관성: 메뉴 카드 트랙(τ·감쇠 슬라이더). 뷰어: 국수공방 갤러리 6장(SVG 데이터 URL, 외부 이미지 없음).
- **게이트 결과** — ① build·lint·test 통과 ② validateSkills(해시 검사 포함) 통과 ③ 브라우저: 스프링 공 3프레임 궤적·`linear()` 720ms 적용 확인, 관성 트랙 드래그·러버밴드 수치 공식 일치(170.103px)·경계 복귀(243→0) 확인, 뷰어 열림→끌기 중 `scale 0.825`/배경 0.5→놓으면 썸네일 복귀·언마운트 확인, 콘솔 에러 0(합성 포인터의 `setPointerCapture` 예외는 try/catch로 방어) ④ 모션 리뷰(코드 기준): 이징·GPU 속성·reduced-motion 위반 없음. 스프링 정착 시간(기본 100px 720ms)은 duration 예산 규칙의 예외로 SKILL.md에 프리셋 표와 함께 명시.

### 실기기 피드백 반영 (2026-08-29)

- 사용자 실기기에서 **momentum-drag 카드가 안 움직임** 보고. 원인 추정: 터치를 포인터 이벤트로만 받아 브라우저의 pan 판정(`touch-action: pan-y`)·포인터 캡처에 의존 → 모바일에서 첫 움직임이 끊기거나 이벤트가 오지 않음. 실기기 검증이 끝난 pinch-zoom과 같은 **터치 이벤트 경로**(처음 6px 축 잠금, 우리 축이면 `touchmove` preventDefault(passive:false), 아니면 포기)를 추가하고 포인터 이벤트는 `pointerType !== 'touch'`만 처리하도록 분리. 테스트 3케이스 추가(가로 추종·세로 포기·터치 관성+포인터 중복 무시), 전체 **218테스트**. SKILL.md 기술 선택·주의사항 갱신.

### momentum-drag 제거 (2026-08-29)

- 터치 이벤트 경로를 추가한 뒤에도 사용자 실기기에서 카드가 움직이지 않아 **스킬을 통째로 제거**했다(정본·데모·테스트·레지스트리). 위 작업내용의 momentum-drag 항목은 이력으로 남긴다. 재도전 시 확인할 것: 실기기 원격 디버깅(Safari Web Inspector / chrome://inspect)으로 `touchstart`·`touchmove`가 뷰포트에 도달하는지, 데모 셸의 조상 요소에 `touch-action`·`pointer-events`·`overflow` 간섭이 있는지, iOS의 `-webkit-overflow-scrolling` 컨테이너 안인지. 스프링 코어 복사본 검사(`@shared-core`)는 swipe-dismiss-viewer가 계속 사용한다.

## 3. 주의사항

- **브라우저 확장 탭이 백그라운드면 rAF가 멈춘다** — 스프링·관성·데모 재생이 정지한 것처럼 보인다. 스크린샷 캡처가 프레임을 진행시키므로 연속 캡처로 확인했고, 정착 타이밍은 단위 테스트가 보장한다. 확장의 JS 도구는 격리 월드라 페이지 `requestAnimationFrame` 패치가 통하지 않는다.
- 데모 스크린샷 좌표는 CSS px와 배율이 다르다(dpr 2·창 스케일) — 드래그 거리로 수치를 검증할 땐 합성 이벤트를 쓴다.
- momentum-drag는 네이티브 스크롤이 되는 곳엔 쓰지 말 것(접근성·주소창 축소). 세로축은 페이지 스크롤과 경합.
- swipe-dismiss-viewer는 핀치줌과의 동시 사용(두 손가락 판별)을 포함하지 않았다. 썸네일이 화면 밖이면 `returnTo`가 null을 돌려주게 할 것.
- 실기기 검증은 하지 않았다 — 사용자 육안 확인 시 관성 느낌(τ)·뷰어 복귀 스프링을 실기기에서 봐 주면 좋다. dev 서버는 `*:5173`(`--host`)으로 떠 있다.
- 커밋·PR은 사용자 육안 확인 후 직접 또는 명시 요청 시 `pr` 스킬.
