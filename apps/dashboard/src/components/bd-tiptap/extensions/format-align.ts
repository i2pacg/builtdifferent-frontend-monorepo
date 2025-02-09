import { Extension } from '@tiptap/core'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import type { GeneralOptions } from '@/types'
import FormatAlignComponent from '../toolbar/format/FormatAlign.vue'
/**
 * Represents the interface for font size options, extending GeneralOptions.
 */
export interface FormatAlignOptions extends GeneralOptions<FormatAlignOptions> {}

export const FormatAlign = Extension.create<FormatAlignOptions>({
  name: 'formatAlign',
  addOptions() {
    return {
      ...this.parent?.(),
      button: ({ editor }) => {
        return {
          component: FormatAlignComponent,
          componentProps: {
            editor,
            hidden: ['subscript', 'superscript', 'strike'],
          },
        }
      },
    }
  },
  addExtensions() {
    return [
      TextAlign.configure({
        types: ['paragraph', 'heading', 'blockquote', 'listItem'],
        alignments: ['left', 'center', 'right', 'justify'],
      }),
    ]
  },
})
