import styles from './MissionSection.module.css'

function MissionSection() {
  return (
    <section className={styles.missionSection}>
      <h2 className={styles.missionTitle}>Our Mission Matters</h2>

      <div className={styles.missionContainer}>
        <div className={styles.missionLeft}>
          <h2 className={styles.missionSubtitle}>Why We Exist</h2>

          <p>
            MCA Exposed serves as a dedicated public-awareness platform,
            shedding light on fraudulent activities within the merchant cash
            advance scams (MCA Scam) industry. Our commitment includes
            highlighting critical legal actions, such as federal RICO lawsuits,
            the ongoing Supervest lawsuit, and exposing cases like SuperFast
            Capital fraud, along with merchant cash advance lawsuit proceedings
            aimed at holding wrongdoers accountable and supporting small
            businesses that may have fallen prey to these schemes. By exposing
            every MCA scam, we aim to increase transparency and public
            awareness.
          </p>

          <p>
            MCA companies have made millions at the expense of hard-working
            small business who, as a result of the predatory and illicit acts of
            MCA companies, have gone out of business - affecting real people&apos;s
            lives, families, and wellbeing. Merchant cash advance scam have
            devastated countless businesses, with each MCA scam leaving a
            lasting financial impact on owners and their families. In many
            cases, victims describe the industry as an MCA pyramid scheme
            designed to benefit funders at the expense of small business owners.
          </p>

          <p>
            It&apos;s time to fight back, to defend those who have been defrauded,
            and to bring justice to the individuals running these schemes. Our
            mission is to expose every MCA scam, support victims, and help bring
            accountability to those responsible.
          </p>
        </div>

        <div className={styles.missionLine}></div>

        <div className={styles.missionRight}>
          <div className={styles.imageWrapper}>
            <img src="/images/FIST%20COVER.avif" alt="fist" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default MissionSection
