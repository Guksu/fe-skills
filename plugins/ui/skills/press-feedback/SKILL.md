---
name: press-feedback
description: 버튼·카드가 눌리는 순간 움츠러들었다 스프링처럼 복귀하는 프레스 피드백(CSS-only) 구현. "버튼 눌림 효과, 프레스 애니메이션, 누를 때 반응, 탭 피드백, 클릭 감각" 요청 시, 버튼·카드형 터치 타깃을 만들 때 반드시 이 스킬을 사용할 것. 기존 적용분의 배율·복귀 속도 수정 요청도 포함.
---

# press-feedback — 프레스 피드백

라이브 데모: https://guksu.github.io/fe-skills/#/press-feedback

## 언제 쓰는가

버튼·카드·리스트 셀 등 누르는 모든 것에. "눌렸다"는 물리적 반응이 0.1초 안에 오면 인터페이스 전체가 단단하게 느껴진다 — 개별 화려함이 아니라 앱 전반의 기본기다.

**기술 선택:** 순수 CSS(`:active` + transition). JS가 필요 없는 대표 영역이다. 핵심은 **비대칭 타이밍** — 누름은 60ms 즉각, 복귀는 220ms 스프링 커브. 대칭이면 굼떠 보인다.

| 파일 | 층 | 복사 대상 |
|------|-----|----------|
| `assets/press-feedback.css` | 전부 | 모든 프로젝트 |

## 사용 방법

1. `assets/press-feedback.css`를 복사한다(전체 구현 — 반드시 읽어라).
2. 누를 수 있는 요소에 클래스를 붙인다:
   - `pressable` — 기본: 눌리면 96%로 움츠렸다 복귀
   - `pressable pressable-dim` — 면적 큰 카드형: 축소 + 살짝 어두워짐
   - `pressable pressable-lift` — 데스크톱 호버 시 1px 리프트(정밀 포인터에서만)

```html
<button class="pressable">주문하기</button>
<a class="pressable pressable-dim card" href="/menu">오늘의 국수</a>
```

React·Vue 등 어디서든 className만 붙이면 된다 — 래퍼 없음.

## 커스터마이즈 포인트

| 대상 | 방법 |
|------|------|
| 눌림 배율 | `--press-scale` (기본 0.96 — 작은 버튼 0.94, 큰 카드 0.98이 무난) |
| 복귀 속도 | `--press-release` (기본 220ms) |

## 주의사항

- **비대칭을 유지하라** — `:active`의 `transition-duration: 60ms`를 지우면 눌림도 220ms가 되어 굼떠진다.
- 호버 리프트는 `(hover: hover) and (pointer: fine)` 게이트 안에 있다 — 터치 기기에서 호버 잔상이 남는 것을 막는 장치이므로 게이트 제거 금지.
- **reduced-motion 대응 내장** — 축소 대신 밝기 변화만 남는다.
- 이 효과는 고빈도 노출이다 — scale을 0.9 이하로 과장하지 마라. 매번 크게 움직이는 버튼은 금방 피로해진다.
