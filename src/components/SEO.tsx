import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { getPageSEOByPath, type PageSEO } from '../data/page-seo'
import { getInitialPageSEOByPath } from '../ssr/data'

interface SEOProps {
  path: string
}

// Default social-share image used when a page has no specific one.
const DEFAULT_OG_IMAGE = 'https://mca.exposed/images/post-image1.png'

export function SEO({ path }: SEOProps) {
  // Seed synchronously so the prerendered HTML (and the matching first client
  // render) already include the tags; the effect below still refreshes from the
  // live API to pick up any admin/custom overrides.
  const [seo, setSeo] = useState<PageSEO | null>(() => getInitialPageSEOByPath(path) ?? null)

  useEffect(() => {
    let active = true
    const fetchSEO = async () => {
      const pageSEO = await getPageSEOByPath(path)
      if (active) {
        setSeo(pageSEO || null)
      }
    }
    fetchSEO()
    return () => {
      active = false
    }
  }, [path])

  if (!seo) {
    return null
  }

  return (
    <Helmet>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <link rel="canonical" href={seo.canonicalUrl} />
      {seo.noindex && <meta name="robots" content="noindex" />}

      {/* Open Graph */}
      <meta property="og:type" content={seo.type === 'post' ? 'article' : 'website'} />
      <meta property="og:site_name" content="MCA Exposed" />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:url" content={seo.canonicalUrl} />
      <meta property="og:image" content={DEFAULT_OG_IMAGE} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={DEFAULT_OG_IMAGE} />
    </Helmet>
  )
}
