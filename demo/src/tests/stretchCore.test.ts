import { parallaxFrame, stretchFrame } from '@skills/stretchy-header/assets/stretchCore'

describe('parallaxFrame — 스크롤에 따른 이미지 지연 이동·페이드', () => {
  it('scrollTop 0에서는 항등(이동 0·불투명 1)', () => {
    expect(parallaxFrame({ scrollTop: 0, headerHeight: 240 })).toEqual({ translateY: 0, opacity: 1 })
    expect(parallaxFrame({ scrollTop: -30, headerHeight: 240 })).toEqual({ translateY: 0, opacity: 1 })
  })

  it('기본 비율 0.5 — 이미지가 콘텐츠의 절반 속도로 밀려 올라간다', () => {
    const frame = parallaxFrame({ scrollTop: 100, headerHeight: 240 })
    expect(frame.translateY).toBe(50) // 콘텐츠는 100 올라갔는데 이미지는 50만 되돌려 놓는다
    expect(parallaxFrame({ scrollTop: 100, headerHeight: 240, parallaxRatio: 0.2 }).translateY).toBe(20)
  })

  it('헤더 높이를 넘긴 스크롤은 클램프된다 — 이동은 headerHeight×비율, 불투명도는 0.3', () => {
    const frame = parallaxFrame({ scrollTop: 2000, headerHeight: 240 })
    expect(frame.translateY).toBe(120)
    expect(frame.opacity).toBeCloseTo(0.3)
    expect(parallaxFrame({ scrollTop: 120, headerHeight: 240 }).opacity).toBeCloseTo(0.65)
  })
})

describe('stretchFrame — 당김에 따른 늘어남(고무줄 저항)', () => {
  it('당김 0 이하는 항등(scale 1·이동 0)', () => {
    expect(stretchFrame({ pull: 0, headerHeight: 240 })).toEqual({ scale: 1, translateY: 0 })
    expect(stretchFrame({ pull: -50, headerHeight: 240 })).toEqual({ scale: 1, translateY: 0 })
  })

  it('저항이 걸린다 — 당길수록 커지지만 증가폭은 줄고, scale은 1 + maxPull/headerHeight를 넘지 않는다', () => {
    const pulls = [20, 60, 120, 240, 600, 5000]
    const scales = pulls.map((pull) => stretchFrame({ pull, headerHeight: 240 }).scale)
    for (let i = 1; i < scales.length; i++) {
      expect(scales[i]).toBeGreaterThan(scales[i - 1]) // 단조증가
      expect(scales[i]).toBeGreaterThanOrEqual(1)
      expect(scales[i]).toBeLessThan(2) // maxPull 기본값 = headerHeight → 상한 2에 점근
    }
    // 실제 당김 거리보다 덜 늘어난다(저항) — 위 가장자리는 고정
    expect(stretchFrame({ pull: 120, headerHeight: 240 }).scale).toBeLessThan(1 + 120 / 240)
    expect(stretchFrame({ pull: 120, headerHeight: 240 }).translateY).toBe(0)
  })

  it('native 모드(브라우저가 이미 바운스한 경우) — 저항 없이 위 가장자리를 컨테이너 상단에 고정한다', () => {
    const frame = stretchFrame({ pull: 60, headerHeight: 240, native: true })
    expect(frame.translateY).toBe(-60) // 헤더 박스가 60 내려갔으니 이미지는 60 올려 상단에 붙인다
    expect(frame.scale).toBeCloseTo(1.25) // 아래 가장자리는 헤더 박스 바닥에 그대로: -60 + 240×1.25 = 240
  })
})
