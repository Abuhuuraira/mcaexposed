import { Link, useParams } from 'react-router-dom'
import FooterSection from '../components/FooterSection'
import { findPostBySlug } from '../data/posts'
import styles from './PostDetail.module.css'

function PostDetail() {
  const { slug } = useParams()
  const post = slug ? findPostBySlug(slug) : undefined

  return (
    <div className={styles.pageWrap}>
      <section className={styles.heroSection}>
        <div className={styles.contentContainer}>
          {!post ? (
            <>
              <h1>Post not found</h1>
              <p>The post you requested does not exist.</p>
              <Link to="/records" className={styles.backLink}>
                Back to Records
              </Link>
            </>
          ) : (
            <>
              <p className={styles.metaTop}>{post.category}</p>
              <h1>{post.title}</h1>
              <p className={styles.metaLine}>
                <span>{post.date}</span>
                <span>{post.readTime}</span>
              </p>
              <img src={post.image} alt={post.title} className={styles.coverImage} />

              <p className={styles.excerpt}>{post.excerpt}</p>
              <article className={styles.content}>{post.content}</article>

              <Link to="/records" className={styles.backLink}>
                Back to Records
              </Link>
            </>
          )}
        </div>
      </section>

      <div className={styles.divider}></div>
      <FooterSection />
    </div>
  )
}

export default PostDetail
