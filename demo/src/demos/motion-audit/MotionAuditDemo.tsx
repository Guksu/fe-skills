import { useState } from 'react'
import { auditMotion, summarize, type Finding } from '@skills/motion-audit/assets/auditMotion'
import { defineCopy, useDemoLang } from '../../demoLang'
import './motion-audit-demo.css'

// 예시 소스의 본문은 언어와 무관하다. 첫 줄 주석만 COPY에서 골라 붙인다(줄 번호가 두 언어에서 같다)
const BAD_CSS = `.menu-panel {
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

const GOOD_CSS = `.menu-panel {
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

const BAD_TS = `const el = document.querySelector('.ticker')
let x = 0
setInterval(() => {
  x += 2
  el.style.left = x + 'px'
}, 16)`

const SAMPLES = [
  { id: 'badCss', file: 'menu-panel.css', body: BAD_CSS, comment: (title: string) => `/* ${title} */` },
  { id: 'goodCss', file: 'menu-panel.css', body: GOOD_CSS, comment: (title: string) => `/* ${title} */` },
  { id: 'badTs', file: 'ticker.ts', body: BAD_TS, comment: (title: string) => `// ${title}` },
] as const

const COPY = defineCopy({
  ko: {
    samples: {
      badCss: { label: '문제 있는 CSS', title: '국수집 메뉴 패널 — 고치기 전' },
      goodCss: { label: '고친 CSS', title: '국수집 메뉴 패널 — 고친 뒤 (accordion·enter-exit 스킬 방식)' },
      badTs: { label: '문제 있는 TS', title: '주문 수량 티커 — 고치기 전' },
    },
    controlsLabel: '검사 대상',
    loadSample: '예시 불러오기',
    fileName: '파일 이름 (확장자로 CSS/JS 규칙을 고른다)',
    note: (
      <>
        왼쪽에 CSS나 TS를 붙여 넣으면 오른쪽에 <code>file:line</code> 형식으로 결과가 바로 나옵니다. 같은 함수를 CLI(
        <code>node audit.mjs src/</code>)가 폴더 전체에 돌립니다. error는 확실한 결함, warn은 판단이 필요한 것입니다.
      </>
    ),
    sourceLabel: '검사할 소스',
    clean: '문제 없음 ✓',
  },
  en: {
    samples: {
      badCss: { label: 'CSS with problems', title: 'Noodle House menu panel: before the fix' },
      goodCss: { label: 'Fixed CSS', title: 'Noodle House menu panel: after the fix (the accordion and enter-exit approach)' },
      badTs: { label: 'TS with problems', title: 'Order count ticker: before the fix' },
    },
    controlsLabel: 'What to check',
    loadSample: 'Load an example',
    fileName: 'File name (the extension picks CSS or JS rules)',
    note: (
      <>
        Paste CSS or TS on the left and results show up on the right as <code>file:line</code>. The CLI (<code>node audit.mjs src/</code>)
        runs the same function over a whole folder. error is a sure defect; warn needs a judgment call.
      </>
    ),
    sourceLabel: 'Source to check',
    clean: 'No issues ✓',
  },
})

type SampleId = (typeof SAMPLES)[number]['id']

export const MotionAuditDemo = () => {
  const t = COPY[useDemoLang()]
  const [file, setFile] = useState<string>(SAMPLES[0].file)
  // 고르기만 한 예시는 언어를 바꾸면 첫 줄 주석도 바뀐다. 사용자가 고쳐 쓰면 그 글을 그대로 둔다
  const [sampleId, setSampleId] = useState<SampleId>(SAMPLES[0].id)
  const [edited, setEdited] = useState<string | null>(null)
  const sample = SAMPLES.find((item) => item.id === sampleId) ?? SAMPLES[0]
  const text = edited ?? `${sample.comment(t.samples[sample.id].title)}\n${sample.body}`

  const findings = auditMotion([{ file, text }])
  const summary = summarize(findings)

  return (
    <div className="playground">
      <section className="controls" aria-label={t.controlsLabel}>
        <div className="ma-sample-group" role="group" aria-label={t.loadSample}>
          <span className="ma-sample-title">{t.loadSample}</span>
          <div className="ma-samples">
            {SAMPLES.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setFile(item.file)
                  setSampleId(item.id)
                  setEdited(null)
                }}
              >
                {t.samples[item.id].label}
              </button>
            ))}
          </div>
        </div>
        <label>
          <span>{t.fileName}</span>
          <input type="text" value={file} onChange={(e) => setFile(e.target.value)} />
        </label>
        <p className="controls-note">{t.note}</p>
      </section>

      <div className="ma-stage">
        <textarea className="ma-input" value={text} onChange={(e) => setEdited(e.target.value)} spellCheck={false} aria-label={t.sourceLabel} />
        <div className="ma-result" aria-live="polite">
          <div className="ma-summary" data-clean={findings.length === 0 ? 'true' : 'false'}>
            {findings.length === 0 ? t.clean : `error ${summary.errors} · warn ${summary.warnings}`}
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
