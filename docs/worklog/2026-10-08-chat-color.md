# 실사용 점검 — 색의 수와 AI 채팅 화면

| 항목 | 내용 |
|------|------|
| 날짜 | 2026-10-08 |
| 작성 | 에이전트 (Claude Code) |
| 관련 경로 | `skills/suta/SKILL.md`, `skills/suta/patterns/layout-principles/`(토큰·PATTERN.md·references), `skills/suta/patterns/layout-audit/`, `skills/suta/patterns/loading-button`·`search-suggest`, `demo/src/demos/layout-principles/`, `demo/src/tests/auditLayout.test.ts`, `evals/`, `docs/research/2026-10-08-chat-color.md` |

## 1. 개요

사용자가 NoodleLens(Chrome 사이드 패널 AI 채팅 도구)에 suta를 적용했고, 결과(NoodleLens PR #3)에 만족하지 않았다.

- 사용자 지적
  - UI 구조가 아직 난잡하다.
  - 불필요한 색 버튼이 있다.
  - AI 슬롭에 자주 나오는 색(연노랑·주황·쨍한 초록)이 남아 있다.
- 사용자 결정
  - 레퍼런스 화면에 자주 나오는 색만 쓴다.
  - 레이아웃은 ChatGPT·Claude 같은 범용 AI 채팅을 따른다.
  - 진단 → suta 개선 → NoodleLens 재적용으로 검증한다.

## 2. 작업내용

- **진단**
  - PR #3 전후 캡처를 비교했다. suta는 숫자만 고쳤고 구조와 색 토큰 34개는 그대로였다.
  - 원인은 suta 절차의 "기존 체계 우선", 값만 보는 검사, 회색 채움 보조 버튼 권고, 색 수 기준 없음, AI 채팅 유형 없음이다.
- **레퍼런스**(`docs/research/2026-10-08-chat-color.md`)
  - designus 31곳 1,116장을 다시 받아 UI 면의 색을 쟀다.
    - UI 체계 색 2종 이하인 서비스 81%.
    - 옅은 색 면이 있는 화면 13%.
  - 이전 화면 기록에서 채운 버튼 수와 보조 버튼 모양을 셌다. 채운 버튼은 0개 65%, 1개 30%다.
  - AI 채팅 관례는 공개 구현 두 가지(Vercel Chat SDK, assistant-ui의 ChatGPT·Claude 재현)의 코드와 앱 기록의 채팅 화면에서 정리했다.
- **suta**
  - `SKILL.md`
    - 1단계 문구를 바꿨다: 기존 체계는 값의 출처일 뿐이다.
    - 2단계 "덜어내기"를 새로 넣었다.
    - 4단계에 색의 수를 넣었다.
    - 금지선 6행을 더하고 상태 행을 고쳤다.
    - 값 표의 상태 색을 줄이고 "UI 색 수" 행을 더했다.
    - 체크리스트 3항목을 더했다. description에 연노랑·주황 색과 채팅 화면을 넣었다(1,010바이트).
  - `tone.md`
    - 2절 "색의 수"를 새로 썼다.
    - 회색 채움을 보조 버튼에서 뺐다.
    - 상태 색은 오류·완료만 남겼다.
  - `screen-conventions.md`: AI 채팅 유형을 더했다(14종).
  - `principles.md`: 대응표에 5행을 더했다(30행).
  - `layout-principles` PATTERN.md: description·파일 표·톤 절차를 고쳤다.
  - 토큰
    - `--color-warning`(주황)을 지웠다. CSS와 TS 두 벌을 함께 고쳤다.
    - `--color-success`는 글자에만 쓴다.
  - `layout-audit`(TDD)
    - `tinted-surface`·`hue-count` 규칙을 더했다. OKLCH로 판정해 slate 같은 회색은 색으로 보지 않는다.
    - 예외 주석을 단 줄은 파일 단위 요약에서도 뺀다. NoodleLens 로고 색에서 발견했다.
    - 테스트는 7개를 더해 모두 591개다.
  - 패턴 기본값
    - `loading-button`: 파랑 #2563eb를 거의 검정 #1b1e24로 바꿨다.
    - `search-suggest`: 연파랑 선택 바탕을 회색으로 바꿨다.
- **데모**
  - layout-principles에 ⑨ AI 채팅(국수 추천 도우미) 전/후를 더했다.
  - 기존 데모 9곳은 콘텐츠·무대 색이나 일부러 만든 '전' 화면이다. 이유를 적은 예외 주석을 달았다. `demo/src` 검사는 0/0을 유지한다.
- **평가**: 선택 평가 3개와 트리거 평가 1개를 더했다(441/441).
- **NoodleLens 재적용**(그 저장소 작업 폴더, 커밋하지 않음)
  - 구조
    - 대상 표시줄(머리 아래 2줄)을 없앴다. 페이지·대상·첨부는 입력창 맨 위 한 줄에만 둔다.
    - "요소 선택"은 입력창 버튼 하나만 남겼다. API 키 안내도 한 곳만 남겼다.
    - 빈 화면은 인사·설명만 입력창 바로 위에 둔다.
    - 예시 질문 칩은 셋, 윤곽선이다.
    - 이미 보낸 자료의 비활성 체크 상자는 그리지 않는다.
  - 색
    - 토큰은 무채색 + 잉크 + 오류 빨강이다.
    - 아바타·E번호·배지·상태는 무채색 글자다.
    - 검사 등급은 빨강 점·빈 원·회색 점으로 나눈다.
    - 오류는 상자 없이 글자 + 글자 버튼이다.
    - 보조 버튼은 윤곽선·글자 버튼이다.
    - 로고 노랑만 남겼다(예외 주석).
  - 검증
    - typecheck와 단위 테스트 69개를 통과했다.
    - E2E는 40개 통과, 1개 실패다. 실패는 실제 Anthropic 서버를 부르는 테스트로, 고치기 전에도 같았다.
    - E2E 선택자 1곳(`.badge-warn` → `.msg-head .badge`)을 고쳤다.
    - suta 검사는 0/0이다.
    - 캡처 11장을 다시 찍었다.
    - 색 실측: 화면당 유채색 계열은 1.3에서 0.3으로, 옅은 색 면 화면은 6/9에서 0/9로 줄었다.
- **버전**: 0.6.0 → 0.7.0.

## 3. 주의사항

- **designus 표본의 한계**: 로그인하지 않으면 서비스마다 앞쪽 36장만 보인다. 그래서 이번 색 표본은 시작 안내·가입 흐름 중심이고, 채팅 화면은 없다. 채팅 관례는 공개 구현 코드와 이전 화면 기록으로 정했다.
- **NoodleLens 브랜치**: 이 저장소의 git 훅이 `checkout`을 막아 NoodleLens 쪽 브랜치를 만들지 않았다. 작업 폴더(`/home/user/noodlelens`, main 기준)에 변경만 있다. 올릴 때는 `git push origin HEAD:{브랜치}`로 새 브랜치에 올린다.
- **NoodleLens E2E 환경**: E2E가 쓰는 Chrome for Testing 153을 스크래치패드에 받고, root 환경이라 `--no-sandbox` 래퍼로 실행했다(`PLAYWRIGHT_BROWSERS_PATH`). 저장소 코드는 바꾸지 않았다.
- **범위 밖**: NoodleLens 페이지 위 강조 오버레이(`src/content/overlay.ts`)의 노랑·주황·파랑은 패널이 아니라 검사하는 웹페이지 위 표시라 손대지 않았다.
- **검사의 한계**: `hue-count`는 파일 단위다. 정보·행동 중복 같은 구조 문제는 정적 검사로 잡지 못한다. SKILL.md 2단계와 체크리스트로 직접 확인하게 했다.
