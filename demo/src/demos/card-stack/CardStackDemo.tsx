import { useState, type CSSProperties } from 'react'
import { CardStack } from '@skills/card-stack/assets/CardStack'
import type { StackState } from '@skills/card-stack/assets/stackLayout'
import './card-stack-demo.css'

type WalletCard = {
  id: string
  theme: 'points' | 'coupon' | 'prepaid' | 'regular'
  kind: string
  title: string
  emoji: string
  body: string
  footer: string
}

const WALLET: WalletCard[] = [
  { id: 'points', theme: 'points', kind: '적립 카드', title: '면 한 그릇, 도장 하나', emoji: '🍜', body: '도장 7 / 10', footer: '10개 모으면 잔치국수 한 그릇' },
  { id: 'coupon', theme: 'coupon', kind: '쿠폰', title: '손만두 1인분 무료', emoji: '🥟', body: '칼국수 주문 시 사용 가능', footer: '유효기간 10월 31일까지' },
  { id: 'prepaid', theme: 'prepaid', kind: '선불 카드', title: '국수집 선불 잔액', emoji: '💳', body: '32,000원', footer: '충전 5만원마다 5천원 덤' },
  { id: 'regular', theme: 'regular', kind: '단골 카드', title: '성수동 단골 3년차', emoji: '🥢', body: '방문 128회', footer: '단골 전용 — 육수 리필 무제한' },
]

const MODE_LABEL: Record<StackState['mode'], string> = {
  stacked: 'stacked — 겹침 (카드를 눌러 펼치기)',
  fanned: 'fanned — 펼침 (카드를 골라 앞으로 꺼내기)',
  selected: 'selected — 선택 (다시 누르거나 Esc로 되돌리기)',
}

export const CardStackDemo = () => {
  const [peekPx, setPeekPx] = useState(56)
  const [fanGapPx, setFanGapPx] = useState(72)
  const [durationMs, setDurationMs] = useState(420)
  const [state, setState] = useState<StackState>({ mode: 'stacked', selectedIndex: null })

  const vars = { '--stack-duration': `${durationMs}ms` } as CSSProperties
  const selectedCard = state.selectedIndex === null ? null : WALLET[state.selectedIndex]

  const cards = WALLET.map((card) => ({
    id: card.id,
    render: () => (
      <div className="wallet-card" data-theme={card.theme}>
        <div className="wallet-card-head">
          <span className="wallet-card-kind">{card.kind}</span>
          <span className="wallet-card-emoji" aria-hidden="true">
            {card.emoji}
          </span>
        </div>
        <strong className="wallet-card-title">{card.title}</strong>
        <span className="wallet-card-body">{card.body}</span>
        <span className="wallet-card-footer">{card.footer}</span>
      </div>
    ),
  }))

  return (
    <div className="playground">
      <section className="controls" aria-label="카드 묶음 옵션">
        <label>
          <span>
            겹침 높이 <code>peekPx</code>
          </span>
          <input type="range" min={32} max={96} step={4} value={peekPx} onChange={(e) => setPeekPx(Number(e.target.value))} />
          <output>{peekPx}px</output>
        </label>
        <label>
          <span>
            펼침 간격 <code>fanGapPx</code>
          </span>
          <input type="range" min={48} max={140} step={4} value={fanGapPx} onChange={(e) => setFanGapPx(Number(e.target.value))} />
          <output>{fanGapPx}px</output>
        </label>
        <label>
          <span>
            이동 속도 <code>--stack-duration</code>
          </span>
          <input type="range" min={120} max={900} step={20} value={durationMs} onChange={(e) => setDurationMs(Number(e.target.value))} />
          <output>{durationMs}ms</output>
        </label>
        <p className="controls-note">
          카드를 누르면 세로로 펼쳐지고, 하나를 고르면 그 카드가 맨 위로 올라오며 나머지는 아래로 내려가 겹칩니다. 같은 카드를
          다시 누르거나 <kbd>Esc</kbd>로 한 단계씩 되돌아갑니다. Tab으로 카드를 오가고 Enter로 누를 수 있습니다.
        </p>
      </section>

      <div className="wallet-stage" style={vars}>
        <header className="wallet-header">
          <strong>국수집 멤버십 카드 지갑</strong>
          <span className="wallet-status" role="status" aria-live="polite">
            {MODE_LABEL[state.mode]}
            {selectedCard ? ` · ${selectedCard.kind}` : ''}
          </span>
        </header>
        <CardStack cards={cards} cardHeight={180} peekPx={peekPx} fanGapPx={fanGapPx} label="국수집 멤버십 카드" onStateChange={setState} />
      </div>
    </div>
  )
}
