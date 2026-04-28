import { useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import FooterSection from '../components/FooterSection'
import { SEO } from '../components/SEO'
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
      'What does “Confession of Judgment” mean in Merchant Cash Advance agreements?',
    answer:
      'A Confession of Judgment (COJ) clause enables a lender to get a court judgement —without a trial — if a borrower defaults. Though some MCA contracts include this clause, it has been restricted in many states. Given this, businesses should thoroughly review contracts and obtain legal counsel prior to signing.',
  },

  {
    question:
      'What is an “Agreed Judgment,” and how is it used in business financing?',
    answer:
      'Your pre-approved Agreed Judgments mean a settlement has been reached and accepted by both parties. they are included in MCA agreements to expedite the legal process in the event of a default. However, it may hold back the ability of a business to defend itself later on, so a professional review is required.',
  },




  {
    question:
      'What happens if a business can’t repay a Merchant Cash Advance?',
    answer:
      'When a business struggles to meet payment obligations, the funder might consider daily withdrawals or default legal options to collect payments. Since payments are based on real sales, some contracts offer the option to reconcile payment due. Close, frequent contact with the funder helps stop things from escalating.',
  },

  {
    question:
      'What are the consequences of defaulting on a Merchant Cash Advance?',
    answer:
      'Neglecting to pay debts can result in accounts being frozen, legal action, and reputational damage to your business credit. In addition, some funders under personal guarantees will try to seize business assets. Getting legal counsel right away can help negotiate or resolve the debt before it escalates and causes further complications.',
  },





   {
    question:
      'What rights and protections do businesses have under Merchant Cash Advance contracts?',
    answer:
      'Under commercial law, businesses are entitled to disclosure of terms, options for reconciliation, and fair treatment. Some states have regulations requiring MCA funders to disclose and explain all costs and equivalent APRs. Reconciling all terms before finalizing a deal is a best practice from a company’s legal and financial perspective.',
  },

  {
    question:
      'What does the “daily percentage” mean in a Merchant Cash Advance agreement?',
    answer:
      'The daily percentage indicates how much of each days sales are automatically sent to the funder for repayment. Since this varies with the business revenue, it tends to be higher on busier days and lower on slower days. This feature of the system makes repayment flexible and aligned with the business s cash flow.',
  },



   {
    question:
      'What is a reconciliation clause, and why does it matter in an MCA deal?',
    answer:
      'If actual sales fall below projected sales, a business can request an adjustment rec as a result of a reconciliation clause. This reduces the probability of over-collection. It also allows the repayment to be proportionate and equitable. In the absence of this clause, funders can demand high payments even when actual revenue is significantly decreased.',
  },

  {
    question:
      'What does “stacking” mean, and why can it be risky for businesses?',
    answer:
      'When a business takes out several MCAs simultaneously to pay off past debts, it is termed as “stacking.” Although it might give a business some short-term relief, it can result in very high daily payments, which can then lead to severe cash flow issues for the business. Stacking also increases the risk of business failure. In extreme cases, it might result in legal action. Therefore, it should be avoided.',
  },


   {
    question:
      'Is getting a Merchant Cash Advance really worth it for small business owners?',
    answer:
      'For some businesses, MCAs offer a convenient option when they need quick access to capital without the hoops of a traditional bank loan. Still, the high cost of capital and the impact of repayments on a business cash flow should not be underestimated. MCAs are best suited for short rather than long-term financing. ',
  },

  {
    question:
      'Is a Merchant Cash Advance a scam or a real form of financing?',
    answer:
      'Although Merchant Cash Advances are useful financial tools, some unethical funders use dishonest practices. The main thing is to pick licensed, transparent providers who are up front with all fees. Always check about the company before signing.',
  },



    {
    question:
      'Why do some people believe Merchant Cash Advances are scams?',
    answer:
      'Due to excessive fees, ruthless collections, and deceitful selling practices, many consider MCAs to be scams. The product itself, however, is legal. The conduct of a few funders creates this perception. The majority of issues is avoided when reputable firms are employed',
  },

  {
    question:
      'How can you spot a Merchant Cash Advance scam?',
    answer:
      'Beware of funders who say they have “guaranteed approval”; those who hide fees; or those who rush you into signing. Scam companies often have no or unverifiable business or contact information. Always check credentials and contracts carefully. ',
  },

  {
    question:
      'What red flags should business owners look for before signing an MCA agreement?',
    answer:
      'Issues such as unclear repayment agreements, absence of reconciliation clauses, and pledges of funding that do not line up with realities are unsatisfactory. It is preferable to decline if a company does not give you any documentation or is overly pushy. Legal analysis can identify concealed traps.',
  },

  {
    question:
      'How can you report a Merchant Cash Advance scam or fraudulent company?',
    answer:
      'Scams involving MCAs can be reported to the state attorney general, the Federal Trade Commission, or the Consumer Financial Protection Bureau. Including copies of any documents or communication related to the scam will help the authorities conduct their investigations. Reporting these will also help safeguard other small business owners. ',
  },


   {
    question:
      'What is MCA Exposed, and how does it help business owners?',
    answer:
      'As an online resource center, MCA Exposed teaches business owners about scams regarding Merchant Cash Advances. It provides materials, tools, and guides that help businesses recognize predatory funders and defend themselves against financial exploitation.',
  },

  {
    question:
      'Can I report a Merchant Cash Advance scam on MCA Exposed?',
    answer:
      'Yes. MCA Exposed permits small business owners to tell their story and report fraudulent or deceptive MCA businesses. These accounts allow for the notification of others and form part of the growing database concerning scam activity in the MCA industry.',
  },

    {
    question:
      'Why should I publicly report a Merchant Cash Advance scam?',
    answer:
      'When you report a scam, you help other small business owners avoid the same pitfalls. It also helps scam authorities and legal advocates track down repeat offenders and hold predatory scammers accountable.',
  },

  {
    question:
      'What happens after I submit a Merchant Cash Advance complaint on MCA Exposed?',
    answer:
      'Following the submission of a complaint, the system evaluates the report and incorporates it into their awareness database. This public record has the potential to increase visibility, bringing it to the attention of MCA defense attorneys or regulators who help victims.',
  },












  {
    question:
      'How can you report a Merchant Cash Advance scam or fraudulent company?',
    answer:
      'Document all contracts, payment records, and communications, then submit a report to trusted legal resources and consumer protection authorities. You can also report it through MCA Exposed.',
  },

   {
    question:
      'How can MCA Exposed help if I’ve already been scammed by a Merchant Cash Advance company?',
    answer:
      'If you have fallen victim to a scam, MCA Exposed will connect you with attorneys and settlement professionals specializing in MCA defense. These professionals assess your situation, walk you through your entitlements, and advise you on potential remedies, whether through the court or a settlement.',
  },
  
]

function Faq() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0)

  const toggleFAQ = (index: number) => {
    setActiveIndex(index === activeIndex ? null : index)
  }

  return (
    <div className={styles.pageWrap}>
      <SEO path="/mca-frequently-asked-questions-legal-guide" />
      <section className={styles.heroSection}>
        <div className={styles.contentContainer}>
          <h1>MCA Frequently Asked Questions - Legal Guide</h1>

          <p>
            Merchant Cash Advances (MCAs) can be complex, especially when it comes to legal terms and repayment structures. <Link to="/">MCA.Exposed</Link> helps break down common questions and highlights key legal insights so you can better understand risks and make informed decisions.
          </p>

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