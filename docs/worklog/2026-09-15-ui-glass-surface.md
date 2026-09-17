# UI 스킬 추가 — 유리판(글라스모피즘) glass-surface

| 항목 | 내용 |
|------|------|
| 날짜 | 2026-09-15 |
| 작성 | 에이전트 (add-skill 파이프라인) |
| 관련 경로 | `plugins/ui/skills/glass-surface/`, `demo/src/demos/glass-surface/`, `demo/src/demos/index.ts`, `demo/src/tests/glass.test.tsx`, `README.md` |

## 1. 개요

사용자 요청 "요즘 글라스 UI가 유행인데 우리도 추가하자"로 시작했다. 문답으로 범위를 정했다 — 유리 표면 CSS 하나에 카드·GNB(상단 내비게이션 바)·모달 세 자리 예시, 데모 카테고리는 새로 '표면과 스타일'을 만들고, 흐림을 못 쓰는 환경은 불투명 판으로 자동 전환. fe-ui 41 → 42종.

## 2. 작업내용

- `plugins/ui/skills/glass-surface/assets/glass.css` — 정본. 유리 4겹(반투명 tint · `backdrop-filter` 흐림 · 밝은 테두리 · 위쪽 1px 하이라이트)을 `.glass` 하나에 담고, 자리별 변형 `.glass-card`·`.glass-nav`(sticky, 모서리 0)·`.glass-modal`(네이티브 `<dialog>`용)을 뒀다. `data-tone="dark"`로 검은 유리. 폴백 4종: `@supports not (backdrop-filter)`, `prefers-reduced-transparency`, `prefers-contrast: more`, 수동 `data-opaque="true"` — 모두 `--glass-fallback-bg` 단색 판. 유일한 모션은 `.glass-interactive`의 hover 전이(200ms)이며 reduced-motion에서 끈다.
- `assets/Glass.tsx` — 로직 없는 React 래퍼. `as`(태그)·`variant`(card/nav/none)·`tone`·`blur`(CSS 변수로)·`interactive`·`opaque`(data 속성으로). 모달은 래퍼에 넣지 않았다 — 열기·닫기·포커스는 modal-dialog 스킬 몫이라 `className="glass glass-modal"`로만 잇는다.
- `SKILL.md` — 언제 쓰는가(세 자리 표), 기술 선택(순수 CSS), 사용 방법, 커스터마이즈 표, 주의사항(글자 대비 보장 불가·폴백 제거 금지·흐림 비용·흐림 반경 애니메이션 금지·유리 안의 유리는 뒤를 못 봄).
- `demo/src/demos/glass-surface/` — 국수집 무대: 그라디언트 + 색 덩어리 배경을 스크롤 컨테이너에 깔고, 유리 GNB(sticky) 아래로 메뉴 카드·이모지 타일이 지나간다. 조절: 흐림 px, tint 알파, 톤(흰/검은 유리), 불투명 폴백 미리보기. 주문 확인 버튼이 유리 `<dialog>`를 연다.
- `demo/src/demos/index.ts` — `DemoCategory`·`CATEGORIES`에 '표면과 스타일' 추가, `glass-surface` 등록.
- `demo/src/tests/glass.test.tsx` — 래퍼의 CSS 훅 4건(기본 클래스·태그/변형/톤·blur 변수/opaque 속성·className 병합). 시각 효과 자체는 테스트하지 않았다.
- `README.md` — '표면과 스타일' 표 신설, 배지(fe-ui 42, tests 375), 목차·소개 문구의 스킬 수 갱신.

### 게이트 결과

| 게이트 | 결과 |
|--------|------|
| 빌드·린트·테스트 | 통과 (375 tests, 58 files) |
| 스킬 구조 검증 | 통과 (`node scripts/validateSkills.mjs`) |
| 브라우저 실동작 | Chromium(Playwright)으로 확인 — 카드 computed `backdrop-filter: blur(16px) saturate(1.6)`, GNB 밑으로 스크롤되는 타일 흐림, 검은 유리 전환, `data-opaque` 시 `backdrop-filter: none` + 단색, 모달 열림/Esc 닫힘, `prefers-contrast: more` 에뮬레이션에서 자동 단색 폴백, `prefers-reduced-motion` 에뮬레이션에서 hover 전이 0s, 홈 목록에 새 카테고리 노출 |
| 모션 리뷰 | fe-craft 스킬이 이 세션에 없어 같은 기준(이징·타이밍·reduced-motion)으로 직접 검토. 모션이 hover 전이 하나뿐이라 지적 없음 |

## 3. 주의사항

- **fe-craft 리뷰 미실행** — 스킬이 세션에 등록되어 있지 않아 자체 검토로 대체했다. 필요하면 "모션 리뷰 다시"로 재실행.
- `prefers-reduced-transparency` 미디어 쿼리는 Chromium 계열 위주로 지원된다(정확한 지원 범위는 확인하지 못함). 그래서 `@supports`·`prefers-contrast`와 같이 두었다.
- 데모의 "불투명 폴백 미리보기"를 켜면 `.glass-interactive` 카드는 배경이 200ms 동안 서서히 바뀌고 흐림은 즉시 꺼진다. 실제 폴백은 로드 시점에 고정되므로 화면에서는 문제가 없다.
- 이 세션은 `claude/glass-ui-design-iys2mh` 브랜치에서 작업했다(add-skill 절차의 `feat/{skill-name}` 관례와 다름 — 세션이 브랜치를 지정). 커밋·푸시는 하지 않았다.
