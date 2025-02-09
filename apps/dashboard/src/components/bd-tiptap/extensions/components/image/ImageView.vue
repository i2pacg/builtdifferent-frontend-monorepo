<script setup lang="ts">
import { isNumber } from '@/components/bd-tiptap/utils/utils'
import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
import { computed, ref, unref } from 'vue'

const props = defineProps({
  ...nodeViewProps,
  selected: {
    type: Boolean,
    required: true,
  },
})

const originalSize = ref({ width: 0, height: 0 })
const resizing = ref(false)

const imgAttrs = computed(() => {
  const { src, alt, width: w, height: h, title, credit } = props.node.attrs
  return {
    src: src || undefined,
    alt: alt || undefined,
    title: title || undefined,
    credit: credit || undefined,
    style: {
      width: isNumber(w) ? `${w}px` : w || undefined,
      height: isNumber(h) ? `${h}px` : h || undefined,
    },
  }
})

const display = computed(() => props.node.attrs.display || undefined)
const imageViewClass = computed(() => ['image-view', unref(display) ? `image-view--${unref(display)}` : ''])
const imageMaxStyle = computed(() => ({ width: unref(imgAttrs).style.width === '100%' ? '100%' : undefined }))

function onImageLoad(e: Event) {
  const target = e.target as HTMLImageElement
  originalSize.value = { width: target.width, height: target.height }
}

function selectImage() {
  const { editor, getPos } = props
  editor.commands.setNodeSelection(getPos())
}

onMounted(() => {
  /*  document.addEventListener('mousedown', onMouseDown) */
})

onBeforeUnmount(() => {
/*   document.removeEventListener('mousedown', onMouseDown) */
})
</script>

<template>
  <node-view-wrapper
    :class="imageViewClass"
    :style="imageMaxStyle"
    class="image-view"
  >
    <div
      :class="{ 'image-view__body--focused': selected, 'image-view__body--resizing': resizing }"
      class="image-view__body"
      :style="imageMaxStyle"
    >
      <img
        :src="imgAttrs.src"
        :alt="imgAttrs.alt"
        :style="imgAttrs.style"
        class="image-view__body__image"
        @load="onImageLoad"
        @click="selectImage"
      >
      <!--    <div v-if="selected" class="resize-handle" @mousedown="onResizeMouseDown" /> -->
      <v-row no-gutters>
        <v-col>
          <v-text-field
            label="Title"
            class="image-view__body__input"
            :model-value="imgAttrs.title"
            density="compact"
            hide-details
            variant="solo-filled"
            @update:model-value="props.updateAttributes({ title: $event })"
          />
        </v-col>
        <v-col>
          <v-text-field
            label="Credit"
            class="image-view__body__input"
            :model-value="imgAttrs.credit"
            density="compact"
            hide-details
            variant="solo-filled"
            @update:model-value="props.updateAttributes({ credit: $event })"
          />
        </v-col>
      </v-row>
    </div>
  </node-view-wrapper>
</template>
