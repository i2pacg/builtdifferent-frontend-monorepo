<script setup lang="ts" generic="T extends Model">
import type { AxiosResponse } from 'axios'
import type { Constructor, Element, HasMany, Model } from 'pinia-orm'
import { LOG_COMPONENTS_COLOR } from '@/constants'
import { loadModelClasses } from '@/utils/loadModelClasses'

const props = defineProps<{
  relation: HasMany
  item: Element | null
  label: string
}>()
const model = defineModel<[]>()
const relatedModel = ref<Constructor<Model> | null>(null)
const search = ref('')
const total = ref(0)
const options = computed(() => {
  if (!relatedModel.value) {
    return []
  }
  return useRepo(relatedModel.value)
    .limit(5)
    .where((item: Element) => {
      return item.id !== props.item.id
    })
    .where((item: Element) => {
      return item.toString().toLowerCase().includes(search.value.toLowerCase())
    })
    .get()
})
function fetchOptions() {
  useAxiosRepo(relatedModel.value)
    .api()
    .get(`/api/entities/${props.relation.related.$entity()}`, {
      params: {
        page: 1,
        itemsPerPage: 5,
      },
      dataTransformer: (response: AxiosResponse<ApiResponse<PagingResponse>>) => {
        total.value = response.data.result.total
        return response.data.result.data
      },
    })
    .then((response) => {
      const responseData = response.getDataFromResponse() as PagingResponse
      console.log('%c[HasManyField] [fetchOptions] [responseData]', 'color: green; font-weight: bold;', responseData)
      /*    total.value = responseData.total */
      /* useRepo(relatedModel.value).save(responseData.data)
      useRepo(relatedModel.value).hydratedDataCache.clear()
      nextTick(() => {
        options.value = useRepo(relatedModel.value)
          .limit(5)
          .where((item: Element) => {
            return item.id !== props.item.id
          })
          .where((item: Element) => {
            return item.toString().toLowerCase().includes(search.value.toLowerCase())
          })
          .get()
        console.log('%c[HasManyField] [onMounted] [options]', 'color: green; font-weight: bold;', options.value)
      }) */
    })
}
onMounted(() => {
  console.log('%c[HasManyField] %c[onMounted] %crelation', LOG_COMPONENTS_COLOR, 'color:white', 'color:lightblue', props.relation)
  loadModelClasses(props.relation.related.$entity()).then((model) => {
    if (!model) {
      throw new Error('Model not found')
    }
    relatedModel.value = model
    fetchOptions()
    // check if model and related model are the same

  /*   options.value = useRepo(model)
      .limit(5)
      .where((item: Element) => {
        return item.id !== props.item.id
      })
      .where((item: Element) => {
        return item.toString().toLowerCase().includes(search.value.toLowerCase())
      })
      .get()
    useAxiosRepo(model)
      .api()
      .get(`/api/entities/${props.relation.related.$entity()}`, {
        params: {
          page: 1,
          perPage: 5,
        },
        save: false,
        dataTransformer: (response: AxiosResponse<ApiResponse<PagingResponse>>) => {
          return response.data.result
        },
      })
      .then((response) => {
        const responseData = response.getDataFromResponse() as PagingResponse
        useRepo(model).save(responseData.data)
        useRepo(model).hydratedDataCache.clear()
        nextTick(() => {
          options.value = useRepo(model)
            .limit(5)
            .where((item: Element) => {
              return item.id !== props.item.id
            })
            .where((item: Element) => {
              return item.toString().toLowerCase().includes(search.value.toLowerCase())
            })
            .get()
          console.log('%c[HasManyField] [onMounted] [options]', 'color: green; font-weight: bold;', options.value)
        })
      }) */
  })
})

const { t } = useI18n()
</script>

<template>
  <v-autocomplete
    v-model="model"
    v-model:search="search"
    item-value="id"
    return-object
    :items="options"
    :label="t(label)"
    :item-props="(item) => ({ title: item.toString() })"
    clearable
    clear-icon="$mdi-close-circle"
    menu-icon="$mdi-chevron-down"
    hide-details
    hide-selected
    variant="solo-filled"
    :density="model.length ? 'default' : 'compact'"
    multiple
    chips
    closable-chips
    :menu-props="{
      zIndex: 3001,
      location: 'bottom',
    }"
  >
    <template #append>
      <v-menu>
        <template #activator="{ props: menuProps }">
          <v-icon
            v-bind="menuProps"
            icon="$mdi-gear"
          />
        </template>

        <v-list>
          <v-list-item>
            <v-list-item-title>Show Radio Buttons Grid</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>
    <template #append-item>
      {{ total - options.length }} more items available search to see them
    </template>
  </v-autocomplete>
</template>
