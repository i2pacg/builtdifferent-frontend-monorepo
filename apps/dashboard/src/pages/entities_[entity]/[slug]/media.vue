<script lang="ts">
import type { ApiResponse } from '@/interfaces'
import type { Response } from '@pinia-orm/axios'
import type { AxiosResponse } from 'axios'
import type { Model } from 'pinia-orm'
import { useEntityLoader } from '@/loader/useEntityLoader'
import { TextContent } from '@i2pacg/builtdifferent-frontend-tsdata/models'
import { BelongsTo } from 'pinia-orm'

export { useEntityLoader }
</script>

<script setup lang="ts">
const props = defineProps<{
  entity: string
  slug: string
}>()
const { data } = useEntityLoader()
const { breadcrumbs, htmlContentItems } = toRefs(useAppStore())
/* const props = defineProps<{
  entity: string
  slug: string
}>()
const { mediaCollections, fetchMedia } = useEntityMedia(props.entity, props.slug)

onMounted(() => {
  fetchMedia()
}) */
useRepo(data.value.model).hydratedDataCache.clear()

function isNumeric(str: string) {
  if (typeof str != 'string')
    return false // we only process strings!
  return !Number.isNaN(Number.parseInt(str)) && Number.isFinite(Number.parseInt(str))
}
function filterNameRelations(key: string) {
  return !(data.value.relations[key] instanceof BelongsTo && data.value.relations[key].related instanceof TextContent)
}

const query = computed(() => {
  const q = useRepo(data.value.model)
    .where(isNumeric(props.slug) ? 'id' : 'slug', props.slug as any)
  for (const key in data.value.relations) {
    if (key !== 'articles') {
      q.with(key, (query) => {
        if (data.value.relations[key].related instanceof TextContent) {
          query.with('translations')
        }
      })
    }
  }
  /*  data.value.relations[key].related instanceof TextContent */
  return q
})
const { t } = useI18n()
const item: Ref<Model> = ref<Model>(query.value.first()) as Ref<Model>
onMounted(() => {
  console.log('%cMounted', 'color: green; font-weight: bold;', props.entity, props.slug, data.value.formFields)
  if (data.value) {
    breadcrumbs.value = [
      {
        title: t(`entities.${props.entity}.title`),
        to: {
          name: 'entities.index',
          params: {
            entity: props.entity,
          },
        },
      },
      {
        title: item.value ? item.value.toString() : props.slug,
        to: {
          name: 'entities.details',
          params: {
            entity: props.entity,
            slug: props.slug,
          },
        },
      },
      {
        title: 'Media',
        to: {
          name: 'entities.media',
          params: {
            entity: props.entity,
            slug: props.slug,
          },
        },
        disabled: true,
      },
    ]
    htmlContentItems.value = data.value.htmlFields.map((f) => {
      return {
        title: t(`entities.${props.entity}.columns.${f}.header`),
        to: {
          name: 'entities.content',
          params: {
            entity: props.entity,
            slug: props.slug,
            field: f,
          },
        },
      }
    })
  }

  fetchItem()
})
const isFetching = ref(false)
function fetchItem() {
  console.log('%c[EntitySlugView] [fetchItem]', 'color: lightblue;')
  isFetching.value = true
  useAxiosRepo(data.value.model).api().get(`/api/entities/${props.entity}/${props.slug}`, {
    params: {
      with: Object.keys(data.value.relations).filter(filterNameRelations).filter(r => r !== 'articles'),
    },
    save: false,
    dataTransformer: (response: AxiosResponse<ApiResponse>) => {
      return response.data.result
    },
  }).then((response: Response) => {
    const responseData = response.getDataFromResponse()
    console.log('%c[EntitySlugView] [fetchItem] responseData', 'color: lightblue;', responseData)
    useRepo(data.value.model).save(responseData)
    useRepo(data.value.model).hydratedDataCache.clear()
    setTimeout(() => {
      item.value = query.value.first()
    }, 1000)
  }).catch((error) => {
    console.error('%c[EntitySlugView] [fetchItems] Error:', 'color: lightcoral;', error)
  }).finally(() => {
    isFetching.value = false
  })
  console.log('%c[EntitySlugView] [fetchItem] query', 'color: lightblue;', useRepo(data.value.model).all())
}

/*
interface FormDataType {
  [key: string]: number | string | DefaultLocaleMessageSchema | Date
}
const isValid = ref<boolean | null>(null)
const form = ref(reactive({
  ...Object.keys(data.value?.formFields || {}).reduce((acc, key) => {
    const relation = data.value?.relations?.[key]
    if (relation instanceof BelongsTo) {
      acc[key] = item.value?.[key]
      || item.value?.[relation.foreignKey?.toString()]
      || (relation.related instanceof TextContent ? relation.related.$newInstance() : null)
    }
    else if (relation instanceof HasMany) {
      acc[key] = item.value?.[key] || []
    }
    else {
      acc[key] = item.value?.[key] ?? null
    }
    return acc
  }, {} as const as FormDataType),
}))
 */
</script>

<template>
  <v-sheet>
    <!--  <entity-media-collection
      v-for="_, key in mediaCollections"
      :key="key"
      :collection="key"
      :entity="props.entity"
      :slug="props.slug"
    /> -->
  </v-sheet>
</template>

<route lang="json">
  {
    "$schema": "https://raw.githubusercontent.com/posva/unplugin-vue-router/main/route.schema.json",
    "path": "/entities/:entity/:slug/media",
    "name": "entities.media",
    "props": true,
    "meta": {
      "permissions": [
        "admin.super"
      ],
    "requiresAuth": true
    }
  }
</route>
