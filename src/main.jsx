import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import SketchToUI from './SketchToUI.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SketchToUI />
  </StrictMode>,
)
