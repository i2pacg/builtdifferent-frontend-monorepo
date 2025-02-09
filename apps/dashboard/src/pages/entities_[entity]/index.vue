<!-- eslint-disable unused-imports/no-unused-vars -->
<script setup lang="ts">
/* eslint-disable unused-imports/no-unused-imports */
import type { ApiResponse, PagingResponse, SortItem, TableHeaders } from '@/interfaces'
import type { TableHandling, UserColumnPreferences } from '@i2pacg/builtdifferent-frontend-tsdata'
import type { Response } from '@pinia-orm/axios'
import type { AxiosResponse } from 'axios'
import type { Constructor, Model, Relation } from 'pinia-orm'
import type { SortableEvent } from 'sortablejs'
import { LOG_COMPONENTS_COLOR } from '@/constants'
import { getExistingProp } from '@/interfaces'
import { EntityFieldConfig, isFieldIcon } from '@i2pacg/builtdifferent-frontend-tsdata'
import { TextContent } from '@i2pacg/builtdifferent-frontend-tsdata/models'
import { UseTimeAgo } from '@vueuse/components'
import { objectEntries, useElementSize, useSorted } from '@vueuse/core'
import { useRouteQuery } from '@vueuse/router'
import { drop, isDate, snakeCase } from 'lodash-unified'
import { BooleanAttr, HasMany, MorphedByMany, MorphMany } from 'pinia-orm'
import qs from 'qs'
import { Sortable } from 'sortablejs-vue3'
import TextClamp from 'vue3-text-clamp'
import { useRoute } from 'vue-router'

const props = defineProps<{
  entity: string
  slug?: string
  data: Entity
  model: Constructor<Model>
}>()

defineEmits<{
  (e: 'updateBreadcrumbs', breadcrumbs: Array<any>): void
}>()
const route = useRoute('entities.index')
const router = useRouter()

const { columns, entityConfig, entityPreferences, modelFields, relations, entityName } = useEntity(props.model)
const visibleColumns = computed(() => objectEntries(columns.value)
  .filter(([, { visible }]) => visible)
  .map(([column]) => column.toString()))

const { t, n } = useI18n()
const { currentLanguage } = useLocales()

const table = ref()
const { width } = useElementSize(table)
const total = ref(0)
const items = ref<Model[]>([])
const selected = ref<number[]>([])
const isFetching = ref(false)
const page = ref(1)
const sortBy = ref<SortItem>([])
const search = ref<string | undefined>(undefined)

const repoQuery = computed(() => {
  const q = useRepo(props.model)
    .query()
    .limit(entityPreferences.itemsPerPage)
    .offset((page.value - 1) * entityPreferences.itemsPerPage)
  q.where((element) => {
    if (search.value) {
      console.log('searching for:', search.value)
      return element.$getOriginal().toString().toLowerCase().includes(search.value! as string)
    }
    return true
  })
  visibleColumns.value.forEach((key) => {
    if (relations[key]) {
      q.with(key)
    }
  })
  return q
})
const tableHeaders = computed<TableHeaders>(() => {
  return [
    ...visibleColumns.value.map((key) => {
      return {
        key,
        title: t(`entities.${entityName}.columns.${key}.header`),
        minWidth: entityConfig.fields[key]?.table?.minWidth ?? 'auto',
        align: entityConfig.fields[key]?.table?.align ?? 'start',
        nowrap: entityConfig.fields[key]?.table?.nowrap ?? false,
      } as TableHeader
    }),
    {
      key: 'actions',
      title: t('common.columns.actions.header'),
      align: 'center',
      nowrap: false,
      width: 'auto',
      value: 'slug',
    },
  ] as TableHeaders
})

/**
 * Updates columns positions after drag and drop reordering
 * @param evt The sortable event containing old and new indices
 */
function updateColumnsPositions(evt: SortableEvent): void {
  if (evt.newIndex === undefined || evt.oldIndex === undefined)
    return
  const sortedColumns = objectEntries(columns.value)
    .filter(([, config]) => config.visible)
    .sort(([, a], [, b]) => a.position! - b.position!)
    .map(([key]) => key)
  const [movedColumn] = sortedColumns.splice(evt.oldIndex, 1)
  sortedColumns.splice(evt.newIndex, 0, movedColumn)
  Object.assign(
    entityPreferences.columnsConfig,
    sortedColumns.reduce((acc, column, idx) => {
      acc[column] = {
        ...columns.value[column],
        position: idx,
      }
      return acc
    }, {} as Record<string, UserColumnPreferences>),
  )
}

/**
 * Toggles visibility of a column in the table
 * @param column The column key to toggle
 */
function toggleColumnVisibility(column: string) {
  Object.assign(entityPreferences.columnsConfig, {
    [column]: {
      ...columns.value[column],
      visible: !columns.value[column]?.visible,
    },
  })
}

async function fetchItems() {
  console.log(`%c[EntityListView] %c[fetchItems] Fetching ${props.entity}...`, LOG_COMPONENTS_COLOR, 'color: lightseagreen;', route.query)

  try {
    isFetching.value = true
    const params = {
      page: page.value,
      itemsPerPage: entityPreferences.itemsPerPage,
      sortBy: sortBy.value,
      with: Object.keys(relations).filter(k => visibleColumns.value.includes(k)),
      search: search.value,
      include: visibleColumns.value.filter(key => !relations[key]).map(key => snakeCase(key)),
      /*  with:columns.value.filter(([, { visible }]) => visible).map(([key]) => key), */
    }
    await useAxiosRepo(props.model).api().get(`/api/entities/${props.entity}`, {
      params,
      dataTransformer(response: AxiosResponse<ApiResponse<PagingResponse>>) {
        if (!response.data.success)
          throw new Error(response.data.message)
        total.value = response.data.result.total
        return response.data.result.data
      },
    })

    items.value = repoQuery.value.get()
    /*
    items.value = data
    total.value = meta.total
 */
  }
  catch (error) {
    console.error(`%c[EntityListView] %c[fetchItems] Error fetching ${props.entity}:`, LOG_COMPONENTS_COLOR, 'color: red;', error)
  }
  finally {
    isFetching.value = false
  }
}
const isManyRelation = (relation?: Relation): boolean => relation ? relation instanceof HasMany || relation instanceof MorphedByMany || relation instanceof MorphMany : false

// Watch for changes in page, itemsPerPage or sortBy
/* watch([page, itemsPerPage, sortBy], () => {
  fetchItems()
})
 */
onMounted(() => {
  // fetchItems()
})
</script>

<template>
  <!--  <pre>
    {{ selected }}
  </pre> -->
  <v-progress-circular
    v-if="!data"
    indeterminate
    color="primary"
    size="64"
    class="absolute-center"
  />
  <v-data-table-server
    ref="table"
    v-model="selected"
    v-model:items-per-page="entityPreferences.itemsPerPage"
    v-model:sort-by="sortBy"
    v-model:page="page"
    v-model:search="search"
    :items-length="total"
    :items="items"
    :headers="tableHeaders"
    :loading="isFetching"
    item-value="id"
    width="100%"
    fixed-header
    fixed-footer
    next-icon="$mdi-chevron-right"
    prev-icon="$mdi-chevron-left"
    first-icon="$mdi-chevron-double-left"
    last-icon="$mdi-chevron-double-right"
    density="compact"
    :row-props="(row) => ({ class: selected.includes(getExistingProp(row.item, 'id')) ? 'bg-background-lighten-2' : '' })"
    hover
    show-current-page
    items-per-page-text="Items per page"
    :items-per-page-options="[5, 10, 25, 50, 100]"
    multi-sort
    sort-desc-icon="$mdi-chevron-down"
    sort-asc-icon="$mdi-chevron-up"
    item-selectable
    :show-select="false"
    @update:options="fetchItems"
    @click:row="(_:Event, row:any) => (console.log(row), row.toggleSelect(row.internalItem))"
  >
    <template #top>
      <v-sheet display="flex" align="center" class="pa-4">
        <v-sheet class="d-flex">
          <v-text-field
            :model-value="search"
            label="Search"
            density="compact"
            hide-details
            prepend-inner-icon="$mdi-magnify"
            clearable
            variant="solo-filled"
            @update:model-value="(v:any) => !v ? search = undefined : search = v"
            @clear="fetchItems"
          />
          <v-spacer />
          <v-menu
            :close-on-content-click="false"
            style="opacity: 0.95;"
            width="300"
          >
            <template #activator="{ props: menuProps }">
              <v-list-item
                append-icon="$mdi-filter"
                v-bind="menuProps"
                variant="tonal"
                :density="menuProps.density"
              >
                <template #title>
                  <i18n-t
                    class="text-grey text-caption align-self-center"
                    keypath="common.crud.columns.count"
                    :plural="visibleColumns.length"
                    scope="global"
                    tag="small"
                  >
                    <template #count>
                      <strong>
                        {{ n(visibleColumns.length, 'normal', currentLanguage!.locale) }}
                      </strong>
                    </template>
                  </i18n-t>
                </template>
              </v-list-item>
            </template>
            <v-card variant="flat" class="elevation-1">
              <sortable
                tag="div"
                class="v-list v-list--density-default v-list--one-line"
                :options="{
                  animation: 150,
                  easing: 'cubic-bezier(1, 0, 0, 1)',
                  handle: '.handle',
                  draggable: '.v-list-item--active',
                }"
                group="columns"
                :item-key="(key:string) => key"
                :list="Object.keys(columns)"
                @end="updateColumnsPositions"
              >
                <template #item="{ element: item, index }">
                  <v-list-item
                    variant="plain"
                    density="compact"
                    :active="columns[item].visible"
                    :class="{
                      'border-b-sm': index !== Object.keys(columns).length - 1,
                    }"
                  >
                    <template
                      v-if="columns[item].visible"
                      #prepend
                    >
                      <v-icon
                        class="handle"
                        icon="$mdi-drag"
                        size="x-small"
                      />
                    </template>
                    <template #title>
                      <small>
                        {{ t(`entities.${entityName}.columns.${item}.header`) }}
                      </small>
                    </template>
                    <template #append>
                      <v-btn
                        :icon="columns[item].visible ? '$mdi-eye' : '$mdi-eye-off'"
                        size="x-small"
                        variant="text"
                        @click.stop="toggleColumnVisibility(item)"
                      />
                    </template>
                  </v-list-item>
                </template>
              </sortable>
            </v-card>
          </v-menu>
          <v-btn
            icon="$mdi-reload"
            :rounded="0"
            size="small"
            variant="text"
            @click="fetchItems"
          />
        </v-sheet>
        <v-sheet
          class="d-flex mt-2"
        >
          <v-select
            v-model="entityPreferences.itemsPerPage"
            :items="[5, 10, 25, 50, 100]"
            label="Items per page"
            hide-details
            tile
            max-width="150px"
            variant="solo-filled"
            density="compact"
            @update:model-value="fetchItems"
          />
          <v-spacer />
          <v-pagination
            v-model="page"
            :length="Math.ceil(total / entityPreferences.itemsPerPage)"
            :total-visible="5"
            :disabled="isFetching"
            density="compact"
            show-first-last-page
            @update:options="fetchItems"
          />
        </v-sheet>
      </v-sheet>
    </template>

    <!--  <template #[`header.data-table-select`]="{ allSelected, someSelected, selectAll }">
      <v-checkbox
        :model-value="allSelected"
        :indeterminate="someSelected && !allSelected"
        density="compact"
        hide-details
        true-icon="$mdi-checkbox-marked"
        false-icon="$mdi-checkbox-blank-outline"
        indeterminate-icon="$mdi-minus-box"
        :width="28"
        center-affix
        class="text-center"
        @click="selectAll(!allSelected)"
      />
    </template>
    <template #[`item.data-table-select`]="{ isSelected, toggleSelect, internalItem }">
      <v-checkbox
        :model-value="isSelected(internalItem)"
        density="compact"
        hide-details
        @click="toggleSelect(internalItem)"
      />
    </template> -->

    <template
      v-for="key in visibleColumns"
      :key="key"
      #[`item.${key}`]="{ value }"
    >
      <v-chip
        v-if="relations[key] && isManyRelation(relations[key])"
        color="primary"
        :text="`${((value ?? []) as []).length} ${key}`"
      />
      <use-time-ago
        v-else-if="isDate(value)"
        v-slot="{ timeAgo }"
        :time="value"
      >
        <span>{{ timeAgo }}</span>
      </use-time-ago>
      <v-switch
        v-else-if="(modelFields[key] instanceof BooleanAttr)"
        :model-value="value"
        hide-details
        color="primary"
        center-affix
        density="compact"
        :inline="true"
      />
      <text-content-cell
        v-else-if="entityConfig.fields[key]?.textType"
        :value="value"
        :nowrap="entityConfig.fields[key]?.table?.nowrap"
      />
      <text-clamp
        v-else
        v-tooltip="value ? value.toString() : ''"
        :text="value ? value.toString() : ''"
        :max-lines="1"
      />
    </template>
    <template #[`item.actions`]="{ item, value }">
      <v-btn
        class="me-1"
        variant="plain"
        icon="$mdi-pencil"
        size="small"
        :to="{
          name: 'entities.details',
          params: {
            entity: props.entity,
            slug: value || item.$getOriginal().slug || item.$getOriginal().id || 'new',
          },
        }"
      />
    </template>
  </v-data-table-server>
</template>

<route lang="json">
{
  "$schema": "https://raw.githubusercontent.com/posva/unplugin-vue-router/main/route.schema.json",
  "path": "/entities/:entity",
  "props": true,
  "name": "entities.index",
  "meta": {
    "layout": false,
    "permissions": ["admin.super"],
    "requiresAuth": true
  }
}
</route>
