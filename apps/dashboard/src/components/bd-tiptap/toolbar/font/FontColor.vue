<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'
import { VBtn, VMenu } from 'vuetify/components'

export interface ToolbarButtonProps {
  editor: Editor
  inBubble?: boolean
  singleLine?: boolean
}
const props = defineProps<ToolbarButtonProps>()

const fontColor = computed(() => props.editor.getAttributes('textStyle')?.color || undefined)
const highlight = computed(() => props.editor.getAttributes('highlight')?.color || undefined)
</script>

<template>
  <template v-if="!inBubble || !editor.isActive('link')">
    <v-menu
      :close-on-content-click="false"
      :attach="inBubble ? '#bubble-menu' : undefined"
    >
      <template #activator="{ props: menu }">
        <v-btn
          :height="24"
          :width="72"
          variant="text"
          size="x-small"
          tile
          aria-label="Font Color"
          title="Font Color"
          v-bind="menu"
        >
          <v-icon
            icon="$mdi-format-color"
            :size="20"
            :color="fontColor"
          />
          <v-icon
            v-if="!inBubble"
            icon="$mdi-chevron-down"
            :size="20"
          />
        </v-btn>
      </template>
      <div>
        <v-color-picker
          :model-value="fontColor"
          @update:model-value="props.editor.chain().focus().setColor($event).run()"
        />
      </div>
    </v-menu>
    <v-menu
      :close-on-content-click="false"
      :attach="inBubble ? '#bubble-menu' : undefined"
    >
      <template #activator="{ props: menu }">
        <v-btn
          :height="24"
          :width="72"
          variant="text"
          aria-label="Background Color"
          title="Background Color"
          size="x-small"
          tile
          v-bind="menu"
        >
          <v-icon
            icon="$mdi-format-color-fill"
            :size="20"
            :color="highlight"
          />
          <v-icon
            v-if="!inBubble"
            icon="$mdi-chevron-down"
            :size="20"
          />
        </v-btn>
      </template>
      <div>
        <v-color-picker
          :model-value="highlight"
          @update:model-value="props.editor.chain().focus().setHighlight({ color: $event }).run()"
        />
      </div>
    </v-menu>
  </template>
</template>
