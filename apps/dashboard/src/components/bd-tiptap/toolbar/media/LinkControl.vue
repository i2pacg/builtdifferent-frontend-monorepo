<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'
import { isValidUrl } from '../../utils/utils'

const props = defineProps<{
  editor: Editor
  inBubble?: boolean
  newLink?: boolean
}>()

/* const { href, target, rel } = computed(() => {
  const { href, target, rel } = props.editor.getAttributes('link')
  return {
    href: href ?? '',
    target: target === '_blank',
    rel: rel === 'noopener noreferrer',
  }
}) */
/* function isValidUrl(url: string): boolean {
  const pattern = /^(?:https?:\/\/)?(?:[\w-]+\.)+[\w-]{2,}(?:\/\S*)?$/i
  return pattern.test(url)
} */
/* const url = computed({
  get: () => {
    const { href } = props.editor.getAttributes('link')
    return href ?? ''
  },
  set: (value) => {
    // is valid url

    if (!isValidUrl(value)) {
      console.error('Invalid URL:', value)
      return
    }
    props.editor.chain().focus().setLink({ href: value }).run()
  },
}) */
/* const url = computed({
  get: () => {
    const { href } = props.editor.getAttributes('link')
    return href ?? ''
  },
  set: (value) => {
    props.editor.chain().focus().setLink({ href: value }).run()
  },
}) */
const url = computed({
  get: () => {
    return props.editor.isActive('link') ? props.editor.getAttributes('link').href : ''
  },
  set: (value) => {
    props.editor.chain().setLink({ href: value }).run()
  },
})
const target = computed({
  get: () => {
    return props.editor.isActive('link') ? props.editor.getAttributes('link').target === '_blank' : false
  },
  set: (value) => {
    props.editor.chain().setLink({ href: url.value, target: value ? '_blank' : undefined }).run()
  },
})
</script>

<template>
  <div
    v-if="inBubble && editor.isActive('link')"
    class="d-flex flex-column pt-2"
  >
    <v-text-field
      v-model="url"
      :focused="editor.isActive('link')"
      density="compact"
      hide-details
      variant="outlined"
      label="URL"
      min-width="450"
      :rules="[
        (v) => !!v || 'URL is required',
        (v) => isValidUrl(v) || 'Invalid URL',
      ]"
      class="me-2"
      @keydown.enter.prevent="editor.chain().focus().toggleLink({ href: url, target: target ? '_blank' : undefined }).run()"
    />
    <v-checkbox
      v-model="target"
      label="Open in new tab"
      class="me-2"
      density="compact"
      hide-details
      true-icon="$mdi-checkbox-marked"
      false-icon="$mdi-checkbox-blank-outline"
      indeterminate-icon="$mdi-minus-box"
    />
  <!--   <v-btn
      :height="26"
      variant="tonal"
      size="x-small"
      :color="editor.isActive('link') ? 'primary' : ''"
      class="flex-grow-1"
    >
      <template #prepend>
        <v-icon
          icon="$mdi-link-variant"
          :size="16"
        />
      </template>
      <span>{{ 'link' }}</span>
    </v-btn> -->
  </div>
  <v-btn
    v-else
    :height="26"
    variant="tonal"
    size="x-small"
    :color="editor.isActive('link') || newLink ? 'primary' : ''"
    class="flex-grow-1"
    @click="editor.chain().focus().toggleLink({ href: url, target: target ? '_blank' : undefined }).run()"
  >
    <template #prepend>
      <v-icon
        icon="$mdi-link-variant"
        :size="16"
      />
    </template>
    <span>{{ 'link' }}</span>
  </v-btn>
</template>
