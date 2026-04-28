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
    title: 'Merchant Cash Advance Scams (MCA Scam)​ | MCA Exposed',
    description: 'We reveals merchant cash advance scams (MCA scam) through lawsuits and real stories, exposing companies like Supervest to protect small businesses',
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
  title: 'The Courts | Mca Exposed',
  description: 'MCA Exposed tracks litigation against merchant cash advance firms, covering lawsuits, RICO claims, and court actions addressing MCA fraud.',
  canonicalUrl: 'https://mca.exposed/the-courts',
  type: 'page',
},
  {
    id: 'faq',
    path: '/mca-frequently-asked-questions-legal-guide',
    title: 'All in One Legal Guide - MCA Frequently Asked Questions',
    description: 'Get clear legal guide about Merchant Cash Advances. Learn how MCAs work, their risks, legality, key contract terms, how to spot scams, and how MCA Exposed can help.',
    canonicalUrl: 'https://mca.exposed/mca-frequently-asked-questions-legal-guide',
    type: 'page',
  },
  {
    id: 'records',
    path: '/the-records',
    title: 'MCA Records | Mca Exposed',
    description: 'Read the MCA records. A collection of stories, reports and updates documenting MCA fraud, lawsuits and efforts to hold the industry accountable',
    canonicalUrl: 'https://mca.exposed/the-records',
    type: 'page',
  },
  {
    id: 'report',
    path: '/report-mca-fraud',
    title: 'Make a MCA Fraud Report | Mca Expose',
    description: 'Make your MCA fraud report today and help expose scams. Share your story to protect small business owners from fraudulent merchant cash advances.',
    canonicalUrl: 'https://mca.exposed/report-mca-fraud',
    type: 'page',
  },
  {
    id: 'story',
    path: '/the-story',
    title: 'The Story | Mca Exposed',
    description: 'Learn the story behind MCA Exposed. Founder shares how his small business was targeted by MCA fraud and why he is fighting back to protect others ',
    canonicalUrl: 'https://mca.exposed/the-story',
    type: 'page',
  },
]

// Default post SEO data
export const defaultPostSEO: PageSEO[] = [
  {
    id: 'post-the-call-that-started-it-all',
    path: '/post/the-call-that-started-it-all',
    title: 'The Call That Started It All',
    description: 'It all began with a phone call. A broker named Matt Owens promised easy merchant cash advance funding that would change everything.',
    canonicalUrl: 'https://mca.exposed/post/the-call-that-started-it-all',
    type: 'post',
  },
{
  id: 'post-the-hook-false-mca-promises',
  path: '/post/the-hook-false-mca-promises',
  title: 'The Hook: False MCA Promises',
  description: 'How a fake broker named Matt Owens tricked me with promises of easy money and fake papers the start of my fight against MCA fraud.',
  canonicalUrl: 'https://mca.exposed/post/the-hook-false-mca-promises',
  type: 'post',
},
  {
    id: 'post-the-mca-paperwork-it-looked-real',
    path: '/post/the-mca-paperwork-it-looked-real',
    title: 'MCA Paperwork: Finding the Truth Behind Fake Contracts',
    description: 'Matt sent contracts through DocuSign with logos and a fake lawyer’s name. The paperwork looked real, but it was all part of the MCA paperwork fraud.',
    canonicalUrl: 'https://mca.exposed/post/the-mca-paperwork-it-looked-real',
    type: 'post',
  },
  {
    id: 'post-the-trap-closes-mca-fraud',
    path: '/post/the-trap-closes-mca-fraud',
    title: 'The Reveal: The MCA Fraud Comes to Light',
    description: 'MCA Exposed shares how small business owners get trapped in merchant cash advance fraud, with rising payments an broken promises.',
    canonicalUrl: 'https://mca.exposed/post/the-trap-closes-mca-fraud',
    type: 'post',
  },
  {
    id: 'post-the-investigation-how-i-found-the-truth-behind-mca-fraud',
    path: '/post/the-investigation-how-i-found-the-truth-behind-mca-fraud',
    title: 'The Investigation: How I Found the Truth Behind MCA Fraud',
    description: 'One victim uncovers a web of MCA fraud involving fake identities, forged contracts, and linked firms like Superfast Capital, SuperVest, and others.',
    canonicalUrl: 'https://mca.exposed/post/the-investigation-how-i-found-the-truth-behind-mca-fraud',
    type: 'post',
  },
  {
    id: 'post-top-choice-financial-the-servicer-in-the-pipeline',
    path: '/post/top-choice-financial-the-servicer-in-the-pipeline',
    title: 'Top Choice Financial: The Servicer in the Pipeline',
    description: 'Discover the truth behind Top Choice Financial\'s role in a complex financial network. Explore how Top Choice Financial connects brokers and funders.',
    canonicalUrl: 'https://mca.exposed/post/top-choice-financial-the-servicer-in-the-pipeline',
    type: 'post',
  },
  {
    id: 'post-superfast-capital-inc-alternative-capital-group-the-customer-facing-funder',
    path: '/post/superfast-capital-inc-alternative-capital-group-the-customer-facing-funder',
    title: 'SuperFast Capital Inc. & Alternative Capital Group: "Funder"',
    description: "Discover the truth behind SuperFast Capital's funding practices. Learn how SuperFast Capital's branding and agreements impact your business.",
    canonicalUrl: 'https://mca.exposed/post/superfast-capital-inc-alternative-capital-group-the-customer-facing-funder',
    type: 'post',
  },
  {
    id: 'post-a-fraudulent-brokerage-ez-advance-llc',
    path: '/post/a-fraudulent-brokerage-ez-advance-llc',
    title: 'Fraud: EZ Advance LLC, Benjamin Kandhorov and Gabriel Shamuelov',
    description: 'Uncover the truth behind EZ Advance LLC, a fraudulent brokerage. Learn about the allegations against EZ Advance LLC and their disputed claims.',
    canonicalUrl: 'https://mca.exposed/post/a-fraudulent-brokerage-ez-advance-llc',
    type: 'post',
  },
  {
    id: 'post-report-mca-fraud',
    path: '/post/report-mca-fraud',
    title: 'Make a MCA Fraud Report | Mca Expose',
    description: 'Make your MCA fraud report today and help expose scams. Share your story to protect small business owners from fraudulent merchant cash advances.',
    canonicalUrl: 'https://mca.exposed/post/report-mca-fraud',
    type: 'post',
  },
{
  id: 'post-protecting-your-business-from-merchant-cash-advance-scams',
  path: '/post/protecting-your-business-from-merchant-cash-advance-scams',
  title: 'Protecting Your Business from Merchant Cash Advance Scams | MCA Exposed',
  description: 'Protect your business from merchant cash advance scams. Learn how to identify a merchant cash advance scam and safeguard your financial health.',
  canonicalUrl: 'https://mca.exposed/post/protecting-your-business-from-merchant-cash-advance-scams',
  type: 'post',
},
  {
    id: 'post-what-to-do-i-do-if-i-am-a-victim-of-merchant-cash-advance-loan-fraud',
    path: '/post/what-to-do-i-do-if-i-am-a-victim-of-merchant-cash-advance-loan-fraud',
    title: 'What To Do if I am a Victim of Merchant Cash Advance loan Fraud?',
    description: 'What to do if you’ve been defrauded by a merchant cash advance loan. Report MCA fraud, contact an attorney, document everything and file complaint.',
    canonicalUrl: 'https://mca.exposed/post/what-to-do-i-do-if-i-am-a-victim-of-merchant-cash-advance-loan-fraud',
    type: 'post',
  },
  {
    id: 'post-when-the-next-loan-never-comes-a-common-mca-scam-carroting',
    path: '/post/when-the-next-loan-never-comes-a-common-mca-scam-carroting',
    title: 'When “The Next Loan” Never Comes: A Common MCA Scam',
    description: 'MCA carroting is a common merchant cash advance scam. Brokers promise future loans or funding that never arrives, leaving small businesses trapped.',
    canonicalUrl: 'https://mca.exposed/post/when-the-next-loan-never-comes-a-common-mca-scam-carroting',
    type: 'post',
  },
  {
    id: 'post-uncovering-merchant-cash-advance-fraud-a-legal-perspective',
    path: '/post/uncovering-merchant-cash-advance-fraud-a-legal-perspective',
    title: 'Understanding MCA Fraud: A Guide for Small Business Owners',
    description: 'Understand merchant cash advance fraud, legal risks, red flags, and protection steps to help small businesses avoid scams and take informed legal action.',
    canonicalUrl: 'https://mca.exposed/post/uncovering-merchant-cash-advance-fraud-a-legal-perspective',
    type: 'post',
  },
]

export const getAllPageSEO = async (): Promise<PageSEO[]> => {
  try {
    const response = await fetch(`${API_BASE}`)
    if (response.ok) {
      const customSEO = await response.json()
      // Merge default pages and posts with custom SEO (custom overrides defaults)
      const allDefaults = [...defaultPageSEO, ...defaultPostSEO]
      const merged = allDefaults.map(defaultSEO => {
        const custom = customSEO.find((c: PageSEO) => c.id === defaultSEO.id)
        return custom || defaultSEO
      })
      return merged
    }
  } catch (error) {
    console.error('Failed to fetch custom page SEO:', error)
  }
  return [...defaultPageSEO, ...defaultPostSEO]
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