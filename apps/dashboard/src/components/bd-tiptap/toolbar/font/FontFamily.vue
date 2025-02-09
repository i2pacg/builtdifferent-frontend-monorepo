<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'
import { useI18n } from 'vue-i18n'
import MdiChevronDown from '~icons/mdi/chevron-down'

const props = defineProps<{
  editor: Editor
  inBubble?: boolean
}>()

const { t } = useI18n()

const FONT_FAMILY_OPTIONS: string[] = [
  'Montserrat',
  'Arial',
  'Courier New',
  'Georgia',
  'Times New Roman',
  'Trebuchet MS',
  'Verdana',
]
const currentFont = computed(() => props.editor.getAttributes('textStyle').fontFamily || 'Montserrat')
/* const currentFont = ref<string | undefined>(undefined)
onMounted(() => {
  currentFont.value = props.editor.getAttributes('textStyle').fontFamily || 'Montserrat'
}) */
</script>

<template>
  <v-autocomplete
    :model-value="currentFont"
    :items="FONT_FAMILY_OPTIONS"
    density="compact"
    hide-details
    variant="outlined"
    :menu-icon="MdiChevronDown"
    class="flex-grow-1 compactor"
    :aria-label="t('bdTipTap.toolbar.fontFamily')"
    :title="t('bdTipTap.toolbar.fontFamily')"
    :list-props="{
      density: 'compact',
      class: 'pa-0 compactor',
      itemProps(item, fallback) {
        return {
          ...fallback,
          style: {
            fontFamily: item,
          },
        }
      },
    }"
    :menu-props="{
      class: 'pa-0',
    }"
    min-width="150"
    tile
    center-affix
    @update:model-value="($event) => {
      console.log('update:model-value', $event)
      props.editor.chain().focus().setFontFamily($event).run()

      /* editor.update(() => {
        const selection = $getSelection()
        if (selection !== null) {
          $patchStyleText(selection, {
            'font-family': $event,
          })
        }
      }) */
    }"
  />
</template>
