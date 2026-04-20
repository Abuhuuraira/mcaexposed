import { useEffect } from 'react'
import FooterSection from '../components/FooterSection'
import { SEO } from '../components/SEO'
import styles from './Story.module.css'

function Story() {
  useEffect(() => {
    document.title = 'The Story | MCA Exposed'
  }, [])

  return (
    <div className={styles.pageWrap}>
      <SEO path="/story" />
      <section className={styles.heroSection}>
        <div className={styles.contentContainer}>
          <h1>The Story Behind MCA Exposed</h1>
          <p className={styles.heroLead}>
            I&apos;m a small business owner who uncovered a web of MCA fraud built
            on fake names, forged contracts, and unauthorized liens. I created
            MCA Exposed to fight back and to make sure no entrepreneur has to
            face this system alone.
          </p>

          <div className={styles.storyBody}>
            <h2 className={styles.storyHeading}>My Story</h2>
            <p>
              Like many small business owners, I was focused on growing my
              company, creating jobs, and serving our customers.
            </p>

            <p>
              In early 2025, I was targeted by a group of merchant cash advance
              (MCA) companies operating under a web of fake identities, forged
              contracts, and unauthorized liens. What I thought was a lifeline
              for expansion turned out to be a sophisticated scheme designed to
              bleed my business.
            </p>

            <p>
              When I uncovered the fraud, I was shocked by how many entities
              were involved brokers, funders, processors, collectors, and even
              an SEC-registered capital platform. Each played a role in keeping
              the deception alive. It became clear this wasn&apos;t just one bad
              actor, but an entire system built to prey on small businesses.
            </p>

            <p>
              That&apos;s why I decided to fight back. In August 2025, I filed a
              federal RICO lawsuit against the companies and individuals
              involved. But this fight isn&apos;t only about my company. It&apos;s about
              every small business owner who has been trapped in the same cycle
              of lies, threats, and impossible repayment terms.
            </p>

            <p>
              MCA Exposed exists to shine a light on the truth. To document how
              these schemes work. To share our case and others like it. And to
              make sure entrepreneurs know they&apos;re not alone and that these
              companies can be held accountable.
            </p>

            <p className={styles.closingLine}>This is my opening move.</p>
            <p className={styles.closingLine}>
              And I won&apos;t stop until the{' '}
              <span className={styles.fraudHighlight}>fraud</span> in the MCA
              industry is forced into the sunlight.
            </p>
          </div>

          <div className={styles.storyDivider}></div>
        </div>
      </section>

      

      <FooterSection />
    </div>
  )
}

export default Story