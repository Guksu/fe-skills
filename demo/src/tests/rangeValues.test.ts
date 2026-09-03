import { clampPair, lowerOnTop, nearerHandle, snapValue, toPercent, valueAtPercent } from '@skills/range-slider/assets/rangeValues'

/** 가격 필터: 0~50,000원, 1,000원 단위 */
const price = { min: 0, max: 50000, step: 1000 }

describe('rangeValues — 눈금·경계·교차 규칙', () => {
  it('가까운 눈금으로 맞춘다', () => {
    expect(snapValue({ ...price, value: 12400 })).toBe(12000)
    expect(snapValue({ ...price, value: 12600 })).toBe(13000)
  })

  it('범위 밖 값은 경계로 가둔다', () => {
    expect(snapValue({ ...price, value: -5000 })).toBe(0)
    expect(snapValue({ ...price, value: 99000 })).toBe(50000)
  })

  it('소수 눈금에서도 부동소수 오차가 남지 않는다', () => {
    expect(snapValue({ min: 0, max: 5, step: 0.1, value: 0.30000000000000004 })).toBe(0.3)
    expect(snapValue({ min: 0, max: 5, step: 0.1, value: 2.25 })).toBe(2.3)
  })

  it('아래 손잡이를 올려도 위 손잡이를 밀어내지 않는다 — 자기가 멈춘다', () => {
    const next = clampPair({ lower: 40000, upper: 30000, moved: 'lower' })

    expect(next).toEqual({ lower: 30000, upper: 30000 })
  })

  it('위 손잡이를 내려도 아래 손잡이를 밀어내지 않는다', () => {
    const next = clampPair({ lower: 30000, upper: 20000, moved: 'upper' })

    expect(next).toEqual({ lower: 30000, upper: 30000 })
  })

  it('최소 간격을 두면 그만큼 떨어져 멈춘다', () => {
    const next = clampPair({ lower: 40000, upper: 30000, moved: 'lower', minDistance: 5000 })

    expect(next).toEqual({ lower: 25000, upper: 30000 })
  })

  it('서로를 지나치지 않으면 그대로 둔다', () => {
    const next = clampPair({ lower: 10000, upper: 30000, moved: 'lower' })

    expect(next).toEqual({ lower: 10000, upper: 30000 })
  })

  it('값과 트랙 위치를 서로 옮긴다', () => {
    expect(toPercent({ ...price, value: 12500 })).toBe(25)
    expect(valueAtPercent({ ...price, percent: 25 })).toBe(13000) // 눈금에 맞춰진다
    expect(valueAtPercent({ ...price, percent: 0 })).toBe(0)
    expect(valueAtPercent({ ...price, percent: 100 })).toBe(50000)
  })

  it('최소와 최대가 같아도 나눗셈이 깨지지 않는다', () => {
    expect(toPercent({ min: 5, max: 5, value: 5 })).toBe(0)
  })

  it('트랙을 누르면 가까운 손잡이가 움직인다', () => {
    expect(nearerHandle({ value: 8000, lower: 5000, upper: 40000 })).toBe('lower')
    expect(nearerHandle({ value: 38000, lower: 5000, upper: 40000 })).toBe('upper')
    // 정확히 가운데면 아래쪽
    expect(nearerHandle({ value: 10000, lower: 5000, upper: 15000 })).toBe('lower')
  })

  it('겹친 손잡이는 몰려 있는 쪽 반대로 끌 수 있게 쌓는다', () => {
    // 오른쪽 끝에 몰림 → 왼쪽으로 끌 테니 아래쪽이 위에
    expect(lowerOnTop({ ...price, lower: 50000, upper: 50000 })).toBe(true)
    // 왼쪽 끝에 몰림 → 오른쪽으로 끌 테니 위쪽이 위에
    expect(lowerOnTop({ ...price, lower: 0, upper: 0 })).toBe(false)
  })
})
