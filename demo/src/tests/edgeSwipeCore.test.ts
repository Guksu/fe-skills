import { isEdgeStart, progressFrom, shouldCommit, underlayFrame } from '@skills/edge-swipe-back/assets/edgeSwipeCore'

describe('edgeSwipeCore — 가장자리 판정·진행도·커밋 판정·이전 화면 프레임', () => {
  it('가장자리 시작 판정 — 왼쪽 edgeWidth(기본 24px) 안에서만 시작한다', () => {
    expect(isEdgeStart({ x: 0 })).toBe(true)
    expect(isEdgeStart({ x: 24 })).toBe(true)
    expect(isEdgeStart({ x: 25 })).toBe(false)
    expect(isEdgeStart({ x: 200 })).toBe(false)
    // 컨테이너 왼쪽 밖(음수)은 가장자리가 아니다
    expect(isEdgeStart({ x: -1 })).toBe(false)
  })

  it('가장자리 폭은 조절할 수 있다', () => {
    expect(isEdgeStart({ x: 40, edgeWidth: 48 })).toBe(true)
    expect(isEdgeStart({ x: 40, edgeWidth: 24 })).toBe(false)
  })

  it('진행도는 폭 대비 끈 거리이고 0~1로 클램프된다', () => {
    expect(progressFrom({ dx: 100, width: 400 })).toBe(0.25)
    expect(progressFrom({ dx: 400, width: 400 })).toBe(1)
    expect(progressFrom({ dx: 900, width: 400 })).toBe(1)
    // 왼쪽으로 끌면(음수) 0 — 현재 화면은 왼쪽으로 움직이지 않는다
    expect(progressFrom({ dx: -50, width: 400 })).toBe(0)
    // 폭이 0이면(아직 레이아웃 전) 0 — NaN·Infinity가 새어 나가지 않는다
    expect(progressFrom({ dx: 50, width: 0 })).toBe(0)
  })

  it('커밋 판정 — 거리 임계(기본 0.4)를 넘기면 간다', () => {
    expect(shouldCommit({ progress: 0.4, velocity: 0 })).toBe(true)
    expect(shouldCommit({ progress: 0.39, velocity: 0 })).toBe(false)
    expect(shouldCommit({ progress: 0.3, velocity: 0, threshold: 0.25 })).toBe(true)
  })

  it('커밋 판정 — 짧게 끌어도 오른쪽으로 빠르게 튕기면(기본 0.5px/ms) 간다', () => {
    expect(shouldCommit({ progress: 0.1, velocity: 0.5 })).toBe(true)
    expect(shouldCommit({ progress: 0.1, velocity: 0.49 })).toBe(false)
    expect(shouldCommit({ progress: 0.1, velocity: 0.3, velocityThreshold: 0.25 })).toBe(true)
  })

  it('커밋 판정 — 거리를 넘겼어도 왼쪽으로 튕기면(−0.3px/ms 이하) 취소한다', () => {
    expect(shouldCommit({ progress: 0.7, velocity: -0.3 })).toBe(false)
    expect(shouldCommit({ progress: 0.7, velocity: -0.29 })).toBe(true)
  })

  it('이전 화면 프레임 — 진행도 0이면 −shift만큼 물러나 있고 어둡다', () => {
    expect(underlayFrame({ progress: 0 })).toEqual({ translateXPercent: -30, dimOpacity: 0.4 })
    expect(underlayFrame({ progress: 0, shift: 0.5 })).toEqual({ translateXPercent: -50, dimOpacity: 0.4 })
  })

  it('이전 화면 프레임 — 진행도 1이면 제자리(0)이고 어둠이 걷힌다', () => {
    expect(underlayFrame({ progress: 1 })).toEqual({ translateXPercent: 0, dimOpacity: 0 })
    const half = underlayFrame({ progress: 0.5 })
    expect(half.translateXPercent).toBeCloseTo(-15)
    expect(half.dimOpacity).toBeCloseTo(0.2)
  })

  it('이전 화면 프레임 — 어둠의 최대치도 조절할 수 있다', () => {
    expect(underlayFrame({ progress: 0, dim: 0.6 }).dimOpacity).toBeCloseTo(0.6)
    expect(underlayFrame({ progress: 0.5, dim: 0.6 }).dimOpacity).toBeCloseTo(0.3)
  })
})
