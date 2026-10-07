/**
 * 편집 후 검사 훅의 순수 로직 — 훅 입력에서 고친 파일을 찾고, 검사 결과를 훅 응답(종료 코드·출력)으로 바꾼다.
 * 입출력(stdin·파일 읽기·종료)은 post-edit-hook.mjs가 맡는다. 여기는 테스트할 수 있는 판단만 둔다.
 *
 * 두 도구의 입력이 다르다.
 *  - Claude Code(Write·Edit·MultiEdit): tool_input.file_path
 *  - Codex(apply_patch): tool_input.command에 패치 본문 — `*** Add File:`·`*** Update File:`·`*** Move to:` 줄에 경로가 있다
 * 응답은 같다. error는 종료 코드 2 + stderr(두 도구 모두 에이전트에게 돌려보낸다), warn은 종료 0 + additionalContext(참고만).
 */
import { isAbsolute, resolve } from 'node:path'
import type { Finding } from '../patterns/motion-audit/assets/auditCore.ts'

export type HookInput = {
  cwd?: string
  hook_event_name?: string
  tool_name?: string
  tool_input?: Record<string, unknown>
}

export type HookResponse = { exitCode: 0 | 2; stdout: string; stderr: string }

const PATCH_PATH = /^\*\*\* (?:Add File|Update File|Move to): (.+)$/gm
const FILE_FIELDS = ['file_path', 'filePath', 'path']

/** 고친 파일(절대 경로) — 지운 파일은 빼고, Move는 옮기기 전·후를 모두 돌려준다(없는 파일은 호출 쪽이 거른다) */
export const editedFiles = ({ input, cwd }: { input: HookInput; cwd: string }) => {
  const base = typeof input.cwd === 'string' && input.cwd ? input.cwd : cwd
  const paths: string[] = []
  for (const [key, value] of Object.entries(input.tool_input ?? {})) {
    if (typeof value !== 'string') continue
    if (FILE_FIELDS.includes(key)) paths.push(value)
    else for (const match of value.matchAll(PATCH_PATH)) paths.push(match[1].trim())
  }
  return [...new Set(paths.map((path) => (isAbsolute(path) ? path : resolve(base, path))))]
}

const IGNORE_GUIDE =
  '의도된 예외라면 그 줄 바로 위에 이유를 적은 주석을 둔다 — /* layout-audit-ignore: {규칙} — {이유} */ 또는 /* motion-audit-ignore: {규칙} — {이유} */'

const oneLine = (f: Finding) => `- ${f.file}:${f.line} ${f.rule} — ${f.message}`

const listWithRest = ({ findings, max }: { findings: Finding[]; max: number }) => {
  const lines = findings.slice(0, max).map(oneLine)
  if (findings.length > max) lines.push(`… 외 ${findings.length - max}건`)
  return lines.join('\n')
}

/** 검사 결과 → 훅 응답. error는 막고(고친 뒤 계속), warn은 알리기만 하고, 깨끗하면 조용하다 */
export const hookResponse = ({ findings, maxLines = 5 }: { findings: Finding[]; maxLines?: number }): HookResponse => {
  const errors = findings.filter((f) => f.severity === 'error')
  const warns = findings.filter((f) => f.severity === 'warn')
  if (errors.length > 0) {
    const detail = errors.map((f) => `${f.file}:${f.line} [error] ${f.rule} — ${f.message}\n    → ${f.fix}`).join('\n')
    const warnPart = warns.length > 0 ? `\n\nwarn ${warns.length}건(판단해서 고친다):\n${listWithRest({ findings: warns, max: maxLines })}` : ''
    return { exitCode: 2, stdout: '', stderr: `suta 검사 — 방금 고친 파일에 error ${errors.length}건. 고친 뒤 계속한다.\n${detail}\n${IGNORE_GUIDE}${warnPart}\n` }
  }
  if (warns.length > 0) {
    const additionalContext = `suta 검사 warn ${warns.length}건 — 편집은 유지된다. 원칙(layout-principles·motion-principles)을 보고 고칠지 판단한다.\n${listWithRest({ findings: warns, max: maxLines })}`
    return { exitCode: 0, stdout: JSON.stringify({ hookSpecificOutput: { hookEventName: 'PostToolUse', additionalContext } }), stderr: '' }
  }
  return { exitCode: 0, stdout: '', stderr: '' }
}
