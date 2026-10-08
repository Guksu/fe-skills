import { render, cleanup } from '@testing-library/react'
import { DemoLangContext } from '../demoLang'
import { demos } from '../demos'

// 데모 사이트의 영어 화면에 한국어가 새지 않는지 본다 — 데모를 'en'으로 렌더하고 보이는 글자와 읽히는 속성을 훑는다.
// 일부러 한국어를 보여 주는 곳(한글 조판 예시 등)은 그 요소에 lang="ko"를 달면 검사에서 빠진다.

const HANGUL = /[가-힣]/
const READ_ATTRIBUTES = ['aria-label', 'aria-valuetext', 'aria-roledescription', 'placeholder', 'title', 'alt']

// 검사 코어가 만드는 결과 메시지가 한국어라, 화면 문구는 옮기되 결과 영역은 검사하지 않는다(셸이 안내 문구를 붙인다)
const KOREAN_OUTPUT = new Set(['layout-audit', 'motion-audit'])

const leaks = (root: HTMLElement) => {
  const copy = root.cloneNode(true) as HTMLElement
  copy.querySelectorAll('[lang="ko"], script, style, pre').forEach((node) => node.remove())
  const found: string[] = []
  const text = copy.textContent ?? ''
  for (const line of text.split(/\s{2,}|\n/)) if (HANGUL.test(line)) found.push(line.trim().slice(0, 60))
  copy.querySelectorAll('*').forEach((element) => {
    for (const name of READ_ATTRIBUTES) {
      const value = element.getAttribute(name)
      if (value && HANGUL.test(value)) found.push(`[${name}] ${value.slice(0, 60)}`)
    }
  })
  return found
}

beforeAll(() => {
  // jsdom에 없는 브라우저 API — 데모가 마운트될 수 있을 만큼만 채운다
  window.matchMedia ??= ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })) as typeof window.matchMedia
  class NoopObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return []
    }
  }
  window.IntersectionObserver ??= NoopObserver as unknown as typeof IntersectionObserver
  window.ResizeObserver ??= NoopObserver as unknown as typeof ResizeObserver
  Element.prototype.scrollTo ??= () => {}
  Element.prototype.scrollIntoView ??= () => {}
  window.scrollTo = () => {}
  HTMLCanvasElement.prototype.getContext = (() => null) as unknown as HTMLCanvasElement['getContext']
})

afterEach(cleanup)

describe('데모 문구 — 영어 화면에 한국어가 남지 않는다', () => {
  it.each(demos.filter((demo) => !KOREAN_OUTPUT.has(demo.slug)).map((demo) => [demo.slug, demo] as const))('%s', (_slug, demo) => {
    render(
      <DemoLangContext.Provider value="en">
        <div lang="en">
          <demo.Component />
        </div>
      </DemoLangContext.Provider>,
    )
    // 토스트·모달처럼 body로 나가는 요소까지 본다
    expect(leaks(document.body)).toEqual([])
  })
})

describe('데모 문구 — 기본(한국어)은 그대로다', () => {
  it.each(demos.map((demo) => [demo.slug, demo] as const))('%s', (_slug, demo) => {
    const { container } = render(<demo.Component />)
    expect(HANGUL.test(container.textContent ?? '')).toBe(true)
  })
})
