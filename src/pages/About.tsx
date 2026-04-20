import styles from './About.module.css'
import { SEO } from '../components/SEO'

function About() {
  return (
    <div className={styles.container}>
      <SEO path="/about" />
      <h1 className={styles.title}>About MCA Expose</h1>
      <p className={styles.description}>
        MCA Expose is a dedicated platform built for Master of Computer Applications
        students. Our goal is to provide a centralized hub for resources, community
        interactions, and academic support.
      </p>

      <section className={styles.section}>
        <h2>Our Mission</h2>
        <p>
          To empower MCA students with the tools, knowledge, and community they
          need to excel in their academic and professional journey.
        </p>
      </section>

      <section className={styles.section}>
        <h2>What We Offer</h2>
        <ul className={styles.list}>
          <li>Curated study materials and notes</li>
          <li>Previous year question papers</li>
          <li>Project ideas and guidance</li>
          <li>Career resources and placement tips</li>
          <li>Active student community</li>
        </ul>
      </section>
    </div>
  )
}

export default About
