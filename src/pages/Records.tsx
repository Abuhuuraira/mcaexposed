import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { Link, useSearchParams, useParams } from 'react-router-dom'
import FooterSection from '../components/FooterSection'
import { SEO } from '../components/SEO'
import { getAllPosts, type Post, type PostCategory } from '../data/posts'
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

const normalizeCategory = (value: string) => value.trim().toLowerCase()

function Records() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { category: categoryFromPath } = useParams()
  const [allPosts, setAllPosts] = useState<Post[]>([])
  
  // Determine active filter from URL path parameter or query param
  let activeFilter: FilterOption
  if (categoryFromPath) {
    activeFilter = queryToCategory[categoryFromPath] ?? 'All Posts'
  } else {
    activeFilter = queryToCategory[searchParams.get('category') ?? 'all'] ?? 'All Posts'
  }

  useEffect(() => {
    if (activeFilter === 'All Posts') {
      document.title = 'MCA Records | Mca Exposed'
    } else {
      document.title = `${activeFilter} | Mca Exposed`
    }
  }, [activeFilter])

  const refreshPosts = async () => {
    const posts = await getAllPosts(true)
    setAllPosts(posts)
  }

  const handleFilterChange = (filter: FilterOption) => {
    if (filter === 'All Posts') {
      // Navigate to base records page without category
      window.location.href = '/the-records'
    } else {
      // Navigate to category-specific path
      const categoryPath = categoryToQuery[filter]
      if (categoryPath !== 'all') {
        window.location.href = `/the-records/${categoryPath}`
      }
    }
  }

  useEffect(() => {
    void refreshPosts()
  }, [searchParams])

  useEffect(() => {
    const onFocus = () => {
      void refreshPosts()
    }
    window.addEventListener('focus', onFocus)

    return () => window.removeEventListener('focus', onFocus)
  }, [])

  const filteredPosts = useMemo(() => {
    if (activeFilter === 'All Posts') {
      return allPosts
    }

    if (categoryFilters.includes(activeFilter as PostCategory)) {
      const normalizedFilter = normalizeCategory(activeFilter)
      return allPosts.filter((post) => normalizeCategory(post.category) === normalizedFilter)
    }

    return allPosts
  }, [activeFilter, allPosts])

  return (
    <div className={styles.pageWrap}>
      <SEO path="/the-records" />
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
                key={post.id}
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