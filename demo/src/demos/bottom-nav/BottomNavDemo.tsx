import { useState, type CSSProperties } from 'react'
import { BottomNav } from '@skills/bottom-nav/assets/BottomNav'
import { shouldShowBottomNav } from '@skills/bottom-nav/assets/bottomNavCore'
import { Icon } from '@skills/layout-principles/assets/Icon'
import { defineCopy, useDemoLang } from '../../demoLang'
import './bottom-nav-demo.css'

// 언어와 무관한 데이터(경로·아이콘·가격)는 밖에, 화면에 보이거나 읽히는 문구는 COPY 두 벌에 둔다
const TAB_ICONS = [
  { href: '/', key: 'home', icon: <Icon name="home" />, currentIcon: <Icon name="home" filled /> },
  { href: '/category', key: 'category', icon: <Icon name="category" /> },
  { href: '/search', key: 'search', icon: <Icon name="search" /> },
  { href: '/wish', key: 'wish', icon: <Icon name="heart" />, currentIcon: <Icon name="heart" filled /> },
  { href: '/my', key: 'my', icon: <Icon name="user" />, currentIcon: <Icon name="user" filled /> },
] as const
const TAB_PATHS = TAB_ICONS.map((tab) => tab.href)

const MENU = [
  { id: 'janchi', price: 8000 },
  { id: 'bibim', price: 8500 },
  { id: 'kal', price: 9500 },
  { id: 'kong', price: 10000 },
  { id: 'mandu', price: 6000 },
  { id: 'jjol', price: 8000 },
] as const

const COPY = defineCopy({
  ko: {
    tabs: { home: '홈', category: '카테고리', search: '검색', wish: '찜', my: '마이' },
    menu: { janchi: '멸치육수 잔치국수', bibim: '매콤 비빔국수', kal: '바지락 칼국수', kong: '진한 콩국수', mandu: '손만두 한 접시', jjol: '쫄면' },
    categories: ['국물 국수', '비빔 국수', '찬 국수', '만두·곁들임'],
    myLinks: ['주문 내역', '쿠폰', '자주 가는 가게', '설정'],
    shopName: '국수집',
    price: (n: number) => `${n.toLocaleString('ko-KR')}원`,
    cart: (count: number) => (count > 0 ? `장바구니, ${count}개 담김` : '장바구니'),
    controlsLabel: '탭 바 옵션',
    wishBadge: '찜 개수 배지',
    duration: '숨김 속도',
    myDot: '마이에 새 소식 점',
    homeIndicator: '아이폰 홈 표시줄(안전 영역 34px) 흉내',
    note: '메뉴를 눌러 상세로 가면 탭 바가 숨고 하단 담기 바만 남습니다. 검색 탭의 입력칸을 누르면 키보드가 올라온 것으로 보고 탭 바를 숨깁니다. 지금 탭을 다시 누르면 맨 위로 올라갑니다.',
    back: '뒤로',
    detailDesc: '멸치와 다시마로 우린 육수에 소면을 말았습니다. 2인분, 조리 10분.',
    wishAction: '찜하기',
    addToCart: (price: string) => `${price} 담기`,
    popular: '오늘 많이 찾는 국수',
    searchPlaceholder: '국수 이름으로 찾기',
    searchLabel: '메뉴 검색',
    searchHint: '입력칸을 누르면 탭 바가 숨습니다.',
    navLabel: '주요 메뉴',
    badgeLabels: { count: (n: number) => `새 항목 ${n}개`, overflow: '새 항목 99개 이상', dot: '새 소식 있음' },
  },
  en: {
    tabs: { home: 'Home', category: 'Categories', search: 'Search', wish: 'Saved', my: 'My' },
    menu: {
      janchi: 'Anchovy-broth noodles',
      bibim: 'Spicy mixed noodles',
      kal: 'Clam knife-cut noodles',
      kong: 'Cold soy-milk noodles',
      mandu: 'Handmade dumplings',
      jjol: 'Chewy spicy noodles',
    },
    categories: ['Noodle soups', 'Mixed noodles', 'Cold noodles', 'Dumplings & sides'],
    myLinks: ['Orders', 'Coupons', 'Favorite shops', 'Settings'],
    shopName: 'Noodle House',
    price: (n: number) => `₩${n.toLocaleString('en-US')}`,
    cart: (count: number) => (count > 0 ? `Cart, ${count} items` : 'Cart'),
    controlsLabel: 'Tab bar options',
    wishBadge: 'Saved count badge',
    duration: 'Hide speed',
    myDot: 'New-activity dot on My',
    homeIndicator: 'Simulate the iPhone home indicator (34px safe area)',
    note: 'Open a menu item and the tab bar hides, leaving only the add-to-cart bar. Tap the field on the Search tab and the tab bar hides as if the keyboard were up. Tap the current tab again to scroll to the top.',
    back: 'Back',
    detailDesc: 'Thin wheat noodles in anchovy and kelp broth. Serves 2, ready in 10 minutes.',
    wishAction: 'Save',
    addToCart: (price: string) => `Add for ${price}`,
    popular: 'Popular today',
    searchPlaceholder: 'Search noodles by name',
    searchLabel: 'Search the menu',
    searchHint: 'Tap the field and the tab bar hides.',
    navLabel: 'Main menu',
    badgeLabels: { count: (n: number) => `${n} new`, overflow: 'Over 99 new', dot: 'New activity' },
  },
})

export const BottomNavDemo = () => {
  const t = COPY[useDemoLang()]
  const [path, setPath] = useState('/')
  const [cartCount, setCartCount] = useState(2)
  const [wishCount, setWishCount] = useState(3)
  const [myDot, setMyDot] = useState(true)
  const [homeIndicator, setHomeIndicator] = useState(true)
  const [durationMs, setDurationMs] = useState(250)

  const showTabs = shouldShowBottomNav({ path, tabs: TAB_PATHS })
  const detailId = path.match(/^\/menu\/(\w+)$/)?.[1]
  const detail = MENU.find((item) => item.id === detailId)
  const tabs = TAB_ICONS.map(({ key, ...tab }) => ({ ...tab, label: t.tabs[key] }))
  const items = tabs.map((tab) => (tab.href === '/wish' ? { ...tab, badge: wishCount } : tab.href === '/my' ? { ...tab, badge: myDot ? ('dot' as const) : undefined } : tab))
  const titles: Record<string, string> = { '/category': t.tabs.category, '/search': t.tabs.search, '/wish': t.tabs.wish, '/my': t.tabs.my }
  const vars = { '--bottom-nav-duration': `${durationMs}ms` } as CSSProperties

  const cartButton = (
    <button type="button" className="tbd-icon-btn" aria-label={t.cart(cartCount)}>
      <Icon name="cart" />
      {cartCount > 0 && (
        <span className="tbd-count" aria-hidden="true">
          {cartCount}
        </span>
      )}
    </button>
  )

  const menuRows = (list: readonly (typeof MENU)[number][]) => (
    <ul className="tbd-list">
      {list.map((item) => (
        <li key={item.id}>
          <button type="button" className="tbd-row" onClick={() => setPath(`/menu/${item.id}`)}>
            <span className="tbd-tile" aria-hidden="true">
              <Icon name="image" size={20} />
            </span>
            <span className="tbd-row-text">
              <span className="tbd-row-name">{t.menu[item.id]}</span>
              <span className="tbd-row-price">{t.price(item.price)}</span>
            </span>
          </button>
        </li>
      ))}
    </ul>
  )

  return (
    <div className="playground">
      <section className="controls" aria-label={t.controlsLabel}>
        <label>
          <span>
            {t.wishBadge} <code>badge</code>
          </span>
          <input type="range" min={0} max={120} value={wishCount} onChange={(e) => setWishCount(Number(e.target.value))} />
          <output>{wishCount}</output>
        </label>
        <label>
          <span>
            {t.duration} <code>--bottom-nav-duration</code>
          </span>
          <input type="range" min={100} max={500} step={50} value={durationMs} onChange={(e) => setDurationMs(Number(e.target.value))} />
          <output>{durationMs}ms</output>
        </label>
        <label className="controls-inline">
          <input type="checkbox" checked={myDot} onChange={(e) => setMyDot(e.target.checked)} />
          {t.myDot}
        </label>
        <label className="controls-inline">
          <input type="checkbox" checked={homeIndicator} onChange={(e) => setHomeIndicator(e.target.checked)} />
          {t.homeIndicator}
        </label>
        <p className="controls-note">{t.note}</p>
      </section>

      <div className="tbd-phone" data-home-indicator={homeIndicator ? 'true' : undefined} style={vars}>
        <div className="tbd-screen" data-tabs={showTabs ? 'true' : undefined} key={path}>
          {detail ? (
            <>
              <header className="tbd-head">
                <button type="button" className="tbd-icon-btn" aria-label={t.back} onClick={() => setPath('/')}>
                  <Icon name="chevron-left" />
                </button>
                {cartButton}
              </header>
              <div className="tbd-photo" aria-hidden="true">
                <Icon name="image" size={32} />
              </div>
              <div className="tbd-detail">
                <h2 className="tbd-detail-name">{t.menu[detail.id]}</h2>
                <p className="tbd-detail-price">{t.price(detail.price)}</p>
                <p className="tbd-detail-desc">{t.detailDesc}</p>
              </div>
              <div className="tbd-dock">
                <button type="button" className="tbd-icon-btn tbd-wish" aria-label={t.wishAction} onClick={() => setWishCount((n) => n + 1)}>
                  <Icon name="heart" />
                </button>
                <button type="button" className="tbd-buy" onClick={() => setCartCount((n) => n + 1)}>
                  {t.addToCart(t.price(detail.price))}
                </button>
              </div>
            </>
          ) : (
            <>
              <header className="tbd-head">
                <h2 className="tbd-title">{titles[path] ?? t.shopName}</h2>
                {cartButton}
              </header>
              {path === '/' && (
                <>
                  <h3 className="tbd-section">{t.popular}</h3>
                  {menuRows(MENU)}
                </>
              )}
              {path === '/category' && (
                <ul className="tbd-list">
                  {t.categories.map((name) => (
                    <li key={name} className="tbd-link-row">
                      {name}
                      <Icon name="chevron-right" size={20} />
                    </li>
                  ))}
                </ul>
              )}
              {path === '/search' && (
                <div className="tbd-search">
                  <input className="tbd-search-input" type="search" placeholder={t.searchPlaceholder} aria-label={t.searchLabel} />
                  <p className="tbd-hint">{t.searchHint}</p>
                </div>
              )}
              {path === '/wish' && menuRows(MENU.slice(0, 2))}
              {path === '/my' && (
                <ul className="tbd-list">
                  {t.myLinks.map((name) => (
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
          label={t.navLabel}
          badgeLabels={t.badgeLabels}
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
