<script setup lang="ts">
import type { Constructor, Element, Model } from 'pinia-orm'
import { LOG_COMPONENTS_COLOR } from '@/constants'

const props = defineProps<{
  model: Constructor<Model>
  idOrElement: number | Model | Element
}>()

const item = ref<Model | null>(null)
const loading = ref(false)

async function loadModel() {
  loading.value = true

  if (typeof props.idOrElement === 'number') {
    const localItem = useRepo(props.model).find(props.idOrElement)
    if (localItem) {
      item.value = localItem
      loading.value = false
      return
    }

    try {
      const entity = useRepo(props.model).getModel().$entity()
      await useAxiosRepo(props.model)
        .api()
        .get(`/api/entities/${entity}/${props.idOrElement}`, {
          dataTransformer: (response) => {
            if (!response.data.success || !response.data.result)
              throw new Error('Invalid response')
            return response.data.result
          },
        })
      loadModel()
    }
    catch (error) {
      console.error(`%c[ModelLoader] Error: ${error}`, LOG_COMPONENTS_COLOR)
      item.value = null
    }
  }
  else {
    item.value = props.idOrElement as Model
  }
  loading.value = false
}

onMounted(() => {
  loadModel()
})

watch(() => props.idOrElement, () => {
  loadModel()
})
</script>

<template>
  <slot
    :item="item"
    :loading="loading"
  >
    <span v-if="loading">Loading...</span>
    <span v-else-if="item">{{ item.toString() }}</span>
    <span v-else class="text-disabled">{{ $t('common.empty') }}</span>
  </slot>
</template>
