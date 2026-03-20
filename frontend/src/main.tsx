import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { MainApp } from './MainApp.tsx'

// Disable console logging client-side for clean production output
if (typeof window !== 'undefined') {
  console.log = () => {}
  console.info = () => {}
  console.warn = () => {}
  console.error = () => {}
  console.debug = () => {}
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MainApp />
  </StrictMode>,
)
