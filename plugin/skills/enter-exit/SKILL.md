---
name: enter-exit
description: React 요소의 진입/퇴장 애니메이션(페이드·슬라이드·스케일) 구현. 모달·토스트·드롭다운·알림 등 "나타나고 사라지는" UI에 부드러운 전환을 넣을 때, "페이드 인/아웃, 등장/퇴장 효과, 사라질 때 애니메이션, 모달 전환 넣어줘" 요청 시 반드시 이 스킬을 사용할 것. 기존 적용분의 수정·타이밍 조정 요청도 포함.
---

# enter-exit — 진입/퇴장 애니메이션

라이브 데모: https://guksu.github.io/fe-skills/#/enter-exit

## 언제 쓰는가

조건부로 나타나고 사라지는 요소(모달·토스트·드롭다운·배너)에 CSS 전환을 붙일 때. 핵심 문제는 **퇴장**이다: React는 조건이 false가 되는 즉시 언마운트하므로, CSS만으로는 사라지는 애니메이션이 보일 틈이 없다. 이 스킬의 `Presence` 컴포넌트가 언마운트를 애니메이션 종료까지 지연시킨다.

**기술 선택:** CSS transition + 최소 React 상태 머신. 애니메이션 라이브러리 없이 의존성 0으로 해결된다 — 진입/퇴장은 CSS가 가장 싸고 빠른 영역이다.

## 사용 방법

1. `assets/Presence.tsx`와 `assets/enter-exit.css`를 프로젝트로 복사한다(전체 구현이 이 두 파일에 있다 — 반드시 읽어라).
2. 조건부 렌더링 `{open && <Modal />}`을 `Presence`로 감싼다.
3. 자식 요소에 `fx` + 변형 클래스(`fx-fade`·`fx-slide-up`·`fx-scale`)를 붙인다. 순수 페이드(`fx-fade`)는 딤 배경·오버레이용이다 — 콘텐츠(카드·토스트·모달)는 약간의 이동·스케일이 있는 `fx-slide-up`/`fx-scale`이 덜 평평하게 느껴진다.

`Presence`는 자식에 `data-state`(entering→entered→exiting)를 주입하고, CSS는 그 속성에만 반응한다. 상태 흐름과 스타일이 분리되어 있어 변형 추가는 CSS만으로 된다.

## 사용 예시

```tsx
import { Presence } from './Presence'
import './enter-exit.css'

const Toast = ({ open, message }: { open: boolean; message: string }) => (
  <Presence show={open} timeoutMs={400}>
    <div className="fx fx-slide-up" role="status">
      {message}
    </div>
  </Presence>
)
```

## 커스터마이즈 포인트

| 대상 | 방법 |
|------|------|
| 지속 시간·이징 | CSS 변수 `--fx-duration`·`--fx-ease` 덮어쓰기 |
| 이동 거리(슬라이드) | `--fx-distance` |
| 시작 배율(스케일) | `--fx-from-scale` |
| 새 변형 추가 | `.fx-{이름}[data-state='entering'], [data-state='exiting']`에 시작 상태 CSS만 추가 |
| 언마운트 폴백 | `timeoutMs` prop — CSS duration보다 길게 (기본 500ms) |

## 주의사항

- **reduced-motion 대응 내장** — `prefers-reduced-motion: reduce`에서 이동·확대를 끄고 페이드만 남긴다. 이 블록을 지우지 마라.
- `timeoutMs`가 CSS duration보다 짧으면 애니메이션이 잘린 채 언마운트된다.
- 자식은 단일 엘리먼트여야 하며, `Presence`가 ref와 `data-state`를 주입하므로 자식의 기존 ref는 덮어써진다.
- 자식 내부 요소의 transition이 있으면 그 `transitionend`가 버블링되어 퇴장이 조기 종료될 수 있다 — 상세는 `references/edge-cases.md`.
