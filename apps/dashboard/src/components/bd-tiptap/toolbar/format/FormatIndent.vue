<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'

defineProps<{
  editor: Editor
}>()
</script>

<template>
  <v-btn
    aria-label="Decrease Indent"
    :height="24"
    variant="text"
    size="x-small"
    tile
    @click="() => {
      editor.chain().focus().outdent().run()
    }"
  >
    <v-icon
      icon="$mdi-format-indent-decrease"
      :size="20"
    />
  </v-btn>
  <v-btn
    aria-label="Increase Indent"
    :height="24"
    variant="text"
    size="x-small"
    tile

    @click="() => {
      editor.chain().focus().indent().run()
    }"
  >
    <v-icon
      icon="$mdi-format-indent-increase"
      :size="20"
    />
  </v-btn>
</template>
