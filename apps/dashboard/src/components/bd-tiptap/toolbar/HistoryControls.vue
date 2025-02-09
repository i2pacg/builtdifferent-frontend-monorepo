<script lang="ts" setup>
import type { Editor } from '@tiptap/vue-3'

defineProps<{
  editor: Editor
  singleLine?: boolean
}>()
</script>

<template>
  <div class="d-flex">
    <v-btn
      :disabled="!editor.can().chain().focus().undo().run()"
      variant="text"
      size="x-small"
      :height="24"
      @click="editor.chain().focus().undo().run()"
    >
      <v-icon
        icon="$mdi-undo"
        :size="18"
      />
    </v-btn>
    <v-btn
      variant="text"
      size="x-small"
      :height="24"
      :disabled="!editor.can().chain().focus().redo().run()"
      @click="editor.chain().focus().redo().run()"
    >
      <v-icon
        icon="$mdi-redo"
        :size="18"
      />
    </v-btn>
  </div>
  <v-btn
    aria-label="Clear Format"
    title="Clear Format"
    variant="text"
    size="x-small"
    :height="24"
    @click="editor.chain().focus().clearNodes().unsetAllMarks().run()"
  >
    <v-icon
      icon="$mdi-format-clear"
      :size="18"
    />
    Clear
  </v-btn>
</template>
