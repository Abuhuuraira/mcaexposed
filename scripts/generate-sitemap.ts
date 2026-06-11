/**
 * Generates public/sitemap.xml from the real site data so URLs never drift.
 *
 * URLs are derived the exact same way the app derives them at runtime:
 *  - posts: `/post/${createSlug(post.title)}` (see getAllPosts in src/data/posts.ts)
 *  - pages: the indexable routes declared in src/data/page-seo.ts
 *
 * Run manually with `npm run generate:sitemap`. It also runs automatically as
 * the first step of `npm run build`, so a rebuild always ships a fresh sitemap.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { defaultPosts, createSlug, type Post } from '../src/data/posts.ts'
import { defaultPageSEO } from '../src/data/page-seo.ts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '..')

const SITE_URL = 'https://mca.exposed'

// Per-path metadata; anything not listed falls back to the post defaults below.
const PAGE_META: Record<string, { changefreq: string; priority: string }> = {
  '/': { changefreq: 'weekly', priority: '1.0' },
  '/the-courts': { changefreq: 'weekly', priority: '0.9' },
  '/the-records': { changefreq: 'weekly', priority: '0.9' },
  '/the-records/the-fraud-files': { changefreq: 'weekly', priority: '0.85' },
  '/the-records/mca-awareness': { changefreq: 'weekly', priority: '0.85' },
  '/about': { changefreq: 'monthly', priority: '0.8' },
  '/report-mca-fraud': { changefreq: 'monthly', priority: '0.7' },
  '/mca-frequently-asked-questions-legal-guide': { changefreq: 'monthly', priority: '0.7' },
  '/the-story': { changefreq: 'monthly', priority: '0.6' },
}
const POST_META = { changefreq: 'monthly', priority: '0.8' }

const readCustomPosts = (): Post[] => {
  const file = path.join(projectRoot, 'data', 'custom-posts.json')
  try {
    const parsed = JSON.parse(fs.readFileSync(file, 'utf8'))
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

// Mirrors getAllPosts(true) from src/data/posts.ts: dedup custom posts by title,
// drop default posts overridden by a custom post (by id or title), recompute the
// slug from the title, and keep only published posts.
const getPublishedPosts = (): Post[] => {
  const customPosts = readCustomPosts()
  const normalizeTitle = (value: string) => value.trim().toLowerCase()

  const uniqueCustomPosts: Post[] = []
  const seenCustomTitles = new Set<string>()
  for (const post of customPosts) {
    const normalizedTitle = normalizeTitle(post.title)
    if (seenCustomTitles.has(normalizedTitle)) continue
    seenCustomTitles.add(normalizedTitle)
    uniqueCustomPosts.push(post)
  }

  const overriddenDefaultIds = new Set(
    uniqueCustomPosts.map((post) => post.id).filter((id) => id.startsWith('default-')),
  )
  const overriddenDefaultTitles = new Set(
    uniqueCustomPosts
      .filter((post) => post.source === 'custom')
      .map((post) => normalizeTitle(post.title)),
  )

  const visibleDefaultPosts = defaultPosts.filter(
    (post) =>
      !overriddenDefaultIds.has(post.id)
      && !overriddenDefaultTitles.has(normalizeTitle(post.title)),
  )

  return [...uniqueCustomPosts, ...visibleDefaultPosts]
    .map((post) => ({ ...post, slug: createSlug(post.title) }))
    .filter((post) => post.published !== false)
}

const toIsoDate = (value: string | undefined, fallback: string): string => {
  if (!value) return fallback
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? fallback : parsed.toISOString().slice(0, 10)
}

type Entry = { loc: string; lastmod: string; changefreq: string; priority: string }

const buildEntries = (): Entry[] => {
  const today = new Date().toISOString().slice(0, 10)
  const entries: Entry[] = []
  const seenLocs = new Set<string>()

  const push = (loc: string, meta: { changefreq: string; priority: string }, lastmod: string) => {
    if (seenLocs.has(loc)) return
    seenLocs.add(loc)
    entries.push({ loc, lastmod, ...meta })
  }

  // Indexable static pages (skip anything marked noindex, e.g. privacy/search).
  for (const page of defaultPageSEO) {
    if (page.noindex) continue
    const loc = page.path === '/' ? SITE_URL : `${SITE_URL}${page.path}`
    push(loc, PAGE_META[page.path] ?? POST_META, today)
  }

  // Published posts, slugged exactly like the app routes them.
  for (const post of getPublishedPosts()) {
    push(`${SITE_URL}/post/${post.slug}`, POST_META, toIsoDate(post.date, today))
  }

  return entries
}

const renderSitemap = (entries: Entry[]): string => {
  const urls = entries
    .map(
      (entry) =>
        `  <url>\n` +
        `    <loc>${entry.loc}</loc>\n` +
        `    <lastmod>${entry.lastmod}</lastmod>\n` +
        `    <changefreq>${entry.changefreq}</changefreq>\n` +
        `    <priority>${entry.priority}</priority>\n` +
        `  </url>`,
    )
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
}

const entries = buildEntries()
const xml = renderSitemap(entries)
const outFile = path.join(projectRoot, 'public', 'sitemap.xml')
fs.writeFileSync(outFile, xml, 'utf8')

console.log(`Wrote ${entries.length} URLs to ${path.relative(projectRoot, outFile)}`)
