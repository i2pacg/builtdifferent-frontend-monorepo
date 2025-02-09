<script setup lang="ts">
import type { Level } from '@tiptap/extension-heading'
import type { Editor } from '@tiptap/vue-3'

const props = defineProps<{
  editor: Editor
}>()
interface FormatStyle {
  key: string
  name: string
  icon: string
  method: (props: { editor: Editor }) => void
}
function mapHeadingToFormatStyle(level: Level): FormatStyle {
  return {
    key: `heading${level}`,
    name: `Heading ${level}`,
    icon: `$mdi-format-header-${level}`,
    method: ({ editor }: { editor: Editor }) => {
      editor.chain().focus().toggleHeading({ level }).run()
    },
  }
}
const headingLevels: Level[] = [1, 2, 3]
const styles: Record<string, FormatStyle> = {
  paragraph: {
    key: 'paragraph',
    name: 'Paragraph',
    icon: '$mdi-format-paragraph',
    method: ({ editor }: { editor: Editor }) => {
      editor.chain().focus().setParagraph().run()
    },
  },
  ...headingLevels.map<FormatStyle>(mapHeadingToFormatStyle).reduce((acc: Record<string, FormatStyle>, style) => {
    acc[style.key] = style
    return acc
  }, {}),
}
const currentStyle = computed(() => {
  const heading = props.editor.getAttributes('heading')?.level
  if (props.editor.isActive('paragraph'))
    return 'paragraph'
  if (heading)
    return `heading${heading}`
  return 'paragraph'
})
</script>

<template>
  <v-select
    :items="Object.keys(styles)"
    :model-value="currentStyle"
    variant="outlined"
    label="Style"
    hide-details
    density="compact"
    class="flex-grow-0"
    :list-props="{
      density: 'compact',
      bgColor: 'background darken-2',
      class: 'compactor',
    }"
    :menu-props="{
      class: 'pa-0',
    }"
    tile
    menu-icon="$mdi-chevron-down"
    min-width="150"
    :item-props="item => ({
      title: styles[item].name,
    })"
    @update:model-value="(v) => {
      console.log(v)
      styles[v as keyof typeof styles].method({ editor: props.editor })
      /* styles[v as keyof typeof styles].method({ editor: props.editor }) */
    }"
  >
    <template #item="{ item }">
      <v-list-item
        :disabled="item.value === currentStyle"
        :prepend-icon="styles[item.value].icon"
        :title="styles[item.value].name"
        @click="styles[item.value].method({ editor: props.editor })"
      />
    </template>
  </v-select>
</template>
