import styles from './ReportSection.module.css'
import { Link } from 'react-router-dom'

function ReportSection() {
  return (
    <section className={styles.reportSection}>
      <div className={styles.reportContainer}>
        <h1 className={styles.title}>Make a Report</h1>

        <h2 className={styles.subtitle}>
          Have you or someone you know been <br />
          a victim of MCA fraud?
        </h2>

        <p className={styles.description}>
          We are collecting stories from small business owners who were misled,
          pressured, or trapped by merchant cash advance companies. Your story
          matters whether it was fake promises, sky-high payments, unauthorized
          liens, or aggressive collections.
        </p>

        <Link to="/report-mca-fraud" className={styles.reportBtn}>
          Make a Report ›
        </Link>
      </div>
    </section>
  )
}

export default ReportSection
