# UI 스킬 4종 추가 — 인증번호 입력·다크모드 전환·검색 자동완성·가상 스크롤

| 항목 | 내용 |
|------|------|
| 날짜 | 2026-09-01 |
| 작성 | 에이전트 (add-skill 파이프라인) |
| 관련 경로 | `plugins/ui/skills/{otp-input,theme-toggle,search-suggest,virtual-list}/`, `plugins/ui/skills/form-shake-error/assets/shakeCore.ts`, `demo/src/demos/`, `demo/src/tests/`, `README.md` |

## 1. 개요

`feat/ui-flow-patterns`(PR #16)에 이어 두 번째 배치다. 사용자가 고른 4갈래 — 인증 흐름·테마 전환·검색 입력·대용량 목록 성능 — 에 하나씩 채웠다. PR #16이 아직 열려 있어 `main`에서 새 브랜치를 팠다(사용자 결정).

## 2. 작업내용

- `plugins/ui/skills/otp-input/` — 인증번호 칸 입력. `createOtpInput.ts`(자동 이동·빈 칸 backspace·붙여넣기 분배·완성 판정) + `OtpInput.tsx`(ref로 shake/clear/focus 노출) + `shakeCore.ts`(공유 코어 복사본) + CSS. `type="number"` 대신 `type="text"`+`inputMode="numeric"`, 첫 칸에만 `autoComplete="one-time-code"`.
- `plugins/ui/skills/theme-toggle/` — 다크모드 전환. `runThemeTransition.ts`(View Transitions + clip-path 원 확산 + 전환 범위 지정) + `useTheme.ts`(light/dark/system·저장·기기 설정 추종) + `ThemeToggle.tsx` + CSS. 코어가 전환 순간에만 `view-transition-name`을 인라인으로 조정해 page-transition 스킬과 공존한다.
- `plugins/ui/skills/search-suggest/` — 검색어 자동완성. `createSuggestSearch.ts`(디바운스·요청 순번으로 늦은 응답 차단·AbortSignal 취소) + `useSearchSuggest.ts`(ARIA 콤보박스 속성 묶음·키보드) + CSS.
- `plugins/ui/skills/virtual-list/` — 가상 스크롤. `virtualRange.ts`(순수 계산) + `useVirtualList.ts`(구간이 바뀔 때만 리렌더·ResizeObserver) + CSS(뷰포트/사이저/윈도 3겹).
- **공유 코어 수정** — `form-shake-error/assets/shakeCore.ts`에 시간 상한(600ms)을 추가했다. 모션을 줄이는 설정에서는 CSS가 `animation: none`이라 `animationend`가 오지 않아 `data-shake`가 영구히 남고, 그 속성에 걸린 스타일(붉은 테두리)이 지워지지 않았다. `@shared-core` 헤더를 붙여 otp-input의 복사본과 해시로 묶었다.
- 데모 4종과 레지스트리 등록, README 카탈로그 4행·배지(fe-ui 33, tests 257) 갱신.
- 테스트 55건 추가(총 257건): `otpInputCore`(12) `themeTransitionCore`(7) `useTheme`(8) `suggestSearchCore`(8) `searchSuggest`(8) `virtualRange`(10) + `shakeCore` 2건 추가.

### 게이트 결과

| 게이트 | 결과 |
|--------|------|
| 빌드·린트·테스트 | 통과 (257 tests) |
| 스킬 구조 검증 | 통과 (공유 코어 해시 일치 포함) |
| 브라우저 실동작 | 4종 모두 확인 — 인증번호 자동 이동·흔들림·통과, 테마 원 확산(중간 프레임 2장), 자동완성 방향키·Enter 선택·요청 1회, 가상 스크롤 1만 개 중 DOM 14개(28만px 지점에서 #4,998부터) |
| 모션 리뷰(fe-craft) | 통과 — 아래 판단 근거 |

### 사용자 육안 확인 후 수정 (3건)

1. **theme-toggle 아이콘이 8px 오른쪽으로 밀려 있었다.** `.theme-toggle`이 자기 `padding`을 선언하지 않아 프로젝트 전역 `button { padding: .5rem 1rem }`이 스며들었고, 내용 영역(2px)이 아이콘(18px)보다 좁아져 그리드 트랙이 늘어나지 못하고 왼쪽에 붙었다. `padding: 0` + `place-content: center`를 못박았다.
2. **원이 엉뚱한 곳에서 시작하고 다 덮기 전에 끝났다.** `clip-path`를 px로 준 것이 원인이다 — `::view-transition-new()`가 그리는 것은 화면 스냅샷이고 그 안에서 길이는 장치 픽셀 기준으로 해석돼, dpr 2 화면에서 위치와 반지름이 정확히 절반이 됐다(끝에서 나머지 절반이 툭 바뀌던 것이 "매끄럽지 않다"의 정체). 백분율로 바꿔 화면 배율과 무관하게 맞도록 했다(중심 `x/width*100%`, 반지름 기준값은 `대각선÷√2`). 브라우저에서 실측·재확인했다.
3. **이징을 완만한 ease-in-out으로 바꿨다.** 눈에 보이는 것은 반지름이 아니라 가장자리가 화면을 쓸고 가는 속도라, 강한 ease-out에서는 초반에 튀고 후반에 기어간다.
4. **virtual-list의 빈 칸 완화.** 원인 둘을 나눠 처리했다 — (a) 데모의 "맨 위로"가 `behavior: 'smooth'`로 28만px를 훑어 이동 내내 비었다(즉시 이동으로 변경), (b) 손가락 플링에서는 훅이 스크롤 속도를 재서 진행 방향으로만 최대 24개를 미리 그리고(`maxLead`), 멎으면 150ms 뒤 걷어낸다. 브라우저 실측: 정지 11행 → 플링 중 38행 → 멎은 뒤 14행.

### 모션 리뷰 판단

- theme-toggle 450ms는 UI 예산(300ms)을 넘지만 **드물게 일어나는 조작 + 화면 전체를 덮는 원**이라 허용했고 SKILL.md에 근거를 적었다.
- otp-input 흔들림 420ms는 기존 form-shake-error와 같은 값으로 맞췄다(응집).
- search-suggest는 결과가 없는 검색어를 계속 칠 때 패널이 닫혔다 열리며 드롭 연출이 반복될 수 있다 — 구조를 바꾸는 대신 "결과 없음을 직접 그려 패널을 열어 두라"를 주의사항에 적었다.

## 3. 주의사항

- **README 배지가 PR #16과 충돌한다.** 이 브랜치는 `main`(29종·202테스트) 기준이라 33종·257테스트로 적었고, PR #16도 같은 줄을 33종·245테스트로 바꾼다. 먼저 머지되는 쪽 기준으로 나머지 하나를 다시 계산해야 한다(둘 다 머지되면 fe-ui 37종). `node scripts/validateSkills.mjs`가 숫자를 검사하므로 머지 후 반드시 한 번 돌린다.
- **가상 스크롤의 빈 칸은 완화까지가 한계다.** 브라우저는 스크롤을 별도 스레드에서 처리하고 무엇을 그릴지는 자바스크립트가 정하므로, 아주 빠른 플링에서는 여전히 잠깐 비어 보일 수 있다. SKILL.md에 "웹의 구조적 한계"로 명시하고 완화 수단 4가지를 표로 정리했다.
- **`shakeCore.ts`는 이제 두 스킬에 같은 파일로 존재한다**(form-shake-error가 원본). 고칠 때는 원본만 고치고 복사본을 다시 덮는다 — 해시가 다르면 구조 검증이 막는다.
- theme-toggle을 문서 전체에 쓰려면 `<head>` 인라인 스크립트로 새로고침 깜빡임을 막아야 한다(SKILL.md 2번 항목). 데모는 카드 영역만 전환하므로 해당 없음.
- virtual-list는 **항목 높이가 모두 같아야 한다.** 높이가 제각각인 목록은 범위 밖이며 SKILL.md가 라이브러리를 가리킨다.
- search-suggest의 `fetchSuggestions`는 `signal`을 fetch에 그대로 넘겨야 취소가 실제로 동작한다 — 넘기지 않으면 응답만 버리고 통신은 계속된다.
- 커밋·PR은 사용자가 직접 진행한다.
