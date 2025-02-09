<!-- eslint-disable unused-imports/no-unused-vars -->
<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'
import { LOG_COMPONENTS_COLOR } from '@/constants'
import { objectEntries, useElementSize, watchPausable } from '@vueuse/core'
import { VAppBar } from 'vuetify/components'
import FontControls from './FontControls.vue'
import FormatStyle from './format/FormatStyle.vue'
import HistoryControls from './HistoryControls.vue'
import LayoutControls from './LayoutControls.vue'
import LocaleSelector from './locale/LocaleSelector.vue'
import MediaControls from './media/MediaControls.vue'
import StyleControls from './StyleControls.vue'

const props = defineProps<{
  editor: Editor
  singleLine?: boolean
}>()

// Refs
const toolbarRef = ref<HTMLDivElement | null>(null)

const containerRef = ref<HTMLDivElement | null>(null)

const { width: containerWidth } = useElementSize(containerRef)

const controls = [
  HistoryControls,
  LocaleSelector,
  FontControls,
  StyleControls,
  LayoutControls,
  MediaControls,
  FormatStyle,
]

const controlRefs = useTemplateRef('items')
const loaded = ref(false)
const componentWidths = ref<ComponentsConfig>({})
const { pause: pauseWidthWatch, resume } = watchPausable(containerWidth, (width) => {
  if (width) {
    const accumulativeWidth = ref(0)
    objectEntries(componentWidths.value).forEach(([key, value], index) => {
      if (value) {
        if (accumulativeWidth.value + value.width < width - 100) {
          componentWidths.value[key] = {
            width: value.width,
            visible: true,
          }
          accumulativeWidth.value += value.width
        }
        else {
          componentWidths.value[key] = {
            width: value.width,
            visible: false,
          }
        }
      }
    })
  }
}, { immediate: false })

pauseWidthWatch()

watch(() => loaded.value, (loaded) => {
  if (loaded) {
    resume()
  }
})
type ComponentsConfig = Record<string, {
  width: number
  visible: boolean
}>

const { stop, resume: resumeControlRefs } = watchPausable(() => controlRefs.value, (refs) => {
  if (!refs) {
    return
  }
  refs.forEach((ref, index) => {
    if (ref) {
      componentWidths.value[ref.$options.__name!] = {
        visible: objectEntries(componentWidths.value).map(([key, value]) => value.width).reduce((acc, curr) => acc + curr, 0) + ref.$el.parentElement.clientWidth < containerWidth.value,
        width: ref.$el.parentElement.clientWidth,
      }
    }
  })
  nextTick(() => {
    stop()
    loaded.value = true
  })
})

/* watch(() => props.singleLine, (singleLine) => {
  console.log('%c[Toolbar] %c[watch] %csingleLine:', LOG_COMPONENTS_COLOR, 'color: #FFD700;', 'color:white;', singleLine)
  resumeControlRefs()
  loaded.value = false
  nextTick(() => {

  })
}) */
</script>

<template>
  <!--   <div class="position-fixed">
    {{ componentWidths }}
  </div> -->
  <v-sheet
    ref="containerRef"
    class="app-bar-content pe-2"
    color="surface-lighten-1"
    :elevation="2"
    :height="props.singleLine ? 48 : 64"
    :class="{
      loaded,
      singleLine,
    }"
  >
    <div
      v-for="(control, key) in controls.filter(c => !loaded || componentWidths[c.__name!].visible) /* controls *//*  (!loaded ? controls : visibleControls) */"
      :key="key"
    >
      <component
        :is="control"
        ref="items"
        :editor="props.editor"
        :single-line="props.singleLine"
      />
    </div>
    <v-menu
      v-if="loaded && objectEntries(componentWidths).filter(([key, value]) => !value.visible).length"
      offset-y
      bottom
      right
    >
      <template #activator="{ props: activatorProps }">
        <v-btn
          v-bind="activatorProps"
          class="ml-2"
        >
          <v-icon>$mdi-dots-vertical</v-icon>
        </v-btn>
      </template>
    </v-menu>
  </v-sheet>
  <!--  <v-sheet
    id="toolbar"
    ref="toolbarRef"
    class="px-2"
    :height="props.singleLine ? 48 : 64"
  >

  </v-sheet> -->
</template>

<style lang="css">
.app-bar-content {
  width: 100%;
  column-gap: 4px;
  align-items: center;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
}

.app-bar-content > div {
  display: flex;
  flex-direction: column;
  row-gap: 4px;
}
.app-bar-content.singleLine > div {
  flex-direction: row;
  column-gap: 4px;
}
.app-bar-content > div:not(:last-of-type) {
  margin-right: 4px;
}

.app-bar-content.loaded > div:last-of-type {
  flex-grow: 1!important;
}
</style>
