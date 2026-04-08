import express from 'express'
import cors from 'cors'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')
const dataDir = path.join(projectRoot, 'data')
const postsFile = path.join(dataDir, 'custom-posts.json')

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

app.listen(port, async () => {
  await ensureStorageFile()
  console.log(`Posts API running on http://localhost:${port}`)
})
