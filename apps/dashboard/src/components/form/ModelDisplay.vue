<script setup lang="ts">
import type { Constructor, Element, Model } from 'pinia-orm'

import { LOG_COMPONENTS_COLOR } from '@/constants'

const props = defineProps<{
  model: Constructor<Model>
  idOrElement: number | Model | Element
}>()

const item = ref<Model | null>(null)

async function loadModel() {
  console.log(`%c[ModelDisplay] %c[loadModel]`, LOG_COMPONENTS_COLOR, 'color:white', props.idOrElement)
  if (typeof props.idOrElement === 'number') {
    // Try to load from local ORM first
    const localItem = useRepo(props.model).find(props.idOrElement)
    if (localItem) {
      console.log(`%c[ModelDisplay] Found in local ORM:`, LOG_COMPONENTS_COLOR, localItem.toString())
      item.value = localItem
      return
    }

    // Fallback to axios if not found locally
    try {
      console.log(`%c[ModelDisplay] Not found locally, fetching from API...`, LOG_COMPONENTS_COLOR)
      const entity = useRepo(props.model).getModel().$entity()
      const response = await useAxiosRepo(props.model)
        .api()
        .get(`/api/entities/${entity}/${props.idOrElement}`, {
          dataTransformer: (response) => {
            if (!response.data.success || !response.data.result) {
              throw new Error('Invalid response')
            }
            return response.data.result
          },
        })
      console.log(`%c[ModelDisplay] [loadModel] [response]`, LOG_COMPONENTS_COLOR, response)
      /* item.value = response.getDataFromResponse() */
    }
    catch (error) {
      console.error(`%c[ModelDisplay] API fetch failed:`, LOG_COMPONENTS_COLOR, error)
      item.value = null
    }
  }
  else {
    // If not an ID, use the provided model/element directly
    console.log(`%c[ModelDisplay] Using direct model:`, LOG_COMPONENTS_COLOR, props.idOrElement)
    item.value = props.idOrElement as Model
  }
}

onMounted(() => {
  loadModel()
})

// Watch for changes in idOrElement to reload
watch(() => props.idOrElement, () => {
  loadModel()
})
</script>

<template>
  <span v-if="item">{{ item.toString() }}</span>
  <span v-else class="text-disabled">{{ $t('common.empty') }}</span>
</template>
