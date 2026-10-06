import { TRIGGER_STOPWORDS, createRanker, features } from '../../../scripts/lib/selection'

describe('selection — 특징 추출', () => {
  it('조사를 뗀 어간(가중 3)과 한글 음절 2-gram(가중 1)을 함께 뽑는다', () => {
    const extracted = features({ text: '바텀시트로 열어줘' })
    expect(extracted.get('w:바텀시트')).toBe(3)
    expect(extracted.get('b:텀시')).toBe(1)
  })

  it('기본 불용어는 ui·컴포넌트를 버리고, 트리거 평가용 불용어는 남긴다', () => {
    expect(features({ text: 'UI 컴포넌트 만들어줘' }).size).toBe(0)
    const kept = features({ text: 'UI 컴포넌트 만들어줘', stopwords: TRIGGER_STOPWORDS })
    expect(kept.has('w:ui')).toBe(true)
    expect(kept.has('w:컴포넌트')).toBe(true)
  })
})

describe('selection — 순위', () => {
  it('질의와 드문 단어가 겹치는 설명이 1위다', () => {
    const rank = createRanker({
      docs: [
        { name: 'sheet', description: '바텀시트 컴포넌트를 구현한다' },
        { name: 'toast', description: '토스트 알림을 구현한다' },
      ],
    })
    expect(rank('바텀시트 열기')[0].name).toBe('sheet')
  })

  it('겹치는 단어가 없으면 모두 0점이다', () => {
    const rank = createRanker({
      docs: [
        { name: 'apple', description: '사과' },
        { name: 'pear', description: '배' },
      ],
    })
    expect(rank('자동차').every((ranked) => ranked.score === 0)).toBe(true)
  })
})
