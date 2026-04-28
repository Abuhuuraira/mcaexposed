export type PageSEO = {
  id: string
  path: string
  title: string
  description: string
  canonicalUrl: string
  type: 'page' | 'post'
}

const API_BASE = '/api/page-seo'

export const defaultPageSEO: PageSEO[] = [
  {
    id: 'home',
    path: '/',
    title: 'MCA Exposes - Uncovering Merchant Cash Advance Fraud',
    description: 'Learn about merchant cash advance fraud, legal perspectives, and how to protect your business from MCA scams and predatory lending practices.',
    canonicalUrl: 'https://mca.exposed/',
    type: 'page',
  },
  {
    id: 'about',
    path: '/about',
    title: 'About MCA Exposes - Our Mission Against MCA Fraud',
    description: 'About MCA Exposes: Our mission to educate businesses about merchant cash advance fraud, provide legal resources, and advocate for fair lending practices.',
    canonicalUrl: 'https://mca.exposed/about',
    type: 'page',
  },
  {
    id: 'courts',
    path: '/the-courts',
    title: 'MCA Court Cases - Legal Actions Against Fraudulent Lenders',
    description: 'Browse court cases and legal actions taken against merchant cash advance companies involved in fraudulent practices and predatory lending.',
    canonicalUrl: 'https://mca.exposed/the-courts',
    type: 'page',
  },
  {
    id: 'faq',
    path: '/mca-frequently-asked-questions-legal-guide',
    title: 'MCA FAQ - Frequently Asked Questions About Merchant Cash Advances',
    description: 'Common questions and answers about merchant cash advances, MCA fraud, legal protections, and how to identify and avoid predatory lending.',
    canonicalUrl: 'https://mca.exposed/mca-frequently-asked-questions-legal-guide',
    type: 'page',
  },
  {
    id: 'records',
    path: '/the-records',
    title: 'MCA Records - Articles and Resources on Merchant Cash Advance Fraud',
    description: 'Comprehensive records and articles about merchant cash advance fraud, legal cases, and educational resources for business owners.',
    canonicalUrl: 'https://mca.exposed/the-records',
    type: 'page',
  },
  {
    id: 'report',
    path: '/report-mca-fraud',
    title: 'Report MCA Fraud - Submit Your Experience',
    description: 'Report merchant cash advance fraud and share your experience to help others avoid predatory lending practices and support legal actions.',
    canonicalUrl: 'https://mca.exposed/report-mca-fraud',
    type: 'page',
  },
  {
    id: 'story',
    path: '/the-story',
    title: 'Your MCA Story - Share Your Experience with Merchant Cash Advances',
    description: 'Share your personal story about merchant cash advance experiences, whether positive or negative, to help educate the business community.',
    canonicalUrl: 'https://mca.exposed/the-story',
    type: 'page',
  },
]

export const getAllPageSEO = async (): Promise<PageSEO[]> => {
  try {
    const response = await fetch(`${API_BASE}`)
    if (response.ok) {
      const customSEO = await response.json()
      // Merge custom SEO with defaults, custom overrides defaults
      const merged = defaultPageSEO.map(defaultSEO => {
        const custom = customSEO.find((c: PageSEO) => c.id === defaultSEO.id)
        return custom || defaultSEO
      })
      return merged
    }
  } catch (error) {
    console.error('Failed to fetch custom page SEO:', error)
  }
  return defaultPageSEO
}

export const updatePageSEO = async (id: string, updates: Partial<PageSEO>): Promise<PageSEO | null> => {
  try {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    })
    if (response.ok) {
      return await response.json()
    }
  } catch (error) {
    console.error('Failed to update page SEO:', error)
  }
  return null
}

export const getPageSEOByPath = async (path: string): Promise<PageSEO | undefined> => {
  const allSEO = await getAllPageSEO()
  return allSEO.find(seo => seo.path === path)
}