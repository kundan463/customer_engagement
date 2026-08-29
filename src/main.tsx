import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

import './styles/01-base.css'
import './styles/02-chrome.css'
import './styles/03-hero.css'
import './styles/04-journey.css'
import './styles/05-platform.css'
import './styles/07-close.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
