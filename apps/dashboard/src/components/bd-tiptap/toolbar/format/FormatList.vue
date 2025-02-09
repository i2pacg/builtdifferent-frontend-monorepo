<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'

defineProps<{
  editor: Editor
}>()
</script>

<!-- function formatBulletList() {
    if (props.blockType !== 'bullet')
      props.editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
    else
      props.editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)
  } -->
<template>
  <v-btn
    aria-label="Format Bulleted List"
    :active="editor.isActive('bulletList')"
    :height="24"
    variant="text"
    size="x-small"
    tile
    :color="editor.isActive('bulletList') ? 'primary' : ''"
    @click="() => {
      editor.chain().focus().toggleBulletList().run()
    }"
  >
    <v-icon icon="$mdi-format-list-bulleted" :size="20" />
  </v-btn>
  <v-btn
    :active="editor.isActive('orderedList')"
    :height="24"
    variant="text"
    size="x-small"
    tile
    :color="editor.isActive('orderedList') ? 'primary' : ''"
    @click="editor.chain().focus().toggleOrderedList().run()"
  >
    <v-icon icon="$mdi-format-list-numbered" :size="20" />
  </v-btn>
</template>
