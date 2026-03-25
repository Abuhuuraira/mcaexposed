import { useState, type CSSProperties } from 'react'
import FooterSection from '../components/FooterSection'
import styles from './Faq.module.css'

const faqData = [
  {
    question:
      'Who usually provides Merchant Cash Advances — banks or private lenders?',
    answer:
      'MCAs are typically offered by private funders or specialized financing companies, not banks. These providers evaluate a business’s card or sales revenue to determine eligibility.',
  },
  {
    question:
      'How does a Merchant Cash Advance help small businesses access quick funding?',
    answer:
      'A Merchant Cash Advance provides fast access to capital by advancing funds based on future sales. Repayment is often collected as a percentage of daily or weekly revenue.',
  },
  {
    question:
      'What makes a Merchant Cash Advance different from a traditional business loan?',
    answer:
      'Traditional loans usually have fixed installments and interest rates, while MCA agreements are structured as a purchase of future receivables with variable payment flow tied to sales.',
  },
  {
    question: 'Are Merchant Cash Advances legal in the United States?',
    answer:
      'MCAs may be legal when properly documented, but legality often depends on contract terms and business practices. If you suspect abuse, review the agreement with qualified legal counsel.',
  },
  {
    question:
      'What are some of the most common legal issues surrounding Merchant Cash Advances?',
    answer:
      'Common disputes involve misleading terms, aggressive collections, unauthorized debits, confession of judgment clauses, and disagreements about reconciliation rights.',
  },
  {
    question:
      'How can you report a Merchant Cash Advance scam or fraudulent company?',
    answer:
      'Document all contracts, payment records, and communications, then submit a report to trusted legal resources and consumer protection authorities. You can also report it through MCA Exposed.',
  },
]

function Faq() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0)

  const toggleFAQ = (index: number) => {
    setActiveIndex(index === activeIndex ? null : index)
  }

  return (
    <div className={styles.pageWrap}>
      <section className={styles.heroSection}>
        <div className={styles.contentContainer}>
          <h1>MCA Frequently Asked Questions - Legal Guide</h1>

          <div className={styles.faqContainer}>
            {faqData.map((item, index) => (
              <div
                key={item.question}
                className={`${styles.faqItem} ${
                  activeIndex === index ? styles.activeItem : ''
                }`}
                style={{ '--item-index': index } as CSSProperties}
              >
                <div
                  className={styles.faqQuestion}
                  onClick={() => toggleFAQ(index)}
                >
                  <h3>{item.question}</h3>
                  <span
                    className={`${styles.icon} ${
                      activeIndex === index ? styles.open : ''
                    }`}
                  >
                    ▾
                  </span>
                </div>

                {activeIndex === index && (
                  <div className={styles.faqAnswer}>
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className={styles.faqDivider}></div>

      <FooterSection />
    </div>
  )
}

export default Faq