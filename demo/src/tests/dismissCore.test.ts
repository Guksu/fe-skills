import { dismissProgress, dismissScale, frameFromRect, interpolateFrame, isEdgeStart, shouldDismiss } from '@skills/swipe-dismiss-viewer/assets/dismissCore'

describe('dismissCore — 진행도·판정·보간·FLIP', () => {
  it('진행도는 거리 비례, 1에서 클램프, 방향 무관', () => {
    expect(dismissProgress({ dy: 120 })).toBe(0.5)
    expect(dismissProgress({ dy: -120 })).toBe(0.5)
    expect(dismissProgress({ dy: 900 })).toBe(1)
  })

  it('배율은 진행도 0에서 1, 1에서 minScale', () => {
    expect(dismissScale({ progress: 0 })).toBe(1)
    expect(dismissScale({ progress: 1 })).toBeCloseTo(0.65)
    expect(dismissScale({ progress: 0.5, minScale: 0.5 })).toBe(0.75)
  })

  it('닫기 판정 — 거리 또는 속도 중 하나만 넘어도 닫힌다', () => {
    expect(shouldDismiss({ dy: 130, velocityY: 0 })).toBe(true)
    expect(shouldDismiss({ dy: 30, velocityY: 900 })).toBe(true)
    expect(shouldDismiss({ dy: 30, velocityY: -900 })).toBe(true)
    expect(shouldDismiss({ dy: 60, velocityY: 200 })).toBe(false)
  })

  it('가장자리 시작 판정 — 좌우 24px', () => {
    expect(isEdgeStart({ x: 10, viewportWidth: 400 })).toBe(true)
    expect(isEdgeStart({ x: 390, viewportWidth: 400 })).toBe(true)
    expect(isEdgeStart({ x: 200, viewportWidth: 400 })).toBe(false)
  })

  it('프레임 보간', () => {
    const mid = interpolateFrame({ from: { x: 0, y: 0, scale: 1 }, to: { x: 100, y: -50, scale: 0.5 }, t: 0.5 })
    expect(mid).toEqual({ x: 50, y: -25, scale: 0.75 })
  })

  it('frameFromRect — 썸네일 rect를 중앙 이미지 기준 translate·scale로', () => {
    const frame = frameFromRect({
      rect: { left: 10, top: 20, width: 100, height: 100 },
      image: { left: 100, top: 200, width: 400, height: 400 },
    })
    expect(frame.scale).toBe(0.25)
    expect(frame.x).toBe(10 + 50 - (100 + 200)) // -240
    expect(frame.y).toBe(20 + 50 - (200 + 200)) // -330
  })
})
