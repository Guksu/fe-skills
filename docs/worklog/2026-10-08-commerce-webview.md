# 실사용 점검 2 — 모바일 웹뷰 이커머스 화면과 하단 탭(GNB)

| 항목 | 내용 |
|------|------|
| 날짜 | 2026-10-08 |
| 작성 | 에이전트 (Claude Code) |
| 관련 경로 | `skills/suta/SKILL.md`, `skills/suta/patterns/bottom-nav/`(새 패턴), `skills/suta/patterns/layout-principles/`(screen-conventions·tone·`icons.ts`·`Icon.tsx`), `skills/suta/patterns/layout-audit/`, `bottom-sheet`·`toast-stack`·`file-upload`·`switch`·`checkbox-radio` 외 패턴 기본값, `demo/src/demos/bottom-nav/`, `demo/src/tests/`, `evals/`, `docs/research/2026-10-08-commerce-webview.md` |

## 1. 개요

사용자가 실제 상황을 주고 suta로 구현하면서 suta를 개선하자고 했다. 첫 요청은 "모바일 웹뷰에 쓰는 이커머스 화면(홈·상품 리스트·상품 상세·마이·장바구니·설정·GNB)"이다.

- **방법**: 빈 Vite + React 프로젝트에서 `claude -p`를 일반 조건과 suta 조건으로 실행했다.
- **순서**: 결과를 레퍼런스 관례와 대조해 suta를 고쳤다. 고친 suta로 다시 실행해 비교했다.

## 2. 작업내용

- **1차(suta 0.7)**
  - suta는 색·대비·검사에서 일반보다 나았다.
    - 일반: axe 색 대비 111곳, 이모지 아이콘, 주황 알약.
    - suta 0.7: axe 위반 1곳.
  - 구조는 비어 있었다.
    - 홈에 검색이 없었다.
    - 장바구니를 탭에 넣어 탭 바와 주문 바가 겹쳤다.
    - 상세의 수량이 본문 끝에 있고, 후기·탭이 없었다.
    - 토스트가 다음 화면까지 따라왔다.
    - 마이가 빈약하고, 실제 이메일이 노출됐다.
    - 설정 톱니가 해 모양이었다.
    - 복사한 패턴의 포커스 링이 기본 파랑이었다.
- **레퍼런스**
  - 앱 화면 기록 1,116장에서 하단 탭 바를 집계했다. 홈 62%, 상세 5%, 장바구니·주문 6%. 5칸 107화면.
  - 커머스 3곳의 화면 62장에서 홈·카드·목록·상세·마이 관례를 정리했다.
- **suta 개선**
  - 새 패턴 `bottom-nav`(코어·React·CSS, 테스트 11개, 데모 `#/bottom-nav`)를 만들었다.
    - 처음 이름 `tab-bar`는 `tab-indicator`의 `.tab-bar` 클래스와 겹쳐 바꿨다.
  - 아이콘 한 벌 `icons.ts`·`Icon.tsx`(Lucide 40개, ISC 문구 포함, 테스트 3개)를 넣었다.
  - `screen-conventions.md`에 하단 탭 바·모바일 웹뷰·커머스 절을 더했다.
  - `SKILL.md`의 절차·금지선·값·체크리스트에 반영했다.
  - `layout-audit` 규칙 4개를 TDD로 더했다(테스트 8개): `emoji-icon`·`viewport-height`·`input-zoom`·`zoom-disabled`.
  - `toast-stack`에 `clear()`·`clearToasts()`를 더했다(테스트 1개).
  - 패턴 기본색을 바꿨다.
    - 13개 패턴의 파랑과 `switch`의 초록 → 거의 검정.
    - 꺼짐 회색 `#94a3b8`(2.6:1) → `#868b94`(3.4:1).
  - `file-upload`의 📄 이모지를 선 아이콘으로 바꿨다.
- **2차(0.8 ×2, 0.7 재실행 ×1)**
  - 0.8 두 번 모두 새 관례를 따랐다. 검색 입구, 머리의 장바구니, 탭 숨김, 구매 시트, 상세 탭, 마이 구성이다.
  - 패턴 버그 둘이 드러났다.
    - `BottomNav.tsx`가 자기 CSS를 불러오지 않아, 복사한 앱에서 탭 바가 목록으로 그려졌다.
    - `bottom-sheet`가 누르는 순간 포인터를 잡아 시트 안 버튼이 마우스·터치로 눌리지 않았다.
  - 둘 다 고쳤다. 시트는 TDD(테스트 1개)로 고치고, 기존 테스트 13개도 통과한다.
- **3차(0.8 ×2)**
  - 버그 없이 같은 구조가 나왔다.
  - axe 0·2, suta 검사 error 0, 넘침 0이다.
- **데모**
  - `demo/src` 검사 0/0을 유지했다.
    - 데모 33곳의 이모지 자리표시는 이유를 적은 파일 단위 예외로 두었다.
    - 셸의 `100vh`에 `100dvh`를 더했다.
    - 검사 데모 입력칸은 터치 기기에서 16px이다.
  - 패턴 기본색을 바꾸면서, 데모 셸 `:root`에서 패턴 공개 변수를 사이트 색에 연결했다.
- **평가·문서**
  - 선택 평가 bottom-nav 11개, layout-principles 2개, layout-audit 1개, 트리거 2개를 더했다(457/457).
  - 상세 안내 2벌, README 배지(56 patterns·615 tests), AGENTS.md, 설계 문서 15라운드, CLAUDE.md 변경 이력을 고쳤다.
  - 버전 0.8.0.

## 3. 주의사항

- **브랜치**: PR #37이 병합된 뒤 작업 브랜치를 main에서 다시 만들어야 하지만, git 훅이 `checkout`을 막는다. 지금 브랜치는 병합된 커밋(d6eabd5) 위에 있고, 파일 내용은 main(c0f6456)과 같다. 커밋 전에 `git checkout -B feat/busy-bohr-1pb1xb origin/main`을 사용자가 하거나, 이 상태 그대로 커밋해도 PR 차이는 같다.
- **실험 자료**: 실험 프로젝트·사진(위키미디어 커먼즈, CC0·CC BY·CC BY-SA)·캡처는 스크래치패드에만 있다. 저장소에는 넣지 않았다.
- **캡처 글꼴**: 이 환경에는 한글 글꼴이 중국어 글꼴(WenQuanYi)뿐이라, Pretendard를 받아 fontconfig 기본 산세리프로 지정한 뒤 캡처했다.
- **남은 일**(별도 작업으로 제안)
  - 데모 33곳의 이모지 자리표시를 사진·선 아이콘으로 바꾼다.
  - 패턴 CSS의 4px 격자 밖 간격 등 warn 22건을 0으로 만든다. 복사한 앱에서 warn 4~5개가 모두 여기서 나왔다.
- **검사의 한계**: 2차의 두 버그(CSS 누락, 클릭이 안 먹는 시트 버튼)는 정적 검사로 잡을 수 없었다. 에이전트가 "브라우저가 없다"며 화면을 보지 않고 끝낸 실행에서 나왔다.
