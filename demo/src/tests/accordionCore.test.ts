import { toggleOpen } from '@skills/accordion/assets/accordionCore'

describe('toggleOpen — 아코디언 열림 목록 판정 (순수 함수)', () => {
  it('multiple: 닫힌 항목을 열면 목록에 추가된다', () => {
    expect(toggleOpen({ openIds: ['a'], id: 'b' })).toEqual(['a', 'b'])
  })

  it('multiple: 열린 항목을 다시 누르면 목록에서 빠진다', () => {
    expect(toggleOpen({ openIds: ['a', 'b'], id: 'a' })).toEqual(['b'])
  })

  it('single: 다른 항목을 열면 기존 항목이 닫힌다', () => {
    expect(toggleOpen({ openIds: ['a'], id: 'b', single: true })).toEqual(['b'])
  })

  it('single: 열린 항목을 다시 누르면 전부 닫힌다', () => {
    expect(toggleOpen({ openIds: ['a'], id: 'a', single: true })).toEqual([])
  })

  it('빈 목록에서 열기 — 모드와 무관하게 해당 항목만 열린다', () => {
    expect(toggleOpen({ openIds: [], id: 'a' })).toEqual(['a'])
    expect(toggleOpen({ openIds: [], id: 'a', single: true })).toEqual(['a'])
  })
})
