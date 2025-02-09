<!-- eslint-disable unused-imports/no-unused-vars -->
<script setup lang="ts">
import { type Editor, isString } from '@tiptap/vue-3'
import { ref } from 'vue'
import { VAutocomplete } from 'vuetify/components'
import MdiChevronDown from '~icons/mdi/chevron-down'

const props = withDefaults(defineProps<{
  disabled?: boolean
  editor: Editor
  fontSize?: number
}>(), {
  disabled: false,
})
const DEFAULT_FONT_SIZE = 16
/* const fontSize = ref<number | undefined>(DEFAULT_FONT_SIZE)
 *//* const editor = useLexicalComposer() */
/* function handleClick(option: string, value: string) {
  editor.update(() => {
    const selection = $getSelection()
    if (selection !== null) {
      $patchStyleText(selection, {
        [option]: value,
      })
    }
  })
} */

const search = ref('')
const currentSize = computed(() => {
  const fontSize = props.editor.getAttributes('textStyle')!.fontSize
  return fontSize ? Number.parseInt(fontSize, 10) : DEFAULT_FONT_SIZE
})

const FONT_SIZE_OPTIONS: number[] = [
  8,
  9,
  10,
  11,
  12,
  14,
  16,
  18,
  20,
  22,
  24,
  26,
  28,
  36,
  48,
  72,
]
const UPDATE_TYPE = {
  INCREMENT: 1,
  DECREMENT: 2,
}
function getNextFontSize(prevFontSize?: number | string, updateType?: number | null): number {
  console.log('prevFontSize', props.editor.getAttributes('textStyle')!)
  if (isString(prevFontSize)) {
    prevFontSize = Number.parseInt(prevFontSize, 10)
  }
  if (!prevFontSize) {
    prevFontSize = DEFAULT_FONT_SIZE
  }

  if (!updateType) {
    return prevFontSize
  }

  if (updateType === UPDATE_TYPE.INCREMENT) {
    if (prevFontSize < 72) {
      return FONT_SIZE_OPTIONS.find(size => size > prevFontSize) || 72
    }
    else if (prevFontSize < 80) {
      return 80
    }
    else {
      return Math.min(Math.floor(prevFontSize / 10) * 10 + 10, 1638)
    }
  }
  else if (updateType === UPDATE_TYPE.DECREMENT) {
    if (prevFontSize > 80) {
      return Math.max(Math.ceil(prevFontSize / 10) * 10 - 10, 80)
    }
    else if (prevFontSize > 72) {
      return 72
    }
    else {
      return FONT_SIZE_OPTIONS.findLast(size => size < prevFontSize) || 8
    }
  }

  return prevFontSize
}

// get default web font family from website
const inputRef = ref<VAutocomplete | null>(null)
</script>

<template>
  <v-autocomplete
    ref="inputRef"
    v-model:search="search"
    :items="FONT_SIZE_OPTIONS"
    :model-value="currentSize"
    density="compact"
    hide-details
    variant="outlined"
    :menu-icon=" MdiChevronDown"
    class="flex-grow-0 pa-0 compactor"
    :list-props="{
      density: 'compact',
      class: 'pa-0 compactor',
    }"
    :menu-props="{
      class: 'pa-0',
      openDelay: 0,
      closeOnContentClick: true,

    }"

    eager
    tile
    center-affix
    hide-spin-buttons
    hide-no-data
    min-width="84px"
    aria-label="Font Size"
    title="Font Size"
    :autofocus="false"
    @click="($event: Event) => {
      if (($event.target as HTMLInputElement).tagName.toLowerCase() === 'input') {
        ($event.target as HTMLInputElement).select()
      }
    }"
    @update:model-value="editor.chain().focus().setFontSize(`${$event}px`).run() "
  >
    <template #append>
      <v-btn
        aria-label="Font Increase"
        :height="24"
        variant="text"
        size="x-small"
        tile
        title="Font Increase"
        @click.stop.prevent.capture="editor.chain().focus().setFontSize(`${getNextFontSize(currentSize, 1)}px`).run()"
      >
        <v-icon
          icon="$fluent-font-increase-20-filled"
          size="18px"
        />
      </v-btn>
      <v-btn
        aria-label="Font Decrease"
        :height="24"
        variant="text"
        size="x-small"
        tile
        title="Font Decrease"
        @click.stop.prevent.capture="editor.chain().focus().setFontSize(`${getNextFontSize(currentSize, 2)}px`).run()"
      >
        <v-icon
          icon="$fluent-font-decrease-20-filled"
          size="18px"
        />
      </v-btn>
    </template>
    <!--   @keydown.enter="editor.update(() => {
      const selection = $getSelection()
      if (selection !== null) {
        $patchStyleText(selection, {
          ['font-size']: `${$event.target.value}px`,
        })
      }
    })"   <template #selection="{ item }">
      <v-list-item
        density="compact"
        class="px-0 "
      >
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
    </template> -->
  <!--   <template #item="{ item }">
      <v-list-item
        @click="handleClick('font-size', item.value)"
      >
        <v-list-item-title>{{ item.value }}</v-list-item-title>
      </v-list-item>
    </template> -->
  </v-autocomplete>
  <!--  <v-btn
    aria-label="Font Increase"
    :height="32"
    variant="text"
    size="x-small"
    tile
    title="Font Increase"
    @click="editor.chain().focus().setFontSize(`${getNextFontSize(currentSize, 1)}px`).run()"
  >
    <v-icon
      icon="$fluent-font-increase-20-filled"
      size="18px"
    />
  </v-btn>
  <v-btn
    aria-label="Font Decrease"
    :height="32"
    variant="text"
    size="x-small"
    tile
    title="Font Decrease"
    @click="editor.chain().focus().setFontSize(`${getNextFontSize(currentSize, 2)}px`).run()"
  >
    <v-icon
      icon="$fluent-font-decrease-20-filled"
      size="18px"
    />
  </v-btn> -->
</template>
