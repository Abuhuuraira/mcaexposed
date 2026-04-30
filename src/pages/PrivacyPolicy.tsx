import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import styles from './PrivacyPolicy.module.css'
import FooterSection from '../components/FooterSection'

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <Helmet>
        <title>Privacy Policy - MCA Exposed</title>
        <meta name="description" content="Privacy Policy for MCA Exposed. Learn how we collect, use, and protect your information." />
      </Helmet>

      <div className={styles.pageWrap}>
        <section className={styles.heroSection}>
          <div className={styles.contentContainer}>
            <h1>Privacy Policy</h1>
            <p className={styles.effectiveDate}>Effective Date: August 2025</p>
          </div>
        </section>

        <section className={styles.mainContent}>
          <div className={styles.contentContainer}>
            <article className={styles.policyContent}>
              <div className={styles.introduction}>
                <p>
                  MCA Exposed ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains
                  how we collect, use, and safeguard information when you visit our website or submit a report about MCA
                  fraud.
                </p>
              </div>

              <section className={styles.policySection}>
                <h2>1. Information We Collect</h2>
                <p>When you visit our site or submit a form, we may collect:</p>
                <ul>
                  <li>
                    <strong>Personal Information:</strong> Name, email, phone number, business name (if provided).
                  </li>
                  <li>
                    <strong>Report Details:</strong> Information you choose to share about your experience with merchant
                    cash advance (MCA) companies.
                  </li>
                  <li>
                    <strong>Technical Information:</strong> IP address, browser type, and basic analytics (through
                    standard tools like Google Analytics).
                  </li>
                </ul>
              </section>

              <section className={styles.policySection}>
                <h2>2. How We Use Information</h2>
                <p>We use the information collected to:</p>
                <ul>
                  <li>Review and organize reports of MCA fraud.</li>
                  <li>Communicate with you about your submission, if you request or allow it.</li>
                  <li>Provide anonymized statistics and patterns to raise awareness and support advocacy.</li>
                  <li>Improve our website and user experience.</li>
                </ul>
              </section>

              <section className={styles.policySection}>
                <h2>3. Sharing of Information</h2>
                <p>We will never sell or rent your personal information. We may share information only in these limited circumstances:</p>
                <ul>
                  <li>With your consent (e.g., if you agree to speak with a journalist or lawyer).</li>
                  <li>In anonymized form (e.g., publishing trends without names).</li>
                  <li>If required by law, court order, or to protect our legal rights.</li>
                </ul>
              </section>

              <section className={styles.policySection}>
                <h2>4. Cookies and Analytics</h2>
                <p>
                  Like most websites, we use cookies and analytics tools to understand how visitors use our site. This helps
                  us improve the site and make it more useful. You can disable cookies in your browser at any time.
                </p>
              </section>

              <section className={styles.policySection}>
                <h2>5. Data Security</h2>
                <p>
                  We take reasonable steps to protect your information from unauthorized access, loss, or misuse. However,
                  no method of transmission or storage is 100% secure, and we cannot guarantee absolute security.
                </p>
              </section>

              <section className={styles.policySection}>
                <h2>6. Your Choices</h2>
                <p>
                  You may request that we delete your report or personal information at any time by contacting us at
                  info@mcaexposed.com.
                </p>
                <p>You may also request a copy of the information we hold about you.</p>
              </section>

              <section className={styles.policySection}>
                <h2>7. Children's Privacy</h2>
                <p>Our site is not directed to children under 13, and we do not knowingly collect information from children.</p>
              </section>

              <section className={styles.policySection}>
                <h2>8. Changes to This Policy</h2>
                <p>
                  We may update this Privacy Policy from time to time. Updates will be posted on this page with a new
                  "Effective Date."
                </p>
              </section>

              <section className={styles.policySection}>
                <h2>9. Contact Us</h2>
                <p>If you have any questions about this Privacy Policy, please contact us at:</p>
                <p className={styles.contactInfo}>
                  <strong>Website:</strong> MCA.Exposed
                </p>
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

export default PrivacyPolicy
