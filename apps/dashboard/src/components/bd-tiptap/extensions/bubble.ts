import type { ButtonViewParams, ButtonViewReturn, ExtensionNameKeys } from '@/types/bd-tip-tap'

import type { Editor } from '@tiptap/vue-3'
import type { Display } from './components/image/types'
/** Represents the floating types for bubble images */
type BubbleImageFloatType = 'float-left' | 'float-none' | 'float-right'

/** Represents the size types for bubble images or videos */
type BubbleImageOrVideoSizeType = 'size-small' | 'size-medium' | 'size-large'

/** Represents the various types for bubble images */
type BubbleImageType =
  | BubbleImageFloatType
  | `image-${BubbleImageOrVideoSizeType}`
  | `video-${BubbleImageOrVideoSizeType}`
  | 'image'
  | 'image-aspect-ratio'
  | 'unlink'
  | 'link-open'
  | 'remove'

/** Represents the types for bubble videos */
type BubbleVideoType = 'video' | 'remove'

/** Represents the overall types for bubbles */
type BubbleAllType = BubbleImageType | BubbleVideoType | ExtensionNameKeys | 'divider' | (string & {})

/** Represents the key types for node types */
export type NodeTypeKey = 'image' | 'text' | 'link' | 'video' | 'newLink'

/** Represents the menu of bubble types for each node type */
export type BubbleTypeMenu = Partial<Record<NodeTypeKey, BubbleMenuItem[]>>

/** Represents the menu of overall bubble types for each node type */
export type NodeTypeMenu = Partial<Record<NodeTypeKey, BubbleAllType[]>>

/**
 * Represents the structure of a bubble menu item.
 */
export interface BubbleMenuItem extends ButtonViewReturn {
  /** The type of the bubble item */
  type: BubbleAllType
}

/**
 * Represents a function to generate a bubble menu
 */
interface BubbleView<T = any> {
  /**
   * Generates a bubble menu based on the provided options.
   * @param {ButtonViewParams<T>} options - The options for generating the bubble menu.
   * @returns {BubbleTypeMenu} The generated bubble menu.
   */
  (options: ButtonViewParams<T>): BubbleTypeMenu
}

/**
 * Represents the options for configuring bubbles.
 * @interface BubbleOptions
 * @template T
 */
export interface BubbleOptions<T> {
  /** The menu of bubble types for each node type. */
  list: NodeTypeMenu
  /** The default list of bubble types. */
  /** The function to generate a bubble menu. */
  button: BubbleView<T>

  /** The default list of bubble types. */
  defaultBubbleList: typeof defaultBubbleList
}

/*

function imageSizeMenus(editor: Editor): BubbleMenuItem[] {
  const types: BubbleImageOrVideoSizeType[] = ['size-small', 'size-medium', 'size-large']
  const icons: NonNullable<ButtonViewReturn['componentProps']['icon']>[] = ['sizeS', 'sizeM', 'sizeL']

  return types.map((size, i) => ({
    type: `image-${size}`,
    component: ActionButton,
    componentProps: {
      tooltip: `editor.${size.replace('-', '.')}.tooltip`,
      icon: icons[i],
      action: () => editor.commands.updateImage({ width: IMAGE_SIZE[size], height: null }),
      isActive: () => editor.isActive('image', { width: IMAGE_SIZE[size] }),
    },
  }))
} */

/* function videoSizeMenus(editor: Editor): BubbleMenuItem[] {
  const types: BubbleImageOrVideoSizeType[] = ['size-small', 'size-medium', 'size-large']
  const icons: NonNullable<ButtonViewReturn['componentProps']['icon']>[] = ['sizeS', 'sizeM', 'sizeL']

  return types.map((size, i) => ({
    type: `video-${size}`,
    component: ActionButton,
    componentProps: {
      tooltip: `editor.${size.replace('-', '.')}.tooltip`,
      icon: icons[i],
      action: () => editor.commands.updateVideo({ width: VIDEO_SIZE[size] }),
      isActive: () => editor.isActive('video', { width: VIDEO_SIZE[size] }),
    },
  }))
} */
function imageFloatMenus(editor: Editor): BubbleMenuItem[] {
  const types: BubbleImageFloatType[] = ['float-left', 'float-none', 'float-right']
  const icons: NonNullable<ButtonViewReturn['componentProps']['icon']>[] = [
    'formatFloatLeft',
    'formatFloatNone',
    'formatFloatRight',
  ]
  const display: Display[] = ['left', 'inline', 'right']

  console.log('Image Float Menus', 'display', display, 'types', types, 'icons', icons, 'editor', editor)
  return []
  /* return types.map((float, i) => ({
    type: float,
    component: ActionButton,
    componentProps: {
      tooltip: `editor.image.${float.replace('-', '.')}.tooltip`,
      icon: icons[i],
      action: () => editor.commands.updateImage({ display: display[i] }),
      isActive: () => editor.isActive('image', { display: display[i] }),
    },
  })) */
}
export function defaultBubbleList(editor: Editor): BubbleMenuItem[] {
  return [
    ...imageFloatMenus(editor),
  ]
}

/**
 * Generate bubble menu
 * @template T
 * @param {NodeTypeMenu} list
 * @param {BubbleMenuItem[]} defaultList
 * @param {ButtonViewParams<T>} { editor, extension }
 * @return {*}  {BubbleTypeMenu}
 */
// eslint-disable-next-line unused-imports/no-unused-vars
export function generateBubbleTypeMenu<T = any>(list: NodeTypeMenu, defaultList: BubbleMenuItem[], { editor, extension }: ButtonViewParams<T>): BubbleTypeMenu {
  const { extensions = [] } = editor.extensionManager

  const items: BubbleTypeMenu = {}

  for (const node of Object.keys(list)) {
    const nodeType = list[node as NodeTypeKey]
    if (!nodeType)
      continue

    const _items: BubbleMenuItem[] = []

    for (const ext of nodeType) {
      if (ext === 'divider') {
        const lastItem = _items[_items.length - 1]
        if (lastItem?.type === 'divider')
          continue

        _items.push({
          type: 'divider',
          component: undefined,
          componentProps: {},
        })
        continue
      }

      const find = defaultList.find(k => k.type === ext)
      if (find) {
        _items.push({
          ...find,
          componentProps: {
            ...find.componentProps,
            tooltip: find.componentProps.tooltip ? 'AddLater' : undefined,
          },
          componentSlots: find.componentSlots,
        })
        continue
      }

      const findExt = extensions.find(k => k.name === ext)
      if (findExt) {
        const { button } = findExt.options as any
        if (!button)
          continue
        const _button: ButtonViewReturn = button({ editor, extension: findExt })

        _items.push({
          type: ext,
          component: _button.component,
          componentProps: _button.componentProps,
          componentSlots: _button.componentSlots,
        })
        continue
      }
    }

    const lastItem = _items[_items.length - 1]
    const fristItem = _items[0]

    if (lastItem?.type === 'divider')
      _items.pop()
    if (fristItem?.type === 'divider')
      _items.shift()

    items[node as NodeTypeKey] = _items
  }

  return items
}
