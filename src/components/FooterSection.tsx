import styles from './FooterSection.module.css'

function FooterSection() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerLeft}>
          <p className={styles.kicker}>MCA Exposed</p>
          <h3>Stay Connected</h3>
          <p className={styles.leftText}>
            We share updates on active litigation, legal developments, and
            small-business protection resources.
          </p>

          <a href="mailto:Contact@MCAExposed.com">
            Email Us: Contact@MCAExposed.com
          </a>
          <a href="#">Accessibility Statement</a>
          <a href="#">Privacy Policy</a>
          <a
            href="https://www.linkedin.com/company/mca-exposed"
            target="_blank"
            rel="noreferrer"
            className={styles.social}
          >
            Social Share <span>in</span>
          </a>
        </div>

        <div className={styles.footerRight}>
          <p className={styles.subscribeKicker}>Newsletter</p>
          <h3>Subscribe to receive the occasional update</h3>
          <p>
            You&apos;ll get updates for events such as new litigation, existing
            litigation update, new legislation, etc.
          </p>

          <label htmlFor="subscriber-email">Email *</label>
          <div className={styles.inputGroup}>
            <input
              id="subscriber-email"
              type="email"
              placeholder="e.g., email@example.com"
            />
            <button type="button">Join</button>
          </div>

          <div className={styles.checkbox}>
            <input type="checkbox" id="subscribe" />
            <label htmlFor="subscribe">
              I want to subscribe to your mailing list.
            </label>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default FooterSection
