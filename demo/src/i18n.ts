import { useEffect, useState } from 'react'
import type { DemoCategory } from './demos'

export type Lang = 'ko' | 'en'

const STORAGE_KEY = 'fe-skills-lang'

/** 처음 언어를 정하는 순서: URL의 ?lang= → 저장된 선택 → 브라우저 언어(한국어면 ko, 그 밖은 en) */
export const resolveInitialLang = ({ search, stored, navigatorLanguage }: { search: string; stored: string | null; navigatorLanguage: string }): Lang => {
  const fromUrl = new URLSearchParams(search).get('lang')
  if (fromUrl === 'ko' || fromUrl === 'en') return fromUrl
  if (stored === 'ko' || stored === 'en') return stored
  return navigatorLanguage.toLowerCase().startsWith('ko') ? 'ko' : 'en'
}

const readStored = () => {
  try {
    return window.localStorage.getItem(STORAGE_KEY)
  } catch {
    return null // 사생활 보호 모드 등 — 저장이 막혀도 화면은 동작해야 한다
  }
}

/** 언어 상태 — 선택은 브라우저에 기억되고 <html lang>에 반영된다 */
export const useLang = () => {
  const [lang, setLang] = useState<Lang>(() =>
    resolveInitialLang({ search: window.location.search, stored: readStored(), navigatorLanguage: navigator.language ?? 'ko' }),
  )

  useEffect(
    function persistAndReflectLang() {
      document.documentElement.lang = lang
      try {
        window.localStorage.setItem(STORAGE_KEY, lang)
      } catch {
        /* 저장 불가 — 세션 안에서만 유지 */
      }
    },
    [lang],
  )

  const toggle = () => setLang((prev) => (prev === 'ko' ? 'en' : 'ko'))
  return { lang, toggle }
}

/** 뼈대 문구 — 사이드바·홈·데모 페이지 공통. 데모 안의 조절 라벨·콘텐츠는 각 데모가 가진다(한국어) */
export const STRINGS = {
  ko: {
    tagline: '프론트엔드 애니메이션/UI/UX 스킬 데모',
    langToggle: 'English',
    langToggleLabel: '영어로 보기',
    homeIntro: (count: number) => `에이전트가 애니메이션/UI/UX를 구현할 때 참조하는 스킬 저장소입니다. 스킬 ${count}종 — 전부 바닐라 코어 + React 래퍼, 의존성 0, reduced-motion 대응.`,
    searchPlaceholder: '스킬 검색 — 이름·설명·slug',
    searchLabel: '스킬 검색',
    matches: (n: number) => `${n}개 일치`,
    noMatch: (query: string) => `"${query}"에 맞는 스킬이 없습니다.`,
    usage: '사용 예시',
    copy: '코드 복사',
    copied: '복사됨 ✓',
    skillDoc: '스킬 문서 →',
    demoNote: '데모 안의 조절 라벨과 예시 콘텐츠는 한국어입니다.',
  },
  en: {
    tagline: 'Frontend animation / UI / UX skill demos',
    langToggle: '한국어',
    langToggleLabel: 'View in Korean',
    homeIntro: (count: number) => `A skill library agents read before implementing animation, UI and UX. ${count} skills — all vanilla core + React wrapper, zero dependencies, reduced-motion aware.`,
    searchPlaceholder: 'Search skills — name, description, slug',
    searchLabel: 'Search skills',
    matches: (n: number) => `${n} match${n === 1 ? '' : 'es'}`,
    noMatch: (query: string) => `No skill matches "${query}".`,
    usage: 'Usage',
    copy: 'Copy code',
    copied: 'Copied ✓',
    skillDoc: 'Skill doc →',
    demoNote: 'Control labels and sample content inside each demo are in Korean.',
  },
} as const

export const CATEGORY_LABEL: Record<Lang, Record<DemoCategory, string>> = {
  ko: {
    '등장과 전환': '등장과 전환',
    '로딩과 진행': '로딩과 진행',
    피드백: '피드백',
    내비게이션: '내비게이션',
    제스처: '제스처',
    컨트롤: '컨트롤',
    '표면과 스타일': '표면과 스타일',
    '원칙과 검토': '원칙과 검토',
  },
  en: {
    '등장과 전환': 'Enter & transition',
    '로딩과 진행': 'Loading & progress',
    피드백: 'Feedback',
    내비게이션: 'Navigation',
    제스처: 'Gestures',
    컨트롤: 'Controls',
    '표면과 스타일': 'Surface & style',
    '원칙과 검토': 'Principles & review',
  },
}
