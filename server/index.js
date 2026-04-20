import express from 'express'
import cors from 'cors'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import nodemailer from 'nodemailer'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')
const dataDir = path.join(projectRoot, 'data')
const postsFile = path.join(dataDir, 'custom-posts.json')
const newsletterFile = path.join(dataDir, 'newsletter-subscribers.json')
const pageSEOFile = path.join(dataDir, 'page-seo.json')

// Email configuration
const emailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || 'your-email@gmail.com',
    pass: process.env.SMTP_PASS || 'your-app-password',
  },
})

const app = express()
const port = Number(process.env.PORT || 3001)

app.use(cors())
app.use(express.json({ limit: '25mb' }))

const ensureStorageFile = async () => {
  await fs.mkdir(dataDir, { recursive: true })

  try {
    await fs.access(postsFile)
  } catch {
    await fs.writeFile(postsFile, '[]\n', 'utf8')
  }

  try {
    await fs.access(newsletterFile)
  } catch {
    await fs.writeFile(newsletterFile, '[]\n', 'utf8')
  }

  try {
    await fs.access(pageSEOFile)
  } catch {
    await fs.writeFile(pageSEOFile, '[]\n', 'utf8')
  }
}

const readPosts = async () => {
  await ensureStorageFile()
  const raw = await fs.readFile(postsFile, 'utf8')

  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const writePosts = async (posts) => {
  await ensureStorageFile()
  await fs.writeFile(postsFile, `${JSON.stringify(posts, null, 2)}\n`, 'utf8')
}

const readNewsletterSubscribers = async () => {
  await ensureStorageFile()
  const raw = await fs.readFile(newsletterFile, 'utf8')

  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const writeNewsletterSubscribers = async (subscribers) => {
  await ensureStorageFile()
  await fs.writeFile(newsletterFile, `${JSON.stringify(subscribers, null, 2)}\n`, 'utf8')
}

const readPageSEO = async () => {
  await ensureStorageFile()
  const raw = await fs.readFile(pageSEOFile, 'utf8')

  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const writePageSEO = async (seo) => {
  await ensureStorageFile()
  await fs.writeFile(pageSEOFile, `${JSON.stringify(seo, null, 2)}\n`, 'utf8')
}

app.get('/api/custom-posts', async (_req, res) => {
  const posts = await readPosts()
  res.json(posts)
})

app.post('/api/custom-posts', async (req, res) => {
  const posts = await readPosts()
  const payload = req.body

  if (!payload || typeof payload !== 'object') {
    res.status(400).json({ error: 'Invalid payload' })
    return
  }

  const post = {
    ...payload,
    source: 'custom',
  }

  posts.unshift(post)
  await writePosts(posts)
  res.status(201).json(post)
})

app.put('/api/custom-posts/:id', async (req, res) => {
  const posts = await readPosts()
  const { id } = req.params
  const payload = req.body
  const index = posts.findIndex((post) => post.id === id)

  if (index < 0) {
    res.status(404).json({ error: 'Post not found' })
    return
  }

  posts[index] = {
    ...posts[index],
    ...payload,
    id,
    source: 'custom',
  }

  await writePosts(posts)
  res.json(posts[index])
})

app.patch('/api/custom-posts/:id/published', async (req, res) => {
  const posts = await readPosts()
  const { id } = req.params
  const { published } = req.body ?? {}
  const index = posts.findIndex((post) => post.id === id)

  if (index < 0) {
    res.status(404).json({ error: 'Post not found' })
    return
  }

  posts[index] = {
    ...posts[index],
    published: Boolean(published),
  }

  await writePosts(posts)
  res.json(posts[index])
})

app.delete('/api/custom-posts/:id', async (req, res) => {
  const posts = await readPosts()
  const { id } = req.params
  const nextPosts = posts.filter((post) => post.id !== id)

  if (nextPosts.length === posts.length) {
    res.status(404).json({ error: 'Post not found' })
    return
  }

  await writePosts(nextPosts)
  res.status(204).send()
})

app.get('/api/page-seo', async (_req, res) => {
  const seo = await readPageSEO()
  res.json(seo)
})

app.put('/api/page-seo/:id', async (req, res) => {
  const seo = await readPageSEO()
  const { id } = req.params
  const payload = req.body
  const index = seo.findIndex((item) => item.id === id)

  if (index < 0) {
    // If not found, add new
    seo.push({
      ...payload,
      id,
    })
  } else {
    seo[index] = {
      ...seo[index],
      ...payload,
      id,
    }
  }

  await writePageSEO(seo)
  res.json(seo[index >= 0 ? index : seo.length - 1])
})

app.post('/api/newsletter/subscribe', async (req, res) => {
  const subscribers = await readNewsletterSubscribers()
  const { email, consent } = req.body

  if (!email || !consent) {
    res.status(400).json({ error: 'Email and consent are required' })
    return
  }

  // Check if email already exists
  const existingSubscriber = subscribers.find(sub => sub.email === email)
  if (existingSubscriber) {
    res.status(409).json({ error: 'Email already subscribed' })
    return
  }

  const subscriber = {
    email,
    consent,
    subscribedAt: new Date().toISOString(),
    id: Date.now().toString()
  }

  subscribers.push(subscriber)
  await writeNewsletterSubscribers(subscribers)

  // Send notification email
  try {
    await emailTransporter.sendMail({
      from: process.env.SMTP_USER || 'your-email@gmail.com',
      to: process.env.ADMIN_EMAIL || 'admin@mcaexposed.com',
      subject: 'New Newsletter Subscription',
      html: `
        <h2>New Newsletter Subscriber</h2>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subscribed at:</strong> ${subscriber.subscribedAt}</p>
        <p><strong>Consent given:</strong> ${consent ? 'Yes' : 'No'}</p>
        <p><strong>Total subscribers:</strong> ${subscribers.length}</p>
      `,
    })
  } catch (emailError) {
    console.error('Failed to send notification email:', emailError)
    // Don't fail the subscription if email fails
  }

  res.status(201).json({ message: 'Successfully subscribed to newsletter' })
})

app.get('/api/newsletter/subscribers', async (_req, res) => {
  const subscribers = await readNewsletterSubscribers()
  res.json(subscribers)
})

app.listen(port, async () => {
  await ensureStorageFile()
  console.log(`Posts API running on http://localhost:${port}`)
})
