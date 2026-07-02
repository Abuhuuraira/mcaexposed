import StarterKit from '@tiptap/starter-kit'
import { TextStyle, Color, FontFamily, FontSize } from '@tiptap/extension-text-style'
import type { Extensions } from '@tiptap/core'

// A single source of truth for the editor's document schema.
//
// The set of nodes/marks here is deliberately kept in lockstep with what the
// sanitizer (`sanitizeContentHtml`) allows and what `PostDetail` renders. If you
// enable a new node/mark, allow its tag/attributes in the sanitizer too, or it
// will be silently stripped on save/render.
//
// StarterKit (v3) already bundles Bold, Italic, Paragraph, Heading, Lists,
// Blockquote, HardBreak, history (undo/redo) AND Link. We only add the
// text-style marks (color / font-family / font-size) on top, because those are
// the modern, semantic replacement for the old <font> tags execCommand emitted.
export const editorExtensions: Extensions = [
  StarterKit.configure({
    // Match the toolbar (H1–H4) and the sanitizer allow-list.
    heading: { levels: [1, 2, 3, 4] },
    // Features we intentionally don't support (kept out of the HTML output so it
    // stays clean and matches the sanitizer).
    codeBlock: false,
    code: false,
    strike: false,
    underline: false,
    horizontalRule: false,
    // Configure the bundled Link mark instead of adding a second copy.
    link: {
      openOnClick: false,
      autolink: true,
      defaultProtocol: 'https',
      HTMLAttributes: { target: '_blank', rel: 'noreferrer' },
    },
  }),
  // TextStyle is the base mark; Color / FontFamily / FontSize all attach their
  // attributes to it and render as <span style="...">.
  TextStyle,
  Color,
  FontFamily,
  FontSize,
]
