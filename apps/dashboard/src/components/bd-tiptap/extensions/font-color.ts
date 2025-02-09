import type { GeneralOptions } from '@/types'
import { Extension } from '@tiptap/core'
import FontColorExtension from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import FontColorComponent from '../toolbar/font/FontColor.vue'
/**
 * Represents the interface for font size options, extending GeneralOptions.
 */
export interface FontColorOptions extends GeneralOptions<FontColorOptions> {}

export const FontColor = Extension.create<FontColorOptions>({
  name: 'fontColor',
  addOptions() {
    return {
      ...this.parent?.(),
      button: ({ editor }) => {
        return {
          component: FontColorComponent,
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
      FontColorExtension,
      Highlight.configure({ multicolor: true }),
    ]
  },
})
