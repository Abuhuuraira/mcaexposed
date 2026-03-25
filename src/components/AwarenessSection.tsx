import styles from './AwarenessSection.module.css'

const awarenessData = [
  {
    title: 'WHAT TO DO AS A VICTIM',
    date: 'Aug 8, 2025',
    heading: 'What To Do if I am a Victim of Merchant Cash Advance (MCA) loan...',
    desc: 'If you just found out you were scammed by a merchant cash advance (MCA) loan company,...',
  },
  {
    title: 'PROTECT YOUR BUSINESS',
    date: 'Aug 1, 2025',
    heading: 'Protecting Your Business from Merchant Cash Advance Scams',
    desc: 'Understanding Merchant Cash Advances Before diving into scams, it is essential to...',
  },
  {
    title: 'FILE A REPORT',
    date: 'Aug 1, 2025',
    heading: 'Report MCA Fraud',
    desc: 'Most small business owners who get trapped in a merchant cash advance scam don’t know wher...',
  },
]

function AwarenessSection() {
  return (
    <section className={styles.awarenessSection}>
      <h1 className={styles.awarenessTitle}>MCA Awareness</h1>

      <div className={styles.awarenessGrid}>
        {awarenessData.map((item, index) => (
          <div className={styles.awarenessCard} key={index}>
            <div className={styles.topRed}>
              MCA <br /> AWARENESS
            </div>

            <div className={styles.greenLine}></div>

            <div className={styles.bigText}>{item.title}</div>

            <div className={styles.cardBottom}>
              <span className={styles.date}>{item.date}</span>
              <h3>{item.heading}</h3>
              <p>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default AwarenessSection
