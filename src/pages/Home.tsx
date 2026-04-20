import { useEffect, useState } from 'react'
import styles from './Home.module.css'
import MissionSection from '../components/MissionSection'
import RecordsSection from '../components/RecordsSection'
import AwarenessSection from '../components/AwarenessSection'
import ReportSection from '../components/ReportSection'
import FooterSection from '../components/FooterSection'
import { SEO } from '../components/SEO'

function Home() {
  const subtitleText =
    'At MCA Exposed, we aim to inform and empower small businesses against fraud in the merchant cash advance industry.'
  const [typedText, setTypedText] = useState('')
  const isComplete = typedText.length === subtitleText.length

  useEffect(() => {
    if (isComplete) return

    const timer = window.setTimeout(() => {
      setTypedText(subtitleText.slice(0, typedText.length + 1))
    }, 55)

    return () => window.clearTimeout(timer)
  }, [typedText, subtitleText, isComplete])

  return (
    <>
      <SEO path="/" />
      <section className={styles.hero}>
        <div className={styles.overlay}></div>

        <div className={styles.heroBox}>
          <h1 className={styles.heroTitle}>
            Exposing <br />
            Merchant Cash Advance <br />
            Scams
          </h1>

          <p className={styles.heroSubtitle} aria-label={subtitleText}>
            <span>{typedText}</span>
            {!isComplete && <span className={styles.cursor}>|</span>}
          </p>
        </div>
      </section>

      <div className={`${styles.revealSection} ${styles.delay1}`}>
        <MissionSection />
      </div>
      <div className={`${styles.revealSection} ${styles.delay2}`}>
        <RecordsSection />
      </div>
      <div className={`${styles.revealSection} ${styles.delay3}`}>
        <AwarenessSection />
      </div>
      <div className={`${styles.revealSection} ${styles.delay4}`}>
        <ReportSection />
      </div>
      <div className={`${styles.revealSection} ${styles.delay5}`}>
        <FooterSection />
      </div>
    </>
  )
}

export default Home
