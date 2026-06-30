/**
 * Server entry used only at build time by scripts/prerender.ts.
 *
 * `render(url, data)` seeds the synchronous initial-data store, renders the real
 * app for `url` to an HTML string, and returns that markup plus the collected
 * <head> tags (title / meta / canonical / Open Graph / Twitter) produced by
 * react-helmet-async. The client bundle is untouched by this file.
 */
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import { HelmetProvider, type HelmetServerState } from 'react-helmet-async'
import { AppContent } from './App'
import { setInitialData, type InitialData } from './ssr/data'

export function render(url: string, data: InitialData = {}): { html: string; head: string } {
  setInitialData(data)

  const helmetContext: { helmet?: HelmetServerState } = {}

  const html = renderToString(
    <HelmetProvider context={helmetContext}>
      <StaticRouter location={url}>
        <AppContent />
      </StaticRouter>
    </HelmetProvider>,
  )

  const { helmet } = helmetContext
  const head = [
    helmet?.title?.toString() ?? '',
    helmet?.meta?.toString() ?? '',
    helmet?.link?.toString() ?? '',
  ]
    .filter(Boolean)
    .join('\n    ')

  return { html, head }
}
