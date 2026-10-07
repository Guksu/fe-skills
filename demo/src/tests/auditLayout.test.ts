import { readFileSync, readdirSync, statSync } from 'node:fs'
import { extname, join, resolve } from 'node:path'
import { auditLayout, formatFindings, summarize } from '@skills/layout-audit/assets/auditLayout'

type Findings = ReturnType<typeof auditLayout>
const rules = (findings: Findings) => findings.map((f) => f.rule)
const audit = (file: string, text: string) => auditLayout([{ file, text }])

describe('auditLayout — 글자 크기 하한 (tiny-text)', () => {
  it('11px 미만은 error, 11px대는 warn, 12px 이상과 0은 조용하다', () => {
    const text = `.a { font-size: 10px; }\n.b { font-size: 11px; }\n.c { font-size: 0.75rem; }\n.d { font-size: 0; }\n.e { font: 600 0.6rem/1.4 sans-serif; }`
    const findings = audit('a.css', text)
    expect(findings.map((f) => [f.rule, f.severity, f.line])).toEqual([
      ['tiny-text', 'error', 1],
      ['tiny-text', 'warn', 2],
      ['tiny-text', 'error', 5],
    ])
    expect(findings[0].fix).toContain('12px')
  })

  it('Tailwind 임의값과 JSX 인라인 스타일의 작은 글자도 잡는다', () => {
    const text = `export const Badge = () => (\n  <div>\n    <span className="text-[10px] font-bold">NEW</span>\n    <span style={{ fontSize: 9 }}>!</span>\n    <span className="text-xs">ok</span>\n  </div>\n)`
    const findings = audit('Badge.tsx', text)
    expect(findings.filter((f) => f.rule === 'tiny-text').map((f) => [f.line, f.severity])).toEqual([
      [3, 'error'],
      [4, 'error'],
    ])
  })
})

describe('auditLayout — 상자 안 상자 (nested-card)', () => {
  it('JSX에서 둥근 모서리 + 테두리·그림자·배경을 가진 요소 안의 같은 요소를 잡는다', () => {
    const text = [
      'export const Order = () => (',
      '  <div className="rounded-xl border bg-white p-4 shadow-sm">',
      '    <h2 className="text-lg font-semibold">주문</h2>',
      '    <div className="rounded-lg bg-gray-50 p-3">잔치국수</div>',
      '    <input className="rounded-lg border px-3" />',
      '    <button className="rounded-lg bg-black text-white">담기</button>',
      '  </div>',
      ')',
    ].join('\n')
    const findings = audit('Order.tsx', text).filter((f) => f.rule === 'nested-card')
    expect(findings.map((f) => f.line)).toEqual([4])
    expect(findings[0].severity).toBe('warn')
    expect(findings[0].message).toContain('2')
  })

  it('Card 컴포넌트 중첩과, 같은 묶음의 CSS가 상자로 정의한 클래스의 중첩도 잡는다', () => {
    const tsx = `const A = () => (\n  <Card>\n    <MenuCard name="비빔국수" />\n  </Card>\n)`
    expect(rules(audit('A.tsx', tsx))).toContain('nested-card')

    const css = `.order { border: 1px solid #ddd; border-radius: 12px; }\n.price { background: #f5f5f5; border-radius: 8px; }`
    const markup = `const B = () => (\n  <section className="order">\n    <p className="price">8,000원</p>\n  </section>\n)`
    const findings = auditLayout([
      { file: 'order.css', text: css },
      { file: 'B.tsx', text: markup },
    ])
    expect(findings.filter((f) => f.rule === 'nested-card').map((f) => `${f.file}:${f.line}`)).toEqual(['B.tsx:3'])
  })

  it('CSS의 자손 선택자와 SCSS 중첩으로 상자 안 상자를 잡고, 알약·원·입력칸은 빼다', () => {
    const css = [
      '.card { border-radius: 16px; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1); }',
      '.card .inner { background: #f5f5f5; border-radius: 8px; }',
      '.card .badge { background: #eee; border-radius: 999px; }',
      '.card input { border: 1px solid #ccc; border-radius: 8px; }',
    ].join('\n')
    expect(audit('a.css', css).filter((f) => f.rule === 'nested-card').map((f) => f.line)).toEqual([2])

    const scss = `.panel {\n  border: 1px solid #ddd;\n  border-radius: 12px;\n  .row {\n    background: #fafafa;\n    border-radius: 8px;\n  }\n}`
    expect(audit('a.scss', scss).filter((f) => f.rule === 'nested-card').map((f) => f.line)).toEqual([4])
  })

  it('컨트롤의 부속(thumb·track)은 상자로 보지 않고, calc()로 계산한 반경은 종류로 세지 않는다', () => {
    const css = [
      '.segmented { background: #eee; border-radius: 12px; }',
      '.segmented .segment-thumb { background: #fff; border-radius: 8px; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2); }',
      '.a { border-radius: 4px; }',
      '.b { border-radius: calc(var(--r, 12px) - 4px); }',
      '.c { border-radius: var(--r, 12px) var(--r, 12px) 0 0; }',
    ].join('\n')
    expect(rules(audit('a.css', css))).toEqual([])
  })

  it('형제 상자와 한 겹 카드는 조용하다', () => {
    const text = `const L = () => (\n  <ul className="flex flex-col gap-4">\n    <li className="rounded-xl border p-4">하나</li>\n    <li className="rounded-xl border p-4">둘</li>\n  </ul>\n)`
    expect(rules(audit('L.tsx', text))).not.toContain('nested-card')
  })
})

describe('auditLayout — 강조와 효과 (effect-overuse·gradient-text)', () => {
  it('한 파일에 색 그라데이션·backdrop-filter·큰 그림자가 3곳 이상이면 한 번 warn', () => {
    const text = [
      '.hero { background: linear-gradient(135deg, #8b5cf6, #ec4899); }',
      '.nav { backdrop-filter: blur(12px); }',
      '.cta { box-shadow: 0 0 24px rgba(236, 72, 153, 0.5); }',
      '.card { box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1); }',
    ].join('\n')
    const findings = audit('a.css', text).filter((f) => f.rule === 'effect-overuse')
    expect(findings).toHaveLength(1)
    expect(findings[0].line).toBe(1)
    expect(findings[0].message).toContain('3')
  })

  it('사진 위 글자를 받치는 검은 스크림과 스켈레톤 반짝임은 효과로 세지 않는다', () => {
    const text = [
      '.scrim { background: linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent); }',
      '.shimmer { background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent); }',
      '.nav { backdrop-filter: blur(12px); }',
      '.cta { box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2); }',
    ].join('\n')
    expect(rules(audit('a.css', text))).not.toContain('effect-overuse')
  })

  it('Tailwind 클래스의 효과도 세고, 그라데이션 글자는 따로 warn', () => {
    const text = `const H = () => (\n  <div className="bg-gradient-to-r from-purple-500 to-pink-500 shadow-2xl">\n    <h1 className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">국수</h1>\n    <nav className="backdrop-blur-md" />\n  </div>\n)`
    const found = rules(audit('H.tsx', text))
    expect(found).toContain('effect-overuse')
    expect(found).toContain('gradient-text')
    expect(audit('a.css', '.t { -webkit-background-clip: text; background-clip: text; }').filter((f) => f.rule === 'gradient-text')).toHaveLength(1)
  })
})

describe('auditLayout — 규격 (font-size·font-weight·radius 종류, spacing 척도)', () => {
  it('글자 크기 7종 이상, 굵기 4종 이상, 반경 4종 이상(0·50%·알약 제외)이면 파일마다 한 번 warn', () => {
    const sizes = [12, 13, 14, 15, 16, 18, 20].map((px, i) => `.s${i} { font-size: ${px}px; }`)
    const weights = [400, 500, 600, 700].map((w, i) => `.w${i} { font-weight: ${w}; }`)
    const radii = ['4px', '8px', '12px', '16px', '50%', '999px', '0'].map((r, i) => `.r${i} { border-radius: ${r}; }`)
    const found = rules(audit('a.css', [...sizes, ...weights, ...radii].join('\n')))
    expect(found.filter((r) => r === 'font-size-variety')).toHaveLength(1)
    expect(found.filter((r) => r === 'font-weight-variety')).toHaveLength(1)
    expect(found.filter((r) => r === 'radius-variety')).toHaveLength(1)

    const fewer = rules(audit('b.css', [...sizes.slice(0, 6), ...weights.slice(0, 3), ...radii.slice(1)].join('\n')))
    expect(fewer).not.toContain('font-size-variety')
    expect(fewer).not.toContain('font-weight-variety')
    expect(fewer).not.toContain('radius-variety')
  })

  it('4px 격자 밖 간격은 파일마다 한 번 요약하고 가까운 척도를 제안한다', () => {
    const text = `.a { padding: 10px 16px; margin: 0 auto; }\n.b { gap: 0.35rem; }\n.c { padding: 1px 2px; margin: -4px; gap: var(--space-2); }`
    const findings = audit('a.css', text).filter((f) => f.rule === 'spacing-off-scale')
    expect(findings).toHaveLength(1)
    expect(findings[0].line).toBe(1)
    expect(findings[0].message).toContain('2곳')
    expect(findings[0].fix).toContain('10px → 8px')
    expect(rules(audit('ok.css', '.a { padding: 12px 16px; gap: 0.5rem; margin: 0 auto; }'))).toEqual([])
  })

  it('Tailwind 간격의 반 단계(1.5·2.5)와 임의값도 척도 밖으로 센다', () => {
    const text = `const C = () => <div className="px-2.5 py-0.5 gap-1.5 mt-[13px] p-4">국수</div>`
    expect(audit('C.tsx', text).find((f) => f.rule === 'spacing-off-scale')?.message).toContain('3곳')
  })
})

describe('auditLayout — 정렬과 사진 (centered-text-block·image-distort)', () => {
  it('가운데 정렬 안의 긴 문단을 잡고, 짧은 한 줄은 그대로 둔다', () => {
    const long = '멸치와 다시마로 여섯 시간 우린 국물에 손으로 뽑은 중면을 말았습니다. 고명은 그날 들어온 애호박과 달걀지단만 올립니다.'
    const text = `const I = () => (\n  <div className="text-center">\n    <h1>국수집</h1>\n    <p>${long}</p>\n    <p>오늘 휴무</p>\n  </div>\n)`
    expect(audit('I.tsx', text).filter((f) => f.rule === 'centered-text-block').map((f) => f.line)).toEqual([4])
    const dynamic = `const E = ({ message }: { message: string }) => (\n  <div className="text-center">\n    <p>{message}</p>\n  </div>\n)`
    expect(rules(audit('E.tsx', dynamic))).not.toContain('centered-text-block')
    expect(audit('a.css', '.intro-desc { text-align: center; }\n.empty-title { text-align: center; }').filter((f) => f.rule === 'centered-text-block').map((f) => f.line)).toEqual([1])
  })

  it('object-fit: fill과 object-fill은 사진을 늘인다', () => {
    expect(rules(audit('a.css', 'img.thumb { width: 100%; height: 120px; object-fit: fill; }'))).toEqual(['image-distort'])
    expect(rules(audit('P.tsx', 'const P = () => <img className="object-fill h-32 w-full" src="a.jpg" alt="" />'))).toEqual(['image-distort'])
  })
})

describe('auditLayout — 예외 주석과 파일 종류', () => {
  it('layout-audit-ignore는 그 줄과 다음 줄을, layout-audit-ignore-file은 파일 전체의 그 규칙을 건너뛴다', () => {
    const text = `/* layout-audit-ignore: tiny-text — 차트 축 눈금 */\n.axis { font-size: 10px; }\n.note { font-size: 10px; }`
    expect(audit('a.css', text).map((f) => f.line)).toEqual([3])
    const fileWide = `/* layout-audit-ignore-file: effect-overuse — 유리 효과가 이 패턴의 목적 */\n.base { color: red; }\n.a { backdrop-filter: blur(8px); }\n.b { backdrop-filter: blur(8px); }\n.c { backdrop-filter: blur(8px); }`
    expect(rules(audit('glass.css', fileWide))).toEqual([])
  })

  it('Vue·Svelte·HTML은 style 블록을 CSS로, 나머지를 마크업으로 검사하고 줄 번호를 지킨다', () => {
    const vue = `<template>\n  <div class="rounded-xl border">\n    <div class="rounded-lg bg-gray-50">안</div>\n  </div>\n</template>\n<style scoped>\n.t { font-size: 9px; }\n</style>`
    expect(audit('A.vue', vue).map((f) => `${f.rule}:${f.line}`)).toEqual(['nested-card:3', 'tiny-text:7'])
    const html = `<!doctype html>\n<p style="font-size: 10px">작은 글자</p>`
    expect(audit('a.html', html).map((f) => `${f.rule}:${f.line}`)).toEqual(['tiny-text:2'])
  })

  it('TSX 안의 여러 줄 템플릿 문자열(예시 코드·HTML 문자열)은 마크업으로 읽지 않고, 한 줄 className 템플릿은 읽는다', () => {
    const text = [
      'const SAMPLE = `<div className="rounded-xl border">',
      '  <span className="text-[9px]">작은 글자</span>',
      '</div>`',
      'export const A = ({ on }: { on: boolean }) => <p className={`text-[10px] ${on ? "font-bold" : ""}`}>{SAMPLE}</p>',
    ].join('\n')
    expect(audit('A.tsx', text).map((f) => `${f.rule}:${f.line}`)).toEqual(['tiny-text:4'])
  })

  it('ts·js 파일과 주석 속 값은 검사하지 않는다', () => {
    expect(audit('util.ts', 'const css = ".a { font-size: 8px }"')).toEqual([])
    expect(audit('a.css', '/* font-size: 8px; object-fit: fill; */\n.a { color: red; }')).toEqual([])
  })

  it('요약과 file:line 형식 출력은 motion-audit와 같다', () => {
    const findings = audit('a.css', '.a { font-size: 10px; object-fit: fill; }')
    expect(summarize(findings)).toEqual({ errors: 1, warnings: 1 })
    expect(formatFindings(findings)).toContain('a.css:1 [error] tiny-text')
  })
})

describe('auditLayout — 저장소의 패턴 코드', () => {
  it('설치되는 패턴 assets 전체에서 error가 없다', () => {
    // vitest는 demo/에서 돈다 — 정본 패턴 폴더를 그대로 훑는다
    const root = resolve(process.cwd(), '../skills/suta/patterns')
    const collect = (dir: string): { file: string; text: string }[] =>
      readdirSync(dir).flatMap((name) => {
        const path = join(dir, name)
        if (statSync(path).isDirectory()) return collect(path)
        return ['.css', '.tsx', '.html'].includes(extname(path)) ? [{ file: path, text: readFileSync(path, 'utf8') }] : []
      })
    const sources = collect(root)
    expect(sources.length).toBeGreaterThan(50)
    expect(auditLayout(sources).filter((f) => f.severity === 'error')).toEqual([])
  })
})
