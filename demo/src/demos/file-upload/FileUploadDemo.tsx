import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { FileDropZone, type UploadFile } from '@skills/file-upload/assets/FileDropZone'
import { formatBytes, type FileRejection } from '@skills/file-upload/assets/validateFiles'
import './file-upload-demo.css'

const MAX_SIZE = 3 * 1024 * 1024

const describe = (rejections: FileRejection[]) =>
  rejections
    .map(({ file, reason }) =>
      reason === 'type'
        ? `${file.name} — 이미지만 올릴 수 있어요`
        : reason === 'size'
          ? `${file.name} — ${formatBytes(MAX_SIZE)}를 넘습니다 (${formatBytes(file.size)})`
          : `${file.name} — 최대 장수를 넘었어요`,
    )
    .join('\n')

export const FileUploadDemo = () => {
  const [files, setFiles] = useState<UploadFile[]>([])
  const [maxFiles, setMaxFiles] = useState(4)
  const [failing, setFailing] = useState(false)
  const [message, setMessage] = useState('')
  const timers = useRef<number[]>([])

  useEffect(function clearTimersOnUnmount() {
    const running = timers.current
    return () => running.forEach((id) => window.clearInterval(id))
  }, [])

  /** 실제 서비스라면 XMLHttpRequest의 upload.progress를 잇는다 — 데모라 시간으로 흉내 낸다 */
  const fakeUpload = (id: string) => {
    let progress = 0
    const interval = window.setInterval(() => {
      progress += 8 + Math.random() * 14
      if (progress >= 100) {
        window.clearInterval(interval)
        setFiles((prev) =>
          prev.map((item) => (item.id === id ? { ...item, progress: 100, error: failing ? '업로드 실패 — 다시 시도해 주세요' : undefined } : item)),
        )
        return
      }
      setFiles((prev) => prev.map((item) => (item.id === id ? { ...item, progress } : item)))
    }, 180)
    timers.current.push(interval)
  }

  const add = (accepted: File[]) => {
    setMessage('')
    const added = accepted.map((file) => ({ id: `${file.name}-${Date.now()}-${Math.random()}`, file, progress: 0 }))
    setFiles((prev) => [...prev, ...added])
    added.forEach((item) => fakeUpload(item.id))
  }

  const vars = {
    '--upload-accent': 'var(--accent)',
    '--upload-border': 'var(--border)',
    '--upload-dim': 'var(--text-dim)',
    '--upload-track': 'var(--border)',
    '--upload-thumb-bg': 'var(--bg)',
    '--upload-error': '#f87171',
  } as CSSProperties

  return (
    <div className="playground">
      <section className="controls" aria-label="업로드 옵션">
        <label>
          <span>
            최대 장수 <code>maxFiles</code>
          </span>
          <input type="range" min={1} max={8} step={1} value={maxFiles} onChange={(e) => setMaxFiles(Number(e.target.value))} />
          <output>{maxFiles}장</output>
        </label>
        <label className="controls-inline">
          <input type="checkbox" checked={failing} onChange={(e) => setFailing(e.target.checked)} />
          <span>서버가 실패로 응답</span>
        </label>
        <p className="controls-note">
          이미지 파일을 영역 안으로 <b>끌어다 놓아</b> 보세요 — 파일이 올라오면 테두리가 살아납니다. 영역을 <b>눌러서</b>{' '}
          고를 수도 있고, Tab으로 이동해 Enter로도 열립니다. 이미지가 아닌 파일이나 {formatBytes(MAX_SIZE)}를 넘는 파일을
          섞어 놓으면 <b>이유와 함께</b> 거절합니다. 영역 <b>바깥</b>에 놓아도 브라우저가 파일을 열지 않습니다.
        </p>
      </section>

      <div className="fu-stage" style={vars}>
        <h2 className="fu-title">리뷰 사진 첨부</h2>

        <FileDropZone
          files={files}
          onAdd={add}
          onRemove={(id) => setFiles((prev) => prev.filter((item) => item.id !== id))}
          onReject={(rejections) => setMessage(describe(rejections))}
          accept="image/*"
          maxSizeBytes={MAX_SIZE}
          maxFiles={maxFiles}
        />

        {message && (
          <p className="fu-message" role="alert">
            {message}
          </p>
        )}

        <div className="fu-footer">
          <span>
            {files.length} / {maxFiles}장
          </span>
          <button type="button" onClick={() => setFiles([])} disabled={files.length === 0}>
            모두 지우기
          </button>
        </div>
      </div>
    </div>
  )
}
