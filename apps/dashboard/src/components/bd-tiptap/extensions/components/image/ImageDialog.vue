<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'
import type { ImageAttrsOptions, ImageForm, ImageTab, ImageTabKey } from './types'

import { computed, ref, unref, watch } from 'vue'
import { getIcon } from '@/components/bd-tiptap/constants/icons'
import ImageUpload from './ImageUpload.vue'
import ImageUrl from './ImageUrl.vue'

interface Props {
  value?: ImageAttrsOptions
  editor: Editor
  upload?: (file: File) => Promise<string>
  imageTabs?: ImageTab[]
  hiddenTabs?: ImageTabKey[]
  destroy?: () => void
}

const props = withDefaults(defineProps<Props>(), {
  value: () => ({}),
  upload: undefined,
  imageTabs: () => [],
  hiddenTabs: () => [],
  destroy: undefined,
})

const dialog = ref<boolean>(false)

const tab = ref<boolean>(false)
const form = ref<ImageForm>({})

const defaultImageTabs = computed<ImageTab[]>(() => {
  const defTabs: ImageTab[] = [
    {
      name: 'Url',
      type: 'url',
      component: ImageUrl,
    },
    {
      name: 'Upload',
      type: 'upload',
      component: ImageUpload,
    },
  ]

  const filterDefTabs = defTabs.filter((item) => {
    if (!item.type)
      return item
    return !props.hiddenTabs.includes(item.type)
  })

  return [...filterDefTabs, ...props.imageTabs]
})

const disabledApply = computed<boolean>(() => {
  const { src } = unref(form)
  if (typeof src === 'string' && src !== '')
    return false
  return true
})

async function apply() {
  const { src, lockAspectRatio, height } = unref(form)
  if (!src)
    return

  props.editor
    .chain()
    .focus()
    .setImage({
      ...unref(form),
      src,
      height: lockAspectRatio ? undefined : height,
    })
    .run()

  close()
}

function close() {
  dialog.value = false
  form.value = {}

  setTimeout(() => props.destroy?.(), 300)
}

watch(
  () => props.value,
  (val) => {
    form.value = {
      ...unref(form),
      ...val,
    }
  },
  { immediate: true, deep: true },
)
</script>

<template>
  <VDialog
    v-model="dialog"
    max-width="400"
    activator="parent"
    @click:outside="close"
  >
    <VCard>
      <VToolbar
        class="px-6"
        density="compact"
      >
        <span class="headline">Title</span>

        <VSpacer />

        <VBtn
          class="mx-0"
          icon
          @click="close"
        >
          <VIcon :icon="getIcon('close')" />
        </VBtn>
      </VToolbar>

      <VTabs v-model="tab">
        <VTab
          v-for="(imageTab, i) in defaultImageTabs"
          :key="i"
          :value="i"
        >
          {{ imageTab.name }}
        </VTab>
      </VTabs>

      <VCardText>
        <VWindow v-model="tab">
          <VWindowItem
            v-for="(imageTab, i) in defaultImageTabs"
            :key="i"
            :value="i"
          >
            <component
              :is="imageTab.component"
              v-model="form"
              :upload="upload"
            />
          </VWindowItem>
        </VWindow>
      </VCardText>

      <VCardActions>
        <VBtn
          :disabled="disabledApply"
          @click="apply"
        >
          Apply
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>
