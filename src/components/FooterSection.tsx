import { useState } from 'react'
import styles from './FooterSection.module.css'

function FooterSection() {
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !consent) {
      setMessage('Please provide your email and agree to subscribe.')
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setMessage('Please enter a valid email address.')
      return
    }

    setIsLoading(true)
    setMessage('')

    try {
      const response = await fetch('http://localhost:3001/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, consent }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('Thank you for subscribing! You\'ll receive updates soon.')
        setEmail('')
        setConsent(false)
      } else {
        setMessage(data.error || 'Something went wrong. Please try again.')
      }
    } catch (error) {
      setMessage('Network error. Please check your connection and try again.')
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerLeft}>
          <p className={styles.kicker}>MCA Exposed</p>
          <h3>Stay Connected</h3>
          <p className={styles.leftText}>
            We share updates on active litigation, legal developments, and
            small-business protection resources.
          </p>

          <a href="https://mail.google.com/mail/?view=cm&fs=1&to=Contact@MCAExposed.com" target="_blank" rel="noopener noreferrer">
            Email Us: Contact@MCAExposed.com
          </a>
          <a href="#">Accessibility Statement</a>
          <a href="#">Privacy Policy</a>
          <a
            href="https://www.linkedin.com/company/mca-exposed"
            target="_blank"
            rel="noreferrer"
            className={styles.social}
          >
            Social Share <span>in</span>
          </a>
        </div>

        <div className={styles.footerRight}>
          <p className={styles.subscribeKicker}>Newsletter</p>
          <h3>Subscribe to receive the occasional update</h3>
          <p>
            You&apos;ll get updates for events such as new litigation, existing
            litigation update, new legislation, etc.
          </p>

          <label htmlFor="subscriber-email">Email *</label>
          <form onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <input
                id="subscriber-email"
                type="email"
                placeholder="e.g., email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" disabled={isLoading}>
                {isLoading ? 'Joining...' : 'Join'}
              </button>
            </div>
          </form>

          <div className={styles.checkbox}>
            <input 
              type="checkbox" 
              id="subscribe" 
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
            />
            <label htmlFor="subscribe">
              I want to subscribe to your mailing list.
            </label>
          </div>

          {message && (
            <p className={styles.message} style={{ 
              color: message.includes('Thank you') ? '#28a745' : '#dc3545',
              marginTop: '10px',
              fontSize: '14px'
            }}>
              {message}
            </p>
          )}
        </div>
      </div>
    </footer>
  )
}

export default FooterSection
