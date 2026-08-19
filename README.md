# fe-skills

프론트엔드 애니메이션/UI/UX 구현 스킬 저장소입니다. AI 에이전트에게 코딩을 맡길 때, 에이전트가 이 스킬을 읽고 검증된 패턴으로 애니메이션을 구현합니다. 각 스킬은 **사용 방법·예시 코드**와 함께 **사람이 눈으로 확인할 수 있는 라이브 데모**를 제공합니다.

## 데모

https://guksu.github.io/fe-skills/

## 설치 (Claude Code)

```
/plugin marketplace add Guksu/fe-skills
/plugin install fe-skills@fe-skills
```

## 스킬 목록

| 스킬 | 설명 | 데모 |
|------|------|------|
| [enter-exit](plugin/skills/enter-exit/SKILL.md) | 진입/퇴장 애니메이션 — 모달·토스트의 나타남/사라짐 전환(퇴장까지 CSS로) | [보기](https://guksu.github.io/fe-skills/#/enter-exit) |
| [scroll-reveal](plugin/skills/scroll-reveal/SKILL.md) | 스크롤 리빌 — 뷰포트 진입 시 콘텐츠 순차 공개(IntersectionObserver) | [보기](https://guksu.github.io/fe-skills/#/scroll-reveal) |

## 구조

```
plugin/skills/{skill}/   스킬 정본 — SKILL.md(사용법) + assets/(예시 컴포넌트)
demo/                    데모 사이트(Vite+React) — assets/를 import해 렌더링만 한다
```

- **정본은 스킬 문서다.** 데모는 `plugin/skills/*/assets/`의 컴포넌트를 그대로 import한다(복사본 없음).
- 기술 기준: **CSS 우선** — CSS로 되는 것은 의존성 없이, 어려운 것만 라이브러리.
- 모든 스킬은 `prefers-reduced-motion`을 지원합니다.

## 개발

```bash
npm install
npm run dev    # 데모 개발 서버
npm test       # 단위 테스트
npm run build  # 배포 빌드
```
