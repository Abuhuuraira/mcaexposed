import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import FooterSection from '../components/FooterSection'
import {
  addCustomPost,
  deleteCustomPost,
  getAllPosts,
  publishPost,
  unpublishPost,
  type Post,
  type PostCategory,
  updatePost,
} from '../data/posts'
import styles from './Dashboard.module.css'

type FormState = {
  title: string
  excerpt: string
  content: string
  category: PostCategory
  date: string
  readTime: string
  image: string
  contentImage: string
}

const defaultForm: FormState = {
  title: '',
  excerpt: '',
  content: '',
  category: 'MCA Awareness',
  date: '',
  readTime: '',
  image: '',
  contentImage: '',
}

const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result ?? ''))
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('Failed to load image'))
    image.src = src
  })

const compressImageFile = async (file: File): Promise<string> => {
  const originalDataUrl = await readFileAsDataUrl(file)

  if (!file.type.startsWith('image/')) {
    return originalDataUrl
  }

  const image = await loadImage(originalDataUrl)
  const maxDimension = 1400
  const scale = Math.min(1, maxDimension / Math.max(image.width, image.height))

  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(image.width * scale))
  canvas.height = Math.max(1, Math.round(image.height * scale))

  const context = canvas.getContext('2d')
  if (!context) {
    return originalDataUrl
  }

  context.drawImage(image, 0, 0, canvas.width, canvas.height)

  const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8)

  return compressedDataUrl.length < originalDataUrl.length
    ? compressedDataUrl
    : originalDataUrl
}

function Dashboard() {
  const [form, setForm] = useState<FormState>(defaultForm)
  const [message, setMessage] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [savedPost, setSavedPost] = useState<Post | null>(null)
  const [newPostId, setNewPostId] = useState<string | null>(null)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [allPosts, setAllPosts] = useState<Post[]>(getAllPosts())
  const formRef = useRef(form)
  const pendingImageUploadRef = useRef<Promise<void> | null>(null)
  const contentInputRef = useRef<HTMLDivElement | null>(null)
  const navigate = useNavigate()
  const { logout, username } = useAuth()
  const customPostsCount = allPosts.filter((post) => post.source === 'custom').length
  const defaultPostsCount = allPosts.length - customPostsCount
  const publishedCount = allPosts.filter((post) => post.published === true).length

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const onChange =
    (key: keyof FormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const nextForm = { ...formRef.current, [key]: event.target.value }
      formRef.current = nextForm
      setForm(nextForm)
    }

  const onImageFileChange =
    (key: 'image' | 'contentImage') =>
    async (event: ChangeEvent<HTMLInputElement>) => {
      const selectedFile = event.target.files?.[0]
      if (!selectedFile) {
        return
      }

      setIsUploadingImage(true)

      const uploadTask = (async () => {
        try {
          const dataUrl = await compressImageFile(selectedFile)
          const nextForm = { ...formRef.current, [key]: dataUrl }
          formRef.current = nextForm
          setForm(nextForm)
          setMessage('Image uploaded successfully.')
        } catch {
          setMessage('Image upload failed. Please try another image.')
        } finally {
          setIsUploadingImage(false)
          event.target.value = ''
        }
      })()

      pendingImageUploadRef.current = uploadTask
      await uploadTask

      if (pendingImageUploadRef.current === uploadTask) {
        pendingImageUploadRef.current = null
      }
    }

  const stripHtml = (value: string) =>
    value.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim()

  useEffect(() => {
    const input = contentInputRef.current
    if (!input) {
      return
    }

    if (input.innerHTML !== form.content) {
      input.innerHTML = form.content
    }
  }, [form.content])

  const syncContentFromEditor = () => {
    const input = contentInputRef.current
    if (!input) {
      return
    }

    const nextForm = { ...formRef.current, content: input.innerHTML }
    formRef.current = nextForm
    setForm(nextForm)
  }

  const focusEditor = () => {
    contentInputRef.current?.focus()
  }

  const runCommand = (command: string, value?: string) => {
    focusEditor()
    document.execCommand(command, false, value)
    syncContentFromEditor()
  }

  const handleFormatContent = (action: 'bold' | 'italic' | 'heading' | 'quote' | 'bullet' | 'number' | 'link') => {
    if (action === 'bold') {
      runCommand('bold')
      return
    }

    if (action === 'italic') {
      runCommand('italic')
      return
    }

    if (action === 'heading') {
      runCommand('formatBlock', 'h2')
      return
    }

    if (action === 'quote') {
      runCommand('formatBlock', 'blockquote')
      return
    }

    if (action === 'bullet') {
      runCommand('insertUnorderedList')
      return
    }

    if (action === 'number') {
      runCommand('insertOrderedList')
      return
    }

    if (action === 'link') {
      const link = window.prompt('Enter URL', 'https://')
      if (!link) {
        return
      }
      runCommand('createLink', link)
    }
  }

  const waitForPendingImageUpload = async () => {
    if (!pendingImageUploadRef.current) {
      return
    }

    setMessage('Finishing image upload before saving...')
    await pendingImageUploadRef.current
  }

  const getSanitizedFormPayload = (source: FormState): FormState => {
    const normalizedContentImage =
      source.contentImage && source.contentImage !== source.image ? source.contentImage : ''

    return {
      ...source,
      contentImage: normalizedContentImage,
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    await waitForPendingImageUpload()
    const payload = getSanitizedFormPayload(formRef.current)

    if (
      !payload.title
      || !payload.excerpt
      || !stripHtml(payload.content)
      || !payload.date
      || !payload.readTime
      || !payload.image
    ) {
      setMessage('Please fill all fields before saving the post.')
      return
    }

    if (editingId) {
      const updatedPost = updatePost(editingId, payload)
      if (!updatedPost) {
        setMessage('Post update failed. Image may be too large or browser storage is full.')
        return
      }
      setMessage('Post updated successfully!')
      setEditingId(null)
    } else {
      const createdPost = addCustomPost(payload)
      if (!createdPost) {
        setMessage('Post save failed. Image may be too large or browser storage is full.')
        return
      }
      setSavedPost(createdPost)
      setNewPostId(createdPost.id)
      setMessage('Post saved successfully and added to the list!')
      
      // Auto-close modal after 2 seconds
      setTimeout(() => {
        setSavedPost(null)
      }, 2000)
    }

    setAllPosts(getAllPosts())
    formRef.current = defaultForm
    setForm(defaultForm)
  }

  const startNewPost = () => {
    setEditingId(null)
    formRef.current = defaultForm
    setForm(defaultForm)
    setMessage('Ready to add a new post.')
  }

  const startEdit = (post: Post) => {
    setEditingId(post.id)
    const nextForm: FormState = {
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      date: post.date,
      readTime: post.readTime,
      image: post.image,
      contentImage: post.contentImage ?? '',
    }
    formRef.current = nextForm
    setForm(nextForm)
    setMessage('Editing selected post...')
  }

  const removePost = (post: Post) => {
    const shouldDelete = window.confirm(`Delete "${post.title}"? This action cannot be undone.`)

    if (!shouldDelete) {
      return
    }

    if (post.source === 'default') {
      setMessage('Default records cannot be deleted.')
      return
    }

    const deleted = deleteCustomPost(post.id)
    if (!deleted) {
      setMessage('Post delete failed. Please try again.')
      return
    }
    setAllPosts(getAllPosts())
    if (editingId === post.id) {
      setEditingId(null)
      formRef.current = defaultForm
      setForm(defaultForm)
    }
    setMessage('Post deleted successfully.')
  }

  const cancelEdit = () => {
    setEditingId(null)
    formRef.current = defaultForm
    setForm(defaultForm)
    setMessage('Edit canceled.')
  }

  const handlePublish = (post: Post) => {
    const published = publishPost(post.id)
    setAllPosts(getAllPosts())
    if (!published) {
      setMessage('Publish failed. Please save the post first and try again.')
      return
    }
    setMessage(`"${post.title}" is now live on the Records page!`)
  }

  const handleUnpublish = (post: Post) => {
    const unpublished = unpublishPost(post.id)
    if (!unpublished) {
      setMessage('Unpublish failed. Please try again.')
      return
    }
    setAllPosts(getAllPosts())
    setMessage(`"${post.title}" has been removed from the Records page.`)
  }

  const handlePublishPostDirect = async () => {
    await waitForPendingImageUpload()
    const payload = getSanitizedFormPayload(formRef.current)

    if (
      !payload.title
      || !payload.excerpt
      || !stripHtml(payload.content)
      || !payload.date
      || !payload.readTime
      || !payload.image
    ) {
      setMessage('Please fill all fields before publishing the post.')
      return
    }

    let postId: string | null = editingId
    if (!editingId) {
      const createdPost = addCustomPost(payload)
      if (!createdPost) {
        setMessage('Publish failed. Image may be too large or browser storage is full.')
        return
      }
      postId = createdPost.id
    } else {
      const updatedPost = updatePost(editingId, payload)
      if (!updatedPost) {
        setMessage('Publish failed. Could not update post before publishing.')
        return
      }
      postId = updatedPost?.id ?? null
    }

    if (postId) {
      const published = publishPost(postId)
      if (!published) {
        setMessage('Publish failed. Please save the post first and try again.')
        setAllPosts(getAllPosts())
        return
      }
      setMessage('Post published successfully and is now live!')
      setEditingId(null)
      formRef.current = defaultForm
      setForm(defaultForm)
    }

    setAllPosts(getAllPosts())
  }

  return (
    <div className={styles.pageWrap}>
      <section className={styles.heroSection}>
        <div className={styles.contentContainer}>
          <div className={styles.dashboardHeader}>
            <div className={styles.headerContent}>
              <h1>Post Dashboard</h1>
              <p>Create, edit, and manage records that appear on The Records page.</p>
              <div className={styles.statsRow}>
                <div className={styles.statChip}>
                  <span className={styles.statLabel}>Total Posts</span>
                  <strong>{allPosts.length}</strong>
                </div>
                <div className={styles.statChip}>
                  <span className={styles.statLabel}>Custom</span>
                  <strong>{customPostsCount}</strong>
                </div>
                <div className={styles.statChip}>
                  <span className={styles.statLabel}>Published</span>
                  <strong>{publishedCount}</strong>
                </div>
                <div className={styles.statChip}>
                  <span className={styles.statLabel}>Default</span>
                  <strong>{defaultPostsCount}</strong>
                </div>
              </div>
            </div>
            <div className={styles.userInfo}>
              <span className={styles.userLabel}>Logged in as: <strong>{username}</strong></span>
              <button className={styles.logoutBtn} onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <section className={styles.formSection}>
              <h2>Post Details</h2>
              <div className={styles.grid}>
                <label>
                  Title
                  <input value={form.title} onChange={onChange('title')} />
                </label>

                <label>
                  Category
                  <select value={form.category} onChange={onChange('category')}>
                    <option value="MCA Awareness">MCA Awareness</option>
                    <option value="The Fraud Files">The Fraud Files</option>
                    <option value="Other">Other</option>
                  </select>
                </label>

                <label>
                  Date
                  <input placeholder="Aug 25, 2025" value={form.date} onChange={onChange('date')} />
                </label>

                <label>
                  Read Time
                  <input placeholder="4 min read" value={form.readTime} onChange={onChange('readTime')} />
                </label>
              </div>

              <label>
                Excerpt
                <textarea rows={3} value={form.excerpt} onChange={onChange('excerpt')} />
              </label>

              <label>
                Full Post Content
                <div className={styles.editorTools}>
                  <div className={styles.toolGroup}>
                    <button type="button" className={styles.toolBtn} onClick={() => handleFormatContent('heading')} title="Heading" aria-label="Heading">
                      H2
                    </button>
                    <button type="button" className={styles.toolBtn} onClick={() => handleFormatContent('bold')} title="Bold" aria-label="Bold">
                      <strong>B</strong>
                    </button>
                    <button type="button" className={styles.toolBtn} onClick={() => handleFormatContent('italic')} title="Italic" aria-label="Italic">
                      <em>I</em>
                    </button>
                  </div>

                  <div className={styles.toolDivider}></div>

                  <div className={styles.toolGroup}>
                    <button type="button" className={styles.toolBtn} onClick={() => handleFormatContent('bullet')} title="Bullet list" aria-label="Bullet list">
                      • List
                    </button>
                    <button type="button" className={styles.toolBtn} onClick={() => handleFormatContent('number')} title="Numbered list" aria-label="Numbered list">
                      1. List
                    </button>
                    <button type="button" className={styles.toolBtn} onClick={() => handleFormatContent('quote')} title="Quote" aria-label="Quote">
                      “ ”
                    </button>
                    <button type="button" className={styles.toolBtn} onClick={() => handleFormatContent('link')} title="Link" aria-label="Link">
                      Link
                    </button>
                  </div>
                </div>
                <textarea
                  style={{ display: 'none' }}
                  value={form.content}
                  readOnly
                />
                <div
                  ref={contentInputRef}
                  className={styles.richEditor}
                  contentEditable
                  role="textbox"
                  aria-label="Full Post Content Editor"
                  onInput={syncContentFromEditor}
                  suppressContentEditableWarning
                ></div>
                <span className={styles.editorHint}>
                  Tip: Select text and click a format button to apply styling.
                </span>
              </label>
            </section>

            <section className={styles.formSection}>
              <h2>Media</h2>
              <div className={styles.mediaGrid}>
                <div className={styles.mediaCard}>
                  <label>
                    Cover Image Upload
                    <input type="file" accept="image/*" onChange={onImageFileChange('image')} />
                    <span className={styles.uploadNote}>Upload an image file from your device.</span>
                  </label>
                  {form.image && (
                    <div className={styles.imagePreview}>
                      <img src={form.image} alt="Cover preview" className={styles.previewImage} />
                    </div>
                  )}
                </div>

                <div className={styles.mediaCard}>
                  <label>
                    Image Below Post Content
                    <input type="file" accept="image/*" onChange={onImageFileChange('contentImage')} />
                    <span className={styles.uploadNote}>Optional image shown below the full post content.</span>
                  </label>
                  {form.contentImage && (
                    <div className={styles.imagePreview}>
                      <img src={form.contentImage} alt="Content image preview" className={styles.previewImage} />
                    </div>
                  )}
                </div>
              </div>
            </section>

            <div className={styles.actionsRow}>
              <button type="submit">
                {isUploadingImage ? 'Uploading Image...' : editingId ? 'Update Post' : 'Save Post'}
              </button>
              <button
                type="button"
                className={styles.publishActionBtn}
                onClick={handlePublishPostDirect}
              >
                {isUploadingImage ? 'Uploading Image...' : 'Publish Post'}
              </button>
              <button
                type="button"
                className={styles.newPostBtn}
                onClick={startNewPost}
              >
                Add New Post
              </button>
              {editingId && (
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={cancelEdit}
                >
                  Cancel Edit
                </button>
              )}
            </div>
            {message && <p className={styles.message}>{message}</p>}
          </form>

          <section className={styles.savedSection}>
            <h2>All Posts (Records + Custom)</h2>
            {allPosts.length === 0 ? (
              <p className={styles.emptyText}>No posts available.</p>
            ) : (
              <div className={styles.savedList}>
                {allPosts.map((post) => (
                  <article key={post.id} className={`${styles.savedItem} ${newPostId === post.id ? styles.newPost : ''}`}>
                    <img src={post.image} alt={post.title} className={styles.savedThumb} />

                    <div className={styles.savedContent}>
                      <div className={styles.savedTopRow}>
                        <span className={post.source === 'custom' ? styles.customBadge : styles.defaultBadge}>
                          {post.source === 'custom' ? 'Custom' : 'Default'}
                        </span>
                        <span className={styles.categoryBadge}>{post.category}</span>
                        {post.published === true && (
                          <span className={styles.publishedBadge}>Live</span>
                        )}
                      </div>
                      <h3>{post.title}</h3>
                      <p>{post.excerpt}</p>
                      <div className={styles.savedMeta}>
                        <span>{post.date}</span>
                        <span>{post.readTime}</span>
                      </div>
                    </div>

                    <div className={styles.savedActions}>
                      <button type="button" onClick={() => startEdit(post)}>
                        Edit
                      </button>
                      {post.source === 'custom' && post.published !== true && (
                        <button
                          type="button"
                          className={styles.publishBtn}
                          onClick={() => handlePublish(post)}
                        >
                          Publish
                        </button>
                      )}
                      {post.source === 'custom' && post.published === true && (
                        <button
                          type="button"
                          className={styles.unpublishBtn}
                          onClick={() => handleUnpublish(post)}
                        >
                          Unpublish
                        </button>
                      )}
                      <button
                        type="button"
                        className={styles.deleteBtn}
                        onClick={() => removePost(post)}
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          {savedPost && (
            <div className={styles.popupOverlay} role="dialog" aria-modal="true" aria-labelledby="post-saved-title" onClick={() => setSavedPost(null)}>
              <div className={styles.popupCard} onClick={(e) => e.stopPropagation()}>
                <h3 id="post-saved-title">Post saved successfully</h3>
                <p>What would you like to do next?</p>
                <div className={styles.popupActions}>
                  <button
                    type="button"
                    onClick={() => navigate(`/post/${savedPost.slug}`)}
                  >
                    View Post
                  </button>
                  <button
                    type="button"
                    className={styles.stayBtn}
                    onClick={() => setSavedPost(null)}
                  >
                    Stay on Dashboard
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <div className={styles.divider}></div>
      <FooterSection />
    </div>
  )
}

export default Dashboard
