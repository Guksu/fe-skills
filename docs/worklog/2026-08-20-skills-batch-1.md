# 스킬 3종 추가: skeleton · count-up · like-pop

| 항목 | 내용 |
|------|------|
| 날짜 | 2026-08-20 |
| 작성 | Claude Code (add-skill 파이프라인) |
| 관련 경로 | `plugin/skills/{skeleton,count-up,like-pop}/`, `demo/src/demos/`, `demo/src/tests/` |

## 1. 개요

국내 주요 앱(토스·당근·배민·인스타그램) 관례 애니메이션 로드맵의 1~3번을 구현했다. 브랜치는 `feat/skills-batch-1`(feat/demo-playground에서 분기 — 데모 컨트롤 패널 스타일 재사용). **커밋·PR은 하지 않았다** — 사용자 육안 확인 후 직접 진행(CLAUDE.md 규칙).

## 2. 작업내용

- **skeleton (스켈레톤 시머)** — CSS-only 스킬(JS 코어 없음). `::after` translateX 시머(GPU), text/circle/rect 변형, 마지막 글줄 자동 축소, reduced-motion은 시머 대신 느린 opacity 맥동. React 편의 래퍼 `Skeleton.tsx`(로직 없음 — 테스트 미작성, 빈 테스트 양산 금지 원칙). 데모: 2.5초 로딩 후 콘텐츠 교체(CLS 0 확인), 시머 속도 컨트롤.
- **count-up (숫자 카운트업)** — 코어 `createCountUp.ts`(rAF 보간, ease-out cubic, 기본 포맷 천 단위 구분, reduced-motion 즉시 최종값), `count-up.css`(tabular-nums — 폭 떨림 방지), React 래퍼 `CountUp.tsx`(value 변경 시 직전 값에서 이어 굴러감). TDD 7건(중간값·정확 도달·단조성·감소 방향·커스텀 포맷·stop·reduced-motion).
- **like-pop (좋아요 팝 + 더블탭 버스트)** — 코어 `createDoubleTap.ts`(click 2회 직접 판정 — dblclick은 모바일 비일관, 시간·이동 허용치 조절 가능). TDD 5건. `like-pop.css`(팝·버스트 원샷 keyframes, transform/opacity만, touch-action: manipulation, reduced-motion 페이드 완화), React `LikeButton.tsx`(aria-pressed 구동)·`DoubleTapArea.tsx`(버스트 하트 animationend 자체 정리, 콜백 latest-ref로 재등록 방지). 더블탭=항상 좋아요 설정(인스타 관례).
- 데모 레지스트리 등록 3건, 게이트: 빌드·린트·테스트 **34/34**, 구조 검증(5개 스킬 전부 OK), 브라우저 실동작(스켈레톤 교체 CLS 0·카운트 중간값/정확 도달·버스트 생성/자체 정리, 콘솔 에러 0), 모션 리뷰(시머 linear=등속 마퀴 허용, 원샷 keyframes=딜라이트 티어, scale 0 시작 없음).

- **(추가) 커스텀 프로퍼티 상속 버그 수정 — 4개 스킬 CSS 전체** — 사용자가 버스트 하트 크기 조절이 안 먹는 것을 발견. 원인: `.burst-heart { --burst-size: 96px }`처럼 요소 자신에 기본값을 선언하면 조상에서 설정한 값이 상속되지 못함(자기 선언 > 상속값). enter-exit·scroll-reveal·skeleton·like-pop 모두 같은 패턴이라 데모 컨트롤 대부분이 조용히 무동작이었다. **private 변수 + 폴백 패턴**(`--_x: var(--x, 기본값)`)으로 전부 교정. 계측 검증: transition-duration 0.8s·animation-duration 3s·translateY 80px·버스트 width 200px 모두 반영 확인, 게이트 재통과(빌드·린트·테스트 34/34).

## 3. 주의사항

- **커밋 안 됨** — `feat/skills-batch-1` 워킹 트리에 있음. PR #2(feat/demo-playground) 위에 쌓인 브랜치라 PR #2 머지 후 올리는 게 깔끔하다.
- CLAUDE.md 수정분(커밋 규칙)이 이전 세션부터 워킹 트리에 남아 있음 — 어느 커밋에 넣을지는 사용자 판단.
- like-pop 데모의 더블탭은 자동화 도구에선 클릭 간격이 길어 판정 시간을 600ms로 올려 확인했다 — 실사용(마우스/터치)은 기본 300ms로 충분하다.
- count-up은 문자열 금액 파싱을 하지 않는다(호출부 책임) — 스킬 문서에 명시됨.
- **이후 스킬의 CSS 변수 규칙**: 커스터마이즈용 변수의 기본값은 요소 자신에 선언하지 말고 `--_x: var(--x, 기본값)` private 폴백으로 둘 것 — 조상 설정이 상속되어야 한다.
