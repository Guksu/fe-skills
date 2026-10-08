import { useState, type CSSProperties, type ReactNode } from 'react'
import { GAP, RADIUS, SPACE, TEXT, WEIGHT, groupGapOk } from '@skills/layout-principles/assets/layoutTokens'
import { Icon as LineIcon } from '../../shared/Icon'
import { photoSrc } from '../../shared/dishes'
import '@skills/layout-principles/assets/layout-tokens.css'
import './layout-principles-demo.css'
import './layout-principles-before.css'

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

/* 사진 위 글자 비교에는 무늬가 많은 실제 음식 사진을 쓴다 — 사진 위에 바로 얹은 글자가 왜 안 읽히는지 보인다 */
const PHOTO = photoSrc('janchi')
const DETAIL_PHOTO = photoSrc('deulkkae')

/* ---- ① 주문 내역 — 상자 대신 간격(P5·P4) ---- */

const OrderBefore = () => (
  <div className="lp-b-stack">
    <p className="lp-b-title">주문 내역</p>
    {ORDER.map((item) => (
      <div key={item.name} className="lp-b-card">
        <p className="lp-b-strong">{item.name}</p>
        <p className="lp-b-strong">{item.option}</p>
        {/* layout-audit-ignore: nested-card — 고치기 전 예시: 카드 안에 상자를 또 넣은 모습 */}
        <div className="lp-b-inner-box">{won(item.price)}</div>
      </div>
    ))}
    <div className="lp-b-card">
      {/* layout-audit-ignore: nested-card — 고치기 전 예시 */}
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
      <img className="lp-b-detail-photo" src={DETAIL_PHOTO} alt="들깨칼국수 한 그릇" width={480} height={360} />
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
        // layout-audit-ignore: nested-card — 고치기 전 예시: 선택지마다 상자
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
        <img className="lp-a-detail-photo" src={DETAIL_PHOTO} alt="들깨칼국수 한 그릇" width={480} height={360} />
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
          <LineIcon name="heart" />
        </button>
        <button type="button" className="lp-a-buy">
          {won(11000)} 담기
        </button>
      </div>
    </div>
  )
}

/* ---- ⑦ 설정 — 면 두 단계·글자 색 세 단계·강조색 하나(P5·P2·P3) ---- */

const NOTICES = [
  { id: 'cook', label: '조리 시작 알림', desc: '주문한 국수를 삶기 시작하면 알려 드려요' },
  { id: 'event', label: '새 메뉴·쿠폰 소식', desc: '한 달에 한두 번 보내요' },
]

const SettingsBefore = () => (
  <div className="lp-b-settings">
    <p className="lp-b-title">설정</p>
    <div className="lp-b-plain-card">
      <p className="lp-b-strong">알림</p>
      {NOTICES.map((notice, index) => (
        <div key={notice.id} className="lp-b-setting-row">
          <div>
            <p className="lp-b-faint">{notice.label}</p>
            <p className="lp-b-faint">{notice.desc}</p>
          </div>
          <span className="lp-b-toggle" data-on={index === 0 || undefined} aria-hidden="true" />
        </div>
      ))}
    </div>
    <div className="lp-b-plain-card">
      <p className="lp-b-strong">계정</p>
      <button type="button" className="lp-b-blue-fill">
        로그아웃
      </button>
      <button type="button" className="lp-b-blue-fill">
        회원 탈퇴
      </button>
    </div>
  </div>
)

const SettingsAfter = () => {
  const [enabled, setEnabled] = useState<Record<string, boolean>>({ cook: true, event: false })

  return (
    <div className="lp-t-page">
      <p className="lp-t-title">설정</p>
      <p className="lp-t-group-label" id="lp-t-notice">
        알림
      </p>
      <ul className="lp-t-group" aria-labelledby="lp-t-notice">
        {NOTICES.map((notice) => (
          <li key={notice.id}>
            <label className="lp-t-row">
              <span className="lp-t-row-text">
                <span className="lp-t-label">{notice.label}</span>
                <span className="lp-t-desc">{notice.desc}</span>
              </span>
              <input
                type="checkbox"
                role="switch"
                className="lp-t-switch"
                checked={enabled[notice.id]}
                onChange={(e) => setEnabled((prev) => ({ ...prev, [notice.id]: e.target.checked }))}
              />
            </label>
          </li>
        ))}
      </ul>
      <p className="lp-t-group-label" id="lp-t-screen">
        화면
      </p>
      <ul className="lp-t-group" aria-labelledby="lp-t-screen">
        <li>
          <button type="button" className="lp-t-row lp-t-row-button">
            <span className="lp-t-label">글자 크기</span>
            <span className="lp-t-value">
              보통
              <span aria-hidden="true" className="lp-t-chevron" />
            </span>
          </button>
        </li>
      </ul>
      <ul className="lp-t-group" aria-label="계정">
        <li>
          <button type="button" className="lp-t-row lp-t-row-button">
            <span className="lp-t-label">로그아웃</span>
          </button>
        </li>
      </ul>
      <button type="button" className="lp-t-quiet">
        회원 탈퇴
      </button>
    </div>
  )
}

/* ---- ⑧ 로그인 — 강조색 하나를 이어 쓰고, 외부 서비스 버튼은 그 서비스의 색(P3·P11) ---- */

const LoginBefore = () => (
  <div className="lp-b-login">
    <p className="lp-b-title">로그인</p>
    <p className="lp-b-strong">이메일</p>
    <span className="lp-b-input">name@example.com</span>
    <p className="lp-b-strong">비밀번호</p>
    <span className="lp-b-input">8자 이상</span>
    <p className="lp-b-faint">비밀번호 찾기</p>
    <button type="button" className="lp-b-blue-fill">
      로그인
    </button>
    <button type="button" className="lp-b-outline">
      카카오로 계속하기
    </button>
    <button type="button" className="lp-b-outline">
      네이버로 계속하기
    </button>
  </div>
)

const LoginAfter = () => (
  <form className="lp-t-page lp-t-login" onSubmit={(e) => e.preventDefault()}>
    <p className="lp-t-title">성수 국수집에 다시 오셨네요</p>
    <label className="lp-t-field">
      <span className="lp-t-field-label">이메일</span>
      <input className="lp-t-input" type="email" placeholder="name@example.com" autoComplete="email" />
    </label>
    <label className="lp-t-field">
      <span className="lp-t-field-label">비밀번호</span>
      <input className="lp-t-input" type="password" placeholder="8자 이상" autoComplete="current-password" />
    </label>
    <button type="submit" className="lp-t-primary">
      로그인
    </button>
    <p className="lp-t-links">
      <a href="#/layout-principles">비밀번호 찾기</a>
      <span aria-hidden="true" className="lp-t-links-divider" />
      <a href="#/layout-principles">회원가입</a>
    </p>
    <p className="lp-t-desc lp-t-social-label">다른 방법으로 로그인</p>
    <button type="button" className="lp-t-social" data-brand="kakao">
      <svg aria-hidden="true" viewBox="0 0 24 24" className="lp-t-social-mark">
        <path d="M12 4C7 4 3 7.1 3 11c0 2.5 1.7 4.7 4.2 5.9l-.9 3.3c-.1.3.3.6.6.4l3.9-2.6c.4 0 .8.1 1.2.1 5 0 9-3.1 9-7s-4-7.1-9-7.1z" />
      </svg>
      카카오로 시작하기
    </button>
    <button type="button" className="lp-t-social" data-brand="naver">
      <svg aria-hidden="true" viewBox="0 0 24 24" className="lp-t-social-mark">
        <path d="M14.6 12.4 9.1 4.5H4.5v15h4.9v-7.9l5.5 7.9h4.6v-15h-4.9z" />
      </svg>
      네이버로 시작하기
    </button>
  </form>
)

/* ---- ⑨ AI 채팅 — 머리 한 줄·정보는 한 곳·무채색 + 강조색 하나(P1·P3·P11) ---- */

const CHAT_QUESTION = '비 오는 날 어울리는 국수 추천해줘'
const CHAT_ANSWER = ['비 오는 날에는 뜨끈한 국물이 좋아요.', '칼국수는 바지락 국물이 진하고, 잔치국수는 멸치 국물이 맑아요. 손만두를 곁들이면 한 끼로 넉넉해요.']

const ChatBefore = () => (
  <div className="lp-b-chat">
    <div className="lp-b-chat-bar">
      <span className="lp-b-avatar">N</span>
      <span className="lp-b-strong">국수 추천 도우미</span>
      <span className="lp-b-pill-amber">추천 모드</span>
    </div>
    <div className="lp-b-chat-bar lp-b-chat-sub">성수 국수집 · 메뉴판 12개</div>
    <div className="lp-b-chat-bar lp-b-chat-sub">
      <span className="lp-b-pill-amber">M1</span> 오늘의 메뉴판
    </div>
    <p className="lp-b-bubble-me">{CHAT_QUESTION}</p>
    <div className="lp-b-answer">
      <p className="lp-b-answer-head">
        <span className="lp-b-avatar">N</span> 도우미 <span className="lp-b-pill-green">완료</span>
      </p>
      <p className="lp-b-faint">{CHAT_ANSWER.join(' ')}</p>
    </div>
    <div className="lp-b-error">
      <p className="lp-b-strong">요청이 많아 잠시 후 다시 시도해 주세요.</p>
      <button type="button" className="lp-b-gray-pill">
        다시 시도
      </button>
    </div>
    <div className="lp-b-chips">
      <span className="lp-b-gray-pill">맵지 않은 거</span>
      <span className="lp-b-gray-pill">곱빼기</span>
      <span className="lp-b-gray-pill">포장</span>
    </div>
    <div className="lp-b-composer">
      {/* layout-audit-ignore: nested-card — 일부러 AI 슬롭으로 만든 '전' 화면(입력창 안 색 상자) */}
      <p className="lp-b-attach">
        <span className="lp-b-pill-amber">M1</span> 오늘의 메뉴판
      </p>
      <span className="lp-b-faint">메시지를 입력하세요</span>
      <button type="button" className="lp-b-gray-pill">
        메뉴 고르기
      </button>
    </div>
  </div>
)

const Icon = ({ d }: { d: string }) => (
  <svg aria-hidden="true" viewBox="0 0 24 24" className="lp-t-icon">
    <path d={d} />
  </svg>
)
const ICON = {
  chevron: 'm6 9 6 6 6-6',
  newChat: 'M12 5v14M5 12h14',
  history: 'M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5M12 7v5l3 2',
  copy: 'M9 9h10v10H9zM5 15V5h10',
  retry: 'M4 4v6h6M20 20v-6h-6M5.5 15a7 7 0 0 0 12.6 2M18.5 9A7 7 0 0 0 5.9 7',
  attach: 'm21 11-8.6 8.6a5 5 0 0 1-7-7L14 3.9a3.3 3.3 0 0 1 4.7 4.7L10 17.2a1.7 1.7 0 0 1-2.4-2.4l8-8',
  send: 'M12 19V5M5 12l7-7 7 7',
}

const ChatAfter = () => {
  const [text, setText] = useState('')
  const [attached, setAttached] = useState(true)

  return (
    <section className="lp-t-chat" aria-label="국수 추천 도우미">
      <header className="lp-t-chat-head">
        <button type="button" className="lp-t-model">
          국수 도우미
          <Icon d={ICON.chevron} />
        </button>
        <span className="lp-t-chat-actions">
          <button type="button" className="lp-t-icon-button" aria-label="새 대화">
            <Icon d={ICON.newChat} />
          </button>
          <button type="button" className="lp-t-icon-button" aria-label="기록">
            <Icon d={ICON.history} />
          </button>
        </span>
      </header>
      <div className="lp-t-chat-log">
        <p className="lp-t-bubble">{CHAT_QUESTION}</p>
        <article className="lp-t-answer">
          {CHAT_ANSWER.map((line) => (
            <p key={line}>{line}</p>
          ))}
          <p className="lp-t-answer-foot">
            <button type="button" className="lp-t-icon-button" aria-label="답변 복사">
              <Icon d={ICON.copy} />
            </button>
            <button type="button" className="lp-t-icon-button" aria-label="다시 생성">
              <Icon d={ICON.retry} />
            </button>
            <span className="lp-t-desc">메뉴판 근거 2곳</span>
          </p>
        </article>
        <p className="lp-t-chat-error" role="status">
          <span className="lp-t-error-text">요청이 많아 답하지 못했어요.</span>
          <button type="button" className="lp-t-text-button">
            다시 시도
          </button>
        </p>
      </div>
      <form className="lp-t-composer" onSubmit={(e) => e.preventDefault()}>
        {attached && (
          <p className="lp-t-attach">
            <Icon d={ICON.attach} />
            오늘의 메뉴판
            <button type="button" className="lp-t-text-button" onClick={() => setAttached(false)}>
              빼기
            </button>
          </p>
        )}
        <label className="lp-t-composer-row">
          <span className="lp-t-sr">질문</span>
          <textarea className="lp-t-composer-input" rows={1} placeholder="무엇을 드시고 싶으세요?" value={text} onChange={(e) => setText(e.target.value)} />
        </label>
        <span className="lp-t-composer-row lp-t-composer-tools">
          <button type="button" className="lp-t-icon-button" aria-label="자료 첨부" onClick={() => setAttached(true)}>
            <Icon d={ICON.attach} />
          </button>
          <button type="submit" className="lp-t-send" aria-label="보내기" disabled={text.trim() === ''}>
            <Icon d={ICON.send} />
          </button>
        </span>
      </form>
    </section>
  )
}

type Example = { id: string; title: string; principle: string; before: string; after: string; Before: () => ReactNode; After: () => ReactNode; flush?: boolean; light?: boolean }

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
  {
    id: 'settings',
    title: '⑦ 설정',
    principle: 'P5 면은 톤 차이로 · P2 글자 색 세 단계 · P3 강조색 하나',
    before: '흰 바탕에 테두리·그림자 카드를 겹치고, 이름과 설명이 같은 연회색이다. 강조색은 기본 파랑이고 채운 버튼이 둘이다.',
    after: '옅은 바탕 위 흰 묶음(테두리·그림자 없음). 구역 이름은 묶음 밖 위에 옅게, 항목 이름은 진하게, 설명은 한 단계 옅게. 강조색은 켜진 스위치에만 쓰고, 탈퇴는 옅은 글자 링크로 낮춘다.',
    Before: SettingsBefore,
    After: SettingsAfter,
    flush: true,
    light: true,
  },
  {
    id: 'login',
    title: '⑧ 로그인',
    principle: 'P3 강조색 하나를 이어 쓴다 · P11 외부 서비스 버튼은 그 서비스의 색',
    before: '기본 파랑 버튼, 굵은 라벨, 같은 흰 윤곽선 소셜 버튼. 비밀번호 찾기는 링크로 보이지 않는 회색 글자다.',
    after: '서비스의 강조색 하나로 주 버튼을 채운다. 링크는 밑줄로 링크답게, 소셜 버튼은 그 서비스의 색과 로고(카카오 노랑, 네이버 로고)를 같은 높이로.',
    Before: LoginBefore,
    After: LoginAfter,
    flush: true,
    light: true,
  },
  {
    id: 'chat',
    title: '⑨ AI 채팅',
    principle: 'P1 정보는 한 곳 · P3 색은 강조색 하나 · P11 범용 채팅 화면의 관례',
    before: '머리 아래에 사이트·대상 줄을 쌓고, 같은 대상을 입력창에 또 보인다. 상태마다 노랑·초록 알약, 오류는 분홍 상자, 보조 버튼은 회색 채움 알약이다.',
    after: '머리 한 줄(모델·새 대화·기록). 내 말은 회색 말풍선, 답변은 말풍선 없는 본문과 무채색 아이콘 한 줄. 첨부는 입력창 안 한 곳, 오류는 그 자리 글자 + 다시 시도. 채운 버튼은 보내기 하나다.',
    Before: ChatBefore,
    After: ChatAfter,
    flush: true,
    light: true,
  },
]

const Pane = ({ label, note, tone, flush = false, light = false, children }: { label: string; note: string; tone: 'before' | 'after'; flush?: boolean; light?: boolean; children: ReactNode }) => (
  <div className="lp-pane" data-tone={tone}>
    <p className="lp-pane-label">{label}</p>
    <div className="lp-screen" data-flush={flush || undefined} data-light={light || undefined}>
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
              <Pane label="고치기 전" note={example.before} tone="before" flush={example.flush} light={example.light}>
                <example.Before />
              </Pane>
            )}
            {view !== 'before' && (
              <Pane label="고친 뒤" note={example.after} tone="after" flush={example.flush} light={example.light}>
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
