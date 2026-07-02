import DOMPurify from 'dompurify'

// The single, shared HTML sanitizer used BOTH when saving editor content and
// when rendering it on the public post page. Keeping one implementation means
// the "what's allowed" contract can never drift between write and read paths.
//
// Security model: all post HTML is admin-authored (behind auth), but we still
// run it through DOMPurify so a compromised/mistaken payload can never inject
// script, event handlers, or javascript: URLs into the public site.

// Semantic tags the editor produces + <font>/<u> kept ONLY so legacy posts
// authored with the old execCommand editor still render.
const ALLOWED_TAGS = [
  'a', 'p', 'br', 'strong', 'b', 'em', 'i', 'u',
  'h1', 'h2', 'h3', 'h4', 'ul', 'ol', 'li', 'blockquote',
  'span', 'font',
]

const ALLOWED_ATTR = [
  'href', 'target', 'rel', 'download', // links
  'style',                             // color / font-family / font-size (span)
  'face', 'color', 'size',             // legacy <font> attributes
]

// Only these CSS properties survive on a `style` attribute. Everything else
// (position, display, background-image, …) is dropped so authored HTML stays
// clean and can't smuggle layout/behaviour tricks.
const ALLOWED_STYLE_PROPS = new Set([
  'color',
  'background-color',
  'font-family',
  'font-size',
  'text-align',
])

// Permit http(s)/mailto/tel links, plus base64 data URLs for the inline
// "download file" feature. DOMPurify's default regex blocks data: URLs, which
// would break existing download links, so we widen it explicitly here.
const ALLOWED_URI_REGEXP =
  /^(?:(?:https?|mailto|tel):|data:application\/[a-z0-9.+-]+;base64,)/i

let hooksInstalled = false

const installHooks = () => {
  if (hooksInstalled) return
  hooksInstalled = true

  DOMPurify.addHook('afterSanitizeAttributes', (node) => {
    if (!(node instanceof Element)) return

    // Force safe link behaviour on every anchor that survived sanitization.
    if (node.tagName === 'A' && node.getAttribute('href')) {
      node.setAttribute('target', '_blank')
      node.setAttribute('rel', 'noreferrer')
    }

    // Filter the style attribute down to the allowed CSS properties.
    const style = node.getAttribute('style')
    if (style) {
      const cleaned = style
        .split(';')
        .map((decl) => decl.trim())
        .filter(Boolean)
        .filter((decl) => {
          const prop = decl.split(':')[0]?.trim().toLowerCase()
          return prop ? ALLOWED_STYLE_PROPS.has(prop) : false
        })
        .join('; ')

      if (cleaned) {
        node.setAttribute('style', cleaned)
      } else {
        node.removeAttribute('style')
      }
    }
  })
}

export const sanitizeContentHtml = (rawHtml: string): string => {
  if (!rawHtml.trim()) {
    return ''
  }

  // DOMPurify needs a DOM. During SSR / build-time prerendering (Node) there is
  // none, so we pass the (already-sanitized-on-save, admin-authored) markup
  // through untouched; the browser re-sanitizes it on hydration.
  if (typeof window === 'undefined' || typeof DOMParser === 'undefined') {
    return rawHtml
  }

  installHooks()

  return DOMPurify.sanitize(rawHtml, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOWED_URI_REGEXP,
  })
}
