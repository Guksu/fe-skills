import { useState, type CSSProperties } from 'react'
import { CardStack } from '@skills/card-stack/assets/CardStack'
import type { StackState } from '@skills/card-stack/assets/stackLayout'
import { Icon } from '@skills/layout-principles/assets/Icon'
import { defineCopy, useDemoLang } from '../../demoLang'
import './card-stack-demo.css'

// 언어와 무관한 데이터(id·테마)는 밖에, 카드 문구는 COPY에 id로 둔다
const WALLET = [
  { id: 'points', theme: 'points' },
  { id: 'coupon', theme: 'coupon' },
  { id: 'prepaid', theme: 'prepaid' },
  { id: 'regular', theme: 'regular' },
] as const

const COPY = defineCopy({
  ko: {
    cards: {
      points: { kind: '적립 카드', title: '면 한 그릇, 도장 하나', body: '도장 7 / 10', footer: '10개 모으면 잔치국수 한 그릇' },
      coupon: { kind: '쿠폰', title: '손만두 1인분 무료', body: '칼국수 주문 시 사용 가능', footer: '유효기간 10월 31일까지' },
      prepaid: { kind: '선불 카드', title: '국수집 선불 잔액', body: '32,000원', footer: '충전 5만원마다 5천원 덤' },
      regular: { kind: '단골 카드', title: '성수동 단골 3년차', body: '방문 128회', footer: '단골 전용 — 육수 리필 무제한' },
    },
    modeLabel: {
      stacked: 'stacked — 겹침 (카드를 눌러 펼치기)',
      fanned: 'fanned — 펼침 (카드를 골라 앞으로 꺼내기)',
      selected: 'selected — 선택 (다시 누르거나 Esc로 되돌리기)',
    },
    controlsLabel: '카드 묶음 옵션',
    peek: '겹침 높이',
    fanGap: '펼침 간격',
    duration: '이동 속도',
    note: (
      <>
        카드를 누르면 세로로 펼쳐지고, 하나를 고르면 그 카드가 맨 위로 올라오며 나머지는 아래로 내려가 겹칩니다. 같은 카드를
        다시 누르거나 <kbd>Esc</kbd>로 한 단계씩 되돌아갑니다. Tab으로 카드를 오가고 Enter로 누를 수 있습니다.
      </>
    ),
    walletTitle: '국수집 멤버십 카드 지갑',
    stackLabel: '국수집 멤버십 카드',
  },
  en: {
    cards: {
      points: { kind: 'Stamp card', title: 'One bowl, one stamp', body: 'Stamps 7 / 10', footer: 'Collect 10 for free anchovy-broth noodles' },
      coupon: { kind: 'Coupon', title: 'Free handmade dumplings', body: 'With knife-cut noodles', footer: 'Valid until Oct 31' },
      prepaid: { kind: 'Prepaid card', title: 'Noodle House balance', body: '₩32,000', footer: '₩5,000 bonus for every ₩50,000 top-up' },
      regular: { kind: 'Regulars card', title: 'Seongsu-dong regular, year 3', body: '128 visits', footer: 'Regulars only: unlimited broth refills' },
    },
    modeLabel: {
      stacked: 'stacked (tap a card to fan out)',
      fanned: 'fanned (pick a card to bring it forward)',
      selected: 'selected (tap again or press Esc to go back)',
    },
    controlsLabel: 'Card stack options',
    peek: 'Peek height',
    fanGap: 'Fan gap',
    duration: 'Motion speed',
    note: (
      <>
        Tap the cards and they fan out vertically. Pick one and it rises to the top while the rest drop down and stack
        below it. Tap the same card again or press <kbd>Esc</kbd> to step back one level at a time. Use Tab to move between
        cards and Enter to press one.
      </>
    ),
    walletTitle: 'Noodle House membership wallet',
    stackLabel: 'Noodle House membership cards',
  },
})

export const CardStackDemo = () => {
  const t = COPY[useDemoLang()]
  const [peekPx, setPeekPx] = useState(56)
  const [fanGapPx, setFanGapPx] = useState(72)
  const [durationMs, setDurationMs] = useState(420)
  const [state, setState] = useState<StackState>({ mode: 'stacked', selectedIndex: null })

  const vars = { '--stack-duration': `${durationMs}ms` } as CSSProperties
  const selectedCard = state.selectedIndex === null ? null : t.cards[WALLET[state.selectedIndex].id]

  const cards = WALLET.map((card) => ({
    id: card.id,
    render: () => (
      <div className="wallet-card" data-theme={card.theme}>
        <div className="wallet-card-head">
          <span className="wallet-card-kind">{t.cards[card.id].kind}</span>
          {/* 머리 오른쪽은 발급처 로고 자리 — 네 장 모두 같은 가게라 같은 그릇 표시를 둔다 */}
          <Icon name="bowl" className="wallet-card-logo" />
        </div>
        <strong className="wallet-card-title">{t.cards[card.id].title}</strong>
        <span className="wallet-card-body">{t.cards[card.id].body}</span>
        <span className="wallet-card-footer">{t.cards[card.id].footer}</span>
      </div>
    ),
  }))

  return (
    <div className="playground">
      <section className="controls" aria-label={t.controlsLabel}>
        <label>
          <span>
            {t.peek} <code>peekPx</code>
          </span>
          <input type="range" min={32} max={96} step={4} value={peekPx} onChange={(e) => setPeekPx(Number(e.target.value))} />
          <output>{peekPx}px</output>
        </label>
        <label>
          <span>
            {t.fanGap} <code>fanGapPx</code>
          </span>
          <input type="range" min={48} max={140} step={4} value={fanGapPx} onChange={(e) => setFanGapPx(Number(e.target.value))} />
          <output>{fanGapPx}px</output>
        </label>
        <label>
          <span>
            {t.duration} <code>--stack-duration</code>
          </span>
          <input type="range" min={120} max={900} step={20} value={durationMs} onChange={(e) => setDurationMs(Number(e.target.value))} />
          <output>{durationMs}ms</output>
        </label>
        <p className="controls-note">{t.note}</p>
      </section>

      <div className="wallet-stage" style={vars}>
        <header className="wallet-header">
          <strong>{t.walletTitle}</strong>
          <span className="wallet-status" role="status" aria-live="polite">
            {t.modeLabel[state.mode]}
            {selectedCard ? ` · ${selectedCard.kind}` : ''}
          </span>
        </header>
        <CardStack cards={cards} cardHeight={180} peekPx={peekPx} fanGapPx={fanGapPx} label={t.stackLabel} onStateChange={setState} />
      </div>
    </div>
  )
}
