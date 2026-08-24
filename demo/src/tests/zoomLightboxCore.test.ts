import { openZoom } from '@skills/zoom-lightbox/assets/openZoom'

const withRect = ({ el, top, left, width, height }: { el: HTMLElement; top: number; left: number; width: number; height: number }) => {
  el.getBoundingClientRect = () =>
    ({ top, left, width, height, right: left + width, bottom: top + height, x: left, y: top, toJSON: () => ({}) }) as DOMRect
  return el
}

describe('openZoom — 썸네일이 화면 중앙 확대본으로 전환', () => {
  let source: HTMLElement

  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'requestAnimationFrame', 'cancelAnimationFrame'] })
    source = withRect({ el: document.createElement('img'), top: 500, left: 100, width: 120, height: 80 })
    document.body.appendChild(source)
  })
  afterEach(() => {
    document.querySelectorAll('.zoom-backdrop, .zoom-ghost').forEach((el) => el.remove())
    source.remove()
    vi.useRealTimers()
  })

  it('열면 백드롭과 고스트가 출발 rect에 뜨고, 프레임 뒤 중앙 확대 transform이 걸린다', () => {
    openZoom({ source })
    const ghost = document.querySelector('.zoom-ghost') as HTMLElement
    const backdrop = document.querySelector('.zoom-backdrop') as HTMLElement
    expect(ghost.style.left).toBe('100px')
    expect(ghost.style.top).toBe('500px')
    expect(backdrop.dataset.open).toBe('false')
    vi.advanceTimersByTime(50)
    expect(backdrop.dataset.open).toBe('true')
    expect(ghost.style.transform).toContain('translate')
    expect(ghost.style.transform).toContain('scale')
  })

  it('close()는 원위치로 되돌린 뒤 transitionend에서 정리하고 onClose를 부른다', () => {
    let closed = 0
    const close = openZoom({ source, onClose: () => (closed += 1) })
    vi.advanceTimersByTime(50)
    close()
    const ghost = document.querySelector('.zoom-ghost') as HTMLElement
    expect(ghost.style.transform).toBe('')
    ghost.dispatchEvent(new Event('transitionend'))
    expect(document.querySelector('.zoom-ghost')).toBeNull()
    expect(document.querySelector('.zoom-backdrop')).toBeNull()
    expect(closed).toBe(1)
  })

  it('백드롭 클릭과 Escape로 닫힌다', () => {
    openZoom({ source })
    vi.advanceTimersByTime(50)
    const backdrop = document.querySelector('.zoom-backdrop') as HTMLElement
    backdrop.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect((document.querySelector('.zoom-ghost') as HTMLElement).style.transform).toBe('')
    // 이미 닫히는 중 — Escape가 중복 동작해도 안전해야 한다
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    vi.advanceTimersByTime(1000)
    expect(document.querySelector('.zoom-ghost')).toBeNull()
  })

  it('transitionend가 유실돼도 타임아웃 폴백으로 정리된다', () => {
    const close = openZoom({ source, durationMs: 300 })
    vi.advanceTimersByTime(50)
    close()
    vi.advanceTimersByTime(800)
    expect(document.querySelector('.zoom-ghost')).toBeNull()
  })

  it('열려 있는 동안 body 스크롤이 잠기고 닫으면 풀린다', () => {
    const close = openZoom({ source })
    expect(document.body.style.overflow).toBe('hidden')
    close()
    const ghost = document.querySelector('.zoom-ghost') as HTMLElement
    ghost.dispatchEvent(new Event('transitionend'))
    expect(document.body.style.overflow).toBe('')
  })
})
