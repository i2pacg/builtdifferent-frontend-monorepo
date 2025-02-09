import type { GeneralOptions } from '@/types'
import type { EditorView } from '@tiptap/pm/view'

import { Extension, getMarkRange } from '@tiptap/core'

import { Link } from '@tiptap/extension-link'
import { Plugin, TextSelection } from '@tiptap/pm/state'

import { MediaControls as MediaControlsComponent } from '../toolbar/media'
import { Image } from './image'
/**
 * Represents the interface for font size options, extending GeneralOptions.
 */
export interface MediaControlsOptions extends GeneralOptions<MediaControlsOptions> {}

export const MediaControls = Extension.create<MediaControlsOptions>({
  name: 'mediaControls',
  addOptions() {
    return {
      ...this.parent?.(),
      button: ({ editor }) => {
        return {
          component: MediaControlsComponent,
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
      Image.configure({
        inline: true,
      }),
      Link.configure({
        openOnClick: false,
      }),
    ]
  },
  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          handleClick(view: EditorView, pos: number) {
            const { schema, doc, tr } = view.state

            const range = getMarkRange(doc.resolve(pos), schema.marks.link)

            if (!range)
              return false

            const $start = doc.resolve(range.from)
            const $end = doc.resolve(range.to)

            const transaction = tr.setSelection(new TextSelection($start, $end))

            view.dispatch(transaction)
            return true
          },
        },
      }),
    ]
  },
})

/**
 * Represents the interface for link options, extending TiptapLinkOptions and GeneralOptions.
 */

/*   addOptions() {
    return {
      ...this.parent?.(),
      openOnClick: false,
      button: ({ editor, extension }) => {
        return {
          component: LinkActionButton,
          componentProps: {
            inBubble: true,
          },
        }
      },
    }
  }, */
/*
  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          handleClick(view: EditorView, pos: number) {
            const { schema, doc, tr } = view.state

            const range = getMarkRange(doc.resolve(pos), schema.marks.link)

            if (!range)
              return false

            const $start = doc.resolve(range.from)
            const $end = doc.resolve(range.to)

            const transaction = tr.setSelection(new TextSelection($start, $end))

            view.dispatch(transaction)
            return true
          },
        },
      }),
    ]
  },
})
 */
