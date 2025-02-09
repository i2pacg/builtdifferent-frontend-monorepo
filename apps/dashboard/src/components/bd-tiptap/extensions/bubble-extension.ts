// StarterKit
import type { AnyExtension } from '@tiptap/core'
import type { CharacterCountOptions } from '@tiptap/extension-character-count'
import type { DropcursorOptions } from '@tiptap/extension-dropcursor'
import type { FocusOptions } from '@tiptap/extension-focus'
import type { HardBreakOptions } from '@tiptap/extension-hard-break'
import type { ListItemOptions } from '@tiptap/extension-list-item'
import type { ParagraphOptions } from '@tiptap/extension-paragraph'
import type { PlaceholderOptions } from '@tiptap/extension-placeholder'
import type { TextStyleOptions } from '@tiptap/extension-text-style'
import { Extension } from '@tiptap/core'
import { CharacterCount } from '@tiptap/extension-character-count'
import { Document } from '@tiptap/extension-document'
import { Dropcursor } from '@tiptap/extension-dropcursor'
import Focus from '@tiptap/extension-focus'
import { Gapcursor } from '@tiptap/extension-gapcursor'
import { HardBreak } from '@tiptap/extension-hard-break'
import { ListItem } from '@tiptap/extension-list-item'
import { Paragraph } from '@tiptap/extension-paragraph'
import { Placeholder } from '@tiptap/extension-placeholder'

import { Text } from '@tiptap/extension-text'
import { TextStyle } from '@tiptap/extension-text-style'
import { NODE_TYPE_MENU } from '../constants/define'
import { type BubbleOptions, defaultBubbleList, generateBubbleTypeMenu } from './bubble'
/**
 * Represents the interface for options in the base toolkit.
 */
export interface BubbleExtensionOptions {
  hidden: string[]
  bubble: Partial<BubbleOptions<BubbleExtensionOptions>>
}

export const BubbleExtension = /* @__PURE__ */ Extension.create<BubbleExtensionOptions>({
  name: 'bubble-extension',
  addOptions() {
    return {
      ...this.parent?.(),
      bubble: {
        list: NODE_TYPE_MENU,
        defaultBubbleList,
        button: ({ editor, extension }) => {
          const { list = {}, defaultBubbleList } = extension.options?.bubble ?? {}
          const defaultList = defaultBubbleList?.(editor) ?? []
          return generateBubbleTypeMenu(list, defaultList, { editor, extension })
        },
      },
    }
  },
})
