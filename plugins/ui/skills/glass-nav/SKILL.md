---
name: glass-nav
description: 스크롤에 반응하는 유리 GNB(상단 내비게이션 바)를 구현한다 — 맨 위에서는 투명했다가 내려가면 유리로 변하고, 아래로 스크롤하면 숨고 위로 올리면 나타나거나, 링크가 접혀 알약 하나로 줄어든다(glass nav, scroll-aware header). "스크롤하면 헤더 숨기기, 내리면 GNB 사라지고 올리면 나오게, 스크롤하면 상단 바 유리로, 애플식 알약 탭 바, 배민처럼 홈 상단 바" 요청에 쓴다. 기존 적용분의 임계 거리·모드 수정에도 쓴다.
---

# glass-nav — 스크롤에 반응하는 유리 GNB

라이브 데모: https://guksu.github.io/fe-skills/#/glass-nav

## 언제 쓰는가

상단 바가 콘텐츠 위에 "떠 있다"는 느낌을 주고, 읽는 동안에는 자리를 비켜 줄 때. 세 관례를 한 스킬에 모았다.

| 모드 | 동작 | 어디서 보이나 |
|------|------|---------------|
| `elevate` | 맨 위에서는 투명, 조금 내려가면 유리(배경·흐림·테두리)로 변한다 | 배민 홈(배너 위 투명 → 스크롤 시 바), 카카오맵 검색 바 |
| `hide` | 아래로 스크롤하면 위로 숨고, 조금이라도 위로 올리면 다시 내려온다 | 배민·카카오 목록 화면 |
| `compact` | 아래로 스크롤하면 링크가 접혀 알약 하나(브랜드 + 현재 메뉴)로 줄고, 위로 올리면 펼쳐진다 | iOS 26 Liquid Glass 탭 바 |

`elevate`는 항상 켜져 있고, `hide`와 `compact` 중 하나를 고른다. 반박: 숨는 바는 "언제든 위로 올리면 나온다"를 사용자가 모르면 메뉴를 잃어버린 것처럼 느낀다. 첫 화면에서 한 번은 바를 보여 주고, 맨 위에서는 절대 숨기지 않는다(`hideAfterPx`).

**기술 선택:** 코어는 스크롤 위치와 방향으로 세 상태만 정하고 `data-elevated`·`data-hidden`·`data-compact`를 붙인다(프레임당 한 번, passive). 움직임은 전부 CSS transition이다 — 숨김은 `transform`, 유리 전환은 `background`·`backdrop-filter`, 축소는 `grid-template-columns 1fr→0fr`(accordion의 세로 기법을 가로로). 겉모습만 필요하면 glass-surface 스킬, 큰 제목이 작은 제목으로 바뀌는 헤더는 sticky-header 스킬을 쓴다.

| 파일 | 층 | 복사 대상 |
|------|-----|----------|
| `assets/navScrollCore.ts` | 순수 판정 — `reduceNavState` (위치·방향 → 세 상태) | 모든 프로젝트 |
| `assets/createGlassNav.ts` | 코어 — scroll 리스너·rAF·data 속성·`setOptions`·`destroy` | 모든 프로젝트 |
| `assets/glass-nav.css` | 투명→유리·숨김·축소 전이, 알약 모양 | 모든 프로젝트 |
| `assets/useGlassNav.ts` | React 훅 (`navRef`, `state`) | React 프로젝트만 |

TS가 아닌 프로젝트에 복사할 때는 타입 표기를 벗겨 .js로 저장한다 — 로직은 그대로다.

## 사용 방법 — React

```tsx
import { useGlassNav } from './useGlassNav'

const TopBar = ({ current }: { current: string }) => {
  const { navRef } = useGlassNav({ mode: 'hide' }) // 페이지 스크롤 기준. 컨테이너가 따로면 containerRef 전달

  return (
    <header ref={navRef} className="gnav">
      <div className="gnav-bar">
        <a className="gnav-brand" href="/">🍜 국수집</a>
        <nav className="gnav-links" aria-label="주메뉴">
          <div>
            <a href="/menu" aria-current={current === 'menu' ? 'page' : undefined}>메뉴</a>
            <a href="/stores">매장</a>
            <a href="/orders">주문 내역</a>
          </div>
        </nav>
        <span className="gnav-current" aria-hidden="true">메뉴</span> {/* compact에서만 보이는 현재 메뉴 */}
      </div>
    </header>
  )
}
```

`gnav`는 `position: sticky`라 스크롤 컨테이너의 **첫 자식**으로 둔다. 컨테이너가 `overflow: hidden`인 조상 안에 있으면 sticky가 동작하지 않는다.

## 사용 방법 — 순수 JS (React 없음)

```js
import { createGlassNav } from './createGlassNav.js'

const nav = document.querySelector('.gnav')
const control = createGlassNav({ nav, mode: 'compact', hideAfterPx: 120 }) // container 생략 = 페이지 스크롤
// 화면 전환 시 모드를 바꾸려면 control.setOptions({ mode: 'hide' }), 떼려면 control.destroy()
```

## 커스터마이즈 포인트

| 대상 | 방법 |
|------|------|
| 모드 | `mode: 'elevate' | 'hide' | 'compact'` (기본 elevate) |
| 투명 → 유리 시작점 | `thresholdPx` (기본 8 — 거의 바로. 배너 높이만큼 두면 배너를 지나야 유리가 된다) |
| 숨김·축소 시작점 | `hideAfterPx` (기본 80 — 맨 위 근처에서는 절대 숨기지 않는다) |
| 미세 튐 무시 | `minDeltaPx` (기본 6) |
| 속도 | `--gnav-duration` (250ms — 컴포넌트 전환 단계) |
| 유리 색·흐림 | `--gnav-tint`·`--gnav-border`·`--gnav-blur`(16px) |
| 알약 모서리 | `--gnav-radius` (999px — 각진 바를 원하면 8px) |
| 글자·활성 배경 | `--gnav-color`·`--gnav-active-bg` |

## 주의사항

- **맨 위(scrollTop 0)에서는 항상 펼친 투명 상태다.** 코어가 보장한다. 숨긴 채 맨 위에 도착하는 어색함이 없다.
- **`gnav`는 클릭을 통과시킨다**(`pointer-events: none`). 투명 띠가 배너의 버튼을 가리지 않기 위해서다. 유리 판(`gnav-bar`)만 클릭을 받는다.
- **compact의 현재 메뉴는 복제다.** 링크 묶음이 접히면 안의 `aria-current` 링크도 보이지 않으므로 `gnav-current`에 이름을 따로 적는다(`aria-hidden` — 스크린 리더에는 접힌 링크가 그대로 있다). 라우트가 바뀌면 이 텍스트도 바꿔야 한다.
- 스크롤 컨테이너가 `document`가 아니면 `containerRef`(React) 또는 `container`(JS)를 반드시 넘긴다. 안 넘기면 페이지 스크롤을 듣고 아무 반응이 없다.
- 유리 전환의 `backdrop-filter`는 뒤에 무언가 있어야 보인다 — 단색 배경 위에서는 배경·테두리만 바뀐다. 흐림 미지원 브라우저·투명도 줄이기 설정 대응은 glass-surface 스킬의 폴백 블록을 같이 쓴다.
- **reduced-motion 대응 내장** — 세 상태 모두 전이 없이 즉시 바뀐다. 숨김 자체는 유지한다(움직임이 아니라 자리 비움).
- 축소(`grid-template-columns` 전이)는 Chrome 107·Safari 16·Firefox 66 이상. 그 아래에서는 전이 없이 즉시 접힌다.
