import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import { editorExtensions } from './editorExtensions'
import { EditorToolbar } from './EditorToolbar'
import styles from './RichTextEditor.module.css'

export type RichTextEditorHandle = {
  /** Insert HTML at the current cursor position (used for inline download links / title). */
  insertHTML: (html: string) => void
  focus: () => void
}

type Props = {
  value: string
  onChange: (html: string) => void
  ariaLabel?: string
}

/**
 * Uncontrolled-at-the-DOM, controlled-at-the-model rich text editor.
 *
 * Tiptap owns a ProseMirror document; React never writes into the editable DOM
 * on every keystroke. `onChange` reports the serialized HTML out, and we only
 * push `value` back IN when it diverges from what the editor already holds
 * (e.g. loading a different post to edit). That one rule is what removes the
 * cursor-jumping / content-reset feedback loop of the old contentEditable.
 */
export const RichTextEditor = forwardRef<RichTextEditorHandle, Props>(
  ({ value, onChange, ariaLabel = 'Post content editor' }, ref) => {
    // Keep the latest onChange without recreating the editor (which would remount
    // ProseMirror and drop the selection).
    const onChangeRef = useRef(onChange)
    onChangeRef.current = onChange

    const editor = useEditor(
      {
        extensions: editorExtensions,
        content: value,
        // Required for SSR / prerender safety: don't render during the first
        // (server) pass, only after mount on the client.
        immediatelyRender: false,
        editorProps: {
          attributes: {
            class: styles.content,
            role: 'textbox',
            'aria-multiline': 'true',
            'aria-label': ariaLabel,
          },
        },
        onUpdate: ({ editor }) => {
          onChangeRef.current(editor.getHTML())
        },
      },
      [], // create once
    )

    // Sync external value → editor without clobbering the caret while typing.
    useEffect(() => {
      if (!editor) return
      const incoming = value || ''
      if (incoming === editor.getHTML()) return
      editor.commands.setContent(incoming, { emitUpdate: false })
    }, [value, editor])

    useImperativeHandle(
      ref,
      () => ({
        insertHTML: (html: string) => {
          editor?.chain().focus().insertContent(html).run()
        },
        focus: () => {
          editor?.chain().focus().run()
        },
      }),
      [editor],
    )

    return (
      <div className={styles.editor}>
        <EditorToolbar editor={editor} />
        <EditorContent editor={editor} className={styles.surface} />
      </div>
    )
  },
)

RichTextEditor.displayName = 'RichTextEditor'
