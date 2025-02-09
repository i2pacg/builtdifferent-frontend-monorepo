<script setup lang="ts">
import type { FormDataType } from '@/interfaces/crud'
import type { Response } from '@pinia-orm/axios'
import type { AxiosResponse } from 'axios'
import type { Item, Model } from 'pinia-orm'
import { TextContent } from '@i2pacg/builtdifferent-frontend-tsdata/models'
import { BelongsTo } from 'pinia-orm'

const props = defineProps<{
  entity: string
  slug: string
  data: Entity
}>()

useRepo(props.data.model).hydratedDataCache.clear()

function isNumeric(str: string) {
  if (typeof str != 'string')
    return false
  return !Number.isNaN(Number.parseInt(str)) && Number.isFinite(Number.parseInt(str))
}

function filterNameRelations(key: string) {
  return !(props.data.relations[key] instanceof BelongsTo && props.data.relations[key].related instanceof TextContent)
}

const query = computed(() => {
  const q = useRepo(props.data.model)
    .where(isNumeric(props.slug) ? 'id' : 'slug', props.slug as any)
  for (const key in props.data.relations) {
    q.with(key, (query) => {
      if (props.data.relations[key].related instanceof TextContent) {
        query.with('translations')
      }
    })
  }
  return q
})

const item: Ref<Item<Model>> = ref<Item<Model>>(query.value.first()) as Ref<Item<Model>>
const isFetching = ref(false)

onMounted(() => {
  console.log('%cMounted', 'color: green; font-weight: bold;', props.entity, props.slug, props.data)
  /* if (props.data) {
    breadcrumbs.value = [
      {
        title: t(`entities.${props.entity}.title`),
        to: { name: 'entities.index', params: { entity: props.entity } },
      },
      {
        title: item.value ? item.value.toString() : props.slug,
        to: { name: 'entities.details', params: { entity: props.entity, slug: props.slug } },
      },
    ]
    htmlContentItems.value = props.data.htmlFields.map((f) => {
      return {
        title: t(`entities.${props.entity}.columns.${f}.header`),
        to: {
          name: 'entities.content',
          params: { entity: props.entity, slug: props.slug, field: f },
        },
      }
    })
  } */
  fetchItem()
})

function fetchItem() {
  console.log('%c[EntitySlugView] [fetchItem]', 'color: lightblue;')
  isFetching.value = true
  useAxiosRepo(props.data.model).api().get(`/api/entities/${props.entity}/${props.slug}`, {
    params: {
      with: Object.keys(props.data.relations).filter(filterNameRelations).filter(k => k !== 'locales' && !k.startsWith('pivot')),
    },
    save: true,
    dataTransformer: (response: AxiosResponse<ApiResponse<Element>>) => {
      return response.data.result
    },
  }).then((response: Response) => {
    const responseData = response.getDataFromResponse()
    console.log('%c[EntitySlugView] [fetchItem] responseData', 'color: lightblue;', responseData)
    nextTick(() => {
      const q = useRepo(props.data.model)
        .where(/[a-z]/i.test(props.slug) ? 'slug' : 'id', props.slug as any)

      for (const key in props.data.relations) {
        q.with(key)
      }
      item.value = q.first()
      console.log('%c[EntitySlugView] [fetchItem] item', 'color: lightblue;', isNumeric(props.slug) ? 'id' : 'slug', item.value)
    })
  }).catch((error) => {
    console.error('%c[EntitySlugView] [fetchItems] Error:', 'color: lightcoral;', error)
  }).finally(() => {
    isFetching.value = false
    /*  breadcrumbs.value = [
      {
        title: t(`entities.${props.entity}.title`),
        to: { name: 'entities.index', params: { entity: props.entity } },
      },
      {
        title: item.value ? item.value.toString() : props.slug,
        to: { name: 'entities.details', params: { entity: props.entity, slug: props.slug } },
        disabled: true,
      },
    ] */
  })
  console.log('%c[EntitySlugView] [fetchItem] query', 'color: lightblue;', useRepo(props.data.model).all())
}

function onSubmit(item: FormDataType) {
  const url = `/api/entities/${props.entity}/${props.slug}`
  useAxiosRepo(props.data.model).api().put(url, item, {
    save: true,
    dataTransformer: (response: AxiosResponse<ApiResponse<Element>>) => {
      console.log('dataTransformer response', response)
      return response.data.result
    },
  }).then((response: Response) => {
    console.log('response', response)
    fetchItem()
  })
}
</script>

<template>
  <div class="d-flex flex-column h-100 w-100">
    <bd-fields
      v-if="item"
      :model="data.model"
      :item="item"
      @confirm="onSubmit"
    />
  </div>
</template>

<route lang="json">
{
  "$schema": "https://raw.githubusercontent.com/posva/unplugin-vue-router/main/route.schema.json",
  "path": "/entities/:entity/:slug",
  "name": "entities.details",
  "props": true,
  "meta": {
    "layout": false,
    "permissions": ["admin.super"],
    "requiresAuth": true
  }
}
</route>

<!-- All commented code moved to bottom -->
<!--
watch(data, () => {
  if (props.data) {
    breadcrumbs.value = [
      {
        title: props.entity,
        to: { name: 'entities.index', params: {
          entity: props.entity,
        } },
      },
      {
        title: item.value.toString(),
        to: { name: 'entities.details', params: {
          entity: props.entity,
          slug: props.slug,
        } },
      },
    ]
  }
  console.log('data', props.data)
})
then((value: any) => {
  console.log('value', value)
  breadcrumbs.value = [
    {
      title: props.entity,
      to: { name: 'entities.index', params: {
        entity: props.entity,
      } },
    },
    {
      title: item.value.toString(),
      to: { name: 'entities.details', params: {
        entity: props.entity,
        slug: props.slug,
      } },
    },
  ]
})
Initialize router and redirect if no entity

Get model and config
const { fields, item, loading, fetchItem, updateItem } = useEntityDetails(props.entity, props.slug)

Handle form submission
async function onSubmit(data: any) {
  console.log('onSubmit', data)
  await updateItem(data).then((slug?: string | boolean) => {
    console.log('updateItem slug', slug, props.slug)
    if (slug !== props.slug) {
      console.log('ReDirecting')
      router.push(`/entities/${props.entity}/${slug}`)
    }
    // router.push(`/entities/${props.entity}`)
  })
}

const visibleLocales = ref<string[]>(['en'])
const localesPerRow = ref(2)

const query = useRepo(props.data.model)
  .where(isNumeric(props.slug) ? 'id' : 'slug', props.slug as any)

useRepo(props.data.model).insert(responseData)
item.value = query.first()

bd-locale-selector
v-if="data.entity.entityConfig.multiLocale"
v-model="visibleLocales"
v-model:per-row="localesPerRow"
class="my-2"

bd-localized-component
v-if="fields[key].translatable"
:show-locales="visibleLocales"
:show-per-row="localesPerRow"
>
<template #locale="{ locale: l }">
  <v-text-field
    v-if="fields[key]?.type === 'string'"
    :key="`locale-${l}-${key}`"
    v-model="(form[key]! as I18nProperty)[l as keyof I18nProperty]"
    :hide-details="isValid == null || isValid"
    density="compact"
    variant="solo-filled"
    class="me-2"
  >
    <template #label>
      <i18n-t
        v-if="fields[key].title"
        :keypath="fields[key].title"
        scope="global"
        :locale="l"
        tag="span"
      />
      ({{ t(`common.lang.${l}`) }})
    </template>
  </v-text-field>
  <v-textarea
    v-else-if="fields[key]?.type === 'text'"
    v-model="(form[key]! as I18nProperty)[l as keyof I18nProperty]"
    :hide-details="isValid == null || isValid"
    density="compact"
    variant="solo-filled"
    class="me-2"
  >
    <template #label>
      <i18n-t
        v-if="fields[key].title"
        :keypath="fields[key].title"
        scope="global"
        :locale="l"
        tag="span"
      />
      ({{ t(`common.lang.${l}`) }})
    </template>
  </v-textarea>
</template>
</bd-localized-component>
<v-text-field
v-else-if="fields[key]?.type === 'string'"
v-model="form[key]"
:hide-details="isValid == null || isValid"
density="compact"
variant="solo-filled"
class="me-2"
>
<template #label>
  <span>{{ t(fields[key].title) }}</span>
</template>
</v-text-field>
<v-textarea
v-else-if="fields[key]?.type === 'text'"
v-model="form[key]"
:hide-details="isValid == null || isValid"
density="compact"
variant="solo-filled"
class="me-2"
>
<template #label>
  <span>{{ t(fields[key].title) }}</span>
</template>
</v-textarea>
<v-select
v-else-if="fields[key]!.type! === 'icon'"
:model-value="getTyped<string>(form[key])"
:label="t(fields[key].field?.label ?? fields[key].title)"
:item-props="true"
hide-details
variant="solo-filled"
density="compact"
class="me-2"
:items="Object.keys(iconAliases).map((a) => ({
  title: a.replace(/(_|[A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase()).replace(/-/g, ' ').replace(/_/g, ' '),
  value: a,
  prependIcon: `$${a}`,
  density: 'compact',
}))"
:menu-props="{ zIndex: 3001 }"
@update:model-value="form[key] = $event"
>
<template #selection="{ item: innerItem }">
  <v-list-item
    :prepend-icon="`${innerItem.value}`"
    :title="innerItem.title"
    density="compact"
  />
</template>
</v-select>
<vue-date-picker
v-else-if="['date', 'datetime'].includes(fields[key]!.type!)"
:model-value="getTyped<Date>(form[key])"
:teleport="true"
:dark="current.dark"
placeholder="Select date"
position="left"
:clearable="false"
:enable-time-picker="fields[key]!.type === 'datetime'"
:model-type="fields[key]!.type === 'datetime' ? 'timestamp' : 'yyyy-MM-dd'"
:utc="fields[key]!.type === 'datetime'"
@update:model-value="form[key] = getTyped<Date>($event)"
>
<template
  #dp-input="{
    value, onInput, onEnter, onTab, onClear, onBlur, onKeypress, onPaste,
  }"
>
  <v-text-field
    :model-value="value"
    :label="t(fields[key].field?.label ?? fields[key].title)"
    :hide-details="isValid == null || isValid"
    :dense="true"
    variant="solo-filled"
    :menu-props="{ zIndex: 3001 }"
    density="compact"
    class="me-2"
    @input="onInput"
    @keydown.enter="onEnter"
    @keydown.tab="onTab"
    @keydown.esc="onClear"
    @blur="onBlur"
    @keypress="onKeypress"
    @paste="onPaste"
  />
</template>
</vue-date-picker>

<v-btn
v-if="isModal"
variant="tonal"
:text="t(`actions.cancel`)"
@click="emit('cancel')"
/>
<v-btn
variant="tonal"
:disabled="!isChanged"
@click="resetForm"
>
RESET
</v-btn>
<v-btn
variant="tonal"
:disabled="!isValid || (operation === 'edit' && !isChanged)"
@click="emit('submit', form)"
>
<i18n-t
  scope="global"
  :keypath="`crud.${operation}.confirm`"
>
  <template #entity>
    {{ t(`entities.${modelName}.name`) }}
  </template>
</i18n-t>
</v-btn>

<bd-form
v-if="item"
:entity="props.entity"
:loading="loading"
:fields="fields"
:item="item"
:locales-per-row="2"
@submit="onSubmit"
/>
-->
