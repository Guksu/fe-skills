import { useState } from 'react'
import { LoadingButton } from '@skills/loading-button/assets/LoadingButton'
import './loading-button-demo.css'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const LoadingButtonDemo = () => {
  const [latencyMs, setLatencyMs] = useState(90)
  const [minLoadingMs, setMinLoadingMs] = useState(400)
  const [willFail, setWillFail] = useState(false)
  const [sentCount, setSentCount] = useState(0)
  const [clickCount, setClickCount] = useState(0)

  const placeOrder = async () => {
    setSentCount((prev) => prev + 1) // 실제로 서버에 나간 요청 수 — 연타해도 늘지 않아야 한다
    await delay(latencyMs)
    if (willFail) throw new Error('품절된 메뉴입니다')
    return 'ok'
  }

  return (
    <div className="playground">
      <section className="controls" aria-label="버튼 옵션">
        <label>
          <span>
            서버 응답 지연 <code>latency</code>
          </span>
          <input type="range" min={0} max={2000} step={10} value={latencyMs} onChange={(e) => setLatencyMs(Number(e.target.value))} />
          <output>{latencyMs}ms</output>
        </label>
        <label>
          <span>
            최소 로딩 유지 <code>minLoadingMs</code>
          </span>
          <input type="range" min={0} max={1200} step={50} value={minLoadingMs} onChange={(e) => setMinLoadingMs(Number(e.target.value))} />
          <output>{minLoadingMs}ms</output>
        </label>
        <label className="controls-inline">
          <input type="checkbox" checked={willFail} onChange={(e) => setWillFail(e.target.checked)} />
          <span>서버가 실패로 응답</span>
        </label>
        <p className="controls-note">
          지연을 90ms로 두고 최소 로딩을 0으로 내려 보세요 — 스피너가 깜빡이고 지나가 눌린 건지 알 수 없습니다. 400ms로
          올리면 같은 응답이 "전송 중"으로 읽힙니다. 버튼을 연타해도 아래 <b>실제 전송</b> 수는 늘지 않습니다.
        </p>
      </section>

      <div className="lb-stage">
        <h2 className="lb-stage-title">멸치국수 2인분</h2>
        <p className="lb-stage-price">16,000원 · 성수동 손칼국수</p>

        <div className="lb-actions" onClickCapture={() => setClickCount((prev) => prev + 1)}>
          <LoadingButton
            onAction={placeOrder}
            minLoadingMs={minLoadingMs}
            loadingLabel="주문 중"
            successLabel="주문 완료"
            errorLabel="품절입니다"
          >
            주문하기
          </LoadingButton>
        </div>

        <dl className="lb-counters">
          <div>
            <dt>버튼 클릭</dt>
            <dd>{clickCount}회</dd>
          </div>
          <div>
            <dt>실제 전송</dt>
            <dd className="lb-counter-strong">{sentCount}회</dd>
          </div>
        </dl>

        <button
          type="button"
          className="lb-reset"
          onClick={() => {
            setClickCount(0)
            setSentCount(0)
          }}
        >
          카운터 초기화
        </button>
      </div>
    </div>
  )
}
