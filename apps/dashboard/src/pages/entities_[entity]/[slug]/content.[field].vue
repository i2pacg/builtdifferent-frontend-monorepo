<script lang="ts">
import type { Response } from '@pinia-orm/axios'
import type { AxiosResponse } from 'axios'
import { useEntityLoader } from '@/loader/useEntityLoader'
import { TextContent } from '@i2pacg/builtdifferent-frontend-tsdata/models'
import { BelongsTo, type Model } from 'pinia-orm'

export { useEntityLoader }
</script>

<script setup lang="ts">
const props = defineProps<{
  entity: string
  slug: string
  field: string
}>()
const { data } = useEntityLoader()
const { breadcrumbs, htmlContentItems } = toRefs(useAppStore())
const { t } = useI18n()
useRepo(data.value.model).hydratedDataCache.clear()

function isNumeric(str: string) {
  if (typeof str != 'string')
    return false // we only process strings!
  return !Number.isNaN(Number.parseInt(str)) && Number.isFinite(Number.parseInt(str))
}

const query = computed(() => {
  const q = useRepo(data.value.model)
    .where(isNumeric(props.slug) ? 'id' : 'slug', props.slug as any)
  for (const key in data.value.relations) {
    q.with(key, (query) => {
      if (data.value.relations[key].related instanceof TextContent) {
        query.with('translations')
      }
    })
  }
  /*  data.value.relations[key].related instanceof TextContent */
  return q
})

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
        title: t(`entities.${props.entity}.columns.${props.field}.header`),
        to: {
          name: 'entities.content',
          params: {
            entity: props.entity,
            slug: props.slug,
            field: props.field,
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
        disabled: f === props.field,
      }
    })
  }

  fetchItem()
})
function filterNameRelations(key: string) {
  return !(data.value.relations[key] instanceof BelongsTo && data.value.relations[key].related instanceof TextContent)
}

const isFetching = ref(false)
function fetchItem() {
/*   console.log('%c[EntitySlugView] [fetchItem]', 'color: lightblue;') */
  isFetching.value = true
  useAxiosRepo(data.value.model).api().get(`/api/entities/${props.entity}/${props.slug}`, {
    params: {
      with: Object.keys(data.value.relations).filter(filterNameRelations),
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
    item.value = query.value.first()

    /*    editor.value.commands.setContent((item.value?.[props.field] || '').toString()) */
  }).catch((error) => {
    console.error('%c[EntitySlugView] [fetchItems] Error:', 'color: lightcoral;', error)
  }).finally(() => {
    isFetching.value = false
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
        title: t(`entities.${props.entity}.columns.${props.field}.header`),
        to: {
          name: 'entities.content',
          params: {
            entity: props.entity,
            slug: props.slug,
            field: props.field,
          },
        },
        disabled: true,
      },
    ]
  })
/*   console.log('%c[EntitySlugView] [fetchItem] query', 'color: lightblue;', useRepo(data.value.model).all()) */
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
const { availableLocales } = useI18n()
</script>

<template>
  <div class="d-flex flex-column h-100 w-100">
    <bd-tip-tap
      v-if="item"
      v-model="item[field]"
      default-locale="en"
      :supported-locales="availableLocales"
    />
  </div>
</template>

<route lang="json">
{
  "$schema": "https://raw.githubusercontent.com/posva/unplugin-vue-router/main/route.schema.json",
  "path": "/entities/:entity/:slug/content/:field",
  "name": "entities.content",
  "props": true,
  "meta": {
    "permissions": [
      "admin.super"
    ],
    "requiresAuth": true
  }
}
</route>
