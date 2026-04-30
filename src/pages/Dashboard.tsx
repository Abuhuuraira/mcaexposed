import { useEffect, useMemo, useRef, useState, type ChangeEvent, type ClipboardEvent, type FormEvent } from 'react'
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
import { getAllPageSEO, updatePageSEO, type PageSEO, defaultPageSEO } from '../data/page-seo'
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

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const linkifyText = (value: string) =>
  escapeHtml(value).replace(
    /(https?:\/\/[^\s<]+)/gi,
    (url) => `<a href="${url}" target="_blank" rel="noreferrer">${url}</a>`,
  )

// Color conversion utilities
const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

const rgbToHex = (r: number, g: number, b: number): string => {
  return (
    '#' +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16)
        return hex.length === 1 ? '0' + hex : hex
      })
      .join('')
      .toUpperCase()
  )
}

const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / d + 2) / 6
        break
      case b:
        h = ((r - g) / d + 4) / 6
        break
    }
  }

  return { h: h * 360, s: s * 100, l: l * 100 }
}

const hslToRgb = (h: number, s: number, l: number): { r: number; g: number; b: number } => {
  h = h / 360
  s = s / 100
  l = l / 100

  let r, g, b

  if (s === 0) {
    r = g = b = l
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  }
}

const isLikelyHeading = (line: string, blockIndex: number) => {
  if (/^#{1,3}\s+/.test(line)) {
    return true
  }

  if (blockIndex !== 0) {
    return false
  }

  const words = line.split(/\s+/).filter(Boolean).length
  if (words < 3 || words > 18 || line.length > 120) {
    return false
  }

  return !/[.!?]$/.test(line)
}

const smartFormatPlainText = (rawText: string): string => {
  const normalized = rawText
    .replace(/\r\n/g, '\n')
    .replace(/\u00a0/g, ' ')
    .trim()

  if (!normalized) {
    return ''
  }

  const blocks = normalized
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)

  return blocks
    .map((block, blockIndex) => {
      const lines = block
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)

      if (lines.length === 0) {
        return ''
      }

      const markdownHeading = lines.length === 1 && /^#{1,3}\s+/.test(lines[0])
      if (markdownHeading) {
        return `<h2>${linkifyText(lines[0].replace(/^#{1,3}\s+/, ''))}</h2>`
      }

      if (lines.length === 1 && isLikelyHeading(lines[0], blockIndex)) {
        return `<h2>${linkifyText(lines[0])}</h2>`
      }

      const isBulletList = lines.every((line) => /^[-*•]\s+/.test(line))
      if (isBulletList) {
        const items = lines
          .map((line) => `<li>${linkifyText(line.replace(/^[-*•]\s+/, ''))}</li>`)
          .join('')
        return `<ul>${items}</ul>`
      }

      const isOrderedList = lines.every((line) => /^\d+\.\s+/.test(line))
      if (isOrderedList) {
        const items = lines
          .map((line) => `<li>${linkifyText(line.replace(/^\d+\.\s+/, ''))}</li>`)
          .join('')
        return `<ol>${items}</ol>`
      }

      return `<p>${linkifyText(lines.join(' '))}</p>`
    })
    .filter(Boolean)
    .join('')
}

const shouldSmartFormatEditorHtml = (rawHtml: string): boolean =>
  !/<(h[1-6]|p|ul|ol|li|blockquote|a|strong|b|em|i)\b/i.test(rawHtml)

const needsContentNormalization = (rawHtml: string): boolean =>
  /<(div|span|font|section|article|header|footer|table|tbody|tr|td|th|figure|figcaption|h1|h4|h5|h6)\b/i.test(rawHtml)

const normalizeContentForStorage = (rawContent: string): string => {
  const trimmedContent = rawContent.trim()
  if (!trimmedContent) {
    return ''
  }

  const hasHtmlTag = /<\/?[a-z][\s\S]*>/i.test(trimmedContent)
  if (!hasHtmlTag) {
    return smartFormatPlainText(trimmedContent)
  }

  if (!needsContentNormalization(trimmedContent)) {
    return trimmedContent
  }

  const parser = new DOMParser()
  const doc = parser.parseFromString(trimmedContent, 'text/html')
  const plainText = (doc.body.textContent ?? '')
    .replace(/\u00a0/g, ' ')
    .trim()

  return smartFormatPlainText(plainText)
}

function Dashboard() {
  const [form, setForm] = useState<FormState>(defaultForm)
  const [message, setMessage] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newPostId, setNewPostId] = useState<string | null>(null)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [inlineFileTitle, setInlineFileTitle] = useState('')
  const [inlineFileName, setInlineFileName] = useState('')
  const [inlineFileData, setInlineFileData] = useState('')
  const [allPosts, setAllPosts] = useState<Post[]>([])
  const [subscribers, setSubscribers] = useState<any[]>([])
  const [pageSEO, setPageSEO] = useState<PageSEO[]>(defaultPageSEO)
  const [selectedSEOId, setSelectedSEOId] = useState<string>('home')
  const [activeSection, setActiveSection] = useState<'posts' | 'newsletter' | 'seo'>('posts')
  const [showFontPicker, setShowFontPicker] = useState(false)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [selectedColor, setSelectedColor] = useState('#39ff14')
  const [colorHue, setColorHue] = useState(120)
  const [colorSaturation, setColorSaturation] = useState(100)
  const [colorBrightness, setColorBrightness] = useState(50)
  const formRef = useRef(form)
  const pendingImageUploadRef = useRef<Promise<void> | null>(null)
  const contentInputRef = useRef<HTMLDivElement | null>(null)
  const navigate = useNavigate()
  const { logout, username } = useAuth()
  const customPostsCount = allPosts.filter((post) => post.source === 'custom').length
  const defaultPostsCount = allPosts.length - customPostsCount
  const publishedCount = allPosts.filter((post) => post.published === true).length

  const allSEOItems = useMemo(() => {
    const items = [...pageSEO]
    allPosts.forEach(post => {
      const existing = items.find(item => item.id === `post-${post.id}`)
      if (!existing) {
        items.push({
          id: `post-${post.id}`,
          path: `/post/${post.slug}`,
          title: post.title,
          description: post.excerpt,
          canonicalUrl: `https://mca.exposed/post/${post.slug}`,
          type: 'post',
        })
      }
    })
    return items
  }, [pageSEO, allPosts])

  const selectedSEO = allSEOItems.find(item => item.id === selectedSEOId) || allSEOItems[0]

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

  const onInlineFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (!selectedFile) {
      return
    }

    setIsUploadingImage(true)

    const uploadTask = (async () => {
      try {
        const dataUrl = await readFileAsDataUrl(selectedFile)
        setInlineFileName(selectedFile.name)
        setInlineFileData(dataUrl)
        if (!inlineFileTitle.trim()) {
          setInlineFileTitle(selectedFile.name)
        }
        setMessage(`File "${selectedFile.name}" is ready to insert.`)
      } catch {
        setMessage('File upload failed. Please try another file.')
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

  const clearInlineFile = () => {
    setInlineFileName('')
    setInlineFileData('')
    setInlineFileTitle('')
    setMessage('File selection cleared.')
  }

  const stripHtml = (value: string) =>
    value.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim()

  const refreshPosts = async () => {
    const posts = await getAllPosts()
    setAllPosts(posts)
  }

  const refreshSubscribers = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/newsletter/subscribers')
      if (response.ok) {
        const subscribersData = await response.json()
        setSubscribers(subscribersData)
      }
    } catch (error) {
      console.error('Failed to fetch subscribers:', error)
    }
  }

  const refreshPageSEO = async () => {
    const seo = await getAllPageSEO()
    setPageSEO(seo)
  }

  useEffect(() => {
    void refreshPosts()
    void refreshSubscribers()
    void refreshPageSEO()
  }, [])

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

  const smartFormatEditorIfNeeded = () => {
    const input = contentInputRef.current
    if (!input) {
      return
    }

    const plainText = input.innerText.replace(/\u00a0/g, ' ').trim()
    if (!plainText || !shouldSmartFormatEditorHtml(input.innerHTML)) {
      syncContentFromEditor()
      return
    }

    const formattedHtml = smartFormatPlainText(plainText)
    if (!formattedHtml) {
      syncContentFromEditor()
      return
    }

    input.innerHTML = formattedHtml
    syncContentFromEditor()
  }

  const handleEditorPaste = (event: ClipboardEvent<HTMLDivElement>) => {
    const pastedText = event.clipboardData.getData('text/plain')
    if (!pastedText.trim()) {
      return
    }

    event.preventDefault()
    const formattedHtml = smartFormatPlainText(pastedText)
    document.execCommand('insertHTML', false, formattedHtml || escapeHtml(pastedText))
    syncContentFromEditor()
  }

  const focusEditor = () => {
    contentInputRef.current?.focus()
  }

  const runCommand = (command: string, value?: string) => {
    focusEditor()
    document.execCommand(command, false, value)
    syncContentFromEditor()
  }

  const handleFormatHeading = (tag: 'h1' | 'h2' | 'h3' | 'h4' | 'p') => {
    focusEditor()
    const selection = window.getSelection()
    
    if (!selection || selection.toString().length === 0) {
      setMessage(`Please select text before applying ${tag === 'p' ? 'Paragraph' : tag.toUpperCase()} formatting`)
      return
    }

    const selectedText = selection.toString()
    
    if (tag === 'p') {
      // Remove formatting from selected text
      document.execCommand('removeFormat', false, undefined)
    } else {
      // Create heading-styled HTML for selected text
      const headingStyles = {
        h1: 'font-size: 2em; font-weight: bold;',
        h2: 'font-size: 1.5em; font-weight: bold;',
        h3: 'font-size: 1.17em; font-weight: bold;',
        h4: 'font-size: 1em; font-weight: bold;',
      }
      
      const escapedText = selectedText
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
      
      const headingHTML = `<span style="${headingStyles[tag]}" data-heading-type="${tag}">${escapedText}</span>`
      
      // Use insertHTML which supports undo/redo
      document.execCommand('insertHTML', false, headingHTML)
    }
    
    syncContentFromEditor()
    contentInputRef.current?.focus()
    setMessage(`Applied ${tag === 'p' ? 'Paragraph' : tag.toUpperCase()} formatting to selected text only`)
  }

  const insertInlineDownloadLink = () => {
    if (!inlineFileData || !inlineFileName) {
      setMessage('Upload a file first, then insert it into content.')
      return
    }

    const title = inlineFileTitle.trim() || inlineFileName
    const encodedTitle = escapeHtml(title)
    const encodedFileName = escapeHtml(inlineFileName)
    const safeHref = inlineFileData.replace(/"/g, '&quot;')

    const linkHtml = `<p><a href="${safeHref}" download="${encodedFileName}" target="_blank" rel="noreferrer">${encodedTitle} ↓</a></p>`

    focusEditor()
    document.execCommand('insertHTML', false, linkHtml)
    syncContentFromEditor()

    setInlineFileName('')
    setInlineFileData('')
    setInlineFileTitle('')
    setMessage('Download link inserted into post content.')
  }

  const handleFormatContent = (
    action: 'bold' | 'italic' | 'heading' | 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'quote' | 'bullet' | 'number' | 'link' | 'color' | 'font' | 'fontSize'
  ) => {
    if (action === 'bold') {
      runCommand('bold')
      return
    }

    if (action === 'italic') {
      runCommand('italic')
      return
    }

    if (action === 'h1') {
      handleFormatHeading('h1')
      return
    }

    if (action === 'h2') {
      handleFormatHeading('h2')
      return
    }

    if (action === 'h3') {
      handleFormatHeading('h3')
      return
    }

    if (action === 'h4') {
      handleFormatHeading('h4')
      return
    }

    if (action === 'p') {
      handleFormatHeading('p')
      return
    }

    if (action === 'heading') {
      handleFormatHeading('h2')
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

    if (action === 'color') {
      setShowColorPicker(true)
      return
    }

    if (action === 'font') {
      setShowFontPicker(true)
      return
    }

    if (action === 'fontSize') {
      const size = window.prompt('Enter font size (1-7, where 1=8px, 3=16px, 5=32px)', '3')
      if (!size) {
        return
      }
      runCommand('fontSize', size)
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

  const handleApplyFont = (fontFamily: string) => {
    runCommand('fontName', fontFamily)
    setShowFontPicker(false)
    contentInputRef.current?.focus()
  }

  const handleApplyColor = (color: string) => {
    runCommand('foreColor', color)
    setSelectedColor(color)
    setShowColorPicker(false)
    contentInputRef.current?.focus()
  }

  const handleColorGradientClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const saturation = (x / rect.width) * 100
    const brightness = 100 - (y / rect.height) * 100

    setColorSaturation(saturation)
    setColorBrightness(brightness)

    const rgb = hslToRgb(colorHue, saturation, brightness)
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b)
    setSelectedColor(hex)
  }

  const handleHueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hue = parseFloat(e.target.value)
    setColorHue(hue)

    const rgb = hslToRgb(hue, colorSaturation, colorBrightness)
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b)
    setSelectedColor(hex)
  }

  const handleColorHexInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hex = e.target.value
    // Allow typing without immediate validation, just update display
    setSelectedColor(hex)
  }

  const applyHexColor = (hexValue: string) => {
    let cleanHex = hexValue.trim().toUpperCase()
    
    // Remove # if present
    if (cleanHex.startsWith('#')) {
      cleanHex = cleanHex.slice(1)
    }
    
    // Convert 3-char hex to 6-char hex
    if (cleanHex.length === 3) {
      cleanHex = cleanHex
        .split('')
        .map((char) => char + char)
        .join('')
    }
    
    // Validate hex format
    if (!/^[0-9A-F]{6}$/.test(cleanHex)) {
      setMessage('Invalid hex code. Please use format: #RRGGBB or RRGGBB')
      return
    }
    
    const fullHex = '#' + cleanHex
    setSelectedColor(fullHex)
    
    const rgb = hexToRgb(fullHex)
    if (rgb) {
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
      setColorHue(hsl.h)
      setColorSaturation(hsl.s)
      setColorBrightness(hsl.l)
    }
    
    setMessage(`Color updated: ${fullHex}`)
  }

  const waitForPendingImageUpload = async () => {
    if (!pendingImageUploadRef.current) {
      return
    }

    setMessage('Finishing image upload before saving...')
    await pendingImageUploadRef.current
  }

  const getSanitizedFormPayload = (source: FormState): FormState => {
    const normalizedContent = normalizeContentForStorage(source.content)

    return {
      title: source.title,
      excerpt: source.excerpt,
      content: normalizedContent,
      category: source.category,
      date: source.date,
      readTime: source.readTime,
      image: source.image,
      contentImage: source.contentImage,
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
      const updatedPost = await updatePost(editingId, payload)
      if (!updatedPost) {
        setMessage('Post update failed. Please make sure the local posts server is running.')
        return
      }
      setMessage('Post updated successfully!')
      setEditingId(null)
    } else {
      const createdPost = await addCustomPost(payload)
      if (!createdPost) {
        setMessage('Post save failed. Please make sure the local posts server is running.')
        return
      }
      setNewPostId(createdPost.id)
      setMessage('Post saved successfully and added to the list!')
    }

    await refreshPosts()
    formRef.current = defaultForm
    setForm(defaultForm)
  }

  const startNewPost = () => {
    setEditingId(null)
    formRef.current = defaultForm
    setForm(defaultForm)
    setInlineFileTitle('')
    setInlineFileName('')
    setInlineFileData('')
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
    setInlineFileTitle('')
    setInlineFileName('')
    setInlineFileData('')
    setMessage('Editing selected post...')
  }

  const removePost = async (post: Post) => {
    const shouldDelete = window.confirm(`Delete "${post.title}"? This action cannot be undone.`)

    if (!shouldDelete) {
      return
    }

    if (post.source === 'default') {
      setMessage('Default records cannot be deleted.')
      return
    }

    const deleted = await deleteCustomPost(post.id)
    if (!deleted) {
      setMessage('Post delete failed. Please try again.')
      return
    }
    await refreshPosts()
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
    setInlineFileTitle('')
    setInlineFileName('')
    setInlineFileData('')
    setMessage('Edit canceled.')
  }

  const handlePublish = async (post: Post) => {
    const published = await publishPost(post.id)
    await refreshPosts()
    if (!published) {
      setMessage('Publish failed. Please save the post first and try again.')
      return
    }
    setMessage(`"${post.title}" is now live on the Records page!`)
  }

  const handleUnpublish = async (post: Post) => {
    const unpublished = await unpublishPost(post.id)
    if (!unpublished) {
      setMessage('Unpublish failed. Please try again.')
      return
    }
    await refreshPosts()
    setMessage(`"${post.title}" has been removed from the Records page.`)
  }

  const handleUpdatePageSEO = async (id: string, updates: Partial<PageSEO>) => {
    const updated = await updatePageSEO(id, updates)
    if (!updated) {
      setMessage('SEO update failed. Please try again.')
      return
    }
    await refreshPageSEO()
    setMessage(`SEO settings for ${id} updated successfully.`)
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
      const createdPost = await addCustomPost(payload)
      if (!createdPost) {
        setMessage('Publish failed. Please make sure the local posts server is running.')
        return
      }
      postId = createdPost.id
    } else {
      const updatedPost = await updatePost(editingId, payload)
      if (!updatedPost) {
        setMessage('Publish failed. Could not update post before publishing.')
        return
      }
      postId = updatedPost?.id ?? null
    }

    if (postId) {
      const published = await publishPost(postId)
      if (!published) {
        setMessage('Publish failed. Please save the post first and try again.')
        await refreshPosts()
        return
      }
      setMessage('Post published successfully and is now live!')
      setEditingId(null)
      formRef.current = defaultForm
      setForm(defaultForm)
      setInlineFileTitle('')
      setInlineFileName('')
      setInlineFileData('')
    }

    await refreshPosts()
  }

  return (
    <div className={styles.pageWrap}>
      <section className={styles.heroSection}>
        <div className={styles.contentContainer}>
          <div className={styles.tabButtons}>
            <button
              className={`${styles.tabBtn} ${activeSection === 'posts' ? styles.tabActive : ''}`}
              onClick={() => setActiveSection('posts')}
            >
              Post Dashboard
            </button>
            <button
              className={`${styles.tabBtn} ${activeSection === 'newsletter' ? styles.tabActive : ''}`}
              onClick={() => setActiveSection('newsletter')}
            >
              Newsletter
            </button>
            <button
              className={`${styles.tabBtn} ${activeSection === 'seo' ? styles.tabActive : ''}`}
              onClick={() => setActiveSection('seo')}
              style={{ display: 'none' }}
            >
              SEO Settings
            </button>
          </div>

          {activeSection === 'posts' && (
            <>
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
                      <div className={styles.titleInputWrapper}>
                        <input value={form.title} onChange={onChange('title')} />
                        <button
                          type="button"
                          className={styles.insertTitleBtn}
                          onClick={() => {
                            if (form.title && contentInputRef.current) {
                              const div = document.createElement('div')
                              const h1 = document.createElement('h1')
                              h1.textContent = form.title
                              div.appendChild(h1)
                              contentInputRef.current.innerHTML += div.innerHTML
                              syncContentFromEditor()
                              setMessage('Title inserted as H1 in content.')
                            }
                          }}
                          title="Insert title as H1 heading in content"
                        >
                          Insert as H1
                        </button>
                      </div>
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
                        <select className={styles.toolSelect} onChange={(e) => handleFormatContent(e.target.value as any)} defaultValue="p" title="Heading Style">
                          <option value="p">Paragraph</option>
                          <option value="h1">H1 - Title</option>
                          <option value="h2">H2 - Heading</option>
                          <option value="h3">H3 - Subheading</option>
                          <option value="h4">H4 - Minor Heading</option>
                        </select>
                        <button type="button" className={styles.toolBtn} onClick={() => handleFormatContent('bold')} title="Bold" aria-label="Bold">
                          <strong>B</strong>
                        </button>
                        <button type="button" className={styles.toolBtn} onClick={() => handleFormatContent('italic')} title="Italic" aria-label="Italic">
                          <em>I</em>
                        </button>
                      </div>

                      <div className={styles.toolDivider}></div>

                      <div className={styles.toolGroup} style={{ position: 'relative' }}>
                        <div style={{ position: 'relative' }}>
                          <button type="button" className={styles.toolBtn} onClick={() => setShowColorPicker(!showColorPicker)} title="Text Color" aria-label="Text Color">
                            <span
                              className={styles.colorIndicator}
                              style={{ backgroundColor: selectedColor }}
                            ></span>
                            🎨 Color
                          </button>
                          {showColorPicker && (
                            <div className={styles.modernColorPickerContainer}>
                              <div className={styles.modernColorPicker}>
                                {/* Gradient Selector */}
                                <div
                                  className={styles.colorGradient}
                                  style={{
                                    background: `linear-gradient(to right, rgb(255, 255, 255), hsl(${colorHue}, 100%, 50%))`,
                                  }}
                                  onClick={handleColorGradientClick}
                                >
                                  <div
                                    className={styles.colorSelector}
                                    style={{
                                      left: `${colorSaturation}%`,
                                      top: `${100 - colorBrightness}%`,
                                    }}
                                  />
                                </div>

                                {/* Hue Slider */}
                                <div className={styles.colorSliderContainer}>
                                  <input
                                    type="range"
                                    min="0"
                                    max="360"
                                    value={colorHue}
                                    onChange={handleHueChange}
                                    className={styles.hueSlider}
                                  />
                                </div>

                                {/* Controls Section */}
                                <div className={styles.colorControls}>
                                  <div className={styles.colorInputRow}>
                                    <label>
                                      Hex Code
                                      <div className={styles.hexInputWrapper}>
                                        <input
                                          type="text"
                                          value={selectedColor}
                                          onChange={handleColorHexInput}
                                          placeholder="#000000 or 000000"
                                          className={styles.hexInput}
                                          maxLength={7}
                                        />
                                        <button
                                          type="button"
                                          className={styles.applyHexBtn}
                                          onClick={() => applyHexColor(selectedColor)}
                                          title="Apply hex color"
                                        >
                                          ✓
                                        </button>
                                      </div>
                                    </label>
                                  </div>

                                  <div className={styles.colorPresetSection}>
                                    <p className={styles.presetLabel}>Quick Colors</p>
                                    <div className={styles.colorPresetGrid}>
                                      {['#000000', '#FFFFFF', '#39ff14', '#FF0000', '#0000FF', '#FFFF00', '#FFA500', '#800080'].map(
                                        (color) => (
                                          <button
                                            key={color}
                                            type="button"
                                            className={styles.presetColor}
                                            style={{ backgroundColor: color }}
                                            onClick={() => {
                                              const rgb = hexToRgb(color)
                                              if (rgb) {
                                                const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
                                                setColorHue(hsl.h)
                                                setColorSaturation(hsl.s)
                                                setColorBrightness(hsl.l)
                                              }
                                              setSelectedColor(color)
                                            }}
                                            title={`Select ${color}`}
                                          />
                                        ),
                                      )}
                                    </div>
                                  </div>

                                  <button
                                    type="button"
                                    className={styles.applyColorBtn}
                                    onClick={() => handleApplyColor(selectedColor)}
                                  >
                                    Apply Color
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        <div style={{ position: 'relative' }}>
                          <button type="button" className={styles.toolBtn} onClick={() => setShowFontPicker(!showFontPicker)} title="Font Family" aria-label="Font Family">
                            ✎ Font
                          </button>
                          {showFontPicker && (
                            <div className={styles.pickerDropdown} style={{ top: '100%', left: 0, marginTop: '0.4rem', zIndex: 1000 }}>
                              <div className={styles.fontPickerDropdown}>
                                <div className={styles.fontCategory}>
                                  <p className={styles.fontCategoryLabel}>Sans-Serif</p>
                                  {['Arial', 'Helvetica', 'Trebuchet MS', 'Verdana', 'Calibri', 'Segoe UI', 'Roboto', 'Source Sans Pro', 'Open Sans', 'Tahoma', 'Lucida Grande'].map((font) => (
                                    <button
                                      key={font}
                                      type="button"
                                      className={styles.fontOptionDropdown}
                                      style={{ fontFamily: font }}
                                      onClick={() => handleApplyFont(font)}
                                      title={`Select ${font}`}
                                    >
                                      {font}
                                    </button>
                                  ))}
                                </div>
                                <div className={styles.fontCategory}>
                                  <p className={styles.fontCategoryLabel}>Serif</p>
                                  {['Georgia', 'Times New Roman', 'Garamond', 'Cambria', 'Droid Serif', 'Palatino', 'Book Antiqua', 'Courier'].map((font) => (
                                    <button
                                      key={font}
                                      type="button"
                                      className={styles.fontOptionDropdown}
                                      style={{ fontFamily: font }}
                                      onClick={() => handleApplyFont(font)}
                                      title={`Select ${font}`}
                                    >
                                      {font}
                                    </button>
                                  ))}
                                </div>
                                <div className={styles.fontCategory}>
                                  <p className={styles.fontCategoryLabel}>Monospace</p>
                                  {['Courier New', 'Monaco', 'Consolas', 'Ubuntu Mono', 'Menlo', 'Inconsolata'].map((font) => (
                                    <button
                                      key={font}
                                      type="button"
                                      className={styles.fontOptionDropdown}
                                      style={{ fontFamily: font }}
                                      onClick={() => handleApplyFont(font)}
                                      title={`Select ${font}`}
                                    >
                                      {font}
                                    </button>
                                  ))}
                                </div>
                                <div className={styles.fontCategory}>
                                  <p className={styles.fontCategoryLabel}>Script & Display</p>
                                  {['Comic Sans MS', 'Brush Script MT', 'Cursive', 'Lucida Calligraphy', 'Lucida Handwriting', 'Edwardian Script ITC'].map((font) => (
                                    <button
                                      key={font}
                                      type="button"
                                      className={styles.fontOptionDropdown}
                                      style={{ fontFamily: font }}
                                      onClick={() => handleApplyFont(font)}
                                      title={`Select ${font}`}
                                    >
                                      {font}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        <button type="button" className={styles.toolBtn} onClick={() => handleFormatContent('fontSize')} title="Font Size" aria-label="Font Size">
                          A+ Size
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
                          " "
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
                      onPaste={handleEditorPaste}
                      onBlur={smartFormatEditorIfNeeded}
                      onClick={() => contentInputRef.current?.focus()}
                      suppressContentEditableWarning
                    ></div>
                    <span className={styles.editorHint}>
                      Tip: Paste text to auto-format title, paragraphs, lists, and links.
                    </span>
                    <div className={styles.inlineFileTools}>
                      <h3>Insert Download File In Content</h3>
                      <div className={styles.inlineFileRow}>
                        <input
                          type="file"
                          onChange={onInlineFileChange}
                          aria-label="Choose file to insert in content"
                        />
                        <input
                          type="text"
                          value={inlineFileTitle}
                          onChange={(event) => setInlineFileTitle(event.target.value)}
                          placeholder="Download title shown in post"
                          aria-label="Download title"
                        />
                        <button
                          type="button"
                          className={styles.insertFileBtn}
                          onClick={insertInlineDownloadLink}
                        >
                          Insert File Link
                        </button>
                      </div>
                      {inlineFileName && (
                        <div className={styles.filePreview}>
                          <p className={styles.fileName}>📄 {inlineFileName}</p>
                          <button
                            type="button"
                            className={styles.clearFileBtn}
                            onClick={clearInlineFile}
                          >
                            Clear
                          </button>
                        </div>
                      )}
                    </div>
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
            </>
          )}

          {activeSection === 'newsletter' && (
            <>
              <div className={styles.dashboardHeader}>
                <h2>Newsletter Subscribers</h2>
                <p>Manage your newsletter subscribers and view subscription details.</p>
                <div className={styles.statsRow}>
                  <div className={styles.statChip}>
                    <span className={styles.statLabel}>Total Subscribers</span>
                    <strong>{subscribers.length}</strong>
                  </div>
                </div>
              </div>

              {subscribers.length === 0 ? (
                <p className={styles.emptyText}>No subscribers yet.</p>
              ) : (
                <div className={styles.savedList}>
                  {subscribers.map((subscriber) => (
                    <article key={subscriber.id} className={styles.savedItem}>
                      <div className={styles.savedContent}>
                        <h3>{subscriber.email}</h3>
                        <div className={styles.savedMeta}>
                          <span>Subscribed: {new Date(subscriber.subscribedAt).toLocaleDateString()}</span>
                          <span>Consent: {subscriber.consent ? 'Given' : 'Not given'}</span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </>
          )}

          {activeSection === 'seo' && (
            <>
              <div className={styles.dashboardHeader}>
                <h2>Page SEO Settings</h2>
                <p>Manage meta titles, descriptions, and canonical URLs for each page to improve search engine optimization.</p>
              </div>

              <div className={styles.seoForm}>
                <label>
                  Select Page/Post to Edit SEO
                  <select value={selectedSEOId} onChange={(e) => setSelectedSEOId(e.target.value)}>
                    {allSEOItems.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.type === 'page' ? item.id.charAt(0).toUpperCase() + item.id.slice(1) : item.title} ({item.path})
                      </option>
                    ))}
                  </select>
                </label>

                {selectedSEO && (
                  <form
                    className={styles.seoEditForm}
                    onSubmit={(e) => {
                      e.preventDefault()
                      const formData = new FormData(e.target as HTMLFormElement)
                      const updates = {
                        title: (formData.get('title') as string).trim(),
                        description: (formData.get('description') as string).trim(),
                        canonicalUrl: (formData.get('canonicalUrl') as string).trim(),
                      }
                      handleUpdatePageSEO(selectedSEO.id, updates)
                    }}
                  >
                    <label>
                      Meta Title
                      <input
                        name="title"
                        defaultValue={selectedSEO.title}
                        placeholder="Page title for search engines"
                      />
                    </label>
                    <label>
                      Meta Description
                      <textarea
                        name="description"
                        rows={3}
                        defaultValue={selectedSEO.description}
                        placeholder="Page description for search engines"
                      />
                    </label>
                    <label>
                      Canonical URL
                      <input
                        name="canonicalUrl"
                        defaultValue={selectedSEO.canonicalUrl}
                        placeholder="https://example.com/page"
                      />
                    </label>
                    <button type="submit">Update SEO</button>
                  </form>
                )}
              </div>
            </>
          )}
        </div>
      </section>

      <div className={styles.divider}></div>
      <FooterSection />
    </div>
  )
}

export default Dashboard
