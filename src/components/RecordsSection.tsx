import styles from './RecordsSection.module.css'

const records = [
  {
    img: '/images/record1.png',
    date: 'Jun 1, 2025',
    title: 'A Fraudulent Brokerage: EZ Advance LLC, Benjamin Kandhorov,...',
    desc: 'The following summarizes allegations contained in a federal lawsuit. The defendants dispute...',
  },
  {
    img: '/images/record2.png',
    date: 'Jun 1, 2025',
    title: 'SuperFast Capital Inc. & Alternative Capital Group: The Customer...',
    desc: 'The following summarizes allegations contained in a federal lawsuit. The defendants dispute...',
  },
  {
    img: '/images/record3.png',
    date: 'May 31, 2025',
    title: 'Top Choice Financial: The Servicer in the Pipeline',
    desc: 'The following summarizes allegations contained in a federal lawsuit. The defendants dispute...',
  },
]

function RecordsSection() {
  return (
    <section className={styles.recordsSection}>
      <h1 className={styles.recordsTitle}>The Records</h1>

      <p className={styles.recordsSubtext}>
        These articles tell the story, from the start, of what MCA Exposed is doing.
      </p>

      <p className={styles.recordsSubtext}>
        They also are a resource to merchants, bringing awareness to the fraud, and
        encouraging them to come forward
      </p>

      <h2 className={styles.fraudTitle}>The Fraud Files</h2>

      <div className={styles.recordsGrid}>
        {records.map((item, index) => (
          <div className={styles.recordCard} key={index}>
            <img src={item.img} alt="record" />

            <div className={styles.cardContent}>
              <span className={styles.date}>{item.date}</span>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default RecordsSection
