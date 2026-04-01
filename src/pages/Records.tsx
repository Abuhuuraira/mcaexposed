import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import FooterSection from '../components/FooterSection'
import { getAllPosts, type PostCategory } from '../data/posts'
import styles from './Records.module.css'

const filters = ['All Posts', 'The Fraud Files', 'MCA Awareness', 'Other'] as const
type FilterOption = (typeof filters)[number]

const categoryFilters: PostCategory[] = ['The Fraud Files', 'MCA Awareness', 'Other']

const categoryToQuery: Record<FilterOption, string> = {
  'All Posts': 'all',
  'The Fraud Files': 'the-fraud-files',
  'MCA Awareness': 'mca-awareness',
  Other: 'other',
}

const queryToCategory: Record<string, FilterOption> = {
  all: 'All Posts',
  'the-fraud-files': 'The Fraud Files',
  'mca-awareness': 'MCA Awareness',
  other: 'Other',
}

function Records() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [allPosts, setAllPosts] = useState(getAllPosts())
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

  useEffect(() => {
    setAllPosts(getAllPosts(true))
  }, [])

  const filteredPosts = useMemo(() => {
    if (activeFilter === 'All Posts') {
      return allPosts
    }

    if (categoryFilters.includes(activeFilter as PostCategory)) {
      return allPosts.filter((post) => post.category === activeFilter)
    }

    return allPosts
  }, [activeFilter, allPosts])

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
                <Link to={`/post/${post.slug}`} className={styles.postImageLink}>
                  <img src={post.image} alt={post.title} />
                </Link>

                <div className={styles.cardBody}>
                  <h3>
                    <Link to={`/post/${post.slug}`}>{post.title}</Link>
                  </h3>
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