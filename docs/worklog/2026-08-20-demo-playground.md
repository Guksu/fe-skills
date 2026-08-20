# 데모 플레이그라운드 재구성 (enter-exit·scroll-reveal)

| 항목 | 내용 |
|------|------|
| 날짜 | 2026-08-20 |
| 작성 | Claude Code (add-skill 파이프라인) |
| 관련 경로 | `demo/src/demos/`, `demo/src/styles.css` |

## 1. 개요

첫 배포 확인 후 사용자 피드백 3건을 반영했다: ① 카드 등장 시 부모(stage) 높이가 변해 레이아웃이 흔들림 ② 페이드와 스케일의 차이가 체감되지 않음 ③ 속도·옵션을 데모에서 직접 조절할 수 있어야 함. 정본(assets)은 이미 CSS 변수로 커스터마이즈를 지원하므로 데모만 수정했다 — 정본 무변경.

## 2. 작업내용

- `demo/src/demos/enter-exit/EnterExitDemo.tsx` — 컨트롤 패널 추가: 지속 시간(100~800ms)·이징(커스텀 cubic-bezier 4종 select)·이동 거리·시작 배율 슬라이더. CSS 변수(`--fx-*`)로 주입하고 `timeoutMs`는 duration+100으로 연동. 스케일 데모 기본값 0.95→0.9(체감 개선, 권장 범위 0.9~0.97 내). 권장값 안내 문구 포함.
- `demo/src/demos/enter-exit/enter-exit-demo.css` — **stage를 `min-height`→고정 `height: 160px`(+overflow hidden)로 변경** — 카드가 나타나고 사라져도 주변 레이아웃이 밀리지 않는다(피드백 ①).
- `demo/src/demos/scroll-reveal/ScrollRevealDemo.tsx` — 컨트롤 패널 추가: 지속 시간·이동 거리(CSS 변수)·연쇄 간격(delayMs)·공개 시점(threshold, 옵저버 재등록으로 즉시 반영). 리플레이 버튼과 조합.
- `demo/src/styles.css` — 데모 공통 `.controls` 패널 스타일(그리드·range·select·output).
- 게이트: 빌드·린트·테스트 22/22 통과, 브라우저 확인(슬라이더 실효·레이아웃 픽셀 고정·콘솔 에러 0).

## 3. 주의사항

- 컨트롤 패널은 데모 전용 장치다 — 정본 assets에는 어떤 데모 편의 코드도 넣지 않았다(오염 금지 원칙).
- 컨트롤이 노출하는 변수 이름은 SKILL.md 커스터마이즈 표와 1:1로 맞춰져 있다 — 변수를 추가·개명하면 두 곳을 함께 갱신할 것.
- 슬라이더 범위는 비교 실험을 위해 권장 범위 밖(예: 800ms, scale 0.5)도 허용한다 — 권장값은 패널 하단 문구가 안내한다.
