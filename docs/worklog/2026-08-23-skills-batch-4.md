# 스킬 3종 추가: flip-list · cart-fly · pull-to-refresh (로드맵 완주, 총 13종)

| 항목 | 내용 |
|------|------|
| 날짜 | 2026-08-23 |
| 작성 | Claude Code (add-skill 파이프라인) |
| 관련 경로 | `plugin/skills/{flip-list,cart-fly,pull-to-refresh}/`, `demo/src/demos/`, `demo/src/tests/`, `README.md` |

## 1. 개요

첫 로드맵의 마지막 3종을 구현해 스킬 13종이 됐다. **커밋·PR은 하지 않았다** — 배치 2·리브랜딩·배치 3과 함께 미커밋 누적(사용자 육안 확인 대기).

## 2. 작업내용

- **flip-list** — FLIP(First-Last-Invert-Play) 코어 `captureFlip.ts`(TDD 4건, data-flip-id로 전후 연결, reduced-motion 생략). React 훅 `useFlipList`는 매 커밋 직후 직전 캡처와 비교·재생(캡처를 play 전에 떠서 invert 오염 방지).
- **cart-fly** — 포물선 비행 코어 `flyToTarget.ts`(TDD 4건): 바깥 요소 가로 linear + 안쪽 요소 세로 ease-in의 2축 분리로 곡선 생성, 고스트 자체 정리(transitionend+타임아웃 폴백), reduced-motion은 즉시 onArrive. CSS 파일 없음(고스트 인라인 — 파일 하나로 완결).
- **pull-to-refresh** — 코어 `createPullToRefresh.ts`(TDD 5건): 최상단 판정·지수 감쇠 고무줄 저항·거리 임계·done() 복귀. 진행률을 `--pull-progress`/`data-refreshing`으로 노출해 인디케이터는 전적으로 CSS 몫. React 래퍼는 Promise finally로 done 보장.
- 데모 3종(정렬 메뉴판·장바구니 담기·국수신문 피드) + 레지스트리, README 스킬 목록 13종으로 갱신.
- **발견·수정**: 데모 피드의 새 글 id를 잘린 목록 기준으로 만들어 React 중복 key 발생 → 기존 최대 id+1로 교정(콘솔 클린 확인).
- 게이트: 빌드·린트·테스트 **72/72**, 구조 검증 3종 OK, 브라우저 실동작(FLIP 전이 중간 프레임·고스트 비행·당김 전 사이클 계측: 저항 110px→progress 1→refreshing→새 글→복귀, 콘솔 에러 0), 모션 리뷰 통과.

## 3. 주의사항

- **커밋 안 됨** — 미커밋 누적: 배치 2(tab-indicator·bottom-sheet) + 리브랜딩 + 배치 3(sticky-header·carousel·story-progress) + 배치 4(이번). 커밋 시 배치별 분리 권장.
- flip-list는 위치 이동만 재생(크기 변화 FLIP은 범위 밖), cart-fly 연타는 고스트 다중 비행이 의도된 동작(문서 명시).
- pull-to-refresh는 모바일 브라우저 자체 당김과 이중이 될 수 있음 — body `overscroll-behavior-y` 정책과 함께 검토(문서 명시).
- 합성 드래그(left_click_drag)는 속도 편차로 리프레시가 안 걸릴 수 있다 — 제스처 검증은 JS 포인터 시퀀스가 결정적이다.
