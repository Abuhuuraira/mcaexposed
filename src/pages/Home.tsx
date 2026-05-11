import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
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

          {/* Internal Navigation Links for SEO */}
          <div style={{ 
            marginTop: '30px', 
            display: 'flex', 
            gap: '20px', 
            justifyContent: 'center', 
            flexWrap: 'wrap',
            fontSize: '14px'
          }}>
            <Link to="/the-records" style={{ color: '#fff', textDecoration: 'underline' }}>View Records</Link>
            <Link to="/the-courts" style={{ color: '#fff', textDecoration: 'underline' }}>The Courts</Link>
            <Link to="/the-story" style={{ color: '#fff', textDecoration: 'underline' }}>Our Story</Link>
            <Link to="/report-mca-fraud" style={{ color: '#fff', textDecoration: 'underline' }}>Make a Report</Link>
            <Link to="/mca-frequently-asked-questions-legal-guide" style={{ color: '#fff', textDecoration: 'underline' }}>FAQ</Link>
            <Link to="/about" style={{ color: '#fff', textDecoration: 'underline' }}>About</Link>
          </div>
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
