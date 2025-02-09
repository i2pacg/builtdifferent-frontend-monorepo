<script lang="ts" setup>
import type { Editor } from '@tiptap/vue-3'

defineProps<{
  editor: Editor
  singleLine?: boolean
}>()
</script>

<template>
  <div class="d-flex align-center">
    <format-list
      :editor="editor"
    />
    <format-indent :editor="editor" />
  </div>
  <div class="d-flex align-center">
    <format-align
      :editor="editor"
    />
  </div>
</template>
