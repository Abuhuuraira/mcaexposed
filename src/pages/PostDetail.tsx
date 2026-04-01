import { Link, useParams } from 'react-router-dom'
import type { ReactNode } from 'react'
import FooterSection from '../components/FooterSection'
import { findPostBySlug } from '../data/posts'
import styles from './PostDetail.module.css'

const allowedTags = new Set(['A', 'P', 'BR', 'STRONG', 'EM', 'B', 'I', 'H2', 'H3', 'UL', 'OL', 'LI', 'BLOCKQUOTE', 'DIV'])

const sanitizeHtml = (rawHtml: string): string => {
  if (!rawHtml.trim()) {
    return ''
  }

  const parser = new DOMParser()
  const doc = parser.parseFromString(rawHtml, 'text/html')

  const walk = (node: Node) => {
    const children = Array.from(node.childNodes)

    for (const child of children) {
      if (child.nodeType === Node.ELEMENT_NODE) {
        const element = child as HTMLElement

        if (!allowedTags.has(element.tagName)) {
          while (element.firstChild) {
            node.insertBefore(element.firstChild, element)
          }
          node.removeChild(element)
          continue
        }

        if (element.tagName === 'A') {
          const href = element.getAttribute('href') ?? ''
          if (!/^https?:\/\//i.test(href)) {
            element.removeAttribute('href')
          }
          element.setAttribute('target', '_blank')
          element.setAttribute('rel', 'noreferrer')
        }

        const allowedAttrs = element.tagName === 'A'
          ? ['href', 'target', 'rel']
          : []
        Array.from(element.attributes).forEach((attr) => {
          if (!allowedAttrs.includes(attr.name)) {
            element.removeAttribute(attr.name)
          }
        })

        walk(element)
      }
    }
  }

  walk(doc.body)
  return doc.body.innerHTML
}

const parseInlineContent = (text: string): ReactNode[] => {
  const nodes: ReactNode[] = []
  let remaining = text
  let index = 0

  const patterns = [
    { type: 'link', regex: /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/ },
    { type: 'bold', regex: /\*\*([^*]+)\*\*/ },
    { type: 'italic', regex: /\*([^*\n]+)\*/ },
  ] as const

  while (remaining.length > 0) {
    const matches = patterns
      .map((pattern) => {
        const match = remaining.match(pattern.regex)
        return match && typeof match.index === 'number'
          ? { type: pattern.type, match, index: match.index }
          : null
      })
      .filter((value): value is { type: 'link' | 'bold' | 'italic'; match: RegExpMatchArray; index: number } => Boolean(value))
      .sort((a, b) => a.index - b.index)

    const next = matches[0]
    if (!next) {
      nodes.push(remaining)
      break
    }

    if (next.index > 0) {
      nodes.push(remaining.slice(0, next.index))
    }

    if (next.type === 'link') {
      nodes.push(
        <a
          key={`inline-link-${index}`}
          href={next.match[2]}
          target="_blank"
          rel="noreferrer"
          className={styles.contentLink}
        >
          {next.match[1]}
        </a>,
      )
    }

    if (next.type === 'bold') {
      nodes.push(<strong key={`inline-bold-${index}`}>{next.match[1]}</strong>)
    }

    if (next.type === 'italic') {
      nodes.push(<em key={`inline-italic-${index}`}>{next.match[1]}</em>)
    }

    remaining = remaining.slice(next.index + next.match[0].length)
    index += 1
  }

  return nodes
}

const renderContent = (rawContent: string) => {
  const blocks = rawContent
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)

  return blocks.map((block, blockIndex) => {
    const lines = block
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)

    const isHeading = lines.length === 1 && /^#{1,3}\s+/.test(lines[0])
    if (isHeading) {
      const headingText = lines[0].replace(/^#{1,3}\s+/, '')
      return (
        <h3 key={`heading-${blockIndex}`} className={styles.contentHeading}>
          {parseInlineContent(headingText)}
        </h3>
      )
    }

    const isQuote = lines.every((line) => /^>\s+/.test(line))
    if (isQuote) {
      const quoteText = lines.map((line) => line.replace(/^>\s+/, '')).join(' ')
      return (
        <blockquote key={`quote-${blockIndex}`} className={styles.contentQuote}>
          {parseInlineContent(quoteText)}
        </blockquote>
      )
    }

    const isBulletList = lines.every((line) => /^[-*•]\s+/.test(line))
    if (isBulletList) {
      return (
        <ul key={`list-${blockIndex}`} className={styles.contentList}>
          {lines.map((line, lineIndex) => (
            <li key={`item-${blockIndex}-${lineIndex}`}>
              {parseInlineContent(line.replace(/^[-*•]\s+/, ''))}
            </li>
          ))}
        </ul>
      )
    }

    const isOrderedList = lines.every((line) => /^\d+\.\s+/.test(line))
    if (isOrderedList) {
      return (
        <ol key={`ordered-${blockIndex}`} className={styles.contentOrderedList}>
          {lines.map((line, lineIndex) => (
            <li key={`ordered-item-${blockIndex}-${lineIndex}`}>
              {parseInlineContent(line.replace(/^\d+\.\s+/, ''))}
            </li>
          ))}
        </ol>
      )
    }

    const paragraphText = lines.join(' ')

    return (
      <p key={`para-${blockIndex}`} className={styles.contentParagraph}>
        {parseInlineContent(paragraphText)}
      </p>
    )
  })
}

const renderPostContent = (rawContent: string) => {
  const hasHtmlTag = /<\/?[a-z][\s\S]*>/i.test(rawContent)

  if (hasHtmlTag) {
    return (
      <article
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(rawContent) }}
      />
    )
  }

  return <article className={styles.content}>{renderContent(rawContent)}</article>
}

function PostDetail() {
  const { slug } = useParams()
  const post = slug ? findPostBySlug(slug) : undefined

  return (
    <div className={styles.pageWrap}>
      <section className={styles.heroSection}>
        <div className={styles.contentContainer}>
          {!post ? (
            <div className={styles.postCard}>
              <h1>Post not found</h1>
              <p>The post you requested does not exist.</p>
              <Link to="/records" className={styles.backLink}>
                Back to Records
              </Link>
            </div>
          ) : (
            <article className={styles.postCard}>
              <p className={styles.metaTop}>{post.category}</p>
              <h1>{post.title}</h1>
              <p className={styles.metaLine}>
                <span>{post.date}</span>
                <span>{post.readTime}</span>
              </p>

              <p className={styles.excerpt}>{post.excerpt}</p>
              {renderPostContent(post.content)}
              {post.contentImage && post.contentImage !== post.image && (
                <img src={post.contentImage} alt={`${post.title} content`} className={styles.contentImage} />
              )}

              <Link to="/records" className={styles.backLink}>
                Back to Records
              </Link>
            </article>
          )}
        </div>
      </section>

      <div className={styles.divider}></div>
      <FooterSection />
    </div>
  )
}

export default PostDetail
