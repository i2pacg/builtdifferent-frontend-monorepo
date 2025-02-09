<!-- eslint-disable unused-imports/no-unused-vars -->
<script setup lang="ts">
// Type imports
import type { AutoCompleteProps, CustomFilter, DataIteratorItem, Group, InternalItem, InternalListItem } from '@/interfaces'
import type { RelationConfig, UserFormPreferences } from '@i2pacg/builtdifferent-frontend-tsdata'
import type { AxiosResponse } from 'axios'
import type { Element, Relation } from 'pinia-orm'

import { useEntity } from '@/composables/useEntity'
// Regular imports
import { LOG_COMPONENTS_COLOR } from '@/constants'
import { isGroup, isType } from '@/interfaces'
import axios from 'axios'
import { isArray, keyBy, snakeCase } from 'lodash-unified'
import { BelongsTo, Model, MorphMany } from 'pinia-orm'
import { markRaw, nextTick } from 'vue'
import { VAutocomplete, VCheckbox, VListItem, VListSubheader, VRadio, VSwitch } from 'vuetify/components'
/* defineProps<{
  relation: Relation
  label?: string
  item?: Element
  relationConfig?: RelationConfig
}>() */
// Component props and model
const props = withDefaults(defineProps<{
  relation: Relation
  relationConfig?: RelationConfig
  item: Model
  label?: string
  variant?: 'outlined'
    | 'plain'
    | 'underlined'
    | 'filled'
    | 'solo'
    | 'solo-inverted'
    | 'solo-filled'
}>(), {
  variant: 'outlined',
})
const model = defineModel<Model | Model[]>()

// Component state
const ready = ref(false)
const loading = ref(false)
const menu = ref(false)
const search = ref()
const autocomplete = ref()
const itemsPerPage = ref(3)
const displayMode = ref<DisplayMode>(markRaw(VAutocomplete))
const cancelTokenSource = ref(axios.CancelToken.source())
const groupBy = ref()
// Constants
const GROUPED_ITEMS_PER_PAGE = [1, 2, 3, 4, 5, 6]
const ITEMS_PER_PAGE = [5, 10, 25, 50, 100]
const DISPLAY_MODES = [
  { value: markRaw(VAutocomplete), icon: '$mdi-magnify', title: 'common.listing.display.search' },
  { value: markRaw(VSwitch), icon: '$mdi-toggle-switch', title: 'common.listing.display.switch' },
  { value: markRaw(VCheckbox), icon: '$mdi-checkbox-marked', title: 'common.listing.display.checkbox' },
  { value: markRaw(VRadio), icon: '$mdi-radiobox-marked', title: 'common.listing.display.radio' },
] as const
type DisplayMode = typeof DISPLAY_MODES[number]['value']

const { t } = useI18n()

const selectedIds = computed(() => {
  const selected = (isArray(model.value) ? model.value : [model.value]) as Model[]
  return selected.map((item: Model) => item.$getKey())
})
function toggleSelection(item: InternalListItem | Model) {
  if (item instanceof Model) {
    if (props.relation instanceof BelongsTo) {
      model.value = item
    }
    else if (isArray(model.value)) {
      const index = model.value.findIndex((i: Model) => i.$getKey() === item.$getKey())
      if (index > -1) {
        model.value.splice(index, 1)
      }
      else {
        model.value.push(item)
      }
    }
  }
  else
    if (props.relation instanceof BelongsTo) {
      model.value = item.raw as Model
    }
    else if (isArray(model.value)) {
      const index = model.value.findIndex((i: Model) => i.$getKey() === item.value)
      if (index > -1) {
        model.value.splice(index, 1)
      }
      else {
        model.value.push(item.raw as Model)
      }
    }
}
const columnsPerPage = computed(() => {
  console.log(`%c[RelationField] [columnsPerPage]`, LOG_COMPONENTS_COLOR, itemsPerPage.value)
  return Math.ceil(12 / itemsPerPage.value)
})

const isGridView = computed(() => displayMode.value !== VAutocomplete)

function toggleDisplayMode(mode: DisplayMode) {
  console.log(`%c[RelationField] [toggleDisplayMode]`, LOG_COMPONENTS_COLOR, mode)
  displayMode.value = mode
  if (mode === VAutocomplete) {
    nextTick(() => {
      autocomplete.value?.$el.querySelector('input')?.focus()
    })
  }
}

const entity = computed(() => {
  return useEntity(props.relation.related.$self())
})

const groupableFields = computed(() => {
  return Object.entries(entity.value?.modelFields || {})
    .filter(([key, _]) => entity.value.entityConfig.fields[key]?.table?.groupable)
    .flatMap(([key]) => key)

  /*
    .map(([field]) => ({
      title: t(`entities.${props.relation.related.$entity()}.columns.${field}.label`),
      value: field,
    })) */
})

const relationOptions = computed(() => {
  const query = useRepo(props.relation.related.$self())
    .query()
    .where((item: Element) => props.relationConfig?.filter?.(item, props.item) ?? true)

  if (groupBy.value) {
    const childrenKey = entity.value.entityConfig.fields[groupBy.value]?.table?.groupable?.childrenKey
    if (childrenKey) {
      if (isGridView.value) {
        query.whereNotNull(groupBy.value)
      }
      else {
        query
          .with(childrenKey)
          .has(childrenKey, '>', 0)
          .whereHas(childrenKey, undefined, '>', 0)
      }
    }
  }

  return query.get()
})
/* function getSubItems(option: InternalListItem): InternalListItem[] {
  if (option.children) {
    console.log(`%c[RelationField] [getSubItems]`, LOG_COMPONENTS_COLOR, option.children)
    return option.title.toString().toLowerCase().includes(search.value?.toLowerCase() || '')
      ? option.children
      : option.children.filter(item => !search.value || item.title.toString().toLowerCase().includes(search.value.toLowerCase()))
  }
  return []
} */

const noExactMatch = computed(() => {
  if (props.relationConfig?.group?.itemKey) {
    return !relationOptions.value.some((item: Element) => {
      return item.toString() === search.value
        || item[props.relationConfig!.group!.itemKey as keyof Element]?.some((child: Element) => child.toString() === search.value)
    })
  }
  return !relationOptions.value.some((item: Element) => item.toString() === search.value)
})
const noResults = computed(() => {
  return !relationOptions.value.some((item: Element) => {
    if (props.relationConfig?.group?.itemKey) {
      return !search.value
        || item.toString().toLowerCase().includes(search.value.toLowerCase())
        || item[props.relationConfig.group.itemKey as keyof Element]?.some(
          (child: Element) => child.toString().toLowerCase().includes(search.value.toLowerCase()),
        )
    }
    return !search.value || item.toString().toLowerCase().includes(search.value.toLowerCase())
  })
})

const canCreate = computed(() => {
  return Boolean(
    props.relationConfig?.canCreate
    && search.value && noExactMatch.value,
  )
})

async function fetchOptions() {
  try {
    cancelTokenSource.value.cancel('Operation canceled due to new request.')
    cancelTokenSource.value = axios.CancelToken.source()

    const entityName = props.relation.related.$entity()
    loading.value = true
    const include = ['id', props.relation.related.$getDisplayField(), snakeCase(props.relationConfig?.group?.groupKey), 'slug'].filter(Boolean)
    const join = [props.relationConfig?.group?.groupName, props.relationConfig?.group?.itemKey].filter(Boolean)

    useAxiosRepo(props.relation.related.$self())
      .api()
      .get(`/api/entities/${entityName}`, {
        params: {
          with: join,
          include,
          ...(search.value
            ? {
                search: search.value,
                searchIn: [props.relation.related.$getDisplayField()],
              }
            : {}),
        },
        cancelToken: cancelTokenSource.value.token,
        dataTransformer: (response: AxiosResponse<ApiResponse<Element[]>>) => {
          if (!response.data.success || !response.data.result) {
            throw new Error('Invalid response')
          }
          return response.data.result
        },
      })
      .catch((error: Error) => {
        if (!axios.isCancel(error)) {
          console.error(`%c[RelationField] [fetchOptions] Error:`, 'color: red', error)
        }
      })
      .finally(() => {
        useRepo(props.relation.related.$self()).hydratedDataCache.clear()
        autocomplete.value?.$forceUpdate()
        autocomplete.value?.focus()
        loading.value = false
        nextTick(() => {
          if (search.value) {
            menu.value = true
          }
        })
      })
  }
  catch (error) {
    if (!axios.isCancel(error)) {
      console.error(`%c[RelationField] [fetchOptions] Error:`, 'color: red', error)
    }
  }
}

onMounted(async () => {
  try {
    fetchOptions()
    ready.value = true
  }
  catch (error) {
    console.error(`%c[RelationField] [onMounted] Error:`, 'color: red', error)
  }
})

onBeforeUnmount(() => {
  cancelTokenSource.value.cancel('Component unmounted')
})

function handleEnter() {
  if (props.relationConfig?.canCreate && search && noExactMatch) {
    menu.value = false
    const item = props.relation.related.$self().newRawInstance()
    item.$safelySet(item.$getDisplayField(), search.value.trim())
    if (props.relation instanceof BelongsTo) {
      model.value = item
    }
    else if (isArray(model.value)) {
      model.value!.push(item)
    }
    search.value = ''
  }
}

/* const autoCompleteProps: ComputedRef<AutoCompleteProps> = computed(() => ({
  'custom-filter': (itemText: string, queryText: string, item: InternalListItem) => {
    if (!queryText)
      return true
    const query = queryText.toLowerCase()
    if (props.relationConfig?.group?.itemKey) {
      return item.children!.some(subItem => subItem.title.toString().toLowerCase().includes(query))
        || item.title.toString().toLowerCase().includes(query)
    }
    return itemText.toString().toLowerCase().includes(query)
  },
})) */

// We can save this configuration per entity type for future use
watch(displayMode, (newMode) => {
  const entityName = props.relation.related.$entity()
  // TODO: Save display preference
  console.log(`Display mode changed to ${newMode.name} for ${entityName}`)
})

const customFilter: CustomFilter = (value: string, queryText: string, item?: InternalItem) => {
  if (!queryText)
    return true
  if (isType<InternalListItem>(item!) && item.children) {
    return item!.children!.some(subItem => subItem.title.toString().toLowerCase().includes(queryText))
      || item!.title.toString().toLowerCase().includes(queryText)
  }
  return value.toString().toLowerCase().includes(queryText.toLowerCase())
}
</script>

<template>
  <!-- Remove the standalone menu button -->
  <div class="d-flex align-center gap-2 w-100">
    <v-autocomplete
      v-if="!isGridView"
      ref="autocomplete"
      v-model="model"
      v-model:search="search"
      :custom-filter="customFilter"
      chips
      return-object
      :multiple="!(props.relation instanceof BelongsTo)"
      :variant="props.variant"
      :items="relationOptions"
      :item-children="entity.entityConfig.fields[groupBy]?.table?.groupable?.childrenKey"
      item-value="id"
      :item-props="(item) => {
        return {
          title: item.toString(),
        }
      }"
      :list-props="{
        density: 'compact',
        class: 'compactor underlined py-0',
        bgColor: 'background-darken-1',
        variant: 'plain',
        style: {
          paddingTop: canCreate && !noResults ? '48px !important' : '',
        },
      }"
      class="w-100"
      density="compact"
      @update:search="fetchOptions"
      @update:model-value="model = $event"
      @keydown.enter="handleEnter"
      @keydown.tab.prevent.stop="handleEnter"
    >
      <template #no-data>
        <v-list-item
          lines="one"
          density="compact"
          :height="48"
          class="text-center font-weight-bold bg-background"
          variant="text"
          :loading="loading"
        >
          <template #title>
            <i18n-t keypath="common.crud.newQuick" tag="small" scope="global">
              <template #entity>
                {{ t(`entities.${props.relation.related.$entity()}.name`) }}
              </template>
              <template #name>
                <strong class="text-primary">{{ search }}</strong>
              </template>
            </i18n-t>
          </template>
        </v-list-item>
      </template>
      <template v-if="canCreate && !noResults" #prepend-item>
        <v-list-item
          class="top-0 position-fixed z-index-100 w-100 text-center bg-background"
          lines="one"
          density="compact"
          :height="48"
          variant="text"
          @click="handleEnter"
        >
          <template #title>
            <i18n-t keypath="common.crud.newQuick" tag="small" scope="global">
              <template #entity>
                {{ t(`entities.${props.relation.related.$entity()}.name`) }}
              </template>
              <template #name>
                <strong class="text-primary">{{ search }}</strong>
              </template>
            </i18n-t>
          </template>
        </v-list-item>
      </template>
      <template #item="{ item: option, props: optionProps }">
        <component
          :is="VListItem"
          v-bind="optionProps"
          :prepend-icon="selectedIds.includes(option.value) ? '$mdi-check' : undefined"
        >
          <template #title>
            <span v-highlight="{ text: option.title, query: search }" />
          </template>
        </component>
        <!--   <v-list-group
          v-if="groupBy"
          :items="option.children"
          sub-group
        />
          @click:select="(item) => {
            toggleSelection(item.id as InternalListItem)
          }" -->
        <!--  <pre v-if="index === 0 ">
            {{ optionProps }}
          </pre> -->
        <v-list
          v-if="groupBy"
          class="border-s-thin underlined bg-transparent py-0 ms-4"
          lines="one"
          density="compact"
          variant="plain"
          return-object
          :items="option.children"
          :item-props="(childItem, props) => {
            return {
              ...props,
              prependIcon: selectedIds.includes(childItem.value) ? '$mdi-check' : undefined,
            }
          }"
          @click:select="(item) => {
            toggleSelection(item.id as InternalListItem)
          }"
        />
      </template>
    </v-autocomplete>
    <v-data-iterator
      v-else
      :model-value="(model as any[])"
      :items="relationOptions"
      :loading="loading"
      return-object
      class="w-100"
      :items-per-page="itemsPerPage"
      :group-by="groupBy ? [{ key: groupBy }] : undefined"
      :value-comparator="(a, b) => a.$getKey() === b.$getKey()"
      :multiple="!(props.relation instanceof BelongsTo)"
      @update:model-value="model = $event"
    >
      <template #header>
        <v-sheet :loading="loading" class="d-flex align-center justify-space-between pa-2">
          <div class="d-flex align-center gap-2">
            <component
              :is="displayMode"
              v-if="!(props.relation instanceof BelongsTo)"
              hide-details
              density="compact"
              color="primary"
              :model-value="(model as Model[])?.length === relationOptions?.length"
              @update:model-value="$event ? model = relationOptions : model = []"
            >
              <template #label>
                {{ t(props.label || props.relation.related.$entity()) }}
              </template>
            </component>
          </div>
        </v-sheet>
      </template>
      <!--       <template #header="{ selectAll }">
        <v-sheet :loading="loading" class="d-flex align-center justify-space-between pa-2">
          <div class="d-flex align-center gap-2">
            <component
              :is="displayMode"
              v-if="!(props.relation instanceof BelongsTo)"
              hide-details
              density="compact"
              color="primary"
              :model-value="(model as Model[])?.length === relationOptions?.length"
              @update:model-value="selectAll($event!)"
            >
              <template #label>
                {{ t(props.label || props.relation.related.$entity()) }}
              </template>
            </component>
          </div>
          <div class="d-flex align-center gap-2">
            <v-btn-toggle
              :model-value="displayMode"
              density="compact"
              color="primary"
              variant="outlined"
              mandatory
              @update:model-value="toggleDisplayMode"
            >
              <v-btn
                v-for="mode in DISPLAY_MODES"
                :key="mode.value.name"
                :value="mode.value"
                :icon="mode.icon"
                size="small"
              >
                <v-tooltip :text="mode.title" location="bottom">
                  <template #activator="{ props: tooltipProps }">
                    <v-icon v-bind="tooltipProps" :icon="mode.icon" />
                  </template>
                </v-tooltip>
              </v-btn>
            </v-btn-toggle>
          </div>
        </v-sheet>
      </template>

      <template #footer="{ pageCount, setPage, page, itemsPerPage: iteratorItemsPerPage, setItemsPerPage }">
        <v-sheet :loading="loading" class="d-flex align-center justify-space-between pa-2">
          <v-select
            v-if="!props.relationConfig?.group"
            density="compact"
            hide-details
            variant="outlined"
            style="max-width: 120px"
            :items="ITEMS_PER_PAGE"
            :model-value="iteratorItemsPerPage"
            @update:model-value="setItemsPerPage"
          >
            <template #prepend-inner>
              <v-icon size="small">
                $mdi-format-list-numbered
              </v-icon>
            </template>
          </v-select>
          <v-select
            density="compact"
            hide-details
            variant="outlined"
            style="max-width: 120px"
            :items="GROUPED_ITEMS_PER_PAGE"
            :model-value="iteratorItemsPerPage"
            @update:model-value="itemsPerPage = $event"
          >
            <template #prepend-inner>
              <v-icon size="small">
                $mdi-format-list-numbered
              </v-icon>
            </template>
          </v-select>
          <v-pagination
            :length="pageCount"
            :loading="loading"
            :model-value="page"
            :total-visible="5"
            density="compact"
            @update:model-value="setPage($event)"
          />
        </v-sheet>
      </template> -->
      <template #default="{ groupedItems, items, toggleSelect, isSelected }">
        <template v-if="groupBy">
          <v-row no-gutters>
            <v-col
              v-for="groupedItem in groupedItems.map(i => i as Group<DataIteratorItem<Model>>)"
              :key="groupedItem.value"
              :cols="columnsPerPage"
            >
              <v-list
                lines="one"
                class="compactor ps-2"
                density="compact"
              >
                <model-loader :id-or-element="groupedItem.value" :model="props.relation.related.$self()">
                  <template #default="{ item: parentItem }">
                    <component
                      :is="displayMode"
                      v-if="parentItem"
                      :model-value="selectedIds.includes(parentItem.$getKey())"
                      :label="parentItem.toString()"
                      density="compact"
                      hide-details
                      color="primary"
                      class="border-b-thin"
                      @update:model-value="toggleSelection(parentItem as Model)"
                    >
                      <template #label="{ label: itemLabel }">
                        <small v-highlight="{ text: itemLabel, query: search }" />
                      </template>
                    </component>
                  <!--   <component
                      :is="VListItem"
                      :prepend-icon="isSelected(groupedItem.value) ? '$mdi-check' : undefined"
                    >
                      <template #title>
                        <span v-highlight="{ text: parentItem, query: search }" />
                      </template>
                    </component> -->
                    <!--          <v-list-subheader>
                      {{ parentItem }}
                    </v-list-subheader> -->
                  </template>
                </model-loader>
                <template v-if="groupedItem.items && Array.isArray(groupedItem.items)">
                  <component
                    :is="displayMode"
                    v-for="innerItem in groupedItem.items.map(i => i as DataIteratorItem<Model>)"
                    :key="(innerItem.value as string)"
                    :model-value="isSelected(innerItem)"
                    :label="innerItem.raw.toString()"
                    density="compact"
                    hide-details
                    color="primary"
                    class="ps-4"
                    @update:model-value="toggleSelect(innerItem)"
                  >
                    <template #label="{ label: itemLabel }">
                      <small v-highlight="{ text: itemLabel, query: search }" />
                    </template>
                  </component>
                </template>
              </v-list>
            </v-col>
          </v-row>
        </template>
        <template v-else>
          <component
            :is="displayMode"
            v-for="innerItem in items"
            :key="(innerItem.value as string)"
            :model-value="isSelected(innerItem)"
            :label="innerItem.raw.toString()"
            density="compact"
            hide-details
            color="primary"
            class="ps-4"
            @update:model-value="toggleSelect(innerItem)"
          >
            <template #label="{ label: itemLabel }">
              <small v-highlight="{ text: itemLabel, query: search }" />
            </template>
          </component>
        </template>
      </template>
    </v-data-iterator>
    <!-- Add combined menu button after main components -->
    <v-menu location="bottom end" :close-on-content-click="false">
      <template #activator="{ props: menuProps }">
        <v-btn
          v-bind="menuProps"
          icon="$mdi-cog"
          size="small"
          variant="text"
          :rounded="0"
          class="mb-auto"
        />
      </template>

      <v-list density="compact" class="compactor" width="200">
        <!-- Display Mode Section -->
        <v-list-subheader>{{ t('common.listing.display.label') }}</v-list-subheader>
        <v-list-item>
          <v-btn-toggle
            :model-value="displayMode"
            density="compact"
            color="primary"
            variant="outlined"
            mandatory
            class="w-100"
            @update:model-value="toggleDisplayMode"
          >
            <v-btn
              v-for="mode in DISPLAY_MODES"
              :key="mode.value.name"
              :value="mode.value"
              icon
              class="flex-1-0"
            >
              <v-tooltip :text="mode.title" location="bottom">
                <template #activator="{ props: tooltipProps }">
                  <v-icon v-bind="tooltipProps" :icon="mode.icon" />
                </template>
              </v-tooltip>
            </v-btn>
          </v-btn-toggle>
        </v-list-item>
        <!--
        <v-list-item
          v-for="mode in DISPLAY_MODES"
          :key="mode.value.name"
          :value="mode.value"
          @click="toggleDisplayMode(mode.value)"
        >
          <template #prepend>
            <v-icon :icon="mode.icon" size="small" />
          </template>
          <v-list-item-title>{{ mode.title }}</v-list-item-title>
        </v-list-item> -->

        <v-divider />

        <!-- Grouping Section -->
        <v-list-subheader>{{ t('common.listing.group.groupBy') }}</v-list-subheader>
        <template v-if="groupableFields.length">
          <v-list-item
            v-for="field in groupableFields"
            :key="field"
            :title="t(`entities.${props.relation.related.$entity()}.columns.${field}.label`)"
            @click="groupBy = (groupBy === field) ? null : field"
          >
            <template #prepend>
              <v-icon :icon="groupBy === field ? '$mdi-check' : ''" size="small" />
            </template>
          </v-list-item>
        </template>
      </v-list>
    </v-menu>
  </div>

  <div v-if="(props.relation instanceof MorphMany)">
    <bd-fields
      v-for="i, x in model"
      :key="x"
      :item="(i as Model)"
      :model="props.relation.related.$self()"
    />
  </div>
  <template v-else>
    <!--      <model-loader :id-or-element="option.value" :model="props.relation.related.$self()">
        <template #default="{ item: parentItem }">
          <component :is="groupBy ? VListSubheader : VListItem" v-bind="option.props" />
        </template>
      </model-loader> -->
    <!--  <v-list-subheader
        v-if="groupBy"
      >
        {{ groupBy }}
      </v-list-subheader> -->
    <!--  <v-list-item
        :key="option.value"
        v-bind="option.props"
        density="compact"
        class="compactor"
        :class="{ 'border-b-thin': index !== relationOptions.length - 1 }"
        @click="toggleSelection(option)"
      >
        <template #prepend>
          <v-icon v-if="selectedIds.includes(option.value)" color="primary" size="16">
            $mdi-check
          </v-icon>
        </template>
      </v-list-item> -->
  <!--   <v-autocomplete
      v-if="!isGridView"
      ref="autocomplete"
      v-bind="autoCompleteProps"
      v-model:menu="menu"
      v-model:search="search"
      :items="relationOptions"
      item-value="id"
      :item-props="(item) => {
        return {
          title: item.toString(),
        }
      }"
      :model-value="model"
      variant="outlined"
      density="compact"
      :label="t(props.label || props.relation.related.$entity())"
      chips
      autofocus
      :list-props="{
        density: 'compact',
        class: 'compactor underlined py-0',
        bgColor: 'background-darken-1',
        variant: 'plain',
        style: {
          paddingTop: canCreate && !noResults ? '48px !important' : '',
        },
      }"
      :multiple="!(props.relation instanceof BelongsTo)"
      tile
      closable-chips
      hide-details
      @update:search="fetchOptions"
      @update:model-value="model = $event"
      @keydown.enter="handleEnter"
      @keydown.tab.prevent.stop="handleEnter"
    >
      <template #no-data>
        <v-list-item
          lines="one"
          density="compact"
          :height="48"
          class="text-center font-weight-bold"
          variant="text"
          :loading="loading"
        >
          <template #title>
            <i18n-t keypath="common.crud.newQuick" tag="small" scope="global">
              <template #entity>
                {{ t(`entities.${props.relation.related.$entity()}.name`) }}
              </template>
              <template #name>
                <strong class="text-primary">{{ search }}</strong>
              </template>
            </i18n-t>
          </template>
        </v-list-item>
      </template>
      <template #append-inner>
        <v-fade-transition>
          <v-progress-circular
            v-if="loading"
            indeterminate
            color="primary"
            size="24"
            width="2"
          />
        </v-fade-transition>
      </template>

      <template v-if="canCreate && !noResults" #prepend-item>
        <v-list-item
          class="top-0 position-fixed z-index-100 w-100 text-center bg-background"
          lines="one"
          density="compact"
          :height="48"
          variant="text"
        >
          <template #title>
            <i18n-t keypath="common.crud.newQuick" tag="small" scope="global">
              <template #entity>
                {{ t(`entities.${props.relation.related.$entity()}.name`) }}
              </template>
              <template #name>
                <strong class="text-primary">{{ search }}</strong>
              </template>
            </i18n-t>
          </template>
        </v-list-item>
      </template>
      <template #item="{ item: option, index }">
        <template v-if="false">
          <v-list
            class="underlined pb-0"
            lines="one"
            density="compact" bg-color="background-darken-1" variant="plain"
          >
            <v-list-subheader>
              <span v-highlight="{ text: option.title, query: search }" />
            </v-list-subheader>
            <template v-if="option.raw[props.relationConfig.group?.itemKey as keyof Model] && option.children">
              <v-list-item
                v-for="subItem in getSubItems(option)"
                :key="subItem.value"
                v-bind="subItem.props"
                density="compact"
                class="compactor"
                @click="toggleSelection(subItem)"
              >
                <template #prepend>
                  <v-icon v-if="selectedIds.includes(subItem.value)" color="primary" size="16">
                    $mdi-check
                  </v-icon>
                </template>
                <template #title>
                  <span v-highlight="{ text: subItem.title, query: search }" />
                </template>
              </v-list-item>
            </template>
          </v-list>
        </template>
        <v-list-item
          v-else
          :key="option.value"
          v-bind="option.props"
          density="compact"
          class="compactor"
          :class="{ 'border-b-thin': index !== relationOptions.length - 1 }"
          @click="toggleSelection(option)"
        >
          <template #prepend>
            <v-icon v-if="selectedIds.includes(option.value)" color="primary" size="16">
              $mdi-check
            </v-icon>
          </template>
        </v-list-item>
      </template>
      <template #chip="{ item: chip, props: chipProps }">
        <v-chip
          v-bind="chipProps"
          density="compact"
        >
          <strong>{{ chip.title }}</strong>
        </v-chip>
      </template>
      <template #append>
        <div class="d-flex align-center">
          <v-menu location="bottom end">
            <template #activator="{ props: menuProps }">
              <v-btn
                v-bind="menuProps"
                icon="$mdi-group"
                size="small"
                variant="text"
                :rounded="0"
              />
            </template>

            <v-list density="compact" width="200">
              <v-list-subheader>{{ t('common.listing.group.groupBy') }}</v-list-subheader>
              <v-list-item
                @click="groupBy = null"
              >
                <template #prepend>
                  <v-icon icon="$mdi-format-list-text" size="small" />
                </template>
                <v-list-item-title>{{ t('common.listing.group.none') }}</v-list-item-title>
              </v-list-item>
              <v-divider v-if="groupableFields.length" />
              <v-list-item
                v-for="field in groupableFields"
                :key="field"
                :title="t(`entities.${props.relation.related.$entity()}.columns.${field}.label`)"
                @click="groupBy = field"
              />
            </v-list>
          </v-menu>

          <v-menu location="bottom end">
            <template #activator="{ props: menuProps }">
              <v-btn
                v-bind="menuProps"
                icon="$mdi-view-grid"
                size="small"
                variant="text"
                :rounded="0"
              />
            </template>

            <v-list density="compact" width="180">
              <v-list-item
                v-for="mode in DISPLAY_MODES.filter(m => m.value !== VAutocomplete)"
                :key="mode.value.name"
                :value="mode.value"
                @click="toggleDisplayMode(mode.value)"
              >
                <template #prepend>
                  <v-icon :icon="mode.icon" size="small" />
                </template>
                <v-list-item-title>{{ mode.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </template>
    </v-autocomplete> -->
    <!-- <v-data-iterator
      v-else
      :model-value="(model as any[])"
      :items="relationOptions"
      :loading="loading"
      return-object
      class="w-100"
      :items-per-page="itemsPerPage"
      :group-by="props.relationConfig?.group ? [{
        key: props.relationConfig.group.groupKey!,
      }] : undefined"
      :value-comparator="(a, b) => a.$getKey() === b.$getKey()"
      multiple
      @update:model-value="model = $event"
    >
      <template #header="{ selectAll }">
        <v-sheet :loading="loading" class="d-flex align-center justify-space-between pa-2">
          <div class="d-flex align-center gap-2">
            <component
              :is="displayMode"
              v-if="!(props.relation instanceof BelongsTo)"
              hide-details
              density="compact"
              color="primary"
              :model-value="(model as Model[])?.length === relationOptions?.length"
              @update:model-value="selectAll($event!)"
            >
              <template #label>
                {{ t(props.label || props.relation.related.$entity()) }}
              </template>
            </component>
          </div>
          <div class="d-flex align-center gap-2">
            <v-btn-toggle
              :model-value="displayMode"
              density="compact"
              color="primary"
              variant="outlined"
              mandatory
              @update:model-value="toggleDisplayMode"
            >
              <v-btn
                v-for="mode in DISPLAY_MODES"
                :key="mode.value.name"
                :value="mode.value"
                :icon="mode.icon"
                size="small"
              >
                <v-tooltip :text="mode.title" location="bottom">
                  <template #activator="{ props: tooltipProps }">
                    <v-icon v-bind="tooltipProps" :icon="mode.icon" />
                  </template>
                </v-tooltip>
              </v-btn>
            </v-btn-toggle>
          </div>
        </v-sheet>
      </template>
      <template #default="{ groupedItems, items, toggleSelect, isSelected }">
        <template v-if="props.relationConfig?.group">
          <v-row no-gutters>
            <v-col
              v-for="groupedItem in groupedItems.map(i => i as Group<DataIteratorItem<Model>>)"
              :key="groupedItem.value"
              :cols="columnsPerPage"
            >
              <v-list
                lines="one"
                class="compactor"
                density="compact"
              >
                <model-loader :id-or-element="groupedItem.value" :model="props.relation.related.$self()">
                  <template #default="{ item: parentItem }">
                    <v-list-subheader>
                      {{ parentItem }}
                    </v-list-subheader>
                  </template>
                </model-loader>
                <component
                  :is="displayMode"
                  v-for="innerItem in groupedItem.items.map(i => i as DataIteratorItem<Model>)"
                  :key="(innerItem.value as string)"
                  :model-value="isSelected(innerItem)"
                  :label="innerItem.raw.toString()"
                  density="compact"
                  hide-details
                  color="primary"
                  class="ps-4"
                  @update:model-value="toggleSelect(innerItem)"
                >
                  <template #label="{ label: itemLabel }">
                    <small v-highlight="{ text: itemLabel, query: search }" />
                  </template>
                </component>
              </v-list>
            </v-col>
          </v-row>
        </template>
        <template v-else>
          <component
            :is="displayMode"
            v-for="innerItem in items"
            :key="(innerItem.value as string)"
            :model-value="isSelected(innerItem)"
            :label="innerItem.raw.toString()"
            density="compact"
            hide-details
            color="primary"
            class="ps-4"
            @update:model-value="toggleSelect(innerItem)"
          >
            <template #label="{ label: itemLabel }">
              <small v-highlight="{ text: itemLabel, query: search }" />
            </template>
          </component>

        </template>
      </template>
      <template #footer="{ pageCount, setPage, page, itemsPerPage: iteratorItemsPerPage, setItemsPerPage }">
        <v-sheet :loading="loading" class="d-flex align-center justify-space-between pa-2">
          <v-select
            v-if="!props.relationConfig?.group"
            density="compact"
            hide-details
            variant="outlined"
            style="max-width: 120px"
            :items="ITEMS_PER_PAGE"
            :model-value="iteratorItemsPerPage"
            @update:model-value="setItemsPerPage"
          >
            <template #prepend-inner>
              <v-icon size="small">
                $mdi-format-list-numbered
              </v-icon>
            </template>
          </v-select>
          <v-select
            density="compact"
            hide-details
            variant="outlined"
            style="max-width: 120px"
            :items="GROUPED_ITEMS_PER_PAGE"
            :model-value="iteratorItemsPerPage"
            @update:model-value="itemsPerPage = $event"
          >
            <template #prepend-inner>
              <v-icon size="small">
                $mdi-format-list-numbered
              </v-icon>
            </template>
          </v-select>
          <v-pagination
            :length="pageCount"
            :loading="loading"
            :model-value="page"
            :total-visible="5"
            density="compact"
            @update:model-value="setPage($event)"
          />
        </v-sheet>
      </template>
    </v-data-iterator> -->
  </template>
<!--   <v-switch
    v-model="wideOpenMenu"
    label="Wide Open Menu"
    inset
    hide-details
  /> -->
<!--   <div class="w-100">
    <pre>
    {{ model }}
  </pre>
  </div> -->     <!-- <v-list lines="one" density="compact">
            <v-list-item
              v-for="(listItem, index) in items"
              :key="index!"
              :title="listItem.raw.toString()"
            >
              <template #prepend>
                <v-switch
                  hide-details
                  density="compact"
                  color="primary"
                  v-for="(listItem, index) in items"
              :key="index!"
              :title="listItem.raw.toString()"
                   :model-value="isSelected(listItem)"
                  @update:model-value="toggleSelect(listItem)"
                />
              </template>
            </v-list-item>
          </v-list> -->
</template>

<style scoped>
.compactor {
  min-height: 32px;
}
</style>
