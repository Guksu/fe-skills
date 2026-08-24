# cart-fly: 직선 비행 버그 수정 + 궤적 방향 옵션(arc)

| 항목 | 내용 |
|------|------|
| 날짜 | 2026-08-24 |
| 작성 | Claude Code (add-skill 파이프라인 — 기존 스킬 수정) |
| 관련 경로 | `plugin/skills/cart-fly/assets/flyToTarget.ts`, `demo/src/tests/cartFlyCore.test.ts` |

## 1. 개요

사용자 보고: 카트 플라이가 포물선이 아니라 직선으로 이동. 브랜치 `fix/cart-fly-parabola`(main에서 분기). 커밋 안 함.

## 2. 작업내용

- **원인** — 포물선은 바깥(가로 linear)/안쪽(세로 ease-in) 2축 분리로 만드는데, 안쪽 요소가 `source.cloneNode()`라 **원본이 인라인 요소(span 등)면 CSS transform이 적용되지 않는다**(비대체 인라인 요소는 transform 무시). 데모의 source가 `span.cart-thumb`이라 세로 이동이 통째로 죽고 가로 직선만 남았다.
- **수정** — 코어에서 안쪽 복제에 `display: block` 강제(한 줄) + 사유 주석. TDD: 인라인 span source로 `inner.style.display === 'block'` 단언 테스트 추가(Red→Green).
- **검증** — 게이트 4종 통과(테스트 94/94). 브라우저: computed 이징 분리 확인(ghost linear / inner cubic-bezier(0.55,0,1,0.45)) + 중간 프레임 실측 — 가로 18% 진행 시점에 세로는 직선 예상치보다 아래(ease-in 시그니처) → 곡선 복원.

- **(추가) 궤적 방향 옵션 `arc`** — 사용자 요청: j자(기본)의 반대인 r자 궤적. 축 이징 스왑으로 구현: `'horizontal-first'`(기본)=가로 linear+세로 ease-in(옆으로 갔다가 끝에서 상승), `'vertical-first'`=가로 ease-in+세로 linear(먼저 떠올랐다가 옆으로). 코어·useCartFly·SKILL.md·데모 select 컨트롤·레지스트리 usage 반영. TDD 1건 추가(이징 스왑 단언, 총 95). 브라우저 중간 프레임: r자에서 가로 진행 없이 세로 먼저 상승 확인(j자와 정반대).

## 3. 주의사항

- **계측 함정 재확인**: hidden 탭에서는 rAF가 완전 정지(setInterval도 1s 스로틀) — JS 타이머 기반 궤적 샘플링 불가. CSS transition은 시간 기반이라 완료됨. 브라우저 계측은 computer 액션 배치 안에서 스크린샷/즉시 javascript_exec로 할 것(배치 3 워크로그의 일반화).
- 같은 clone 패턴을 쓰는 zoom-lightbox는 영향 없음 — 고스트에 `position: fixed`(블록화)를 직접 걸어서 인라인 문제가 발생하지 않는다.
