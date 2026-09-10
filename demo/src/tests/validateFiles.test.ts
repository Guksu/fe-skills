import { formatBytes, matchesAccept, validateFiles } from '@skills/file-upload/assets/validateFiles'

const makeFile = ({ name, type = '', size = 1000 }: { name: string; type?: string; size?: number }) => {
  const file = new File(['x'], name, { type })
  Object.defineProperty(file, 'size', { value: size })
  return file
}

const photo = makeFile({ name: '국수.png', type: 'image/png' })
const scan = makeFile({ name: '영수증.pdf', type: 'application/pdf' })
const huge = makeFile({ name: '동영상.png', type: 'image/png', size: 20 * 1024 * 1024 })

describe('validateFiles — 무엇을 받고 왜 거절하는가', () => {
  it('accept가 없으면 형식을 따지지 않는다', () => {
    const result = validateFiles({ files: [photo, scan] })

    expect(result.accepted).toEqual([photo, scan])
    expect(result.rejected).toEqual([])
  })

  it('형식이 맞지 않으면 이유를 type으로 돌려준다', () => {
    const result = validateFiles({ files: [photo, scan], accept: 'image/*' })

    expect(result.accepted).toEqual([photo])
    expect(result.rejected).toEqual([{ file: scan, reason: 'type' }])
  })

  it('accept는 와일드카드·확장자·정확한 형식 세 가지를 이해한다', () => {
    expect(matchesAccept({ file: photo, accept: 'image/*' })).toBe(true)
    expect(matchesAccept({ file: photo, accept: '.png' })).toBe(true)
    expect(matchesAccept({ file: photo, accept: 'image/png' })).toBe(true)
    expect(matchesAccept({ file: photo, accept: '.jpg,.jpeg' })).toBe(false)
    expect(matchesAccept({ file: scan, accept: 'image/*,.pdf' })).toBe(true)
  })

  it('용량이 넘치면 size로 거절한다', () => {
    const result = validateFiles({ files: [photo, huge], maxSizeBytes: 5 * 1024 * 1024 })

    expect(result.accepted).toEqual([photo])
    expect(result.rejected).toEqual([{ file: huge, reason: 'size' }])
  })

  it('개수 제한은 남은 자리만큼 받고 나머지만 거절한다 — 전부 되돌리지 않는다', () => {
    const files = [1, 2, 3, 4].map((n) => makeFile({ name: `${n}.png`, type: 'image/png' }))
    const result = validateFiles({ files, maxFiles: 3, currentCount: 1 })

    expect(result.accepted).toHaveLength(2) // 이미 1장 있으니 2장만 더
    expect(result.rejected).toEqual([
      { file: files[2], reason: 'count' },
      { file: files[3], reason: 'count' },
    ])
  })

  it('형식·용량·개수를 순서대로 본다 — 가장 먼저 걸린 이유를 돌려준다', () => {
    const result = validateFiles({ files: [huge], accept: 'application/pdf', maxSizeBytes: 100 })

    expect(result.rejected).toEqual([{ file: huge, reason: 'type' }])
  })

  it('크기를 사람이 읽는 단위로 바꾼다', () => {
    expect(formatBytes(512)).toBe('512B')
    expect(formatBytes(2048)).toBe('2.0KB')
    expect(formatBytes(5 * 1024 * 1024)).toBe('5.0MB')
    expect(formatBytes(21 * 1024 * 1024)).toBe('21MB')
  })
})
