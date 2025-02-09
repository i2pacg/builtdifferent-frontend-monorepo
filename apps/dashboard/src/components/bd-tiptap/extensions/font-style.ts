import type { GeneralOptions } from '@/types'
import { Extension } from '@tiptap/core'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import Underline from '@tiptap/extension-underline'
import FontStyleComponent from '../toolbar/font/FontStyle.vue'
/**
 * Represents the interface for font size options, extending GeneralOptions.
 */
export interface FontStyleOptions extends GeneralOptions<FontStyleOptions> {}

export const FontStyle = Extension.create<FontStyleOptions>({
  name: 'fontStyle',
  addOptions() {
    return {
      ...this.parent?.(),
      button: ({ editor }) => {
        return {
          component: FontStyleComponent,
          componentProps: {
            editor,
            inBubble: true,
            hidden: ['subscript', 'superscript', 'strike'],
          },
        }
      },
    }
  },
  addExtensions() {
    return [
      Underline,
      Subscript,
      Superscript,
    ]
  },
})
