import { useState } from 'react'
import { auditLayout, summarize, type Finding } from '@skills/layout-audit/assets/auditLayout'
import './layout-audit-demo.css'

const BAD_TSX = `// 국수집 메뉴 구역 — 고치기 전
export const MenuSection = () => (
  <section className="rounded-2xl border bg-white p-6 shadow-xl text-center">
    <h2 className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
      오늘의 국수
    </h2>
    <p>멸치와 다시마로 여섯 시간 우린 국물에 손으로 뽑은 중면을 말았습니다. 고명은 그날 들어온 애호박과 달걀지단만 올립니다.</p>
    <div className="rounded-xl border bg-gray-50 p-2.5 shadow-lg">
      <span className="text-[10px] font-bold">인기</span>
      <p className="text-lg font-extrabold">잔치국수</p>
      <img className="h-32 w-full object-fill" src="janchi.jpg" alt="잔치국수" />
    </div>
    <button className="bg-gradient-to-r from-purple-500 to-pink-500 px-5 py-2.5">담기</button>
  </section>
)`

const GOOD_TSX = `// 국수집 메뉴 구역 — 고친 뒤 (layout-principles 원칙)
export const MenuSection = () => (
  <section className="grid gap-6">
    <div className="grid gap-2">
      <h2 className="text-2xl font-bold">오늘의 국수</h2>
      <p className="max-w-prose text-base text-gray-600">멸치와 다시마로 여섯 시간 우린 국물에 손으로 뽑은 중면을 말았습니다.</p>
    </div>
    <article className="grid gap-3 rounded-xl border p-4">
      <img className="aspect-[4/3] w-full rounded-lg object-cover" src="janchi.jpg" alt="잔치국수" />
      <div className="grid gap-1">
        <p className="text-base font-semibold">잔치국수</p>
        <p className="text-sm text-gray-500">인기 · 8,000원</p>
      </div>
      <button className="h-11 rounded-lg bg-gray-900 px-6 text-white">담기</button>
    </article>
  </section>
)`

const BAD_CSS = `/* 국수집 주문 패널 — 고치기 전 */
.order-panel {
  padding: 18px;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(124, 58, 237, 0.25);
}

.order-panel .order-item {
  margin-bottom: 10px;
  padding: 10px 14px;
  border-radius: 10px;
  background: linear-gradient(135deg, #ede9fe, #fce7f3);
}

.order-item .price {
  font-size: 10px;
  font-weight: 800;
}

.order-desc {
  font-size: 13px;
  text-align: center;
}

.order-thumb {
  width: 64px;
  height: 40px;
  border-radius: 6px;
  object-fit: fill;
}

.order-total {
  font-size: 22px;
  font-weight: 900;
  border-radius: 20px;
  background: linear-gradient(90deg, #7c3aed, #db2777);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}`

const SAMPLES = [
  { label: '문제 있는 TSX', file: 'MenuSection.tsx', text: BAD_TSX },
  { label: '고친 TSX', file: 'MenuSection.tsx', text: GOOD_TSX },
  { label: '문제 있는 CSS', file: 'order-panel.css', text: BAD_CSS },
]

export const LayoutAuditDemo = () => {
  const [file, setFile] = useState(SAMPLES[0].file)
  const [text, setText] = useState(SAMPLES[0].text)

  const findings = auditLayout([{ file, text }])
  const summary = summarize(findings)

  return (
    <div className="playground">
      <section className="controls" aria-label="검사 대상">
        <div className="la-sample-group" role="group" aria-label="예시 불러오기">
          <span className="la-sample-title">예시 불러오기</span>
          <div className="la-samples">
            {SAMPLES.map((sample) => (
              <button
                key={sample.label}
                type="button"
                onClick={() => {
                  setFile(sample.file)
                  setText(sample.text)
                }}
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>
        <label>
          <span>파일 이름 (확장자로 CSS·마크업 규칙을 고른다)</span>
          <input type="text" value={file} onChange={(e) => setFile(e.target.value)} />
        </label>
        <p className="controls-note">
          왼쪽에 CSS나 TSX·HTML을 붙여 넣으면 오른쪽에 <code>file:line</code> 형식으로 결과가 바로 나옵니다. 같은 함수를 CLI(
          <code>node audit.mjs src/</code>)가 폴더 전체에 돌립니다. error는 읽히지 않는 글자, warn은 원칙을 보고 판단할 것입니다.
        </p>
      </section>

      <div className="la-stage">
        <textarea className="la-input" value={text} onChange={(e) => setText(e.target.value)} spellCheck={false} aria-label="검사할 소스" />
        <div className="la-result" aria-live="polite">
          <div className="la-summary" data-clean={findings.length === 0 ? 'true' : 'false'}>
            {findings.length === 0 ? '문제 없음 ✓' : `error ${summary.errors} · warn ${summary.warnings}`}
          </div>
          <ul className="la-findings">
            {findings.map((f: Finding, i) => (
              <li key={i} className="la-finding" data-severity={f.severity}>
                <code>
                  {f.file}:{f.line}
                </code>
                <span className="la-rule">{f.rule}</span>
                <p>{f.message}</p>
                <p className="la-fix">→ {f.fix}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
