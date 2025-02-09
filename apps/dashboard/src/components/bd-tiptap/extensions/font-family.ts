import type { FontFamilyOptions as TiptapFontFamilyOptions } from '@tiptap/extension-font-family'
import { Extension } from '@tiptap/core'

import { FontFamily as TiptapFontFamily } from '@tiptap/extension-font-family'
import type { GeneralOptions } from '@/types'
import FontFamilyComponent from '../toolbar/font/FontFamily.vue'
/**
 * Represents the interface for font size options, extending GeneralOptions.
 */
export interface FontFamilyOptions extends TiptapFontFamilyOptions, GeneralOptions<FontFamilyOptions> {}

export const FontFamily = TiptapFontFamily.extend<FontFamilyOptions>({
  name: 'fontFamily',
  addOptions() {
    return {
      ...this.parent?.(),
      button: ({ editor }) => {
        return {
          component: FontFamilyComponent,
          componentProps: {
            editor,
            inBubble: true,
          },
        }
      },
    }
  },
  addExtensions() {
    return [

    ]
  },
})
