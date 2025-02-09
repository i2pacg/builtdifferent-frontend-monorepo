<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'

interface FontStyleButtonProps {
  key: string
  text: string
  icon: string
  action: () => void
}
const props = withDefaults(defineProps<{
  editor: Editor
  inBubble?: boolean
  hidden?: FormatType[]
}>(), {
  hidden: () => ['subscript', 'superscript'],
})
const FORMAT_TYPES = ['bold', 'italic', 'underline', 'strike', 'subscript', 'superscript'] as const
type FormatType = typeof FORMAT_TYPES[number]
const buttons: Record<FormatType, FontStyleButtonProps> = {
  bold: {
    key: 'bold',
    icon: '$mdi-format-bold',
    text: 'Format Bold',
    action: () => props.editor.chain().focus().toggleBold().run(),
  },
  italic: {
    key: 'italic',
    icon: '$mdi-format-italic',
    text: 'Format Italic',
    action: () => props.editor.chain().focus().toggleItalic().run(),
  },
  underline: {
    key: 'underline',
    icon: '$mdi-format-underline',
    text: 'Format Underline',
    action: () => props.editor.chain().focus().toggleUnderline().run(),
  },
  strike: {
    key: 'strike',
    icon: '$mdi-format-strikethrough',
    text: 'Format Strikethrough',
    action: () => props.editor.chain().focus().toggleStrike().run(),
  },
  subscript: {
    key: 'subscript',
    icon: '$mdi-format-subscript',
    text: 'Format Subscript',
    action: () => props.editor.chain().focus().toggleSubscript().run(),
  },
  superscript: {
    key: 'superscript',
    icon: '$mdi-format-superscript',
    text: 'Format Superscript',
    action: () => props.editor.chain().focus().toggleSuperscript().run(),
  },
}
</script>

<template>
  <template
    v-if="!(inBubble && editor.isActive('link'))"
  >
    <v-btn
      v-for="(button, key) in FORMAT_TYPES
        .filter(k2 => !props.hidden?.includes(k2 as keyof typeof buttons))
        .map(key => buttons[key])
      "
      :key="key"
      :aria-label="button.text"
      :title="button.text"
      :active="editor.isActive(button.key)"
      :height="24"
      variant="text"
      size="x-small"
      tile
      :color="editor.isActive(button.key) ? 'primary' : ''"
      @click="button.action"
    >
      <v-icon
        :icon="button.icon"
        :size="20"
      />
    </v-btn>
  </template>
  <!--  <v-menu
    v-else
    :close-on-content-click="false"
    attach="#bubble-menu"
  >
    <template #activator="{ props: menu }">
      <v-btn
        :height="32"
        variant="text"
        aria-label="Format Style"
        title="Format Style"
        size="x-small"
        tile
        v-bind="menu"
      >
        <v-icon
          size="18px"
          icon="$mdi-format-font"
        />
      </v-btn>
    </template>
    <div />
  </v-menu> -->
  <!-- <v-btn
    :height="32"
    variant="text"
    aria-label="Text Formatting"
    title="Text Formatting"
    size="x-small"
    tile
    @click="toggleDropdown"
  >
    <v-icon
      icon="mdi-format-font"
      size="18px"
    />
  </v-btn> -->
</template>
