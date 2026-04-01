export type PostCategory = 'MCA Awareness' | 'The Fraud Files' | 'Other'

export type Post = {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  category: PostCategory
  date: string
  readTime: string
  image: string
  contentImage?: string
  source: 'default' | 'custom'
  published?: boolean
}

const STORAGE_KEY = 'mca_custom_posts'

export const defaultPosts: Post[] = [
  {
    id: 'default-1',
    slug: 'uncovering-merchant-cash-advance-fraud-a-legal-perspective',
    title: 'Uncovering Merchant Cash Advance Fraud: A Legal Perspective',
    excerpt:
      'Merchant cash advances (MCAs) have become a popular financing option for small businesses. They offer quick access to cash, which can be helpful but risky when terms are unclear.',
    content:
      'Merchant cash advances can offer fast capital for businesses, but the speed often comes with complex terms and aggressive collection structures. Before signing, business owners should review repayment language, reconciliation clauses, fees, and default triggers. Understanding these details early helps reduce legal and financial risk.',
    category: 'MCA Awareness',
    date: 'Aug 25, 2025',
    readTime: '4 min read',
    image:
      'https://static.wixstatic.com/media/6b4687_1d4ed5d0f1194eabb9076ddc35e6201c~mv2.png/v1/fill/w_292,h_389,fp_0.50_0.50,q_95,enc_avif,quality_auto/6b4687_1d4ed5d0f1194eabb9076ddc35e6201c~mv2.png',
    source: 'default',
  },
  {
    id: 'default-2',
    slug: 'when-the-next-loan-never-comes-a-common-mca-scam-carroting',
    title: 'When “The Next Loan” Never Comes: A Common MCA Scam - Carroting',
    excerpt:
      'One of the most common merchant cash advance scams looks simple on the surface. A business owner is promised real long-term funding that never actually arrives.',
    content:
      'A common pattern in MCA abuse is the promise of future funding used to pressure immediate signing. Business owners may accept harmful terms expecting a second funding round that never happens. Clear documentation and independent review are critical before agreeing to renewal-based promises.',
    category: 'MCA Awareness',
    date: 'Aug 15, 2025',
    readTime: '3 min read',
    image:
      'https://static.wixstatic.com/media/6b4687_b1f370bec2c94fe7a2b14e91914eee71~mv2.png/v1/fill/w_292,h_389,fp_0.50_0.50,q_95,enc_avif,quality_auto/6b4687_b1f370bec2c94fe7a2b14e91914eee71~mv2.png',
    source: 'default',
  },
  {
    id: 'default-3',
    slug: 'what-to-do-if-i-am-a-victim-of-merchant-cash-advance-mca-loan-fraud',
    title: 'What To Do if I am a Victim of Merchant Cash Advance (MCA) loan Fraud?',
    excerpt:
      'If you just found out you were scammed by an MCA company, you may feel stuck. The good news is there are concrete steps you can take right away to protect your business.',
    content:
      'If you suspect fraud, first preserve records: contracts, bank statements, call logs, and emails. Then consult qualified legal counsel and file reports with relevant agencies. Early action often improves your ability to dispute unauthorized debits and harmful filings.',
    category: 'MCA Awareness',
    date: 'Aug 8, 2025',
    readTime: '2 min read',
    image:
      'https://static.wixstatic.com/media/6b4687_88b2fddecb604628b61679c4217c2989~mv2.png/v1/fill/w_292,h_389,fp_0.50_0.50,q_95,enc_avif,quality_auto/6b4687_88b2fddecb604628b61679c4217c2989~mv2.png',
    source: 'default',
  },
  {
    id: 'default-4',
    slug: 'protecting-your-business-from-merchant-cash-advance-scams',
    title: 'Protecting Your Business from Merchant Cash Advance Scams',
    excerpt:
      'Understanding merchant cash advances is essential before signing. This guide covers practical checks to reduce risk and avoid high-pressure scam structures.',
    content:
      'Prevention starts with process: verify broker identity, request full agreement copies, compare funding options, and confirm reconciliation rights in writing. Do not rely on verbal promises alone for rates, renewals, or payoff terms.',
    category: 'MCA Awareness',
    date: 'Aug 1, 2025',
    readTime: '4 min read',
    image:
      'https://static.wixstatic.com/media/6b4687_a26d03c5b94b4dbba07b4f2b712f6355~mv2.png/v1/fill/w_292,h_389,fp_0.50_0.50,q_95,enc_avif,quality_auto/6b4687_a26d03c5b94b4dbba07b4f2b712f6355~mv2.png',
    source: 'default',
  },
  {
    id: 'default-5',
    slug: 'a-fraudulent-brokerage-ez-advance-llc-benjamin-kandhorov-and-gabriel-shamuelov',
    title: 'A Fraudulent Brokerage: EZ Advance LLC, Benjamin Kandhorov, and Gabriel Shamuelov',
    excerpt:
      'This article summarizes allegations in a federal lawsuit. The defendants dispute these claims, and the case remains active as legal proceedings continue.',
    content:
      'This post summarizes allegations presented in litigation records and public filings. Legal matters can evolve as the case proceeds, so readers should track court updates and consult legal counsel for case-specific interpretation.',
    category: 'The Fraud Files',
    date: 'Jun 1, 2025',
    readTime: '5 min read',
    image:
      'https://static.wixstatic.com/media/6b4687_63f6180ed8e347d3a84b470314d29761~mv2.png/v1/fill/w_292,h_179,fp_0.50_0.50,q_95,enc_avif,quality_auto/6b4687_63f6180ed8e347d3a84b470314d29761~mv2.png',
    source: 'default',
  },
  {
    id: 'default-6',
    slug: 'report-mca-fraud',
    title: 'Report MCA Fraud',
    excerpt:
      'Most small business owners who get trapped in a merchant cash advance scam don’t know where to turn. This post explains practical reporting options and how to document evidence.',
    content:
      'Reporting misconduct becomes stronger when supported by timeline evidence and transaction records. Organize your evidence, preserve original contracts, and submit clear complaints to legal and consumer channels.',
    category: 'MCA Awareness',
    date: 'Aug 1, 2025',
    readTime: '1 min read',
    image:
      'https://static.wixstatic.com/media/6b4687_9546dcb48b434073a1dc62eee49985a3~mv2.png/v1/fill/w_292,h_389,fp_0.50_0.50,q_95,enc_avif,quality_auto/6b4687_9546dcb48b434073a1dc62eee49985a3~mv2.png',
    source: 'default',
  },
  {
    id: 'default-7',
    slug: 'the-investigation-how-i-found-the-truth-behind-mca-fraud',
    title: 'The Investigation: How I Found the Truth Behind MCA Fraud',
    excerpt:
      'From forgery and aliases to a deeper network, this post walks through the investigation process and the evidence trail that led to legal action.',
    content:
      'Investigations often begin with small inconsistencies: mismatched names, unexplained debits, or changing contract versions. By tracing entities and transaction flows, business owners can uncover larger patterns that support legal action.',
    category: 'The Fraud Files',
    date: 'Apr 22, 2025',
    readTime: '3 min read',
    image:
      'https://static.wixstatic.com/media/6b4687_d355f8d7c6dd48db8e711a9de08419f3~mv2.jpg/v1/fill/w_292,h_167,fp_0.50_0.50,q_90,enc_avif,quality_auto/6b4687_d355f8d7c6dd48db8e711a9de08419f3~mv2.jpg',
    source: 'default',
  },
]

export const createSlug = (title: string) =>
  title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

export const getCustomPosts = (): Post[] => {
  if (typeof window === 'undefined') {
    return []
  }

  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    return []
  }

  try {
    const parsed = JSON.parse(raw) as Post[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export const saveCustomPosts = (posts: Post[]): boolean => {
  if (typeof window === 'undefined') {
    return false
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(posts))
    return true
  } catch {
    return false
  }
}

export const addCustomPost = (
  postInput: Omit<Post, 'id' | 'slug' | 'source'>,
): Post | undefined => {
  const current = getCustomPosts()
  const post: Post = {
    ...postInput,
    id: `custom-${Date.now()}`,
    slug: `${createSlug(postInput.title)}-${Date.now()}`,
    source: 'custom',
  }

  const updated = [post, ...current]
  if (!saveCustomPosts(updated)) {
    return undefined
  }
  return post
}

export const updateCustomPost = (
  id: string,
  postInput: Omit<Post, 'id' | 'slug' | 'source'>,
): Post | undefined => {
  const current = getCustomPosts()
  const existing = current.find((post) => post.id === id)

  if (!existing) {
    return undefined
  }

  const updatedPost: Post = {
    ...existing,
    ...postInput,
    slug: `${createSlug(postInput.title)}-${id.replace('custom-', '')}`,
  }

  const updated = current.map((post) => (post.id === id ? updatedPost : post))
  if (!saveCustomPosts(updated)) {
    return undefined
  }
  return updatedPost
}

export const updatePost = (
  id: string,
  postInput: Omit<Post, 'id' | 'slug' | 'source'>,
): Post | undefined => {
  // First check if it's a custom post
  const customPosts = getCustomPosts()
  const existingCustom = customPosts.find((post) => post.id === id)

  if (existingCustom) {
    // It's already a custom post, update it normally
    return updateCustomPost(id, postInput)
  }

  // It's a default post or doesn't exist - check in all posts
  const allPosts = getAllPosts()
  const existingPost = allPosts.find((post) => post.id === id)

  if (!existingPost) {
    return undefined
  }

  // If it's a default post, create a custom version of it
  const updatedPost: Post = {
    ...existingPost,
    ...postInput,
    slug: `${createSlug(postInput.title)}-${Date.now()}`,
    source: 'custom',
  }

  // Add to custom posts (will appear first due to getAllPosts order)
  const updated = [updatedPost, ...customPosts]
  if (!saveCustomPosts(updated)) {
    return undefined
  }
  return updatedPost
}

export const deleteCustomPost = (id: string): boolean => {
  const current = getCustomPosts()
  const updated = current.filter((post) => post.id !== id)
  return saveCustomPosts(updated)
}

export const getAllPosts = (onlyPublished = false): Post[] => {
  const allPosts = [...getCustomPosts(), ...defaultPosts]
  if (onlyPublished) {
    return allPosts.filter((post) => post.published !== false)
  }
  return allPosts
}

export const publishPost = (id: string): Post | undefined => {
  const current = getCustomPosts()
  const existing = current.find((post) => post.id === id)

  if (!existing) {
    return undefined
  }

  const updated = current.map((post) =>
    post.id === id ? { ...post, published: true } : post,
  )
  if (!saveCustomPosts(updated)) {
    return undefined
  }
  return updated.find((post) => post.id === id)
}

export const unpublishPost = (id: string): Post | undefined => {
  const current = getCustomPosts()
  const existing = current.find((post) => post.id === id)

  if (!existing) {
    return undefined
  }

  const updated = current.map((post) =>
    post.id === id ? { ...post, published: false } : post,
  )
  if (!saveCustomPosts(updated)) {
    return undefined
  }
  return updated.find((post) => post.id === id)
}

export const findPostBySlug = (slug: string): Post | undefined =>
  getAllPosts().find((post) => post.slug === slug)
