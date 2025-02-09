import type { GeneralOptions } from '@/types'
import type { ImageOptions as TiptapImageOptions } from '@tiptap/extension-image'

import type { Display, ImageAttrsOptions, ImageTab, ImageTabKey } from './components/image/types'
import { Image as TiptapImage } from '@tiptap/extension-image'
import { InputRule, mergeAttributes, VueNodeViewRenderer } from '@tiptap/vue-3'
import { IMAGE_SIZE } from '../constants/define'
import ImageView from './components/image/ImageView.vue'

/**
 * Represents the type for the upload function, which takes a File parameter and returns a Promise of type string.
 */
type Upload = (file: File) => Promise<string>

/**
 * Represents the interface for image options, extending TiptapImageOptions and GeneralOptions.
 */
export interface ImageOptions extends TiptapImageOptions, GeneralOptions<ImageOptions> {
  /** Function for uploading images */
  upload?: Upload
  /** image default width */
  width?: string | number
  /** image default display */
  display: Display
  /** List of image tabs */
  imageTabs: ImageTab[]
  /** List of hidden image tab keys */
  hiddenTabs: ImageTabKey[]
  /** Component for the image dialog */
  dialogComponent: any
}

/**
 * Represents the interface for options to set image attributes, extending ImageAttrsOptions and including the src property.
 */
interface SetImageAttrsOptions extends ImageAttrsOptions {
  /** The source URL of the image. */
  src: string
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    imageResize: {
      /**
       * Add an image
       */
      setImage: (options: Partial<SetImageAttrsOptions>) => ReturnType
      /**
       * Update an image
       */
      updateImage: (options: Partial<SetImageAttrsOptions>) => ReturnType
    }
  }
}

export const Image = /* @__PURE__ */ TiptapImage.extend<ImageOptions>({
  name: 'imageView',
  addAttributes() {
    return {
      ...this.parent?.(),
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      lockAspectRatio: {
        default: true,
      },
      width: {
        default: this.options.width,
      },
      height: {
        default: null,
      },
      display: {
        default: this.options.display,
        renderHTML: ({ display }) => {
          if (!display) {
            return {}
          }

          return {
            'data-display': display,
          }
        },
        parseHTML: (element) => {
          const display = element.getAttribute('data-display')
          return display || 'inline'
        },
      },
    }
  },
  content: 'inline*',

  parseHTML() {
    return [
      {
        tag: this.options.allowBase64
          ? 'img[src]'
          : 'img[src]:not([src^="data:"])',
        getAttrs: (node) => {
          if (!(node instanceof Element)) {
            return false
          }
          const src = node.getAttribute('src')
          return src ? { src } : false
        },
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'img',
      mergeAttributes(
        this.options.HTMLAttributes,
        HTMLAttributes,
      ),
    ]
  },
  addInputRules() {
    const parentInputRules = this.parent?.()
    if (!parentInputRules) {
      return []
    }

    /*    const getAttributes = (match: ExtendedRegExpMatchArray) => {
      const [, , alt, src, title] = match
      return { src, alt, title }
    } */

    return parentInputRules.map(
      rule =>
        new InputRule({
          find: rule.find,
          handler: (props) => {
            console.log('props', props)
            /*   const attributes = getAttributes(props.match);
            if (!this.options.isAllowedImgSrc(attributes.src)) {
              return;
            } */
            return rule.handler(props)
          },
        }),
    )
  },
  addNodeView() {
    return VueNodeViewRenderer(ImageView)
  },

  addCommands() {
    return {
      ...this.parent?.(),
      updateImage:
        options =>
          ({ commands }) => {
            console.log('updateImage', options)
            return commands.updateAttributes(this.name, options)
          },
    }
  },
  addOptions() {
    return {
      ...this.parent?.(),
      upload: undefined,
      width: IMAGE_SIZE['size-large'],
      display: 'inline',
      imageTabs: [],
      hiddenTabs: [],
      inline: true,
    }
  },
})
