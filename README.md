<div align="center">

# suta

**AI 슬롭 없는 UI**

AI가 만든 티가 나는 UI를 없애는 에이전트 스킬입니다.<br>
한 번 설치하면 Claude Code·Codex가 UI를 만들 때마다 자동으로 읽습니다.

[![Deploy demo](https://github.com/Guksu/suta/actions/workflows/deploy-demo.yml/badge.svg)](https://github.com/Guksu/suta/actions/workflows/deploy-demo.yml)
![Patterns](https://img.shields.io/badge/suta-55%20patterns-6ea8fe)
![Dependencies](https://img.shields.io/badge/runtime%20deps-0-34c759)
![Tests](https://img.shields.io/badge/tests-578%20passing-34c759)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

[**라이브 데모**](https://guksu.github.io/suta/) · [상세 안내](docs/guide.md) · [English](README.en.md)

</div>

## 벤치마크

같은 요청 8개를 Claude Code에 두 번씩 맡기고, 만든 화면을 브라우저로 열어 쟀습니다. 한쪽은 아무것도 설치하지 않았고, 다른 쪽은 suta만 설치했습니다. 모델과 설정은 같습니다.

| 화면 16개 합계 (낮을수록 좋음) | 일반 Claude Code | suta 설치 |
|---|---|---|
| 접근성 위반 (axe) | 87 | 4 |
| 상자 안 상자 | 41 | 0 |
| 그라데이션·흐림·큰 그림자 | 47 | 0 |
| 24px 미만 터치 영역 | 27 | 0 |
| 12px 미만 글자가 있는 화면 | 4 | 0 |
| 320px에서 가로로 넘친 화면 | 2 | 0 |

결함은 크게 줄었습니다. 하지만 모델이 스크린샷을 블라인드로 비교한 판정에서는 일반 쪽이 더 많이 뽑혔습니다(32번 중 25번, 다른 판정 모델은 18번). 이유는 suta 쪽이 "깔끔하지만 밋밋하다"가 가장 많았습니다. 화면 하나에 드는 시간은 61초에서 96초로 늡니다. 방법과 판정 이유, 한계는 [벤치마크 문서](docs/benchmark.md)에 있습니다.

## 무엇을 해 주나

AI에게 화면을 맡기면 모든 섹션이 카드에 갇히고, 간격은 제각각이고, `transition: all`이 곳곳에 붙습니다. 이런 결과물을 **AI 슬롭**이라고 부릅니다. suta는 에이전트가 UI를 만들 때 금지선을 지키고, 검증된 패턴 55종의 코드를 쓰게 합니다.

| AI가 흔히 만드는 UI | suta를 쓰면 |
|---|---|
| 모든 화면이 같은 틀, 모든 섹션이 카드 | 화면 유형별 뼈대, 간격과 얇은 선으로 묶기 |
| 간격·글자·반경 값이 제각각, 9px 글자 | 토큰(척도)에서만 고르기, 글자 12px 이상 |
| 그라데이션·배지·채운 버튼이 곳곳에 | 강조는 화면마다 한두 곳 |
| `transition: all`, 높이를 움직이는 애니메이션 | `transform`·`opacity`만, 크기에 맞는 시간 |
| 키보드·스크린 리더·동작 줄이기 설정 무시 | 모든 패턴에 접근성과 동작 줄이기 대응 |

전체 목록은 [상세 안내 — 무엇을 없애나](docs/guide.md#무엇을-없애나)에 있습니다.

## 설치

**Claude Code**

```text
/plugin marketplace add Guksu/suta
/plugin install suta@suta
```

**Codex** — 설치한 뒤 `/hooks`에서 suta의 편집 후 검사를 승인합니다.

```bash
codex plugin marketplace add Guksu/suta
codex plugin add suta@suta
```

**Cursor · Gemini CLI · GitHub Copilot 등** — 스킬만 설치합니다.

```bash
npx skills add Guksu/suta --skill suta
```

설치 스크립트, 설치 폴더, 예전 버전에서 옮겨 오는 방법은 [상세 안내 — 설치](docs/guide.md#설치)에 있습니다.

## 쓰는 법

평소처럼 요청하면 됩니다. "로그인 화면 만들어줘", "이 버튼 애니메이션 다듬어줘"라고 말하면, 에이전트가 suta를 열어 맞는 패턴을 고릅니다.

- **편집 후 검사:** 플러그인으로 설치하면 파일을 고칠 때마다 레이아웃·모션 검사가 돕니다. 방금 바꾼 줄의 문제만 돌려받습니다. [자세히](docs/guide.md#편집-후-검사)
- **패턴 55종:** 바텀시트·토스트·캐러셀·폼 입력 등을 [라이브 데모](https://guksu.github.io/suta/)에서 직접 만져 볼 수 있습니다. [목록](docs/guide.md#패턴-55종)

## 더 알아보기

- [상세 안내](docs/guide.md) — 설치 전체, 동작 방식, 편집 후 검사, 패턴 55종, 개발과 기여
- [벤치마크](docs/benchmark.md) — 일반 Claude Code와 suta 비교의 방법·전체 지표·판정 이유
- [에이전트 작업 지침](AGENTS.md) — 이 저장소에서 일하는 코딩 에이전트용
- 연구: [레이아웃 원칙](docs/research/2026-10-06-layout-principles.md) · [화면 유형별 관례](docs/research/2026-10-07-screen-conventions.md)

## 라이선스

[MIT](LICENSE) © 2026 Guksu
