import { useState, type CSSProperties, type ReactNode } from 'react'
import { GAP, RADIUS, SPACE, TEXT, WEIGHT, groupGapOk } from '@skills/layout-principles/assets/layoutTokens'
import '@skills/layout-principles/assets/layout-tokens.css'
import './layout-principles-demo.css'

type View = 'both' | 'before' | 'after'

const VIEW_LABEL: Record<View, string> = {
  both: '나란히 비교',
  before: '고치기 전만',
  after: '고친 뒤만',
}

const ORDER = [
  { name: '잔치국수', option: '보통 · 김치 추가', price: 8000 },
  { name: '비빔국수', option: '곱빼기 · 덜 맵게', price: 9500 },
  { name: '손만두', option: '6개', price: 6000 },
]
const won = (amount: number) => `${amount.toLocaleString('ko-KR')}원`
const ORDER_TOTAL = ORDER.reduce((sum, item) => sum + item.price, 0)

/** 실제 사진 대신 쓰는 SVG — 일부러 무늬를 많이 넣어 글자를 얹으면 읽기 어렵게 만든다 */
const photoUrl = () => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="360" viewBox="0 0 480 360"><defs><radialGradient id="g" cx="0.5" cy="0.45" r="0.7"><stop offset="0" stop-color="#f4d9a8"/><stop offset="0.6" stop-color="#c98a4b"/><stop offset="1" stop-color="#6b3f1f"/></radialGradient></defs><rect width="480" height="360" fill="url(#g)"/><circle cx="240" cy="190" r="128" fill="#f8f1e4" stroke="#8a5a2b" stroke-width="10"/><text x="240" y="205" font-size="150" text-anchor="middle" dominant-baseline="middle">🍜</text><text x="70" y="80" font-size="56">🥢</text><text x="400" y="300" font-size="48">🌶️</text><text x="390" y="90" font-size="44">🥚</text><text x="80" y="300" font-size="44">🧅</text></svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}
const PHOTO = photoUrl()

/* ---- ① 주문 내역 — 상자 대신 간격(P5·P4) ---- */

const OrderBefore = () => (
  <div className="lp-b-stack">
    <p className="lp-b-title">주문 내역</p>
    {ORDER.map((item) => (
      <div key={item.name} className="lp-b-card">
        <p className="lp-b-strong">{item.name}</p>
        <p className="lp-b-strong">{item.option}</p>
        <div className="lp-b-inner-box">{won(item.price)}</div>
      </div>
    ))}
    <div className="lp-b-card">
      <div className="lp-b-inner-box">합계 {won(ORDER_TOTAL)}</div>
    </div>
  </div>
)

const OrderAfter = () => (
  <div className="lp-a-order">
    <p className="lp-a-title">주문 내역</p>
    <ul className="lp-a-rows">
      {ORDER.map((item) => (
        <li key={item.name} className="lp-a-row">
          <div className="lp-a-row-text">
            <span className="lp-a-name">{item.name}</span>
            <span className="lp-a-sub">{item.option}</span>
          </div>
          <span className="lp-a-amount">{won(item.price)}</span>
        </li>
      ))}
    </ul>
    <div className="lp-a-total">
      <span>합계</span>
      <span className="lp-a-amount">{won(ORDER_TOTAL)}</span>
    </div>
  </div>
)

/* ---- ② 가게 소개 — 정렬선 하나(P6·P8) ---- */

const INTRO = '멸치와 다시마로 여섯 시간 우린 국물에 손으로 뽑은 중면을 말았습니다. 고명은 그날 들어온 애호박과 달걀지단만 올립니다.'

const IntroBefore = () => (
  <div className="lp-b-center">
    <p className="lp-b-title">성수동 골목 국수집</p>
    <p className="lp-b-text">{INTRO}</p>
    <p className="lp-b-text">영업시간 11:00–21:00</p>
    <p className="lp-b-text">성수동 2가 골목 안</p>
    <button type="button" className="lp-b-fill">
      메뉴 보기
    </button>
  </div>
)

const IntroAfter = () => (
  <div className="lp-a-intro">
    <p className="lp-a-title">성수동 골목 국수집</p>
    <p className="lp-a-body">{INTRO}</p>
    <p className="lp-a-meta">
      <span>11:00–21:00</span>
      <span aria-hidden="true" className="lp-a-divider" />
      <span>성수동 2가 골목 안</span>
    </p>
    <button type="button" className="lp-a-primary">
      메뉴 보기
    </button>
  </div>
)

/* ---- ③ 결제 요약 — 숫자 위계와 영수증 정렬(P2·P6) ---- */

const PAY = [
  { label: '주문 금액', amount: ORDER_TOTAL },
  { label: '포장 할인', amount: -1000 },
  { label: '쿠폰', amount: -2000 },
]
const PAY_TOTAL = PAY.reduce((sum, row) => sum + row.amount, 0)

const PayBefore = () => (
  <div className="lp-b-stack">
    <p className="lp-b-strong">총 결제 금액은 {won(PAY_TOTAL)}입니다</p>
    {PAY.map((row) => (
      <p key={row.label} className="lp-b-strong">
        {row.label}: {won(row.amount)}
      </p>
    ))}
  </div>
)

const PayAfter = () => (
  <div className="lp-a-pay">
    <div className="lp-a-key">
      <span className="lp-a-sub">결제할 금액</span>
      <span className="lp-a-display">{won(PAY_TOTAL)}</span>
    </div>
    <dl className="lp-a-receipt">
      {PAY.map((row) => (
        <div key={row.label} className="lp-a-receipt-row">
          <dt>{row.label}</dt>
          <dd className="lp-a-amount">{won(row.amount)}</dd>
        </div>
      ))}
    </dl>
  </div>
)

/* ---- ④ 메뉴 카드 — 강조는 한 곳(P3) ---- */

const MenuBefore = () => (
  <div className="lp-b-menu">
    <p className="lp-b-gradient-text">들깨칼국수</p>
    <div className="lp-b-badges">
      <span className="lp-b-pill lp-b-pill-red">인기</span>
      <span className="lp-b-pill lp-b-pill-green">NEW</span>
      <span className="lp-b-pill lp-b-pill-blue">추천</span>
    </div>
    <p className="lp-b-text">고소한 들깨 국물에 직접 민 칼국수</p>
    <div className="lp-b-actions">
      <button type="button" className="lp-b-fill">
        담기
      </button>
      <button type="button" className="lp-b-fill">
        바로 주문
      </button>
    </div>
  </div>
)

const MenuAfter = () => (
  <div className="lp-a-menu">
    <div className="lp-a-menu-text">
      <span className="lp-a-name">들깨칼국수</span>
      <span className="lp-a-sub">고소한 들깨 국물에 직접 민 칼국수</span>
      <span className="lp-a-tags">인기 · 새 메뉴</span>
    </div>
    <span className="lp-a-price">{won(11000)}</span>
    <div className="lp-a-actions">
      <button type="button" className="lp-a-primary">
        담기
      </button>
      <button type="button" className="lp-a-link">
        자세히
      </button>
    </div>
  </div>
)

/* ---- ⑤ 오늘의 국수 — 사진은 가리지 않고 비율을 지킨다(P9) ---- */

const PhotoBefore = () => (
  <div className="lp-b-photo">
    <img className="lp-b-photo-img" src={PHOTO} alt="잔치국수 한 그릇" width={480} height={360} />
    <div className="lp-b-photo-text">
      <p>오늘의 국수</p>
      <p>잔치국수 8,000원</p>
    </div>
  </div>
)

const PhotoAfter = () => (
  <figure className="lp-a-photo">
    <img className="lp-a-photo-img" src={PHOTO} alt="잔치국수 한 그릇" width={480} height={360} />
    <figcaption className="lp-a-photo-text">
      <span className="lp-a-sub">오늘의 국수</span>
      <span className="lp-a-name">잔치국수 {won(8000)}</span>
    </figcaption>
  </figure>
)

/* ---- ⑥ 메뉴 상세 — 화면 유형의 관례: 행동은 하단 고정 바 하나(P11·P3) ---- */

const SPICE = ['순한 맛', '보통', '매운맛']

const DetailBefore = () => (
  <div className="lp-b-detail" tabIndex={0} aria-label="고치기 전 메뉴 상세 — 스크롤 영역">
    <div className="lp-b-card">
      <img className="lp-b-detail-photo" src={PHOTO} alt="들깨칼국수 한 그릇" width={480} height={360} />
    </div>
    <div className="lp-b-center">
      <p className="lp-b-title">들깨칼국수</p>
      <p className="lp-b-text">{won(11000)}</p>
    </div>
    <div className="lp-b-actions">
      <button type="button" className="lp-b-fill">
        담기
      </button>
      <button type="button" className="lp-b-fill">
        바로 주문
      </button>
      <button type="button" className="lp-b-fill">
        찜
      </button>
    </div>
    <div className="lp-b-card">
      <p className="lp-b-strong">맵기 선택</p>
      {SPICE.map((spice) => (
        <div key={spice} className="lp-b-inner-box">
          {spice}
        </div>
      ))}
    </div>
    <p className="lp-b-text">고소한 들깨 국물에 직접 민 칼국수. 들깨는 그날 아침에 갈아 넣습니다.</p>
  </div>
)

const DetailAfter = () => {
  const [spice, setSpice] = useState(SPICE[1])

  return (
    <div className="lp-a-detail">
      <div className="lp-a-detail-scroll" tabIndex={0} aria-label="고친 뒤 메뉴 상세 — 스크롤 영역">
        <img className="lp-a-detail-photo" src={PHOTO} alt="들깨칼국수 한 그릇" width={480} height={360} />
        <div className="lp-a-detail-body">
          <div className="lp-a-detail-head">
            <span className="lp-a-sub">성수동 골목 국수집</span>
            <span className="lp-a-detail-name">들깨칼국수</span>
            <span className="lp-a-display">{won(11000)}</span>
            <span className="lp-a-sub">고소한 들깨 국물에 직접 민 칼국수. 들깨는 그날 아침에 갈아 넣습니다.</span>
          </div>
          <fieldset className="lp-a-options">
            <legend className="lp-a-options-title">맵기</legend>
            {SPICE.map((option) => (
              <label key={option} className="lp-a-option">
                <span>{option}</span>
                <input type="radio" name="lp-spice" value={option} checked={spice === option} onChange={() => setSpice(option)} />
              </label>
            ))}
          </fieldset>
        </div>
      </div>
      <div className="lp-a-buybar">
        <button type="button" className="lp-a-icon-button" aria-label="찜하기">
          ♡
        </button>
        <button type="button" className="lp-a-buy">
          {won(11000)} 담기
        </button>
      </div>
    </div>
  )
}

type Example = { id: string; title: string; principle: string; before: string; after: string; Before: () => ReactNode; After: () => ReactNode; flush?: boolean }

const EXAMPLES: Example[] = [
  {
    id: 'order',
    title: '① 주문 내역',
    principle: 'P5 상자는 마지막 수단 · P4 간격으로 묶는다',
    before: '항목마다 카드, 카드 안에 또 상자. 간격이 모두 같고 전부 굵다.',
    after: '선 한 줄로 행을 나누고, 이름과 옵션은 8px로 붙인다. 금액은 오른쪽 한 열.',
    Before: OrderBefore,
    After: OrderAfter,
  },
  {
    id: 'intro',
    title: '② 가게 소개',
    principle: 'P6 정렬선 하나 · P8 빈 곳은 의도로만',
    before: '여러 줄 문단까지 가운데 정렬. 줄마다 시작점이 달라 시선이 지그재그로 움직인다.',
    after: '왼쪽 선 하나에서 시작한다. 짧은 정보는 한 줄로 모으고 세로선 하나로 나눈다.',
    Before: IntroBefore,
    After: IntroAfter,
  },
  {
    id: 'pay',
    title: '③ 결제 요약',
    principle: 'P2 위계는 크기·굵기·농도로 · P6 숫자는 오른쪽 한 열',
    before: '핵심 금액이 문장 속에 있고, 라벨과 숫자가 같은 크기·같은 굵기다.',
    after: '금액은 자기 줄에 라벨의 2배 이상으로. 내역은 오른쪽 정렬과 같은 폭 숫자로 위아래 비교.',
    Before: PayBefore,
    After: PayAfter,
  },
  {
    id: 'menu',
    title: '④ 메뉴 카드',
    principle: 'P3 강조는 한두 곳에만',
    before: '그라데이션 글자, 색 배지 셋, 채운 버튼 둘, 빛나는 그림자 — 강조가 서로 시선을 나눈다.',
    after: '채운 버튼은 주 행동 하나. 배지는 회색 글자, 보조 행동은 글자 링크.',
    Before: MenuBefore,
    After: MenuAfter,
  },
  {
    id: 'photo',
    title: '⑤ 오늘의 국수',
    principle: 'P9 사진은 가리지 않고 비율을 지킨다',
    before: '사진을 틀에 맞춰 늘이고(찌그러짐), 무늬 위에 글자를 바로 얹었다.',
    after: '4:3 틀에 잘라 채우고(object-fit: cover), 글자는 사진 아래로 뺐다.',
    Before: PhotoBefore,
    After: PhotoAfter,
  },
  {
    id: 'detail',
    title: '⑥ 메뉴 상세',
    principle: 'P11 익숙한 구조 · P3 강조는 한 곳 — 상세 화면의 관례',
    before: '담기·바로 주문·찜이 모두 채운 버튼으로 내용 중간에 있다. 스크롤하면 사라지고, 가격은 작은 회색 글자다.',
    after: '사진 → 이름 → 가격 → 옵션 순. 행동은 화면 아래에 고정한 바 하나에 모으고, 채운 버튼은 담기 하나다. 바 아래에는 홈 표시줄 높이(안전 영역)를 더한다.',
    Before: DetailBefore,
    After: DetailAfter,
    flush: true,
  },
]

const Pane = ({ label, note, tone, flush = false, children }: { label: string; note: string; tone: 'before' | 'after'; flush?: boolean; children: ReactNode }) => (
  <div className="lp-pane" data-tone={tone}>
    <p className="lp-pane-label">{label}</p>
    <div className="lp-screen" data-flush={flush || undefined}>
      {children}
    </div>
    <p className="lp-pane-note">{note}</p>
  </div>
)

export const LayoutPrinciplesDemo = () => {
  const [view, setView] = useState<View>('both')

  return (
    <div className="playground">
      <section className="controls" aria-label="비교 옵션">
        <label>
          <span>보기</span>
          <select value={view} onChange={(e) => setView(e.target.value as View)}>
            {(Object.keys(VIEW_LABEL) as View[]).map((key) => (
              <option key={key} value={key}>
                {VIEW_LABEL[key]}
              </option>
            ))}
          </select>
        </label>
        <p className="controls-note">
          왼쪽은 AI가 흔히 만드는 모습, 오른쪽은 원칙대로 고친 모습입니다. 고친 쪽은 숫자 대신 토큰(<code>--gap-item</code>·
          <code>--text-display</code>·<code>--radius-card</code> 등)만 씁니다. 레이아웃은 꾸미는 일이 아니라 순서를 정하는 일입니다.
        </p>
      </section>

      {EXAMPLES.map((example) => (
        <section key={example.id} className="lp-example" aria-labelledby={`lp-${example.id}`}>
          <div className="lp-example-head">
            <h2 id={`lp-${example.id}`}>{example.title}</h2>
            <p>{example.principle}</p>
          </div>
          <div className="lp-compare" data-view={view}>
            {view !== 'after' && (
              <Pane label="고치기 전" note={example.before} tone="before" flush={example.flush}>
                <example.Before />
              </Pane>
            )}
            {view !== 'before' && (
              <Pane label="고친 뒤" note={example.after} tone="after" flush={example.flush}>
                <example.After />
              </Pane>
            )}
          </div>
        </section>
      ))}

      <section className="lp-example" aria-labelledby="lp-tokens">
        <div className="lp-example-head">
          <h2 id="lp-tokens">토큰 한 벌</h2>
          <p>
            묶음 안 {GAP.item}px ≤ 묶음 사이 {GAP.group}px의 절반 — {groupGapOk({ inside: GAP.item, between: GAP.group }) ? '간격만으로 묶음이 보인다' : '묶음이 안 보인다'}
          </p>
        </div>
        <div className="lp-tokens">
          <div className="lp-token-group">
            <p className="lp-token-title">간격 --space-*</p>
            <ul className="lp-token-list">
              {Object.entries(SPACE).map(([step, px]) => (
                <li key={step} className="lp-token-row">
                  <code>--space-{step}</code>
                  <span className="lp-space-bar" style={{ '--bar': `${px}px` } as CSSProperties} aria-hidden="true" />
                  <span className="lp-token-value">{px}px</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="lp-token-group">
            <p className="lp-token-title">글자 --text-*</p>
            <ul className="lp-token-list">
              {Object.entries(TEXT).map(([name, px]) => (
                <li key={name} className="lp-token-row">
                  <code>--text-{name}</code>
                  <span className="lp-type-sample" style={{ fontSize: `${px}px` }}>
                    국수
                  </span>
                  <span className="lp-token-value">{px}px</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="lp-token-group">
            <p className="lp-token-title">굵기 --weight-* · 반경 --radius-*</p>
            <ul className="lp-token-list">
              {Object.entries(WEIGHT).map(([name, weight]) => (
                <li key={name} className="lp-token-row">
                  <code>--weight-{name}</code>
                  <span className="lp-type-sample" style={{ fontWeight: weight }}>
                    칼국수
                  </span>
                  <span className="lp-token-value">{weight}</span>
                </li>
              ))}
              {Object.entries(RADIUS).map(([name, px]) => (
                <li key={name} className="lp-token-row">
                  <code>--radius-{name}</code>
                  <span className="lp-radius-swatch" style={{ borderRadius: `${px}px` }} aria-hidden="true" />
                  <span className="lp-token-value">{px}px</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
