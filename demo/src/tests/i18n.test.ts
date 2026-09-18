import { resolveInitialLang, CATEGORY_LABEL, STRINGS } from '../i18n'
import { CATEGORIES, demos } from '../demos'

describe('i18n — 처음 언어 결정', () => {
  it('URL의 ?lang= 이 가장 우선한다', () => {
    expect(resolveInitialLang({ search: '?lang=en', stored: 'ko', navigatorLanguage: 'ko-KR' })).toBe('en')
    expect(resolveInitialLang({ search: '?x=1&lang=ko', stored: 'en', navigatorLanguage: 'en-US' })).toBe('ko')
  })

  it('URL에 없으면 저장된 선택, 그것도 없으면 브라우저 언어(한국어면 ko, 아니면 en)', () => {
    expect(resolveInitialLang({ search: '', stored: 'en', navigatorLanguage: 'ko-KR' })).toBe('en')
    expect(resolveInitialLang({ search: '', stored: null, navigatorLanguage: 'ko' })).toBe('ko')
    expect(resolveInitialLang({ search: '', stored: null, navigatorLanguage: 'ja-JP' })).toBe('en')
    expect(resolveInitialLang({ search: '?lang=fr', stored: 'bogus', navigatorLanguage: 'en-GB' })).toBe('en')
  })
})

describe('i18n — 번역 누락 검사', () => {
  it('모든 카테고리에 영어 이름이 있다', () => {
    for (const category of CATEGORIES) {
      expect(CATEGORY_LABEL.en[category]).toBeTruthy()
      expect(CATEGORY_LABEL.ko[category]).toBe(category)
    }
  })

  it('모든 데모 항목에 영어 제목·설명이 있다', () => {
    for (const demo of demos) {
      expect(demo.titleEn, `${demo.slug} titleEn`).toBeTruthy()
      expect(demo.descriptionEn, `${demo.slug} descriptionEn`).toBeTruthy()
    }
  })

  it('두 언어의 뼈대 문구 키가 같다', () => {
    expect(Object.keys(STRINGS.en).sort()).toEqual(Object.keys(STRINGS.ko).sort())
  })
})
