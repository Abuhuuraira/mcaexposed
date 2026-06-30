import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { setInitialData } from './ssr/data.ts'

// Seed the synchronous initial-data store from data the prerenderer inlined into
// the page, so the first client render matches the prerendered HTML.
setInitialData(window.__SSR_DATA__)

const rootEl = document.getElementById('root')!

const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// Prerendered pages already contain real markup inside #root -> hydrate it.
// In `vite dev` (or any non-prerendered HTML) #root is empty -> mount fresh.
if (rootEl.childElementCount > 0) {
  hydrateRoot(rootEl, app)
} else {
  createRoot(rootEl).render(app)
}
