import { moveHighlight } from '@skills/select/assets/selectCore'

describe('moveHighlight — 리스트박스 키보드 내비게이션 판정 (순수 함수)', () => {
  it('ArrowDown은 다음 항목으로, 마지막에서는 멈춘다', () => {
    expect(moveHighlight({ index: 0, count: 3, key: 'ArrowDown' })).toBe(1)
    expect(moveHighlight({ index: 2, count: 3, key: 'ArrowDown' })).toBe(2)
  })

  it('ArrowUp은 이전 항목으로, 첫 항목에서는 멈춘다', () => {
    expect(moveHighlight({ index: 2, count: 3, key: 'ArrowUp' })).toBe(1)
    expect(moveHighlight({ index: 0, count: 3, key: 'ArrowUp' })).toBe(0)
  })

  it('하이라이트가 없을 때(-1) ArrowDown은 첫 항목, ArrowUp은 마지막 항목', () => {
    expect(moveHighlight({ index: -1, count: 3, key: 'ArrowDown' })).toBe(0)
    expect(moveHighlight({ index: -1, count: 3, key: 'ArrowUp' })).toBe(2)
  })

  it('Home·End는 양 끝으로 점프한다', () => {
    expect(moveHighlight({ index: 1, count: 5, key: 'Home' })).toBe(0)
    expect(moveHighlight({ index: 1, count: 5, key: 'End' })).toBe(4)
  })

  it('관련 없는 키는 하이라이트를 바꾸지 않는다', () => {
    expect(moveHighlight({ index: 1, count: 3, key: 'a' })).toBe(1)
    expect(moveHighlight({ index: 1, count: 3, key: 'Tab' })).toBe(1)
  })

  it('옵션이 없으면 항상 -1', () => {
    expect(moveHighlight({ index: 0, count: 0, key: 'ArrowDown' })).toBe(-1)
  })
})
