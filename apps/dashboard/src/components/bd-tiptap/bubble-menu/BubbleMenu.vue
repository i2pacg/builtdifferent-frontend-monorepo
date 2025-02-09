<script setup lang="ts">
import type { NodeSelection } from '@tiptap/pm/state'
import type { Editor, Extension } from '@tiptap/vue-3'

import type { Props as TippyProps } from 'tippy.js'
import type { BubbleTypeMenu, NodeTypeKey } from '../extensions/bubble'
import { TextSelection } from '@tiptap/pm/state'
import { BubbleMenu } from '@tiptap/vue-3'
import { computed, reactive, unref } from 'vue'

interface Props {
  editor: Editor
}

const props = defineProps<Props>()
const menuOn = ref(false)

const tippyOptions = reactive<Partial<TippyProps>>({
  maxWidth: 'auto',
  zIndex: 1,
  appendTo: 'parent',
  onHidden: () => {
    console.log('Tippy hidden')
    menuOn.value = false
  },
  onShow: () => {
    console.log('Tippy shown')
    // get editor selection and highlight the text with color
    menuOn.value = true
  },
})

const nodeType = computed<NodeTypeKey | undefined>(() => {
  const selection = props.editor.state.selection as NodeSelection
  const isLink = isLinkSelection()

  const isImage = selection.node?.type.name === 'image'
  const isVideo = selection.node?.type.name === 'video'
  const isText = selection instanceof TextSelection

  if (isLink)
    return 'link'
  if (isImage)
    return 'image'
  if (isVideo)
    return 'video'
  if (isText)
    return 'text'
  return undefined
})

const nodeMenus = computed(() => {
  const { extensions = [] } = props.editor.extensionManager
  const find = extensions.find(k => k.name === 'bubble-extension') as Extension
  if (!find)
    return {}
  const { button } = find.options?.bubble ?? {}

  if (!button)
    return {}

  const _button: BubbleTypeMenu = button({
    editor: props.editor,
    extension: find,
  })

  return _button
})

const items = computed(() => {
  if (!nodeType.value)
    return []
  return unref(nodeMenus)?.[nodeType.value] ?? []
})

function isLinkSelection() {
  const { schema } = props.editor
  const linkType = schema.marks.link
  if (!linkType)
    return false

  return props.editor.isActive(linkType.name)
}
</script>

<template>
  <bubble-menu
    v-show="items.length > 0"
    id="bubble-menu"
    :update-delay="300"
    :editor="editor"
    :tippy-options="tippyOptions"
  >
    <v-sheet
      color="background-darken-1"
      class="pa-2"
      :elevation="6"
    >
      <v-toolbar
        density="compact"
        flat
        height="auto"
        color="transparent"
      >
        <template
          v-for="(item, key) in items"
          :key="key"
        >
          <!-- Divider -->
          <VDivider
            v-if="item.type === 'divider'"
            vertical
            class="mx-1 me-2"
          />
          <!-- Buttons -->
          <component
            :is="item.component"
            v-else
            v-bind="item.componentProps"
            :editor="editor"
          >
            <template
              v-for="(element, slotName, i) in item.componentSlots"
              :key="i"
              #[`${slotName}`]="values"
            >
              <component
                :is="element"
                v-bind="values?.props"
              />
            </template>
          </component>
        </template>
      </v-toolbar>
    </v-sheet>
  </bubble-menu>
</template>
