import { computePinch, dimProgress, distance, midpoint } from '@skills/pinch-zoom/assets/pinchCore'

describe('pinchCore — 배율·이동·딤 순수 계산', () => {
  it('거리·중점을 계산한다', () => {
    expect(distance([{ x: 0, y: 0 }, { x: 3, y: 4 }])).toBe(5)
    expect(midpoint([{ x: 0, y: 0 }, { x: 10, y: 20 }])).toEqual({ x: 5, y: 10 })
  })

  it('손가락 거리 비율이 배율, 중점 이동이 평행이동이다', () => {
    const result = computePinch({
      start: [{ x: 100, y: 100 }, { x: 200, y: 100 }],
      current: [{ x: 60, y: 120 }, { x: 260, y: 120 }],
    })
    expect(result.scale).toBe(2)
    expect(result.tx).toBe(10)
    expect(result.ty).toBe(20)
  })

  it('배율은 minScale~maxScale로 클램프된다 (원본보다 작게 안 줄고, 최대 4배)', () => {
    const start: [{ x: number; y: number }, { x: number; y: number }] = [{ x: 0, y: 0 }, { x: 100, y: 0 }]
    expect(computePinch({ start, current: [{ x: 0, y: 0 }, { x: 50, y: 0 }] }).scale).toBe(1)
    expect(computePinch({ start, current: [{ x: 0, y: 0 }, { x: 900, y: 0 }] }).scale).toBe(4)
    expect(computePinch({ start, current: [{ x: 0, y: 0 }, { x: 900, y: 0 }], maxScale: 3 }).scale).toBe(3)
  })

  it('시작 거리가 0이면 배율 1로 안전하게 처리한다', () => {
    expect(computePinch({ start: [{ x: 5, y: 5 }, { x: 5, y: 5 }], current: [{ x: 0, y: 0 }, { x: 10, y: 0 }] }).scale).toBe(1)
  })

  it('딤 진행도는 1배에서 0, dimAtScale에서 1로 클램프된다', () => {
    expect(dimProgress({ scale: 1 })).toBe(0)
    expect(dimProgress({ scale: 1.5 })).toBe(0.5)
    expect(dimProgress({ scale: 3 })).toBe(1)
    expect(dimProgress({ scale: 2, dimAtScale: 3 })).toBe(0.5)
  })
})
