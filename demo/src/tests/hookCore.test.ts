import { auditAll, isAuditTarget } from '../../../skills/suta/scripts/auditAll'
import { editedFiles, hookResponse } from '../../../skills/suta/scripts/hookCore'

const finding = ({ severity, line = 1 }: { severity: 'error' | 'warn'; line?: number }) => ({
  file: 'src/menu.css',
  line,
  rule: severity === 'error' ? 'tiny-text' : 'spacing-off-scale',
  severity,
  message: severity === 'error' ? '글자 10px — 읽히지 않는다(하한 12px)' : '4px 격자 밖 간격 1곳(3줄)',
  fix: '고치는 법',
})

describe('hookCore — 고친 파일 찾기', () => {
  it('Claude Code의 Write·Edit·MultiEdit는 tool_input.file_path다', () => {
    expect(editedFiles({ input: { tool_name: 'Edit', tool_input: { file_path: '/repo/src/menu.css' } }, cwd: '/repo' })).toEqual(['/repo/src/menu.css'])
    expect(editedFiles({ input: { tool_name: 'Write', tool_input: { file_path: 'src/App.tsx' } }, cwd: '/repo' })).toEqual(['/repo/src/App.tsx'])
  })

  it('Codex의 apply_patch는 패치 본문의 Add·Update·Move 줄을 cwd 기준으로 읽고, Delete는 뺀다', () => {
    const patch = [
      '*** Begin Patch',
      '*** Add File: src/new.css',
      '+.a { color: red; }',
      '*** Update File: src/App.tsx',
      '@@',
      '-old',
      '+new',
      '*** Update File: src/old-name.css',
      '*** Move to: src/new-name.css',
      '*** Delete File: src/gone.css',
      '*** End Patch',
    ].join('\n')
    const input = { tool_name: 'apply_patch', cwd: '/work/app', tool_input: { command: patch } }
    expect(editedFiles({ input, cwd: '/elsewhere' })).toEqual(['/work/app/src/new.css', '/work/app/src/App.tsx', '/work/app/src/old-name.css', '/work/app/src/new-name.css'])
  })

  it('입력에 파일이 없으면 빈 목록이다', () => {
    expect(editedFiles({ input: { tool_name: 'Bash', tool_input: { command: 'npm test' } }, cwd: '/repo' })).toEqual([])
    expect(editedFiles({ input: {}, cwd: '/repo' })).toEqual([])
  })
})

describe('hookCore — 훅 응답', () => {
  it('error가 있으면 종료 코드 2와 stderr — 고치는 법과 예외 주석 안내를 담는다', () => {
    const response = hookResponse({ findings: [finding({ severity: 'error' }), finding({ severity: 'warn', line: 3 })] })
    expect(response.exitCode).toBe(2)
    expect(response.stdout).toBe('')
    expect(response.stderr).toContain('src/menu.css:1 [error] tiny-text')
    expect(response.stderr).toContain('고치는 법')
    expect(response.stderr).toContain('layout-audit-ignore')
    expect(response.stderr).toContain('spacing-off-scale')
  })

  it('warn만 있으면 종료 코드 0과 additionalContext JSON — 최대 5줄로 줄인다', () => {
    const findings = Array.from({ length: 7 }, (_, i) => finding({ severity: 'warn', line: i + 1 }))
    const response = hookResponse({ findings })
    expect(response.exitCode).toBe(0)
    expect(response.stderr).toBe('')
    const output = JSON.parse(response.stdout)
    expect(output.hookSpecificOutput.hookEventName).toBe('PostToolUse')
    const context: string = output.hookSpecificOutput.additionalContext
    expect(context).toContain('warn 7건')
    expect(context.split('\n').filter((line) => line.startsWith('- '))).toHaveLength(5)
    expect(context).toContain('외 2건')
  })

  it('문제가 없으면 아무것도 출력하지 않는다', () => {
    expect(hookResponse({ findings: [] })).toEqual({ exitCode: 0, stdout: '', stderr: '' })
  })
})

describe('auditAll — 모션 + 레이아웃 통합 검사', () => {
  it('두 검사의 결과를 한 목록으로 합쳐 줄 순서로 돌려준다', () => {
    const text = `.a {\n  font-size: 10px;\n  transition: height 300ms ease;\n}`
    const findings = auditAll([{ file: 'a.css', text }])
    expect(findings.map((f) => `${f.line}:${f.rule}`)).toEqual(['2:tiny-text', '3:no-reduced-motion', '3:layout-animation'])
  })

  it('검사 대상 — 스타일·마크업·스크립트 파일만, 의존성·빌드 폴더와 테스트·타입 선언·압축 파일은 뺀다', () => {
    expect(['src/a.css', 'src/A.tsx', 'src/a.vue', 'src/a.ts', 'index.html'].every(isAuditTarget)).toBe(true)
    expect(['README.md', 'node_modules/x/a.css', 'dist/a.css', 'src/A.test.tsx', 'src/a.spec.ts', 'src/types.d.ts', 'src/a.min.css'].some(isAuditTarget)).toBe(false)
  })
})
