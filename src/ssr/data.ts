/**
 * Synchronous "initial data" used to render real content on the very first paint
 * (during build-time prerendering on the server, and during hydration on the client).
 *
 * This does NOT replace the existing async API fetching. Components still call the
 * live `/api` endpoints inside their effects to pick up admin/custom updates. This
 * store only seeds the *first* render so the prerendered HTML (and the matching
 * hydration render) already contain titles, meta and page content before JS runs.
 *
 * On the server the prerenderer calls `setInitialData()` before each render.
 * On the client `main.tsx` calls `setInitialData(window.__SSR_DATA__)` before hydrating.
 * When no initial data is present (e.g. `vite dev`), getters fall back to the static
 * defaults so behaviour is unchanged.
 */
import { defaultPageSEO, defaultPostSEO, type PageSEO } from '../data/page-seo'
import { defaultPosts, createSlug, type Post } from '../data/posts'

export type InitialData = {
  pageSEO?: PageSEO[]
  posts?: Post[]
}

let store: InitialData = {}

export const setInitialData = (data: InitialData | undefined | null): void => {
  store = data ?? {}
}

export const getInitialData = (): InitialData => store

const normalizeRouteValue = (value: string): string => {
  try {
    return decodeURIComponent(value).trim().toLowerCase()
  } catch {
    return value.trim().toLowerCase()
  }
}

export const getInitialPageSEOByPath = (path: string): PageSEO | undefined => {
  const fromStore = store.pageSEO?.find((seo) => seo.path === path)
  if (fromStore) {
    return fromStore
  }
  return [...defaultPageSEO, ...defaultPostSEO].find((seo) => seo.path === path)
}

const withSlugs = (posts: Post[]): Post[] =>
  posts.map((post) => ({ ...post, slug: createSlug(post.title) }))

export const getInitialPosts = (): Post[] => {
  if (store.posts) {
    return store.posts
  }
  return withSlugs(defaultPosts).filter((post) => post.published !== false)
}

export const getInitialPostBySlug = (slug: string): Post | undefined => {
  const target = normalizeRouteValue(slug)
  const list = store.posts ?? withSlugs(defaultPosts)

  return list.find((post) => {
    return (
      normalizeRouteValue(post.slug) === target ||
      normalizeRouteValue(createSlug(post.title)) === target ||
      normalizeRouteValue(post.id) === target
    )
  })
}
