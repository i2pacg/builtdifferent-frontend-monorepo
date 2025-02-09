<script setup lang="ts">
import type { TextContent } from '@i2pacg/builtdifferent-frontend-tsdata/models'
import type { Transaction } from '@tiptap/pm/state'
import { LOG_COMPONENTS_COLOR } from '@/constants'
import Placeholder from '@tiptap/extension-placeholder'
import StarterKit from '@tiptap/starter-kit'
import { Editor, EditorContent } from '@tiptap/vue-3'
import BubbleMenu from './bubble-menu/BubbleMenu.vue'
import { FontStyle, MediaControls, TextStyleExtension } from './extensions'
import { BubbleExtension } from './extensions/bubble-extension'
import { FontColor } from './extensions/font-color'
import { FontFamily } from './extensions/font-family'
import { FormatAlign } from './extensions/format-align'
import { IndentExtension } from './extensions/indent'
import { LocaleManagerExtension } from './extensions/locale'
import { BlockStyles, TextFormats } from './extensions/text-styles'
import { EditorToolbar } from './toolbar'
import { isValidUrl } from './utils/utils'

const props = defineProps<{
  locale?: null | string
  defaultLocale?: string
  supportedLocales?: string[]
}>()

const model = defineModel<TextContent>()

// Create editor
const editor = new Editor({
  autofocus: false,
  editorProps: {
    attributes: {
      class: 'fill-height  focus:outline-none',
    },
  },

  onSelectionUpdate({ editor }) {
    // Validate links in the current selection
    const { doc, tr } = editor.state
    const markType = editor.schema.marks.link
    const updatedTransaction: Transaction = tr
    let hasChanges = false

    // Traverse the entire document
    doc.descendants((node, pos) => {
      if (node.marks) {
        node.marks.forEach((mark) => {
          if (mark.type === markType) {
            const href = mark.attrs.href as string

            if (!href || !isValidUrl(href)) {
              console.log('Removing invalid link mark:', href)
              updatedTransaction.removeMark(pos, pos + node.nodeSize, markType)
              hasChanges = true
            }
          }
        })
      }
    })

    // Dispatch the transaction if any changes were made
    if (hasChanges) {
      editor.view.dispatch(updatedTransaction)
    }
  },
  extensions: [
    StarterKit.configure({}),
    BubbleExtension.configure(/* {
      placeholder: {
        placeholder: 'Placeholder...',
      },

    } */),
    FontStyle,
    /*  */
    IndentExtension,
    TextStyleExtension,
    FontFamily,
    FontColor,
    FormatAlign,
    ...BlockStyles.map(v => v.configure({ types: ['listItem', 'heading', 'paragraph'] })),
    ...TextFormats,
    MediaControls.configure({}),
    LocaleManagerExtension.configure({
      defaultLocale: props.defaultLocale ?? 'en',
      supportedLocales: props.supportedLocales ?? ['en'],
      onChange: (locale: { previousLanguage: string | number, currentLanguage: string | number }) => {
        // Save current content before switching
        console.log(`%c[BdTipTapEditor] %c[onChange] %cCurrentLocale${editor.storage.localeManager.currentLocale} locale`, LOG_COMPONENTS_COLOR, 'color: #FFD700;', 'color: white;', locale)

        if (editor.getHTML()) {
          model.value!.content[locale.previousLanguage] = editor.getHTML()
        }

        // Load content for new locale
        nextTick(() => {
          editor.commands.setContent(model.value!.content[locale.currentLanguage] ?? '')
        })
      },
      onTranslationUpdate: (locale: string | number, content: string) => {
        console.log(`Translation updated for ${locale}: ${content ? 'Has content' : 'Empty'}`)
        model.value!.content[locale] = content ?? ''
      },
    }),
    Placeholder.configure({
      emptyEditorClass: 'placeholder',
      emptyNodeClass: 'placeholder',
      placeholder: 'Type something...',
    }),
  ],
  onUpdate: () => {
    console.log('%c[BdTipTapEditor] %c[onUpdate]', LOG_COMPONENTS_COLOR, 'color: white;')
    const currentLocale = editor.storage.localeManager.currentLocale
    const currentContent = editor.getHTML()
    editor.commands.updateTranslation(currentLocale, currentContent)
    // Update model when content changes
    /*  const currentLocale = editor.storage.localeManager.currentLocale */
    /*   console.log('currentLocale onUpdate', currentLocale)
    model.value.content[currentLocale] = editor.getHTML() */
    /* model.value = new TextContent({
      ...model.value,
      translations: {
        ...model.value?.translations,
        [currentLocale]: editor.getHTML(),
      },
    }) */
  },
})

// Watch for external model changes
watch(() => model.value, (newValue) => {
  console.log('%c[BdTipTapEditor] %c[watch] %cmodel', LOG_COMPONENTS_COLOR, 'color: #FFD700;', 'color: white;', newValue)
  const currentLocale = editor.storage.localeManager.currentLocale
  const newContent = newValue?.content?.[currentLocale] ?? ''

  if (newContent !== editor.getHTML()) {
    editor.commands.setContent(newContent)
  }
}, { deep: true })

onMounted(() => {
  console.log('%c[BdTipTapEditor] %c[onMounted] %cmodel', LOG_COMPONENTS_COLOR, 'color: white;', model)
  // Set initial content
  const currentLocale = editor.storage.localeManager.currentLocale
  console.log('currentLocale', currentLocale)
  editor.commands.setTranslations(model.value!.content)
  editor.commands.setContent(model.value?.content?.[currentLocale] ?? '')
})
const isSingleLine = ref(false)
</script>

<template>
  <editor-toolbar
    v-if="editor"
    :editor="editor"
    :single-line="isSingleLine"
  />
  <bubble-menu
    v-if="editor"
    :editor="editor"
  />
  <editor-content
    v-if="editor"
    :editor="editor"
    class="bg-background-lighten-1 elevation-1"
    style="min-height: 10em;"
  />
</template>
