import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styles from './RecordsSection.module.css'
import { getAllPosts, type Post } from '../data/posts'
import { getInitialPosts } from '../ssr/data'

const pickFraudPosts = (posts: Post[]) =>
  posts.filter((post) => post.category === 'The Fraud Files').slice(0, 3)

function RecordsSection() {
  const [fraudPosts, setFraudPosts] = useState<Post[]>(() => pickFraudPosts(getInitialPosts()))

  useEffect(() => {
    const fetchPosts = async () => {
      const posts = await getAllPosts(true) // only published
      setFraudPosts(pickFraudPosts(posts))
    }
    fetchPosts()
  }, [])

  return (
    <section className={styles.recordsSection}>
      <h2 className={styles.recordsTitle}>The Records</h2>

      <p className={styles.recordsSubtext}>
        These articles tell the story, from the start, of what MCA Exposed is doing.
      </p>

      <p className={styles.recordsSubtext}>
        They also are a resource to merchants, bringing awareness to the fraud, and
        encouraging them to come forward
      </p>

      <h2 className={styles.fraudTitle}>The Fraud Files</h2>

      <div className={styles.recordsGrid}>
        {fraudPosts.map((post) => (
          <Link to={`/post/${post.slug}`} key={post.id} className={styles.recordCard}>
            <img src={post.image} alt="record" />

            <div className={styles.cardContent}>
              <span className={styles.date}>{post.date}</span>
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default RecordsSection
