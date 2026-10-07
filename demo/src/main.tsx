import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
// 셸과 데모가 함께 쓰는 토큰 — 셸 CSS(styles.css)보다 먼저 선언한다
import '@skills/layout-principles/assets/layout-tokens.css'
import '@skills/motion-principles/assets/motion-tokens.css'
import './styles.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
