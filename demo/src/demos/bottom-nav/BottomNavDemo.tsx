import { useState, type CSSProperties } from 'react'
import { BottomNav } from '@skills/bottom-nav/assets/BottomNav'
import { shouldShowBottomNav } from '@skills/bottom-nav/assets/bottomNavCore'
import { Icon } from '@skills/layout-principles/assets/Icon'
import './bottom-nav-demo.css'

const TABS = [
  { href: '/', label: '홈', icon: <Icon name="home" />, currentIcon: <Icon name="home" filled /> },
  { href: '/category', label: '카테고리', icon: <Icon name="category" /> },
  { href: '/search', label: '검색', icon: <Icon name="search" /> },
  { href: '/wish', label: '찜', icon: <Icon name="heart" />, currentIcon: <Icon name="heart" filled /> },
  { href: '/my', label: '마이', icon: <Icon name="user" />, currentIcon: <Icon name="user" filled /> },
]
const TAB_PATHS = TABS.map((tab) => tab.href)

const MENU = [
  { id: 'janchi', name: '멸치육수 잔치국수', price: 8000 },
  { id: 'bibim', name: '매콤 비빔국수', price: 8500 },
  { id: 'kal', name: '바지락 칼국수', price: 9500 },
  { id: 'kong', name: '진한 콩국수', price: 10000 },
  { id: 'mandu', name: '손만두 한 접시', price: 6000 },
  { id: 'jjol', name: '쫄면', price: 8000 },
]
const CATEGORIES = ['국물 국수', '비빔 국수', '찬 국수', '만두·곁들임']
const TITLES: Record<string, string> = { '/category': '카테고리', '/search': '검색', '/wish': '찜', '/my': '마이' }

const won = (price: number) => `${price.toLocaleString('ko-KR')}원`

export const BottomNavDemo = () => {
  const [path, setPath] = useState('/')
  const [cartCount, setCartCount] = useState(2)
  const [wishCount, setWishCount] = useState(3)
  const [myDot, setMyDot] = useState(true)
  const [homeIndicator, setHomeIndicator] = useState(true)
  const [durationMs, setDurationMs] = useState(250)

  const showTabs = shouldShowBottomNav({ path, tabs: TAB_PATHS })
  const detailId = path.match(/^\/menu\/(\w+)$/)?.[1]
  const detail = MENU.find((item) => item.id === detailId)
  const items = TABS.map((tab) => (tab.href === '/wish' ? { ...tab, badge: wishCount } : tab.href === '/my' ? { ...tab, badge: myDot ? ('dot' as const) : undefined } : tab))
  const vars = { '--bottom-nav-duration': `${durationMs}ms` } as CSSProperties

  const cartButton = (
    <button type="button" className="tbd-icon-btn" aria-label={cartCount > 0 ? `장바구니, ${cartCount}개 담김` : '장바구니'}>
      <Icon name="cart" />
      {cartCount > 0 && (
        <span className="tbd-count" aria-hidden="true">
          {cartCount}
        </span>
      )}
    </button>
  )

  const menuRows = (list: typeof MENU) => (
    <ul className="tbd-list">
      {list.map((item) => (
        <li key={item.id}>
          <button type="button" className="tbd-row" onClick={() => setPath(`/menu/${item.id}`)}>
            <span className="tbd-tile" aria-hidden="true">
              <Icon name="image" size={20} />
            </span>
            <span className="tbd-row-text">
              <span className="tbd-row-name">{item.name}</span>
              <span className="tbd-row-price">{won(item.price)}</span>
            </span>
          </button>
        </li>
      ))}
    </ul>
  )

  return (
    <div className="playground">
      <section className="controls" aria-label="탭 바 옵션">
        <label>
          <span>
            찜 개수 배지 <code>badge</code>
          </span>
          <input type="range" min={0} max={120} value={wishCount} onChange={(e) => setWishCount(Number(e.target.value))} />
          <output>{wishCount}</output>
        </label>
        <label>
          <span>
            숨김 속도 <code>--bottom-nav-duration</code>
          </span>
          <input type="range" min={100} max={500} step={50} value={durationMs} onChange={(e) => setDurationMs(Number(e.target.value))} />
          <output>{durationMs}ms</output>
        </label>
        <label className="controls-inline">
          <input type="checkbox" checked={myDot} onChange={(e) => setMyDot(e.target.checked)} />
          마이에 새 소식 점
        </label>
        <label className="controls-inline">
          <input type="checkbox" checked={homeIndicator} onChange={(e) => setHomeIndicator(e.target.checked)} />
          아이폰 홈 표시줄(안전 영역 34px) 흉내
        </label>
        <p className="controls-note">
          메뉴를 눌러 상세로 가면 탭 바가 숨고 하단 담기 바만 남습니다. 검색 탭의 입력칸을 누르면 키보드가 올라온 것으로 보고 탭 바를 숨깁니다. 지금 탭을 다시 누르면 맨
          위로 올라갑니다.
        </p>
      </section>

      <div className="tbd-phone" data-home-indicator={homeIndicator ? 'true' : undefined} style={vars}>
        <div className="tbd-screen" data-tabs={showTabs ? 'true' : undefined} key={path}>
          {detail ? (
            <>
              <header className="tbd-head">
                <button type="button" className="tbd-icon-btn" aria-label="뒤로" onClick={() => setPath('/')}>
                  <Icon name="chevron-left" />
                </button>
                {cartButton}
              </header>
              <div className="tbd-photo" aria-hidden="true">
                <Icon name="image" size={32} />
              </div>
              <div className="tbd-detail">
                <h2 className="tbd-detail-name">{detail.name}</h2>
                <p className="tbd-detail-price">{won(detail.price)}</p>
                <p className="tbd-detail-desc">멸치와 다시마로 우린 육수에 소면을 말았습니다. 2인분, 조리 10분.</p>
              </div>
              <div className="tbd-dock">
                <button type="button" className="tbd-icon-btn tbd-wish" aria-label="찜하기" onClick={() => setWishCount((n) => n + 1)}>
                  <Icon name="heart" />
                </button>
                <button type="button" className="tbd-buy" onClick={() => setCartCount((n) => n + 1)}>
                  {won(detail.price)} 담기
                </button>
              </div>
            </>
          ) : (
            <>
              <header className="tbd-head">
                <h2 className="tbd-title">{TITLES[path] ?? '국수집'}</h2>
                {cartButton}
              </header>
              {path === '/' && (
                <>
                  <h3 className="tbd-section">오늘 많이 찾는 국수</h3>
                  {menuRows(MENU)}
                </>
              )}
              {path === '/category' && (
                <ul className="tbd-list">
                  {CATEGORIES.map((name) => (
                    <li key={name} className="tbd-link-row">
                      {name}
                      <Icon name="chevron-right" size={20} />
                    </li>
                  ))}
                </ul>
              )}
              {path === '/search' && (
                <div className="tbd-search">
                  <input className="tbd-search-input" type="search" placeholder="국수 이름으로 찾기" aria-label="메뉴 검색" />
                  <p className="tbd-hint">입력칸을 누르면 탭 바가 숨습니다.</p>
                </div>
              )}
              {path === '/wish' && menuRows(MENU.slice(0, 2))}
              {path === '/my' && (
                <ul className="tbd-list">
                  {['주문 내역', '쿠폰', '자주 가는 가게', '설정'].map((name) => (
                    <li key={name} className="tbd-link-row">
                      {name}
                      <Icon name="chevron-right" size={20} />
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
        <BottomNav
          items={items}
          path={path}
          hidden={!showTabs}
          onNavigate={({ href, event }) => {
            event.preventDefault()
            setPath(href)
          }}
          onReselect={() => {
            const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
            document.querySelector('.tbd-screen')?.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
          }}
        />
      </div>
    </div>
  )
}
