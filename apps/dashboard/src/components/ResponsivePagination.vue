<script lang="ts" setup>
import { useDisplay } from 'vuetify'
import { VPagination, VSelect } from 'vuetify/components'

defineProps<{
  pages: number
  page: number
}>()
const emit = defineEmits(['update'])
const { t } = useI18n()
const { xs } = useDisplay()
</script>

<template>
  <v-select
    v-if="xs"
    :label="t('page')"
    :items="Array.from({ length: pages }, (_, i) => i + 1)"
    :model-value="page"
    variant="solo-filled"
    hide-details
    density="compact"
    @update:model-value="emit('update', $event)"
  >
    <template #prepend>
      <v-btn
        :disabled="page === 1"
        density="compact"
        icon="$mdiChevronLeft"
        @click="emit('update', page - 1)"
      />
    </template>
    <template #append>
      <v-btn
        :disabled="page === pages"
        density="compact"
        icon="$mdi-chevron-right"
        @click="emit('update', page + 1)"
      />
    </template>
  </v-select>
  <v-pagination
    v-else
    :model-value="page"
    show-first-last-page
    :length="pages"
    density="compact"
    variant="tonal"
    total-visible="7"
    next-icon="$mdi-chevron-right"
    prev-icon="$mdi-chevron-left"
    last-icon="$mdi-chevron-double-right"
    first-icon="$mdi-chevron-double-left"
    @update:model-value="emit('update', $event)"
  />
</template>
