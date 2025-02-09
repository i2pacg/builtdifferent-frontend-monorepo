<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'

defineProps<{
  editor: Editor
  singleLine?: boolean
}>()
</script>

<template>
  <div class="d-flex">
    <font-style
      :editor="editor"
    />
  </div>
  <div class="d-flex">
    <font-color
      :editor="editor"
    />
  </div>
</template>
