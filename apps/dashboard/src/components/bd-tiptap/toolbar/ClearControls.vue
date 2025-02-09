<script lang="ts" setup>
import type { Editor } from '@tiptap/vue-3'

defineProps<{
  editor: Editor
  singleLine?: boolean
}>()
</script>

<template>
  <v-btn
    aria-label="Clear Format"
    title="Clear Format"
    variant="text"
    size="x-small"
    :height="32"
    @click="editor.chain().focus().clearNodes().unsetAllMarks().run()"
  >
    <v-icon
      icon="$mdi-format-clear"
      :size="20"
    />
    Clear
  </v-btn>
</template>
