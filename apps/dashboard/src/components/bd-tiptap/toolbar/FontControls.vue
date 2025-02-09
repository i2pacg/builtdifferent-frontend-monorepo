<script lang="ts" setup>
import type { Editor } from '@tiptap/vue-3'

defineProps<{
  editor: Editor
  singleLine?: boolean
}>()
</script>

<template>
  <div>
    <font-family
      :editor="editor"
    />
  <!--   <v-divider
      color="transparent"
      vertical
      class="mx-1"
    />
    <font-size
      :editor="editor"
    /> -->
  </div>
  <div>
    <font-size
      :editor="editor"
    />    <!--  <font-style
      :editor="editor"
    />
    <v-divider
      vertical
      class="mx-1"
    />
    <font-color
      :editor="editor"
    /> -->
  </div>
</template>
