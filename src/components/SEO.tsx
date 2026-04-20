import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { getPageSEOByPath, type PageSEO } from '../data/page-seo'

interface SEOProps {
  path: string
}

export function SEO({ path }: SEOProps) {
  const [seo, setSeo] = useState<PageSEO | null>(null)

  useEffect(() => {
    const fetchSEO = async () => {
      const pageSEO = await getPageSEOByPath(path)
      setSeo(pageSEO || null)
    }
    fetchSEO()
  }, [path])

  if (!seo) {
    return null
  }

  return (
    <Helmet>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <link rel="canonical" href={seo.canonicalUrl} />
    </Helmet>
  )
}