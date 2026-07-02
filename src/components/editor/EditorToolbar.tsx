import { useCallback } from 'react'
import type { Editor } from '@tiptap/react'
import styles from './RichTextEditor.module.css'

type Props = {
  editor: Editor | null
}

const FONT_FAMILIES = [
  { label: 'Arial', value: 'Arial, Helvetica, sans-serif' },
  { label: 'Georgia', value: 'Georgia, "Times New Roman", serif' },
  { label: 'Times New Roman', value: '"Times New Roman", Times, serif' },
  { label: 'Verdana', value: 'Verdana, Geneva, sans-serif' },
  { label: 'Trebuchet MS', value: '"Trebuchet MS", Helvetica, sans-serif' },
  { label: 'Courier New', value: '"Courier New", Courier, monospace' },
]

const FONT_SIZES = [
  { label: 'Small', value: '0.85rem' },
  { label: 'Normal', value: '1rem' },
  { label: 'Large', value: '1.25rem' },
  { label: 'X-Large', value: '1.5rem' },
  { label: 'Huge', value: '2rem' },
]

const COLOR_SWATCHES = ['#000000', '#39ff14', '#e11d48', '#2563eb', '#f59e0b', '#7c3aed']

// Sentinel option value that means "remove this styling" rather than apply one.
const CLEAR = '__clear__'

export const EditorToolbar = ({ editor }: Props) => {
  const applyBlockStyle = useCallback(
    (value: string) => {
      if (!editor || !value) return

      if (value === 'paragraph') {
        editor.chain().focus().setParagraph().run()
        return
      }

      const level = Number(value.replace('h', '')) as 1 | 2 | 3 | 4
      const { selection, doc } = editor.state
      const { from, to, empty, $from, $to } = selection
      const wholeBlock =
        $from.parentOffset === 0 && $to.parentOffset === $to.parent.content.size

      // No selection, the whole line is selected, or the selection spans several
      // blocks → convert the block(s), which is the natural whole-line behavior.
      if (empty || wholeBlock || !$from.sameParent($to)) {
        editor.chain().focus().toggleHeading({ level }).run()
        return
      }

      // Partial selection inside one paragraph: a heading is a block element, so
      // to affect ONLY the selected words we split them out into their own
      // heading block (the paragraph splits around it). Inline marks aren't
      // carried into the heading — headings are plain by design.
      const text = doc.textBetween(from, to)
      editor
        .chain()
        .focus()
        .insertContentAt(
          { from, to },
          { type: 'heading', attrs: { level }, content: text ? [{ type: 'text', text }] : [] },
        )
        .run()
    },
    [editor],
  )

  const setLink = useCallback(() => {
    if (!editor) return
    const previous = editor.getAttributes('link').href as string | undefined
    const url = window.prompt('Link URL', previous ?? 'https://')
    if (url === null) return // cancelled
    if (url.trim() === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url.trim() }).run()
  }, [editor])

  if (!editor) {
    // Editor mounts on the client; render a stable placeholder bar meanwhile.
    return <div className={styles.toolbar} aria-hidden="true" />
  }

  return (
    <div className={styles.toolbar} role="toolbar" aria-label="Formatting">
      <select
        className={styles.select}
        value=""
        onChange={(e) => applyBlockStyle(e.target.value)}
        title="Heading style"
        aria-label="Heading style"
      >
        <option value="">Select heading</option>
        <option value="paragraph">Paragraph</option>
        <option value="h1">Heading 1</option>
        <option value="h2">Heading 2</option>
        <option value="h3">Heading 3</option>
        <option value="h4">Heading 4</option>
      </select>

      <span className={styles.divider} />

      <button
        type="button"
        className={editor.isActive('bold') ? styles.btnActive : styles.btn}
        onClick={() => editor.chain().focus().toggleBold().run()}
        title="Bold"
        aria-pressed={editor.isActive('bold')}
      >
        <strong>B</strong>
      </button>
      <button
        type="button"
        className={editor.isActive('italic') ? styles.btnActive : styles.btn}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        title="Italic"
        aria-pressed={editor.isActive('italic')}
      >
        <em>I</em>
      </button>

      <span className={styles.divider} />

      <button
        type="button"
        className={editor.isActive('bulletList') ? styles.btnActive : styles.btn}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        title="Bullet list"
        aria-pressed={editor.isActive('bulletList')}
      >
        • List
      </button>
      <button
        type="button"
        className={editor.isActive('orderedList') ? styles.btnActive : styles.btn}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        title="Numbered list"
        aria-pressed={editor.isActive('orderedList')}
      >
        1. List
      </button>
      <button
        type="button"
        className={editor.isActive('blockquote') ? styles.btnActive : styles.btn}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        title="Quote"
        aria-pressed={editor.isActive('blockquote')}
      >
        &ldquo; &rdquo;
      </button>
      <button
        type="button"
        className={editor.isActive('link') ? styles.btnActive : styles.btn}
        onClick={setLink}
        title="Link"
        aria-pressed={editor.isActive('link')}
      >
        Link
      </button>

      <span className={styles.divider} />

      <select
        className={styles.select}
        value=""
        onChange={(e) => {
          const value = e.target.value
          if (value === CLEAR) editor.chain().focus().unsetFontFamily().run()
          else if (value) editor.chain().focus().setFontFamily(value).run()
        }}
        title="Font family"
        aria-label="Font family"
      >
        <option value="">Select font family</option>
        {FONT_FAMILIES.map((f) => (
          <option key={f.label} value={f.value} style={{ fontFamily: f.value }}>
            {f.label}
          </option>
        ))}
        <option value={CLEAR}>Remove font</option>
      </select>

      <select
        className={styles.select}
        value=""
        onChange={(e) => {
          const value = e.target.value
          if (value === CLEAR) editor.chain().focus().unsetFontSize().run()
          else if (value) editor.chain().focus().setFontSize(value).run()
        }}
        title="Font size"
        aria-label="Font size"
      >
        <option value="">Select size</option>
        {FONT_SIZES.map((s) => (
          <option key={s.label} value={s.value}>
            {s.label}
          </option>
        ))}
        <option value={CLEAR}>Reset size</option>
      </select>

      <span className={styles.divider} />

      <label className={styles.colorControl} title="Text color">
        <input
          type="color"
          className={styles.colorInput}
          value={(editor.getAttributes('textStyle').color as string) ?? '#000000'}
          // onInput fires live as the user drags; the selection is preserved by
          // Tiptap's state, so re-focusing here reapplies to the right range.
          onInput={(e) =>
            editor.chain().focus().setColor((e.target as HTMLInputElement).value).run()
          }
        />
        <span className={styles.colorLabel}>Color</span>
      </label>
      <div className={styles.swatches}>
        {COLOR_SWATCHES.map((c) => (
          <button
            key={c}
            type="button"
            className={styles.swatch}
            style={{ backgroundColor: c }}
            onClick={() => editor.chain().focus().setColor(c).run()}
            title={c}
            aria-label={`Set color ${c}`}
          />
        ))}
        <button
          type="button"
          className={styles.btn}
          onClick={() => editor.chain().focus().unsetColor().run()}
          title="Clear color"
        >
          Clear
        </button>
      </div>
    </div>
  )
}
