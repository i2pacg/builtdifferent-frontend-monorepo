<script setup lang="ts">
import type { InternalDataTableHeader, SortItem } from '@/interfaces'

const props = defineProps<{
  column: InternalDataTableHeader
  isSorted: boolean
  sortBy: SortItem
}>()
const { t } = useI18n()
function sortIcon(isHovering: boolean) {
  const item = props.sortBy.find(item => item.key === props.column.key)

  return item
    ? item.order === 'asc'
      ? 'mdi-arrow-up'
      : 'mdi-arrow-down'
    : isHovering
      ? 'mdi-arrow-up'
      : null
}
onMounted(() => {})
</script>

<template>
  <v-hover v-slot="{ isHovering, props: hoverProps }">
    <div
      class="d-flex align-center w-100 h-100"
      v-bind="hoverProps"
    >
      <v-sheet
        :width="column.width"
        :align="column.align"
        class="d-flex flex-grow-1"
      >
        <strong>
          {{ t(column.title!) }}
        </strong>
      </v-sheet>
      <v-sheet
        v-if="column.sortable"
        class="d-flex align-center"
        width="24px"
      >
        <v-icon
          v-show="(column.sortable && isHovering) || isSorted"
        >
          {{ sortIcon(isHovering ?? false) }}
        </v-icon>
      </v-sheet>
    </div>
  </v-hover>
</template>
