import { useEffect, type CSSProperties } from 'react'
import FooterSection from '../components/FooterSection'
import styles from './Courts.module.css'

const cases = [
  {
    title: 'Our Opening Move',
    date: 'September, 2025',
    description:
      'Our first federal RICO lawsuit against a coordinated MCA network — exposing fake identities, forged contracts, and unauthorized liens that targeted our business.',
    image:
      'https://static.wixstatic.com/media/6b4687_91347cda855f40e390a3b921578ded33~mv2.jpg/v1/fill/w_378,h_283,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/01-image1-2%20(1).jpg',
    complaint:
      'https://www.mcaexposed.com/_files/ugd/6b4687_7843c088f38d4aee9722a3144edcf306.pdf',
    files:
      'https://www.courtlistener.com/docket/71373637/mt-products-llc-v-ez-advance-llc/',
    imageAlt: 'RICO case visual',
  },
  {
    title: 'A Class Action Filed Against EZ Advance',
    date: 'November, 2025',
    description:
      'Kevin Bachhuber files a class action lawsuit against EZ Advance LLC for violations of the Telephone Consumer Protection Act.',
    image:
      'https://static.wixstatic.com/media/6b4687_b2c1c800d907423da0f1d6bf18d7f479~mv2.png/v1/fill/w_378,h_283,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/blog_hero_TCPA_547852024_7.21.22_1500x1000.png',
    complaint:
      'https://www.mcaexposed.com/_files/ugd/6b4687_47c51f48ca3744abb28c979cf41f35d5.pdf?index=true',
    files:
      'https://www.courtlistener.com/docket/71945376/bachhuber-kevin-v-ez-advance-llc/',
    imageAlt: 'Class action lawsuit visual',
  },
]

function Courts() {
  useEffect(() => {
    document.title = 'The Courts | Mca Exposed'
  }, [])

  return (
    <div className={styles.pageWrap}>
      <section className={styles.hero}>
        <img
          className={styles.heroImage}
          src="https://static.wixstatic.com/media/11062b_cb534c4d62184ec3a89e16217fe8b190~mv2.jpg/v1/fill/w_980,h_446,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/11062b_cb534c4d62184ec3a89e16217fe8b190~mv2.jpg"
          alt="Unbalanced scales of justice"
        />
        <div className={styles.heroContent}>
          <h1>Progressive Litigation</h1>
          <h2>
            Tracking the lawsuits reshaping the merchant cash advance industry
            from federal RICO claims to deceptive trade practice actions.
          </h2>
          <p>
            The MCA industry has long operated in the shadows, using complex
            corporate structures and predatory practices to trap small
            businesses. Now, lawsuits across the country are beginning to expose
            those schemes in court.
          </p>
        </div>
      </section>

      <section className={styles.timelineSection}>
        {cases.map((caseItem, index) => (
          <article
            key={caseItem.title}
            className={styles.caseCard}
            style={{ '--card-index': index } as CSSProperties}
          >
            <img
              className={styles.caseImage}
              src={caseItem.image}
              alt={caseItem.imageAlt}
            />
            <div className={styles.caseContent}>
              <h3>{caseItem.title}</h3>
              <p className={styles.caseDate}>{caseItem.date}</p>
              <p className={styles.caseDescription}>{caseItem.description}</p>
              <div className={styles.actions}>
                <a
                  href={caseItem.complaint}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.outlineBtn}
                >
                  Download Complaint
                </a>
                <a
                  href={caseItem.files}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.primaryBtn}
                >
                  View Case Files Online
                </a>
              </div>
            </div>
          </article>
        ))}
      </section>

      <FooterSection />
    </div>
  )
}

export default Courts