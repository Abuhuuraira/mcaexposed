import { useState, type ChangeEvent, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import FooterSection from '../components/FooterSection'
import {
  addCustomPost,
  deleteCustomPost,
  getAllPosts,
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

function Dashboard() {
  const [form, setForm] = useState<FormState>(defaultForm)
  const [message, setMessage] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [savedPost, setSavedPost] = useState<Post | null>(null)
  const [allPosts, setAllPosts] = useState<Post[]>(getAllPosts())
  const navigate = useNavigate()
  const { logout, username } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const onChange =
    (key: keyof FormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [key]: event.target.value }))
    }

  const onImageFileChange =
    (key: 'image' | 'contentImage') =>
    async (event: ChangeEvent<HTMLInputElement>) => {
      const selectedFile = event.target.files?.[0]
      if (!selectedFile) {
        return
      }

      try {
        const dataUrl = await readFileAsDataUrl(selectedFile)
        setForm((prev) => ({ ...prev, [key]: dataUrl }))
        setMessage('Image uploaded successfully.')
      } catch {
        setMessage('Image upload failed. Please try another image.')
      } finally {
        event.target.value = ''
      }
    }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!form.title || !form.excerpt || !form.content || !form.date || !form.readTime || !form.image) {
      setMessage('Please fill all fields before saving the post.')
      return
    }

    if (editingId) {
      updatePost(editingId, form)
      setMessage('Post updated successfully!')
      setEditingId(null)
    } else {
      const createdPost = addCustomPost(form)
      setSavedPost(createdPost)
      setMessage('Post saved successfully!')
    }

    setAllPosts(getAllPosts())
    setForm(defaultForm)
  }

  const startNewPost = () => {
    setEditingId(null)
    setForm(defaultForm)
    setMessage('Ready to add a new post.')
  }

  const startEdit = (post: Post) => {
    setEditingId(post.id)
    setForm({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      date: post.date,
      readTime: post.readTime,
      image: post.image,
      contentImage: post.contentImage ?? '',
    })
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

    deleteCustomPost(post.id)
    setAllPosts(getAllPosts())
    if (editingId === post.id) {
      setEditingId(null)
      setForm(defaultForm)
    }
    setMessage('Post deleted successfully.')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setForm(defaultForm)
    setMessage('Edit canceled.')
  }

  return (
    <div className={styles.pageWrap}>
      <section className={styles.heroSection}>
        <div className={styles.contentContainer}>
          <div className={styles.dashboardHeader}>
            <div>
              <h1>Post Dashboard</h1>
              <p>Create and save post content so it appears on The Records page.</p>
            </div>
            <div className={styles.userInfo}>
              <span className={styles.userLabel}>Logged in as: <strong>{username}</strong></span>
              <button className={styles.logoutBtn} onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
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
              Cover Image Upload
              <input type="file" accept="image/*" onChange={onImageFileChange('image')} />
              <span className={styles.uploadNote}>Upload an image file from your device.</span>
            </label>
            {form.image && (
              <div className={styles.imagePreview}>
                <img src={form.image} alt="Cover preview" className={styles.previewImage} />
              </div>
            )}

            <label>
              Excerpt
              <textarea rows={3} value={form.excerpt} onChange={onChange('excerpt')} />
            </label>

            <label>
              Full Post Content
              <textarea rows={8} value={form.content} onChange={onChange('content')} />
            </label>

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

            <div className={styles.actionsRow}>
              <button type="submit">{editingId ? 'Update Post' : 'Save Post'}</button>
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
                  <article key={post.id} className={styles.savedItem}>
                    <div>
                      <h3>{post.title}</h3>
                      <p>
                        {post.category} • {post.date} • {post.readTime}
                      </p>
                    </div>

                    <div className={styles.savedActions}>
                      <button type="button" onClick={() => startEdit(post)}>
                        Edit
                      </button>
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
            <div className={styles.popupOverlay} role="dialog" aria-modal="true" aria-labelledby="post-saved-title">
              <div className={styles.popupCard}>
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
