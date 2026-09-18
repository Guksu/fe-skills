import { useState } from 'react'
import { auditMotion, summarize, type Finding } from '@skills/motion-audit/assets/auditMotion'
import './motion-audit-demo.css'

const BAD_CSS = `/* 국수집 메뉴 패널 — 고치기 전 */
.menu-panel {
  transition: all 800ms ease-in;
  will-change: transform;
}

.menu-panel[data-open='false'] {
  height: 0;
  transition: height 300ms linear;
}

.menu-item {
  transition: transform 200ms linear;
}

.menu-item[data-state='exiting'] {
  transition: opacity 200ms ease-in;
}

.badge-new {
  animation: pulse 1s ease infinite;
}

@keyframes pulse {
  from { font-size: 12px; }
  to { font-size: 14px; }
}`

const GOOD_CSS = `/* 국수집 메뉴 패널 — 고친 뒤 (accordion·enter-exit 스킬 방식) */
.menu-panel {
  display: grid;
  grid-template-rows: 1fr;
  transition: grid-template-rows 250ms cubic-bezier(0.22, 1, 0.36, 1);
}

.menu-panel[data-open='false'] {
  grid-template-rows: 0fr;
}

.menu-item {
  transition:
    transform 250ms cubic-bezier(0.22, 1, 0.36, 1),
    opacity 250ms cubic-bezier(0.22, 1, 0.36, 1);
}

.menu-item[data-state='exiting'] {
  opacity: 0;
  transition-duration: 190ms;
}

.badge-new {
  animation: pulse 1.4s ease-in-out infinite;
}

@keyframes pulse {
  from { transform: scale(1); }
  to { transform: scale(1.08); }
}

@media (prefers-reduced-motion: reduce) {
  .menu-panel, .menu-item { transition-duration: 1ms; }
  .badge-new { animation: none; }
}`

const BAD_TS = `// 주문 수량 티커 — 고치기 전
const el = document.querySelector('.ticker')
let x = 0
setInterval(() => {
  x += 2
  el.style.left = x + 'px'
}, 16)`

const SAMPLES = [
  { label: '문제 있는 CSS', file: 'menu-panel.css', text: BAD_CSS },
  { label: '고친 CSS', file: 'menu-panel.css', text: GOOD_CSS },
  { label: '문제 있는 TS', file: 'ticker.ts', text: BAD_TS },
]

export const MotionAuditDemo = () => {
  const [file, setFile] = useState(SAMPLES[0].file)
  const [text, setText] = useState(SAMPLES[0].text)

  const findings = auditMotion([{ file, text }])
  const summary = summarize(findings)

  return (
    <div className="playground">
      <section className="controls" aria-label="검사 대상">
        <div className="ma-sample-group" role="group" aria-label="예시 불러오기">
          <span className="ma-sample-title">예시 불러오기</span>
          <div className="ma-samples">
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
          <span>파일 이름 (확장자로 CSS/JS 규칙을 고른다)</span>
          <input type="text" value={file} onChange={(e) => setFile(e.target.value)} />
        </label>
        <p className="controls-note">
          왼쪽에 CSS나 TS를 붙여 넣으면 오른쪽에 <code>file:line</code> 형식으로 결과가 바로 나옵니다. 같은 함수를 CLI(
          <code>node audit.mjs src/</code>)가 폴더 전체에 돌립니다. error는 확실한 결함, warn은 판단이 필요한 것입니다.
        </p>
      </section>

      <div className="ma-stage">
        <textarea className="ma-input" value={text} onChange={(e) => setText(e.target.value)} spellCheck={false} aria-label="검사할 소스" />
        <div className="ma-result" aria-live="polite">
          <div className="ma-summary" data-clean={findings.length === 0 ? 'true' : 'false'}>
            {findings.length === 0 ? '문제 없음 ✓' : `error ${summary.errors} · warn ${summary.warnings}`}
          </div>
          <ul className="ma-findings">
            {findings.map((f: Finding, i) => (
              <li key={i} className="ma-finding" data-severity={f.severity}>
                <code>
                  {f.file}:{f.line}
                </code>
                <span className="ma-rule">{f.rule}</span>
                <p>{f.message}</p>
                <p className="ma-fix">→ {f.fix}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
