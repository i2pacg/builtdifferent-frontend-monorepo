<template>
  <link-control
    :editor="props.editor"
    :in-bubble="inBubble"
  />
  <v-menu v-if="!inBubble">
    <template #activator="{ props: menu }">
      <v-btn
        :height="26"
        variant="outlined"
        size="x-small"
        class="flex-grow-1"
        border="sm"
        v-bind="menu"
      >
        <template #prepend>
          <v-icon
            icon="$mdi-image-plus"
            :size="16"
          />
        </template>
        INSERT
      </v-btn>
    </template>
    <v-list>
      <v-list-item
        @click="showInsertImageModal"
      >
        <v-list-item-title>
          Image
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'
import LinkControl from './LinkControl.vue'

const props = defineProps<{
  editor: Editor
  inBubble?: boolean
  singleLine?: boolean
}>()
function showInsertImageModal() {
  console.log('showInsertImageModal')
  const url = window.prompt('URL')

  if (url) {
    props.editor.chain().focus().setImage({ src: url }).run()
  }
}
</script>
