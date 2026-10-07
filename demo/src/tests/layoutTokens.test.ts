import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { GAP, LEADING, LIMITS, RADIUS, RATIO, SPACE, TEXT, WEIGHT, groupGapOk, isOnGrid, nearestSpace, toPx } from '@skills/layout-principles/assets/layoutTokens'

// vitest는 demo/에서 돈다 — 정본 CSS를 파일로 읽어 TS 상수와 비교한다(두 벌이 어긋나면 검사기와 화면이 다른 척도를 쓴다)
const css = readFileSync(resolve(process.cwd(), '../skills/suta/patterns/layout-principles/assets/layout-tokens.css'), 'utf8')
const cssVar = (name: string) => css.match(new RegExp(`${name}:\\s*([^;]+);`))?.[1].trim()

describe('layoutTokens — CSS 토큰과 TS 상수가 같은 값이다', () => {
  it('간격 척도 8단계가 CSS와 일치하고, 이름의 숫자 × 4 = px다', () => {
    expect(Object.keys(SPACE)).toHaveLength(8)
    for (const [step, px] of Object.entries(SPACE)) {
      expect(cssVar(`--space-${step}`)).toBe(`${px}px`)
      expect(Number(step) * 4).toBe(px)
    }
  })

  it('글자 크기·줄 간격·굵기·반경이 CSS와 일치한다', () => {
    for (const [name, px] of Object.entries(TEXT)) expect(cssVar(`--text-${name}`)).toBe(`${px}px`)
    for (const [name, value] of Object.entries(LEADING)) expect(cssVar(`--leading-${name}`)).toBe(String(value))
    for (const [name, value] of Object.entries(WEIGHT)) expect(cssVar(`--weight-${name}`)).toBe(String(value))
    for (const [name, px] of Object.entries(RADIUS)) expect(cssVar(`--radius-${name}`)).toBe(`${px}px`)
  })

  it('간격 역할·크기 한계·이미지 비율이 CSS와 일치한다', () => {
    expect(cssVar('--gap-item')).toBe(`var(--space-${GAP.item / 4})`)
    expect(cssVar('--gap-group')).toBe(`var(--space-${GAP.group / 4})`)
    expect(cssVar('--gap-section')).toBe(`var(--space-${GAP.section / 4})`)
    expect(cssVar('--measure')).toBe(`${LIMITS.measureCh}ch`)
    expect(cssVar('--tap-min')).toBe(`${LIMITS.tapMinPx}px`)
    expect(cssVar('--control-height')).toBe(`${LIMITS.controlHeightPx}px`)
    expect(cssVar('--content-max')).toBe(`${LIMITS.contentMaxPx}px`)
    for (const [name, ratio] of Object.entries(RATIO)) expect(cssVar(`--ratio-${name}`)).toBe(ratio)
  })
})

describe('layoutTokens — 원칙이 값에 들어 있다', () => {
  it('묶음 안 간격은 묶음 사이의 절반 이하, 구역 사이는 묶음 사이보다 넓다 (P4)', () => {
    expect(groupGapOk({ inside: GAP.item, between: GAP.group })).toBe(true)
    expect(GAP.section).toBeGreaterThan(GAP.group)
    expect(groupGapOk({ inside: 16, between: 24 })).toBe(false)
    expect(groupGapOk({ inside: 12, between: 24 })).toBe(true)
  })

  it('글자 단계는 하한 12px에서 시작하고, 핵심 수치는 보조 줄의 2배·화면 제목은 본문의 1.5배 이상이다 (P2·P7)', () => {
    expect(Math.min(...Object.values(TEXT))).toBe(LIMITS.minTextPx)
    expect(TEXT.small).toBe(LIMITS.bodyMinPx)
    expect(TEXT.display / TEXT.small).toBeGreaterThanOrEqual(2)
    expect(TEXT.title / TEXT.body).toBeGreaterThanOrEqual(1.5)
  })

  it('굵기는 3종, 반경은 3종 + 완전 둥근 것이다 (P2·P10)', () => {
    expect(Object.keys(WEIGHT)).toHaveLength(3)
    expect(Object.keys(RADIUS).filter((name) => name !== 'full')).toHaveLength(3)
  })
})

describe('layoutTokens — 판정 함수', () => {
  it('toPx는 px·rem·em을 px로 바꾸고, 렌더 없이 모르는 값은 null이다', () => {
    expect(toPx('12px')).toBe(12)
    expect(toPx('0.75rem')).toBe(12)
    expect(toPx('1.5em')).toBe(24)
    expect(toPx('0')).toBe(0)
    expect(toPx('-8px')).toBe(-8)
    expect(toPx('50%')).toBeNull()
    expect(toPx('var(--space-4)')).toBeNull()
    expect(toPx('calc(1rem + 2px)')).toBeNull()
    expect(toPx('auto')).toBeNull()
  })

  it('isOnGrid는 4px 격자 위의 값과 선 두께(1·2px)를 허용한다', () => {
    expect([0, 1, 2, 4, 8, 20, 64, -16].every(isOnGrid)).toBe(true)
    expect([3, 5, 6, 10, 13, 18, 9.6].some(isOnGrid)).toBe(false)
  })

  it('nearestSpace는 척도에서 가장 가까운 값을 고르고, 같은 거리면 작은 쪽이다', () => {
    expect(nearestSpace(13)).toBe(12)
    expect(nearestSpace(10)).toBe(8)
    expect(nearestSpace(20)).toBe(16)
    expect(nearestSpace(28)).toBe(24)
    expect(nearestSpace(100)).toBe(64)
    expect(nearestSpace(-6)).toBe(-4)
  })
})
