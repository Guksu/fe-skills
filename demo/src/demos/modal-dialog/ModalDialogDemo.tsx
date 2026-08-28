import { useState, type CSSProperties } from 'react'
import { Modal } from '@skills/modal-dialog/assets/Modal'
import './modal-dialog-demo.css'

type Which = 'cancel' | 'pay' | null

export const ModalDialogDemo = () => {
  const [which, setWhich] = useState<Which>(null)
  const [durationMs, setDurationMs] = useState(240)
  const [log, setLog] = useState('버튼을 눌러 모달을 열어 보세요.')

  const vars = { '--modal-duration': `${durationMs}ms`, '--modal-bg': 'var(--surface)' } as CSSProperties
  const closeWith = (message: string) => {
    setWhich(null)
    setLog(message)
  }

  return (
    <div className="playground">
      <section className="controls" aria-label="애니메이션 옵션">
        <label>
          <span>
            속도 <code>--modal-duration</code>
          </span>
          <input
            type="range"
            min={100}
            max={600}
            step={20}
            value={durationMs}
            onChange={(e) => setDurationMs(Number(e.target.value))}
          />
          <output>{durationMs}ms</output>
        </label>
        <p className="controls-note">
          열린 뒤 Tab을 눌러 보세요 — 포커스가 모달 안에서만 돕니다. Esc·백드롭 클릭으로 닫히고, 닫히면
          포커스가 열었던 버튼으로 돌아옵니다. 전부 네이티브 <code>&lt;dialog&gt;</code>가 하는 일입니다.
        </p>
      </section>

      <div className="modal-stage" style={vars}>
        <h2 className="modal-stage-title">주문 #1024 — 들깨칼국수 1 · 비빔국수 1</h2>
        <div className="modal-stage-actions">
          <button type="button" onClick={() => setWhich('cancel')}>
            주문 취소
          </button>
          <button type="button" onClick={() => setWhich('pay')}>
            결제하기
          </button>
        </div>
        <p className="modal-stage-log" aria-live="polite">
          {log}
        </p>

        <Modal open={which === 'cancel'} onClose={() => closeWith('취소 확인창을 닫았습니다.')} labelledBy="cancel-title">
          <h2 id="cancel-title" className="modal-demo-title">
            주문을 취소할까요?
          </h2>
          <p className="modal-demo-text">조리가 시작되면 취소할 수 없습니다. 지금은 취소가 가능합니다.</p>
          <div className="modal-demo-actions">
            <button type="button" onClick={() => closeWith('돌아가기를 눌렀습니다 — 주문이 유지됩니다.')}>
              돌아가기
            </button>
            <button type="button" className="modal-demo-danger" onClick={() => closeWith('주문이 취소되었습니다.')}>
              취소하기
            </button>
          </div>
        </Modal>

        <Modal
          open={which === 'pay'}
          onClose={() => closeWith('결제창은 백드롭 클릭으로 닫히지 않습니다 — Esc 또는 버튼으로 닫힙니다.')}
          labelledBy="pay-title"
          dismissOnBackdrop={false}
        >
          <h2 id="pay-title" className="modal-demo-title">
            19,000원을 결제할까요?
          </h2>
          <p className="modal-demo-text">
            파괴적·결제성 확인이라 <code>dismissOnBackdrop=false</code> — 바깥을 눌러도 닫히지 않습니다.
          </p>
          <div className="modal-demo-actions">
            <button type="button" onClick={() => closeWith('결제를 취소했습니다.')}>
              취소
            </button>
            <button type="button" className="modal-demo-primary" onClick={() => closeWith('결제가 완료되었습니다 🍜')}>
              결제
            </button>
          </div>
        </Modal>
      </div>
    </div>
  )
}
