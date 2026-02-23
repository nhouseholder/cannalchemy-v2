import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { migrateStorageKeys } from './services/storage'

// ── Global error handlers (catch unhandled exceptions in production) ──
if (import.meta.env.PROD) {
  window.addEventListener('error', (event) => {
    console.error('[Global Error]', event.error?.message || event.message, event.error?.stack)
  })
  window.addEventListener('unhandledrejection', (event) => {
    console.error('[Unhandled Promise]', event.reason?.message || event.reason, event.reason?.stack)
  })
}

migrateStorageKeys()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
