import { sameRange, virtualRange } from '@skills/virtual-list/assets/virtualRange'

/** 항목 50px, 상자 400px(=8개 보임), 여유분 없음 — 계산을 눈으로 확인할 수 있는 기본 설정 */
const base = { viewportHeight: 400, itemHeight: 50, itemCount: 1000, overscan: 0 }

describe('virtualRange — 보이는 구간 계산', () => {
  it('맨 위에서는 첫 화면에 걸치는 항목만 그린다', () => {
    const range = virtualRange({ ...base, scrollTop: 0 })

    expect(range.startIndex).toBe(0)
    expect(range.endIndex).toBe(8) // 0~7이 온전히 보이고 8이 경계에 걸친다
    expect(range.offsetY).toBe(0)
  })

  it('전체 높이는 개수 × 항목 높이 — 스크롤바가 진짜 길이를 갖는다', () => {
    expect(virtualRange({ ...base, scrollTop: 0 }).totalHeight).toBe(50000)
  })

  it('스크롤한 만큼 구간이 내려가고 묶음도 그만큼 밀린다', () => {
    const range = virtualRange({ ...base, scrollTop: 5000 })

    expect(range.startIndex).toBe(100)
    expect(range.endIndex).toBe(108)
    expect(range.offsetY).toBe(5000) // 100번째 항목의 자리
  })

  it('여유분을 주면 화면 위아래로 더 그린다 (빠른 스크롤에 빈 칸이 스치지 않게)', () => {
    const range = virtualRange({ ...base, scrollTop: 5000, overscan: 3 })

    expect(range.startIndex).toBe(97)
    expect(range.endIndex).toBe(111)
    expect(range.offsetY).toBe(4850) // 여유분까지 포함한 첫 항목의 자리
  })

  it('빠르게 아래로 스크롤하면 아래쪽만 더 그린다 (지나간 위쪽은 늘리지 않는다)', () => {
    const range = virtualRange({ ...base, scrollTop: 5000, lead: 10, direction: 1 })

    expect(range.startIndex).toBe(100) // 위쪽은 그대로
    expect(range.endIndex).toBe(118) // 아래쪽만 10개 늘었다
  })

  it('위로 스크롤하면 위쪽만 더 그린다', () => {
    const range = virtualRange({ ...base, scrollTop: 5000, lead: 10, direction: -1 })

    expect(range.startIndex).toBe(90)
    expect(range.endIndex).toBe(108)
  })

  it('멈춰 있으면 lead를 주어도 늘리지 않는다', () => {
    const range = virtualRange({ ...base, scrollTop: 5000, lead: 10, direction: 0 })

    expect(range.startIndex).toBe(100)
    expect(range.endIndex).toBe(108)
  })

  it('여유분이 목록 밖으로 나가지 않는다', () => {
    const top = virtualRange({ ...base, scrollTop: 0, overscan: 5 })
    expect(top.startIndex).toBe(0)

    const bottom = virtualRange({ ...base, scrollTop: 49600, overscan: 5 })
    expect(bottom.endIndex).toBe(999)
  })

  it('스크롤이 범위를 벗어나도(고무줄 스크롤) 계산이 깨지지 않는다', () => {
    expect(virtualRange({ ...base, scrollTop: -200 }).startIndex).toBe(0)
    expect(virtualRange({ ...base, scrollTop: 999999 }).endIndex).toBe(999)
  })

  it('항목이 없으면 그릴 것도 없다', () => {
    const range = virtualRange({ ...base, itemCount: 0, scrollTop: 0 })

    expect(range.endIndex).toBe(-1) // start > end = 그리지 않는다
    expect(range.totalHeight).toBe(0)
  })

  it('항목이 상자보다 적으면 전부 그린다', () => {
    const range = virtualRange({ ...base, itemCount: 3, scrollTop: 0 })

    expect(range.startIndex).toBe(0)
    expect(range.endIndex).toBe(2)
    expect(range.totalHeight).toBe(150)
  })

  it('높이를 아직 모를 때(0)도 예외를 내지 않는다 — 첫 렌더 직전', () => {
    const range = virtualRange({ ...base, itemHeight: 0, scrollTop: 0 })

    expect(range.endIndex).toBe(-1)
    expect(range.totalHeight).toBe(0)
  })

  it('sameRange는 구간이 그대로면 참 — 이것으로 리렌더를 건너뛴다', () => {
    const a = virtualRange({ ...base, scrollTop: 5000 })
    const b = virtualRange({ ...base, scrollTop: 5010 }) // 같은 항목들이 보인다
    const c = virtualRange({ ...base, scrollTop: 5100 }) // 한 칸 넘어갔다

    expect(sameRange(a, b)).toBe(true)
    expect(sameRange(a, c)).toBe(false)
  })
})
