import { useEffect, useState } from 'react'
import type { DemoCategory } from './demos'

export type Lang = 'ko' | 'en'

const STORAGE_KEY = 'suta-lang'

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
    tagline: 'AI 슬롭 없는 UI — 패턴 데모',
    langToggle: 'English',
    langToggleLabel: '영어로 보기',
    menu: (count: number) => `패턴 목록 ${count}`,
    navLabel: '패턴',
    homeIntro: (count: number) => `AI가 만든 티가 나는 UI를 없애는 에이전트 스킬 suta의 패턴 데모입니다. 패턴 ${count}종 — 전부 바닐라 코어 + React 래퍼, 의존성 0, reduced-motion 대응.`,
    searchPlaceholder: '패턴 검색 — 이름·설명·slug',
    searchLabel: '패턴 검색',
    matches: (n: number) => `${n}개 일치`,
    noMatch: (query: string) => `"${query}"에 맞는 패턴이 없습니다.`,
    usage: '사용 예시',
    copy: '코드 복사',
    copied: '복사됨 ✓',
    skillDoc: '패턴 문서 →',
    demoNote: '데모 안의 조절 라벨과 예시 콘텐츠는 한국어입니다.',
  },
  en: {
    tagline: 'UI without AI slop — pattern demos',
    langToggle: '한국어',
    langToggleLabel: 'View in Korean',
    menu: (count: number) => `Patterns (${count})`,
    navLabel: 'Patterns',
    homeIntro: (count: number) => `Pattern demos for suta, an agent skill that removes the tell-tale signs of AI-made UI. ${count} patterns — all vanilla core + React wrapper, zero dependencies, reduced-motion aware.`,
    searchPlaceholder: 'Search patterns — name, description, slug',
    searchLabel: 'Search patterns',
    matches: (n: number) => `${n} match${n === 1 ? '' : 'es'}`,
    noMatch: (query: string) => `No pattern matches "${query}".`,
    usage: 'Usage',
    copy: 'Copy code',
    copied: 'Copied ✓',
    skillDoc: 'Pattern doc →',
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
