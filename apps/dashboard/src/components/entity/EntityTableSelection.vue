<script setup lang="ts">
import { keyOrDefault } from '@/helpers'

defineProps<{
  item?: any
  allSelected?: boolean
  someSelected?: boolean
  selected?: number[]
}>()
const emit = defineEmits<{
  (e: 'select', value: number | boolean | null): void
}>()
</script>

<template>
  <v-checkbox
    :model-value="item
      ? selected!.includes(keyOrDefault(item, 'id', -1))
      : allSelected"
    :indeterminate="someSelected"
    density="compact"
    hide-details
    true-icon="$mdi-checkbox-marked"
    false-icon="$mdi-checkbox-blank-outline"
    @update:model-value="emit('select', item ? keyOrDefault(item, 'id', -1) : $event)"
  />
</template>
