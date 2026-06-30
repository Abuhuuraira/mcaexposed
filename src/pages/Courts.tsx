import { useEffect, type CSSProperties, type MouseEvent } from 'react'
import FooterSection from '../components/FooterSection'
import { SEO } from '../components/SEO'
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
      'https://storage.courtlistener.com/recap/gov.uscourts.flmd.447551/gov.uscourts.flmd.447551.1.0.pdf',
    complaintName: 'mt-products-v-ez-advance-complaint.pdf',
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
      'https://storage.courtlistener.com/recap/gov.uscourts.wiwd.55592/gov.uscourts.wiwd.55592.1.0_1.pdf',
    complaintName: 'bachhuber-v-ez-advance-class-action-complaint.pdf',
    files:
      'https://www.courtlistener.com/docket/71945376/bachhuber-kevin-v-ez-advance-llc/',
    imageAlt: 'Class action lawsuit visual',
  },
]

const triggerBrowserDownload = (blob: Blob, fileName: string) => {
  const objectUrl = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = objectUrl
  link.download = fileName
  link.rel = 'noreferrer'
  document.body.appendChild(link)
  link.click()
  link.remove()

  window.setTimeout(() => {
    URL.revokeObjectURL(objectUrl)
  }, 1000)
}

const downloadComplaint = async (sourceUrl: string, fileName: string) => {
  const candidateUrls = [
    `/api/download?url=${encodeURIComponent(sourceUrl)}&name=${encodeURIComponent(fileName)}`,
    sourceUrl,
  ]

  for (const candidateUrl of candidateUrls) {
    try {
      const response = await fetch(candidateUrl, { credentials: 'same-origin' })

      if (!response.ok) {
        continue
      }

      const contentType = response.headers.get('content-type') ?? ''
      if (contentType.includes('text/html')) {
        continue
      }

      const blob = await response.blob()
      triggerBrowserDownload(blob, fileName)
      return
    } catch {
      // Try the next source.
    }
  }

  window.open(sourceUrl, '_blank', 'noopener,noreferrer')
}

const handleComplaintDownload = (
  event: MouseEvent<HTMLAnchorElement>,
  sourceUrl: string,
  fileName: string,
) => {
  event.preventDefault()
  void downloadComplaint(sourceUrl, fileName)
}

function Courts() {
  useEffect(() => {
    document.title = 'The Courts | Mca Exposed'
  }, [])

  return (
    <div className={styles.pageWrap}>
      <SEO path="/the-courts" />
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
                  download={caseItem.complaintName}
                  onClick={(event) => handleComplaintDownload(event, caseItem.complaint, caseItem.complaintName)}
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