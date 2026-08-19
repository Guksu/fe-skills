import { useEffect, useState } from 'react'
import { demos } from './demos'

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
          {demos.map((demo) => (
            <a key={demo.slug} href={`#/${demo.slug}`} data-active={demo.slug === slug ? 'true' : 'false'}>
              {demo.title}
            </a>
          ))}
        </nav>
        <footer>
          <a href="https://github.com/Guksu/fe-skills" target="_blank" rel="noreferrer">
            GitHub
          </a>
        </footer>
      </aside>
      <main className="content">
        {active ? (
          <>
            <header className="demo-header">
              <h1>{active.title}</h1>
              <p>{active.description}</p>
              <code>plugin/skills/{active.slug}/</code>
            </header>
            <active.Component />
          </>
        ) : (
          <section className="home">
            <h1>fe-skills</h1>
            <p>
              에이전트가 애니메이션/UI/UX를 구현할 때 참조하는 스킬 저장소입니다. 각 스킬은 사용
              방법·예시 코드와 함께, 실제로 어떻게 보이는지 이 사이트에서 확인할 수 있습니다.
            </p>
            <ul className="demo-list">
              {demos.map((demo) => (
                <li key={demo.slug}>
                  <a href={`#/${demo.slug}`}>
                    <strong>{demo.title}</strong>
                    <span>{demo.description}</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  )
}
