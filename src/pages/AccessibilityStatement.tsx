import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import styles from './AccessibilityStatement.module.css'
import FooterSection from '../components/FooterSection'

const AccessibilityStatement = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <Helmet>
        <title>Accessibility Statement - MCA Exposed</title>
        <meta name="description" content="Accessibility Statement for MCA Exposed. We are committed to making our website accessible to everyone." />
      </Helmet>

      <div className={styles.pageWrap}>
        <section className={styles.heroSection}>
          <div className={styles.contentContainer}>
            <h1>Accessibility Statement</h1>
            <p className={styles.effectiveDate}>Effective Date: August 2025</p>
          </div>
        </section>

        <section className={styles.mainContent}>
          <div className={styles.contentContainer}>
            <article className={styles.statementContent}>
              <div className={styles.introduction}>
                <p>
                  MCA Exposed is committed to making our website accessible and usable by everyone, including people with
                  disabilities. We believe that all visitors should be able to access information about MCA fraud, read our
                  updates, and share their stories without barriers.
                </p>
              </div>

              <section className={styles.statementSection}>
                <h2>Our Commitment</h2>
                <p>
                  We aim to follow recognized accessibility standards, including the Web Content Accessibility Guidelines
                  (WCAG) 2.1 Level AA.
                </p>
                <ul>
                  <li>
                    We design our site with accessibility in mind, using clear headings, alt text for images,
                    high-contrast colors, and simple navigation.
                  </li>
                  <li>We continue to review and improve the site to meet evolving accessibility needs.</li>
                </ul>
              </section>

              <section className={styles.statementSection}>
                <h2>Features We Use</h2>
                <ul>
                  <li>Alternative text on images so screen readers can describe them.</li>
                  <li>Proper heading structure for easier navigation.</li>
                  <li>Keyboard-friendly menus and forms.</li>
                  <li>Simple, plain-language writing wherever possible.</li>
                </ul>
              </section>

              <section className={styles.statementSection}>
                <h2>Ongoing Efforts</h2>
                <p>
                  Accessibility is an ongoing effort. We regularly test our site and welcome feedback from users to help us
                  identify and fix issues quickly.
                </p>
              </section>

              <section className={styles.contactSection}>
                <h2>Contact Us</h2>
                <p>
                  If you experience difficulty using MCA.Exposed or have suggestions for improvement, please contact us at
                  info@mcaexposed.com.
                </p>
                <p>We will do our best to respond promptly and provide the information you need in an accessible format.</p>
              </section>
            </article>
          </div>
        </section>

        <div className={styles.divider}></div>
        <FooterSection />
      </div>
    </>
  )
}

export default AccessibilityStatement
