import { indexFromScrollTop, itemStyleAt, nextIndexForKey, scrollTopForIndex } from '@skills/wheel-picker/assets/wheelCore'

describe('wheelCore — 스크롤 위치↔인덱스·3D 항목 스타일·키보드 이동', () => {
  it('indexFromScrollTop은 항목 높이 단위로 반올림한다', () => {
    expect(indexFromScrollTop({ scrollTop: 0, itemHeight: 36, count: 10 })).toBe(0)
    expect(indexFromScrollTop({ scrollTop: 17, itemHeight: 36, count: 10 })).toBe(0)
    expect(indexFromScrollTop({ scrollTop: 18, itemHeight: 36, count: 10 })).toBe(1)
    expect(indexFromScrollTop({ scrollTop: 108, itemHeight: 36, count: 10 })).toBe(3)
  })

  it('indexFromScrollTop은 0~count-1로 클램프한다 (고무줄 스크롤·오버슈트)', () => {
    expect(indexFromScrollTop({ scrollTop: -40, itemHeight: 36, count: 10 })).toBe(0)
    expect(indexFromScrollTop({ scrollTop: 9999, itemHeight: 36, count: 10 })).toBe(9)
    expect(indexFromScrollTop({ scrollTop: 50, itemHeight: 36, count: 0 })).toBe(0)
  })

  it('scrollTopForIndex는 인덱스 × 항목 높이', () => {
    expect(scrollTopForIndex({ index: 0, itemHeight: 36 })).toBe(0)
    expect(scrollTopForIndex({ index: 4, itemHeight: 40 })).toBe(160)
  })

  it('itemStyleAt — 가운데(거리 0)는 평평하고 또렷하다', () => {
    expect(itemStyleAt({ distance: 0, maxVisible: 2 })).toEqual({ rotateX: 0, opacity: 1, translateZ: 0 })
  })

  it('itemStyleAt — 거리당 약 20도 기울고, 위 항목은 윗변이 뒤로(양의 각), 아래 항목은 그 반대', () => {
    const above = itemStyleAt({ distance: -1, maxVisible: 2 })
    const below = itemStyleAt({ distance: 1, maxVisible: 2 })
    expect(above.rotateX).toBeGreaterThanOrEqual(18)
    expect(above.rotateX).toBeLessThanOrEqual(22)
    expect(below.rotateX).toBe(-above.rotateX)
    expect(above.opacity).toBe(below.opacity)
    expect(above.opacity).toBeLessThan(1)
    expect(above.opacity).toBeGreaterThan(0)
    // 원통 뒤쪽으로 물러난다 — 멀수록 더
    expect(above.translateZ).toBeLessThan(0)
    expect(itemStyleAt({ distance: -2, maxVisible: 2 }).translateZ).toBeLessThan(above.translateZ)
    // 멀어질수록 흐려진다
    expect(itemStyleAt({ distance: 2, maxVisible: 2 }).opacity).toBeLessThan(below.opacity)
  })

  it('itemStyleAt — maxVisible 밖은 숨긴다(opacity 0), 소수 거리도 연속으로 계산한다', () => {
    expect(itemStyleAt({ distance: 3, maxVisible: 2 }).opacity).toBe(0)
    expect(itemStyleAt({ distance: -2.5, maxVisible: 2 }).opacity).toBe(0)
    const half = itemStyleAt({ distance: 0.5, maxVisible: 2 })
    expect(half.rotateX).toBeCloseTo(itemStyleAt({ distance: 1, maxVisible: 2 }).rotateX / 2)
    expect(half.opacity).toBeGreaterThan(itemStyleAt({ distance: 1, maxVisible: 2 }).opacity)
  })

  it('nextIndexForKey — 방향키·Home/End·PageUp/Down, 경계 클램프, 그 외 키는 null', () => {
    expect(nextIndexForKey({ index: 2, count: 10, key: 'ArrowDown', page: 3 })).toBe(3)
    expect(nextIndexForKey({ index: 2, count: 10, key: 'ArrowUp', page: 3 })).toBe(1)
    expect(nextIndexForKey({ index: 0, count: 10, key: 'ArrowUp', page: 3 })).toBe(0)
    expect(nextIndexForKey({ index: 9, count: 10, key: 'ArrowDown', page: 3 })).toBe(9)
    expect(nextIndexForKey({ index: 5, count: 10, key: 'Home', page: 3 })).toBe(0)
    expect(nextIndexForKey({ index: 5, count: 10, key: 'End', page: 3 })).toBe(9)
    expect(nextIndexForKey({ index: 8, count: 10, key: 'PageDown', page: 3 })).toBe(9)
    expect(nextIndexForKey({ index: 5, count: 10, key: 'PageUp', page: 3 })).toBe(2)
    expect(nextIndexForKey({ index: 5, count: 10, key: 'Enter', page: 3 })).toBeNull()
  })
})
