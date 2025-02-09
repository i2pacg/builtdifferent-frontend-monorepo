<!-- eslint-disable unused-imports/no-unused-vars -->
<script setup lang="ts">
// Regular imports
import type { DisplayMode } from '@/constants'
// Type imports
import type { AutoCompleteProps, CustomFilter, DataIteratorItem, Group, InternalItem, InternalListItem } from '@/interfaces'
import type { RelationConfig, UserFormPreferences } from '@i2pacg/builtdifferent-frontend-tsdata'
import type { AxiosResponse } from 'axios'

import type { Element, Relation } from 'pinia-orm'
import { useEntity } from '@/composables/useEntity'
import { DISPLAY_MODES, LOG_COMPONENTS_COLOR } from '@/constants'
import { isGroup, isType } from '@/interfaces'
import axios from 'axios'
import { isArray, keyBy, snakeCase } from 'lodash-unified'
import { BelongsTo, Model, MorphMany } from 'pinia-orm'
import { markRaw, nextTick } from 'vue'
import { VAutocomplete, VCheckbox, VListItem, VListSubheader, VRadio, VSwitch } from 'vuetify/components'

// Component props and model
const props = withDefaults(defineProps<{
  relation: Relation
  relationConfig?: RelationConfig
  item: Model
  label?: string
  displayMode?: DisplayMode
  groupBy?: string
  variant?: 'outlined'
    | 'plain'
    | 'underlined'
    | 'filled'
    | 'solo'
    | 'solo-inverted'
    | 'solo-filled'
}>(), {
  variant: 'outlined',
  displayMode: 'autocomplete',
})
const model = defineModel<Model | Model[]>()

// Component state
const ready = ref(false)
const loading = ref(false)
const menu = ref(false)
const search = ref('')
const autocomplete = ref()
const itemsPerPage = ref(3)
/* const displayMode = ref<DisplayMode>(markRaw(VAutocomplete)) */
const cancelTokenSource = ref(axios.CancelToken.source())
/* const groupBy = ref() */

// Constants
const GROUPED_ITEMS_PER_PAGE = [1, 2, 3, 4, 5, 6]
const ITEMS_PER_PAGE = [5, 10, 25, 50, 100]
/* const DISPLAY_MODES = [
  { value: markRaw(VAutocomplete), icon: '$mdi-magnify', title: 'common.listing.display.search' },
  { value: markRaw(VSwitch), icon: '$mdi-toggle-switch', title: 'common.listing.display.switch' },
  { value: markRaw(VCheckbox), icon: '$mdi-checkbox-marked', title: 'common.listing.display.checkbox' },
  { value: markRaw(VRadio), icon: '$mdi-radiobox-marked', title: 'common.listing.display.radio' },
] as const
type DisplayMode = typeof DISPLAY_MODES[number]['value'] */
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

const isGridView = computed(() => props.displayMode !== 'autocomplete')

function toggleDisplayMode(mode: DisplayMode) {
  console.log(`%c[RelationField] [toggleDisplayMode]`, LOG_COMPONENTS_COLOR, mode)
/*   displayMode.value = mode
  if (mode === VAutocomplete) {
    nextTick(() => {
      autocomplete.value?.$el.querySelector('input')?.focus()
    })
  } */
}

const entity = computed(() => {
  return useEntity(props.relation.related.$self())
})

/* const groupableFields = computed(() => {
  return Object.entries(entity.value?.modelFields || {})
    .filter(([key, _]) => entity.value.entityConfig.fields[key]?.table?.groupable)
    .flatMap(([key]) => key)
})
 */
const relationOptions = computed(() => {
  const query = useRepo(props.relation.related.$self())
    .query()
    .where((item: Element) => props.relationConfig?.filter?.(item, props.item) ?? true)

  if (props.groupBy) {
    const childrenKey = entity.value.entityConfig.fields[props.groupBy]?.table?.groupable?.childrenKey
    console.log(`%c[RelationField] [relationOptions]`, LOG_COMPONENTS_COLOR, childrenKey)
    if (childrenKey) {
      if (isGridView.value) {
        query.whereNotNull(props.groupBy)
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
          limit: 1,
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

// We can save this configuration per entity type for future use
/* watch(displayMode, (newMode) => {
  const entityName = props.relation.related.$entity()
  // TODO: Save display preference
  console.log(`Display mode changed to ${newMode.name} for ${entityName}`)
}) */

const customFilter: CustomFilter = (value: string, queryText: string, item?: InternalItem) => {
  console.log(`%c[RelationField] [customFilter]`, LOG_COMPONENTS_COLOR, queryText, 'item', item, 'value', value)
  if (!queryText || !item)
    return true
  if (item.value && item.value instanceof Model) {
    console.log(`%c[RelationField] [customFilter]`, LOG_COMPONENTS_COLOR, item.value.$getDisplayField())
    return item.value.toString().toLowerCase().includes(queryText.toLowerCase())
  }
  if (isType<InternalListItem>(item!) && item.children) {
    // Check both the parent item's value and children's values
    return item.title.toString().toLowerCase().includes(queryText.toLowerCase())
      || item.children.some(subItem => subItem.title.toString().toLowerCase().includes(queryText.toLowerCase()))
  }
  return item.toString().toLowerCase().includes(queryText.toLowerCase())
}
</script>

<template>
  <!-- Remove the standalone menu button -->
  <!--   <div class="d-flex align-center gap-2 w-100">

  </div> -->
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
      v-model="model"
      v-model:search="search"
      :custom-filter="customFilter"
      chips
      return-object
      :multiple="!(props.relation instanceof BelongsTo)"
      :variant="props.variant"
      :items="relationOptions"
      :item-children="entity.entityConfig.fields[groupBy!]?.table?.groupable?.childrenKey"
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
      :placeholder="t('common.listing.search', { entity: t(`entities.${props.relation.related.$entity()}.title`) })"
      :label="t(props.label || `entities.${props.relation.related.$entity()}.title`)"
      hide-details
      clearable
      density="compact"
      tile
      closable-chips
      @update:search="fetchOptions"
      @update:model-value="model = $event"
      @keydown.enter="handleEnter"
      @keydown.tab.prevent.stop="handleEnter"
    >
      <template #label>
        <i18n-t :keypath="props.label || `entities.${props.relation.related.$entity()}.title`" scope="global" tag="small" />
      </template>
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
          :disabled="!!groupBy || false"
          :prepend-icon="selectedIds.includes(option.value) ? '$mdi-check' : undefined"
        >
          <template #title>
            <span v-highlight="{ text: option.title, query: search }" />
          </template>
        </component>
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
      <template #chip="{ props: optionProps }">
        <v-chip v-bind="optionProps" size="x-small" />
      </template>
    </v-autocomplete>
    <v-data-iterator
      v-else
      :search="search"
      select-strategy="all"
      :model-value="(model as any[])"
      :items="relationOptions"
      return-object
      class="w-100"
      :items-per-page="itemsPerPage"
      :group-by="groupBy ? [{ key: groupBy }] : undefined"
      :value-comparator="(a, b) => a.$getKey() === b.$getKey()"
      :multiple="!(props.relation instanceof BelongsTo)"
      :custom-filter="customFilter"
      @update:model-value="model = $event"
    >
      <template #header>
        <v-sheet class="d-flex align-center justify-space-between">
          <v-text-field
            v-model="search"
            density="compact"
            tile
            variant="outlined"
            hide-details
            dense
            :label="t(`entities.${props.relation.related.$entity()}.title`)"
            :placeholder="t('common.listing.search', { entity: t(`entities.${props.relation.related.$entity()}.title`) })"
            @update:model-value="fetchOptions"
          >
            <template v-if="loading" #append-inner>
              <v-progress-circular
                indeterminate
                size="16"
                color="primary"
              />
            </template>
          </v-text-field>
          <v-divider vertical class="mx-2" />
          <v-checkbox
            v-if="!(props.relation instanceof BelongsTo)"
            hide-details
            density="compact"
            color="primary"
            :model-value="(model as Model[])?.length === relationOptions?.length"
            :label="t('common.listing.selectAll')"
            @update:model-value="$event ? model = relationOptions : model = []"
          />
        </v-sheet>
      </template>
      <template #default="{ groupedItems, items, toggleSelect, isSelected }">
        <template v-if="groupBy">
          <v-row no-gutters>
            <v-col
              v-for="(groupedItem, index) in groupedItems.map(i => i as Group<DataIteratorItem<Model>>)"
              :key="groupedItem.value"
              :cols="columnsPerPage"
              class="border-e-thin"
              :class="{
                'border-s-thin': index === 0,
              }"
            >
              <v-list
                lines="one"
                class="compactor"
                density="compact"
              >
                <model-loader :id-or-element="groupedItem.value" :model="props.relation.related.$self()">
                  <template #default="{ item: parentItem }">
                    <v-list-subheader
                      v-if="parentItem"
                      class="border-b-thin"
                    >
                      <span v-highlight="{ text: parentItem.toString(), query: search }" />
                    </v-list-subheader>
                  </template>
                </model-loader>
                <template v-if="groupedItem.items && Array.isArray(groupedItem.items)">
                  <component
                    :is="DISPLAY_MODES[displayMode].value"
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
            :is="DISPLAY_MODES[displayMode].value"
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
  </template>
  <!--
  <pre>
    {{ props.relationConfig }}
  </pre> -->
  <!-- <v-menu location="bottom end" :close-on-content-click="false">
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

      <v-divider />

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
  </v-menu> -->
</template>

<style scoped>
.compactor {
  min-height: 32px;
}
</style>
   <!-- Add combined menu button after main components -->
    <!--    <v-menu location="bottom end" :close-on-content-click="false">
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

        <v-divider />

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
    </v-menu> -->
