import { useEffect, useState } from 'react'
import { CATEGORIES, demos, type DemoEntry } from './demos'

const slugFromHash = () => window.location.hash.replace(/^#\/?/, '')

export const App = () => {
  const [slug, setSlug] = useState(slugFromHash)

  useEffect(function syncSlugWithHash() {
    const onHashChange = () => setSlug(slugFromHash())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const active = demos.find((demo) => demo.slug === slug)

  return (
    <div className="layout">
      <aside className="sidebar">
        <a className="brand" href="#/">
          fe-skills
        </a>
        <p className="tagline">프론트엔드 애니메이션/UI/UX 스킬 데모</p>
        <nav>
          {CATEGORIES.map((category) => (
            <div key={category} className="nav-group">
              <span className="nav-group-title">{category}</span>
              {demos
                .filter((demo) => demo.category === category)
                .map((demo) => (
                  <a key={demo.slug} href={`#/${demo.slug}`} data-active={demo.slug === slug ? 'true' : 'false'}>
                    <span className="nav-emoji">{demo.emoji}</span>
                    {demo.title}
                  </a>
                ))}
            </div>
          ))}
        </nav>
        <footer>
          <a href="https://github.com/Guksu/fe-skills" target="_blank" rel="noreferrer">
            GitHub
          </a>
        </footer>
      </aside>
      <main className="content">{active ? <DemoPage demo={active} /> : <Home />}</main>
    </div>
  )
}

const DemoPage = ({ demo }: { demo: DemoEntry }) => (
  <>
    <header className="demo-header">
      <h1>
        <span aria-hidden="true">{demo.emoji}</span> {demo.title}
      </h1>
      <p>{demo.description}</p>
      <code>plugin/skills/{demo.slug}/</code>
    </header>
    <demo.Component />
    <UsageBlock demo={demo} />
  </>
)

const UsageBlock = ({ demo }: { demo: DemoEntry }) => {
  const [copied, setCopied] = useState(false)

  useEffect(
    function resetCopiedBadge() {
      if (!copied) return
      const timer = setTimeout(() => setCopied(false), 1500)
      return () => clearTimeout(timer)
    },
    [copied],
  )

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(demo.usage)
      setCopied(true)
    } catch {
      // 클립보드 권한이 없으면 선택 복사로 대신한다 — 코드는 화면에 이미 있다
    }
  }

  return (
    <section className="usage" aria-label="사용 예시">
      <div className="usage-head">
        <h2>사용 예시</h2>
        <div className="usage-actions">
          <button type="button" onClick={copy}>
            {copied ? '복사됨 ✓' : '코드 복사'}
          </button>
          <a
            href={`https://github.com/Guksu/fe-skills/blob/main/plugin/skills/${demo.slug}/SKILL.md`}
            target="_blank"
            rel="noreferrer"
          >
            스킬 문서 →
          </a>
        </div>
      </div>
      <pre className="usage-code">
        <code>{demo.usage}</code>
      </pre>
    </section>
  )
}

const Home = () => {
  const [query, setQuery] = useState('')
  const keyword = query.trim().toLowerCase()
  const matches = (demo: DemoEntry) =>
    keyword === '' ||
    [demo.title, demo.description, demo.slug].some((text) => text.toLowerCase().includes(keyword))

  const visible = demos.filter(matches)

  return (
    <section className="home">
      <h1>fe-skills</h1>
      <p className="home-intro">
        에이전트가 애니메이션/UI/UX를 구현할 때 참조하는 스킬 저장소입니다. 스킬 {demos.length}종 —
        전부 바닐라 코어 + React 래퍼, 의존성 0, reduced-motion 대응.
      </p>
      <div className="home-search">
        <input
          type="search"
          placeholder="스킬 검색 — 이름·설명·slug"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="스킬 검색"
        />
        {keyword && (
          <span className="home-search-count">
            {visible.length}개 일치
          </span>
        )}
      </div>
      {CATEGORIES.map((category) => {
        const group = visible.filter((demo) => demo.category === category)
        if (group.length === 0) return null
        return (
          <div key={category} className="home-group">
            <h2>{category}</h2>
            <ul className="demo-list">
              {group.map((demo) => (
                <li key={demo.slug}>
                  <a href={`#/${demo.slug}`}>
                    <span className="demo-card-emoji" aria-hidden="true">
                      {demo.emoji}
                    </span>
                    <span className="demo-card-body">
                      <strong>{demo.title}</strong>
                      <span>{demo.description}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )
      })}
      {visible.length === 0 && <p className="home-empty">"{query}"에 맞는 스킬이 없습니다.</p>}
    </section>
  )
}
