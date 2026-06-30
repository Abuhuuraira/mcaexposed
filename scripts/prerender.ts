/**
 * Build-time prerendering (Static Site Generation).
 *
 * Runs after `vite build` (client bundle -> dist/) and the SSR build
 * (`vite build --ssr` -> dist-ssr/entry-server.js). For every public route it
 * renders the real React app to HTML and writes dist/<route>/index.html so the
 * server response already contains a unique <title>, meta description, canonical,
 * Open Graph / Twitter tags, the page <h1> and the page content — before any JS
 * runs. The same markup hydrates normally in the browser.
 *
 * Data is read directly from the source defaults + the data/*.json files (the same
 * inputs the running API serves), so no server needs to be running during build.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

import { defaultPosts, createSlug, type Post } from '../src/data/posts.ts'
import { defaultPageSEO, defaultPostSEO, type PageSEO } from '../src/data/page-seo.ts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '..')
const distDir = path.join(projectRoot, 'dist')

// Import the SSR bundle produced by `vite build --ssr`.
const { render } = (await import(
  pathToFileURL(path.join(projectRoot, 'dist-ssr', 'entry-server.js')).href
)) as typeof import('../src/entry-server.tsx')

// ----- data ---------------------------------------------------------------

const readJsonArray = <T>(file: string): T[] => {
  try {
    const parsed = JSON.parse(fs.readFileSync(path.join(projectRoot, 'data', file), 'utf8'))
    return Array.isArray(parsed) ? (parsed as T[]) : []
  } catch {
    return []
  }
}

// Mirrors getAllPageSEO(): custom entries (by id) override the defaults.
const buildPageSEO = (): PageSEO[] => {
  const custom = readJsonArray<PageSEO>('page-seo.json')
  return [...defaultPageSEO, ...defaultPostSEO].map((base) => {
    const override = custom.find((c) => c.id === base.id)
    return override ?? base
  })
}

// Mirrors getAllPosts(true): dedupe custom posts by title, drop defaults that a
// custom post overrides (by id or title), recompute slugs, keep only published.
const buildPublishedPosts = (): Post[] => {
  const custom = readJsonArray<Post>('custom-posts.json')
  const normalizeTitle = (value: string) => value.trim().toLowerCase()

  const uniqueCustom: Post[] = []
  const seen = new Set<string>()
  for (const post of custom) {
    const key = normalizeTitle(post.title)
    if (seen.has(key)) continue
    seen.add(key)
    uniqueCustom.push(post)
  }

  const overriddenIds = new Set(
    uniqueCustom.map((p) => p.id).filter((id) => id.startsWith('default-')),
  )
  const overriddenTitles = new Set(
    uniqueCustom.filter((p) => p.source === 'custom').map((p) => normalizeTitle(p.title)),
  )

  const visibleDefaults = defaultPosts.filter(
    (p) => !overriddenIds.has(p.id) && !overriddenTitles.has(normalizeTitle(p.title)),
  )

  return [...uniqueCustom, ...visibleDefaults]
    .map((p) => ({ ...p, slug: createSlug(p.title) }))
    .filter((p) => p.published !== false)
}

const pageSEO = buildPageSEO()
const posts = buildPublishedPosts()

// Trimmed copies keep the injected per-page payload small.
const listPosts: Post[] = posts.map((p) => ({
  ...p,
  content: '',
  contentImage: undefined,
  downloadFile: undefined,
}))
const detailPost = (p: Post): Post => ({ ...p, downloadFile: undefined })

// ----- routes -------------------------------------------------------------

type Route = { url: string; data: { pageSEO: PageSEO[]; posts: Post[] } }

// Pages that have a real route in App.tsx (skip /search which has none).
const EXCLUDED_PAGE_PATHS = new Set(['/search'])
const RECORDS_PATHS = new Set([
  '/',
  '/the-records',
  '/the-records/the-fraud-files',
  '/the-records/mca-awareness',
])

const seoFor = (routePath: string): PageSEO[] => {
  const match = pageSEO.find((s) => s.path === routePath)
  return match ? [match] : []
}

const routes: Route[] = []

for (const page of defaultPageSEO) {
  if (EXCLUDED_PAGE_PATHS.has(page.path)) continue
  routes.push({
    url: page.path,
    data: {
      pageSEO: seoFor(page.path),
      posts: RECORDS_PATHS.has(page.path) ? listPosts : [],
    },
  })
}

for (const post of posts) {
  const url = `/post/${post.slug}`
  routes.push({
    url,
    data: { pageSEO: seoFor(url), posts: [detailPost(post)] },
  })
}

// ----- html assembly ------------------------------------------------------

const template = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8')

const serializeData = (data: unknown): string =>
  JSON.stringify(data).replace(/</g, '\\u003c')

const buildHtml = (route: Route): string => {
  const { html, head } = render(route.url, route.data)
  const dataScript = `<script>window.__SSR_DATA__=${serializeData(route.data)}</script>`

  let out = template
    // The per-page <title> comes from Helmet; drop the static placeholder title.
    .replace('<title>MCA Expose</title>', '')

  // Head tags (title / meta / canonical / OG / Twitter).
  out = out.includes('<!--app-head-->')
    ? out.replace('<!--app-head-->', head)
    : out.replace('</head>', `    ${head}\n  </head>`)

  // Rendered app markup.
  out = out.includes('<!--app-html-->')
    ? out.replace('<!--app-html-->', html)
    : out.replace('<div id="root"></div>', `<div id="root">${html}</div>`)

  // Inline the initial data so the first client render matches (hydration).
  const moduleScriptIdx = out.indexOf('<script type="module"')
  if (moduleScriptIdx !== -1) {
    out = `${out.slice(0, moduleScriptIdx)}${dataScript}\n    ${out.slice(moduleScriptIdx)}`
  } else {
    out = out.replace('</body>', `  ${dataScript}\n  </body>`)
  }

  return out
}

const outFileFor = (url: string): string =>
  url === '/'
    ? path.join(distDir, 'index.html')
    : path.join(distDir, url.replace(/^\//, ''), 'index.html')

let written = 0
for (const route of routes) {
  const outFile = outFileFor(route.url)
  fs.mkdirSync(path.dirname(outFile), { recursive: true })
  fs.writeFileSync(outFile, buildHtml(route), 'utf8')
  written += 1
}

console.log(`Prerendered ${written} routes into ${path.relative(projectRoot, distDir)}/`)
