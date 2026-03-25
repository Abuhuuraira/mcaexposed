import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { useSearchParams } from 'react-router-dom'
import FooterSection from '../components/FooterSection'
import styles from './Records.module.css'

const posts = [
  {
    title: 'Uncovering Merchant Cash Advance Fraud: A Legal Perspective',
    excerpt:
      'Merchant cash advances (MCAs) have become a popular financing option for small businesses. They offer quick access to cash, which can be helpful but risky when terms are unclear.',
    category: 'MCA Awareness',
    date: 'Aug 25, 2025',
    readTime: '4 min read',
    image:
      'https://static.wixstatic.com/media/6b4687_1d4ed5d0f1194eabb9076ddc35e6201c~mv2.png/v1/fill/w_292,h_389,fp_0.50_0.50,q_95,enc_avif,quality_auto/6b4687_1d4ed5d0f1194eabb9076ddc35e6201c~mv2.png',
  },
  {
    title: 'When “The Next Loan” Never Comes: A Common MCA Scam - Carroting',
    excerpt:
      'One of the most common merchant cash advance scams looks simple on the surface. A business owner is promised real long-term funding that never actually arrives.',
    category: 'MCA Awareness',
    date: 'Aug 15, 2025',
    readTime: '3 min read',
    image:
      'https://static.wixstatic.com/media/6b4687_b1f370bec2c94fe7a2b14e91914eee71~mv2.png/v1/fill/w_292,h_389,fp_0.50_0.50,q_95,enc_avif,quality_auto/6b4687_b1f370bec2c94fe7a2b14e91914eee71~mv2.png',
  },
  {
    title: 'What To Do if I am a Victim of Merchant Cash Advance (MCA) loan Fraud?',
    excerpt:
      'If you just found out you were scammed by an MCA company, you may feel stuck. The good news is there are concrete steps you can take right away to protect your business.',
    category: 'MCA Awareness',
    date: 'Aug 8, 2025',
    readTime: '2 min read',
    image:
      'https://static.wixstatic.com/media/6b4687_88b2fddecb604628b61679c4217c2989~mv2.png/v1/fill/w_292,h_389,fp_0.50_0.50,q_95,enc_avif,quality_auto/6b4687_88b2fddecb604628b61679c4217c2989~mv2.png',
  },
  {
    title: 'Protecting Your Business from Merchant Cash Advance Scams',
    excerpt:
      'Understanding merchant cash advances is essential before signing. This guide covers practical checks to reduce risk and avoid high-pressure scam structures.',
    category: 'MCA Awareness',
    date: 'Aug 1, 2025',
    readTime: '4 min read',
    image:
      'https://static.wixstatic.com/media/6b4687_a26d03c5b94b4dbba07b4f2b712f6355~mv2.png/v1/fill/w_292,h_389,fp_0.50_0.50,q_95,enc_avif,quality_auto/6b4687_a26d03c5b94b4dbba07b4f2b712f6355~mv2.png',
  },
  {
    title: 'A Fraudulent Brokerage: EZ Advance LLC, Benjamin Kandhorov, and Gabriel Shamuelov',
    excerpt:
      'This article summarizes allegations in a federal lawsuit. The defendants dispute these claims, and the case remains active as legal proceedings continue.',
    category: 'The Fraud Files',
    date: 'Jun 1, 2025',
    readTime: '5 min read',
    image:
      'https://static.wixstatic.com/media/6b4687_63f6180ed8e347d3a84b470314d29761~mv2.png/v1/fill/w_292,h_179,fp_0.50_0.50,q_95,enc_avif,quality_auto/6b4687_63f6180ed8e347d3a84b470314d29761~mv2.png',
  },
  {
    title: 'Report MCA Fraud',
    excerpt:
      'Most small business owners who get trapped in a merchant cash advance scam don’t know where to turn. This post explains practical reporting options and how to document evidence.',
    category: 'MCA Awareness',
    date: 'Aug 1, 2025',
    readTime: '1 min read',
    image:
      'https://static.wixstatic.com/media/6b4687_9546dcb48b434073a1dc62eee49985a3~mv2.png/v1/fill/w_292,h_389,fp_0.50_0.50,q_95,enc_avif,quality_auto/6b4687_9546dcb48b434073a1dc62eee49985a3~mv2.png',
  },
  {
    title: 'The Investigation: How I Found the Truth Behind MCA Fraud',
    excerpt:
      'From forgery and aliases to a deeper network, this post walks through the investigation process and the evidence trail that led to legal action.',
    category: 'The Fraud Files',
    date: 'Apr 22, 2025',
    readTime: '3 min read',
    image:
      'https://static.wixstatic.com/media/6b4687_d355f8d7c6dd48db8e711a9de08419f3~mv2.jpg/v1/fill/w_292,h_167,fp_0.50_0.50,q_90,enc_avif,quality_auto/6b4687_d355f8d7c6dd48db8e711a9de08419f3~mv2.jpg',
  },
]

const filters = ['All Posts', 'The Fraud Files', 'MCA Awareness'] as const
type FilterOption = (typeof filters)[number]

const categoryToQuery: Record<FilterOption, string> = {
  'All Posts': 'all',
  'The Fraud Files': 'the-fraud-files',
  'MCA Awareness': 'mca-awareness',
}

const queryToCategory: Record<string, FilterOption> = {
  all: 'All Posts',
  'the-fraud-files': 'The Fraud Files',
  'mca-awareness': 'MCA Awareness',
}

function Records() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeFilter, setActiveFilter] = useState<FilterOption>(() => {
    const category = searchParams.get('category') ?? 'all'
    return queryToCategory[category] ?? 'All Posts'
  })

  const handleFilterChange = (filter: FilterOption) => {
    setActiveFilter(filter)
    setSearchParams({ category: categoryToQuery[filter] })
  }

  useEffect(() => {
    const category = searchParams.get('category') ?? 'all'
    const nextFilter = queryToCategory[category] ?? 'All Posts'
    setActiveFilter(nextFilter)
  }, [searchParams])

  const filteredPosts = useMemo(() => {
    if (activeFilter === 'All Posts') {
      return posts
    }

    return posts.filter((post) => post.category === activeFilter)
  }, [activeFilter])

  return (
    <div className={styles.pageWrap}>
      <section className={styles.heroSection}>
        <div className={styles.contentContainer}>
          <h1>All Posts</h1>

          <div className={styles.filterRow}>
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                className={`${styles.filterBtn} ${
                  activeFilter === filter ? styles.filterActive : ''
                }`}
                onClick={() => handleFilterChange(filter)}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className={styles.postsGrid}>
            {filteredPosts.map((post, index) => (
              <article
                key={post.title}
                className={styles.postCard}
                style={{ '--card-index': index } as CSSProperties}
              >
                <img src={post.image} alt={post.title} />

                <div className={styles.cardBody}>
                  <h3>{post.title}</h3>
                  <p className={styles.excerpt}>{post.excerpt}</p>

                  <div className={styles.metaRow}>
                    <span>{post.category}</span>
                    <span>{post.date}</span>
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>


      <div className={styles.recordsDivider}></div>
      <FooterSection />
    </div>
  )
}

export default Records