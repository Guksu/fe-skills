---
name: swipe-to-delete
description: 리스트 항목 스와이프 삭제 구현 — 왼쪽으로 밀면 삭제 버튼이 드러나고(스냅 열림), 끝까지 밀거나 튕기면 바로 삭제되며 행 높이가 접혀 사라진다. 세로 스크롤과 축 잠금으로 공존. "스와이프 삭제, 밀어서 삭제, 옆으로 밀어 지우기, 리스트 항목 삭제 제스처, 알림 지우기" 요청 시, 모바일 목록의 항목 제거 UX를 만들 때 반드시 이 스킬을 사용할 것. 기존 적용분의 임계값·폭·속도 수정 요청도 포함.
---

# swipe-to-delete — 밀어서 삭제

라이브 데모: https://guksu.github.io/fe-skills/#/swipe-to-delete

## 언제 쓰는가

장바구니 항목, 알림, 최근 검색어처럼 **자주 지우는 목록**. 항목마다 삭제 버튼을 그리면 목록이 어지럽고 실수로 누르기 쉽다 — 스와이프는 버튼을 숨겼다가 의도가 분명할 때만 꺼낸다. 메일·메시지 앱의 관례라 설명 없이 통한다. 다만 **발견 가능성이 낮은 제스처**이므로 첫 사용자에게는 힌트(첫 항목 살짝 열어 보이기 등)가 필요하고, 키보드·스크린 리더 사용자를 위해 삭제 버튼이 DOM에 항상 존재한다.

**기술 선택:** 포인터 이벤트 코어(`createSwipeDelete.ts`, 의존성 0) + CSS transition. 드래그 중에만 인라인 transform으로 손가락을 따르고, 놓는 순간의 거리·속도로 **열림/닫힘/끝까지 밀어 삭제** 셋 중 하나를 판정한 뒤 정착 이동은 CSS에 맡긴다. 세로 스크롤과의 충돌은 처음 6px의 방향으로 축을 잠가 푼다(`touch-action: pan-y`와 한 쌍). 삭제 후 행이 접히는 것은 높이를 측정해 인라인으로 고정한 뒤 0으로 전이한다 — `auto→0`은 전이되지 않기 때문이다.

| 파일 | 층 | 복사 대상 |
|------|-----|----------|
| `assets/createSwipeDelete.ts` | 제스처 판정 코어 (축 잠금·스냅·튕김·끝까지 밀기) | 모든 프로젝트 |
| `assets/swipe-to-delete.css` | 액션 영역·정착 이동·접힘 정의 | 모든 프로젝트 |
| `assets/SwipeToDelete.tsx` | React 래퍼 (접힘 2단계·키보드 포커스 열림) | React 프로젝트만 |

TS가 아닌 프로젝트에 복사할 때는 타입 표기를 벗겨 .js/.jsx로 저장한다 — 로직은 그대로다.

## 사용 방법 — React

```tsx
import { useState } from 'react'
import { SwipeToDelete } from './SwipeToDelete'

const Cart = () => {
  const [items, setItems] = useState(['멸치국수', '비빔국수', '들깨칼국수'])

  return (
    <ul>
      {items.map((name) => (
        <li key={name}>
          <SwipeToDelete onDelete={() => setItems((prev) => prev.filter((item) => item !== name))}>
            <div className="cart-row">{name}</div>
          </SwipeToDelete>
        </li>
      ))}
    </ul>
  )
}
```

- `onDelete`는 **접힘 애니메이션이 끝난 뒤** 불린다 — 여기서 상태를 지우면 언마운트가 모션 뒤에 온다.
- `key`는 항목의 고유값이어야 한다 — 인덱스를 쓰면 삭제 후 다음 항목이 "삭제 중" 상태를 물려받는다.
- 되돌리기가 필요하면 `onDelete`에서 즉시 지우지 말고 토스트(`toast-stack` 스킬)로 "실행 취소"를 띄운 뒤 지운다.

## 사용 방법 — 순수 JS (React 없음)

```html
<div class="swipe-item" data-open="false">
  <div class="swipe-content">
    멸치국수
    <div class="swipe-actions"><button type="button" class="swipe-action">삭제</button></div>
  </div>
</div>
```

```js
import { createSwipeDelete } from './createSwipeDelete.js'

const item = document.querySelector('.swipe-item')
const swipe = createSwipeDelete({
  content: item.querySelector('.swipe-content'),
  onOpenChange: (open) => (item.dataset.open = String(open)),
  onSwipeOut: () => {
    item.style.height = `${item.offsetHeight}px`
    void item.offsetHeight
    item.dataset.state = 'deleting'
    item.addEventListener('transitionend', () => item.remove(), { once: true })
  },
})
item.querySelector('.swipe-action').addEventListener('click', swipe.swipeOut)
```

## 커스터마이즈 포인트

| 대상 | 방법 |
|------|------|
| 액션 폭 | `actionWidth` prop (88px — CSS 변수 `--swipe-action-width`와 함께 바뀐다) |
| 끝까지 밀기 임계 | `swipeOutThresholdPx` (기본 액션 폭의 2.5배) · `swipeOutVelocity`(0.8px/ms) |
| 속도 | `--swipe-duration` (260ms — 정착·접힘 공통) |
| 색 | `--swipe-action-bg`(#dc2626), `--swipe-bg`(내용 배경 — 반드시 불투명해야 액션이 가려진다) |
| 액션 문구 | `actionLabel` prop |

## 주의사항

- **액션 영역은 `.swipe-content` 안, 오른쪽 바깥(`left: 100%`)에 붙어 내용과 함께 움직인다** — 행 아래에 색을 깔지 않는 이유는 행 높이가 소수 px일 때 경계 틈으로 색이 비치기 때문이다. 액션을 밖으로 빼지 말 것.
- 삭제 버튼은 열리기 전까지 `opacity: 0`이지만 DOM에 있고 Tab으로 닿는다. 포커스되면 행이 열려 버튼이 보인다 — 이 경로가 키보드 사용자의 삭제 수단이니 `tabIndex`를 건드리지 않는다.
- 한 번에 한 행만 열리게 하려면 부모가 `onOpenChange`로 열린 행을 추적하고 나머지를 `close()`한다(코어 반환값) — 이 스킬은 단일 행 단위라 목록 조율은 포함하지 않았다.
- 복구 불가능한 삭제(주문 취소 등)에는 끝까지 밀어 삭제를 끄고 버튼 확인만 남긴다 — `swipeOutThresholdPx: Infinity, swipeOutVelocity: Infinity`.
- 마우스로도 동작하지만 데스크톱에서는 발견되기 어렵다 — 데스크톱은 호버 시 삭제 버튼을 노출하는 등 다른 경로를 함께 둔다.
- **reduced-motion 대응 내장** — 손가락 추적은 유지하고(조작이지 장식 모션이 아니다) 정착·접힘 전이만 즉시로 바꾼다. 블록 제거 금지.
