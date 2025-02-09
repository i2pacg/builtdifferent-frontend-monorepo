<script setup lang="ts">
// Type imports
import type { AutoCompleteProps, DataIteratorItem, Group, InternalListItem } from '@/interfaces'
import type { RelationConfig } from '@i2pacg/builtdifferent-frontend-tsdata'
import type { AxiosResponse } from 'axios'
import type { Element, Model, Relation } from 'pinia-orm'

// Regular imports
import { LOG_COMPONENTS_COLOR } from '@/constants'
import { isGroup } from '@/interfaces'
import axios from 'axios'
import { groupBy, isArray, snakeCase } from 'lodash-unified'
import { BelongsTo, MorphMany } from 'pinia-orm'
import { markRaw, nextTick } from 'vue'
import { VAutocomplete, VCheckbox, VRadio, VSwitch } from 'vuetify/components'

// Component props and model
const props = defineProps<{
  relation: Relation
  label?: string
  item?: Element
  relationConfig?: RelationConfig
}>()
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

// Constants
const GROUPED_ITEMS_PER_PAGE = [1, 2, 3, 4, 5, 6]
const ITEMS_PER_PAGE = [5, 10, 25, 50, 100]
const DISPLAY_MODES = [
  { value: markRaw(VAutocomplete), icon: '$mdi-magnify', title: 'Search' },
  { value: markRaw(VSwitch), icon: '$mdi-toggle-switch', title: 'Switch' },
  { value: markRaw(VCheckbox), icon: '$mdi-checkbox-marked', title: 'Checkbox' },
  { value: markRaw(VRadio), icon: '$mdi-radiobox-marked', title: 'Radio' },
] as const
type DisplayMode = typeof DISPLAY_MODES[number]['value']

const { t } = useI18n()

const selectedIds = computed(() => {
  const selected = (isArray(model.value) ? model.value : [model.value]) as Model[]
  return selected.map((item: Model) => item.$getKey())
})
function toggleSelection(item: InternalListItem) {
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
  displayMode.value = mode
  if (mode === VAutocomplete) {
    nextTick(() => {
      autocomplete.value?.$el.querySelector('input')?.focus()
    })
  }
}

const relationOptions = computed(() => {
  const query = useRepo(props.relation.related.$self())
    .query()
    .where((item: Element) => props.relationConfig?.filter?.(item, props.item) ?? true)
  /* if (props.relationConfig?.group) {
    if (isGridView.value) {
      // When in grid view, show all groups
      query.whereNotNull(props.relationConfig.group.groupKey)
    }
    else {
      // In autocomplete view, only show groups with items
      query
        .with(props.relationConfig.group.itemKey)
        .has(props.relationConfig.group.itemKey, '>', 0)
        .whereHas(props.relationConfig.group.itemKey, undefined, '>', 0)
    }
  } */
  return query.get()
})
function getSubItems(option: InternalListItem): InternalListItem[] {
  if (option.children) {
    return option.title.toString().toLowerCase().includes(search.value?.toLowerCase() || '')
      ? option.children
      : option.children.filter(item => !search.value || item.title.toString().toLowerCase().includes(search.value.toLowerCase()))
  }
  return []
}

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
  }
}

const autoCompleteProps: ComputedRef<AutoCompleteProps> = computed(() => ({
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
  'item-children': props.relationConfig?.group?.itemKey || undefined,
  'returnObject': true,
  'menu-props': {
    zIndex: 3001,
    class: 'position-relative',
  },
}))

// We can save this configuration per entity type for future use
watch(displayMode, (newMode) => {
  const entityName = props.relation.related.$entity()
  // TODO: Save display preference
  console.log(`Display mode changed to ${newMode.name} for ${entityName}`)
})
</script>

<template>
  <!--   <pre>

    {{ loading }}
  </pre> -->
  <div v-if="(props.relation instanceof MorphMany)">
    <bd-fields
      v-for="i, x in model"
      :key="x"
      :item="(i as Model)"
      :model="props.relation.related.$self()"
    />
  </div>
  <template v-else>
    <v-autocomplete
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
        <template v-if="props.relationConfig?.group?.groupKey">
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
          <!-- <v-list lines="one" density="compact">
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
    </v-data-iterator>
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
  </div> -->
</template>

<style scoped>
.compactor {
  min-height: 32px;
}
</style>
