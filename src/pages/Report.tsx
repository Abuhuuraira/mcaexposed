import FooterSection from '../components/FooterSection'
import styles from './Report.module.css'

function Report() {
  return (
    <div className={styles.pageWrap}>
      <section className={styles.heroSection}>
        <div className={styles.contentContainer}>
          <h1>Make a Report</h1>
          <h2>Have you or someone you know been a victim of MCA fraud?</h2>

          <p>
            We are collecting stories from small business owners who were
            misled, pressured, or trapped by merchant cash advance companies.
            Your story matters whether it was fake promises, sky-high payments,
            unauthorized liens, or aggressive collections.
          </p>

          <p>
            By contacting us, you&apos;re helping shine a light on how these
            schemes work. All reports are kept confidential unless you give us
            permission to share.
          </p>

          <p className={styles.emailLine}>
            Email us at:{' '}
            <a href="mailto:Contact@MCAExposed.com?subject=Make%20an%20MCA%20fraud%20Report">
              Contact@MCAExposed.com
            </a>
          </p>

          <a
            href="mailto:contact@mcaexposed.com?subject=Make%20an%20MCA%20Fraud%20Report"
            className={styles.emailButton}
          >
            Email Us
          </a>
        </div>
      </section>

      <div className={styles.reportDivider}></div>

      <FooterSection />
    </div>
  )
}

export default Report