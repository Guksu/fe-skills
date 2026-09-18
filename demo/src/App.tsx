import { useEffect, useState } from 'react'
import { CATEGORIES, demos, type DemoEntry } from './demos'
import { CATEGORY_LABEL, STRINGS, useLang, type Lang } from './i18n'

const slugFromHash = () => window.location.hash.replace(/^#\/?/, '')

/** 언어에 맞는 제목·설명 — 데모 안의 콘텐츠는 각 데모가 가지므로 여기서는 목록 정보만 바꾼다 */
const titleOf = ({ demo, lang }: { demo: DemoEntry; lang: Lang }) => (lang === 'en' ? demo.titleEn : demo.title)
const descriptionOf = ({ demo, lang }: { demo: DemoEntry; lang: Lang }) => (lang === 'en' ? demo.descriptionEn : demo.description)

export const App = () => {
  const [slug, setSlug] = useState(slugFromHash)
  const { lang, toggle } = useLang()
  const t = STRINGS[lang]

  useEffect(function syncSlugWithHash() {
    const onHashChange = () => setSlug(slugFromHash())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const active = demos.find((demo) => demo.slug === slug)

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="brand-row">
          <a className="brand" href="#/">
            fe-skills
          </a>
          <button type="button" className="lang-toggle" onClick={toggle} aria-label={t.langToggleLabel} lang={lang === 'ko' ? 'en' : 'ko'}>
            {t.langToggle}
          </button>
        </div>
        <p className="tagline">{t.tagline}</p>
        <nav>
          {CATEGORIES.map((category) => (
            <div key={category} className="nav-group">
              <span className="nav-group-title">{CATEGORY_LABEL[lang][category]}</span>
              {demos
                .filter((demo) => demo.category === category)
                .map((demo) => (
                  <a key={demo.slug} href={`#/${demo.slug}`} data-active={demo.slug === slug ? 'true' : 'false'}>
                    <span className="nav-emoji">{demo.emoji}</span>
                    {titleOf({ demo, lang })}
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
      <main className="content">{active ? <DemoPage demo={active} lang={lang} /> : <Home lang={lang} />}</main>
    </div>
  )
}

const DemoPage = ({ demo, lang }: { demo: DemoEntry; lang: Lang }) => {
  const t = STRINGS[lang]
  return (
    <>
      <header className="demo-header">
        <h1>
          <span aria-hidden="true">{demo.emoji}</span> {titleOf({ demo, lang })}
        </h1>
        <p>{descriptionOf({ demo, lang })}</p>
        <code>plugins/ui/skills/{demo.slug}/</code>
        {lang === 'en' && <p className="demo-lang-note">{t.demoNote}</p>}
      </header>
      {/* 데모 내부는 한국어 콘텐츠 — 스크린 리더가 언어를 바꿔 읽도록 lang을 명시한다 */}
      <div lang="ko">
        <demo.Component />
      </div>
      <UsageBlock demo={demo} lang={lang} />
    </>
  )
}

const UsageBlock = ({ demo, lang }: { demo: DemoEntry; lang: Lang }) => {
  const [copied, setCopied] = useState(false)
  const t = STRINGS[lang]

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
    <section className="usage" aria-label={t.usage}>
      <div className="usage-head">
        <h2>{t.usage}</h2>
        <div className="usage-actions">
          <button type="button" onClick={copy}>
            {copied ? t.copied : t.copy}
          </button>
          <a
            href={`https://github.com/Guksu/fe-skills/blob/main/plugins/ui/skills/${demo.slug}/SKILL.md`}
            target="_blank"
            rel="noreferrer"
          >
            {t.skillDoc}
          </a>
        </div>
      </div>
      <pre className="usage-code">
        <code>{demo.usage}</code>
      </pre>
    </section>
  )
}

const Home = ({ lang }: { lang: Lang }) => {
  const [query, setQuery] = useState('')
  const t = STRINGS[lang]
  const keyword = query.trim().toLowerCase()
  // 검색은 두 언어를 모두 뒤진다 — 영어 화면에서 한국어 이름을 기억하는 사람도, 그 반대도 찾을 수 있게
  const matches = (demo: DemoEntry) =>
    keyword === '' ||
    [demo.title, demo.description, demo.titleEn, demo.descriptionEn, demo.slug].some((text) => text.toLowerCase().includes(keyword))

  const visible = demos.filter(matches)

  return (
    <section className="home">
      <h1>fe-skills</h1>
      <p className="home-intro">{t.homeIntro(demos.length)}</p>
      <div className="home-search">
        <input
          type="search"
          placeholder={t.searchPlaceholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label={t.searchLabel}
        />
        {keyword && <span className="home-search-count">{t.matches(visible.length)}</span>}
      </div>
      {CATEGORIES.map((category) => {
        const group = visible.filter((demo) => demo.category === category)
        if (group.length === 0) return null
        return (
          <div key={category} className="home-group">
            <h2>{CATEGORY_LABEL[lang][category]}</h2>
            <ul className="demo-list">
              {group.map((demo) => (
                <li key={demo.slug}>
                  <a href={`#/${demo.slug}`}>
                    <span className="demo-card-emoji" aria-hidden="true">
                      {demo.emoji}
                    </span>
                    <span className="demo-card-body">
                      <strong>{titleOf({ demo, lang })}</strong>
                      <span>{descriptionOf({ demo, lang })}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )
      })}
      {visible.length === 0 && <p className="home-empty">{t.noMatch(query)}</p>}
    </section>
  )
}
