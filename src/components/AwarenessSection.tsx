import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styles from './AwarenessSection.module.css'
import { getAllPosts, type Post } from '../data/posts'

function AwarenessSection() {
  const [awarenessPosts, setAwarenessPosts] = useState<Post[]>([])

  useEffect(() => {
    const fetchPosts = async () => {
      const posts = await getAllPosts(true) // only published
      const filtered = posts.filter(post => post.category === 'MCA Awareness').slice(0, 3)
      setAwarenessPosts(filtered)
    }
    fetchPosts()
  }, [])

  return (
    <section className={styles.awarenessSection}>
      <h2 className={styles.awarenessTitle}>MCA Awareness</h2>

      <div className={styles.awarenessGrid}>
        {awarenessPosts.map((post) => (
          <Link to={`/post/${post.slug}`} key={post.id} className={styles.awarenessCard}>
            <div className={styles.topRed}>
              MCA <br /> AWARENESS
            </div>

            <div className={styles.greenLine}></div>

            <div className={styles.bigText}>MCA AWARENESS</div>

            <div className={styles.cardBottom}>
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

export default AwarenessSection
