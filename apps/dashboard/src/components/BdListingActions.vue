<script lang="ts" setup generic="T extends Model">
import type { Constructor, Model } from 'pinia-orm'
import { keyOrDefault } from '@/helpers'
/* updateColumns: (newValue: string[]) => void */
const props = defineProps<{
  item: T
  mediaCollections?: boolean

}>()
const emit = defineEmits<{
  (e: 'delete', id: number): void
}>()
onMounted(() => {
})
</script>

<template>
  <div class="d-flex">
    <v-btn
      class="me-1"
      variant="plain"
      icon="$mdi-pencil"
      :to="`/entities/${props.item.$entity()}/${keyOrDefault(item, 'slug', keyOrDefault(item, 'id', 'new'))}`"
    />
    <v-btn
      v-if="mediaCollections"
      class="me-1"
      variant="plain"
      icon="$ep-files"
      :to="`/entities/${props.item.$entity()}/${keyOrDefault(item, 'slug',
                                                             keyOrDefault(item, 'id', 'new'))}/media`"
    />
    <v-btn
      color="error"
      variant="plain"
      icon="$mdi-delete"
      @click="emit('delete', keyOrDefault(item, 'id', -1))"
    />
  </div>
</template>
