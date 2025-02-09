<script setup lang="ts">
import { useDateFormat } from '@vueuse/core'

const props = defineProps<{
  entity: string
}>()
const emit = defineEmits<{
  (e: 'refresh'): void
}>()

/* const { columns, preferences } = useEntity(props.entity)

const visibleColumns = computed(() => preferences.value.columnsVisible) */
/* const crudRuntime = useCrudRuntimeStore() */
const { t } = useI18n()

const search = ref('')
const loading = ref(false)
const lastRefresh = ref(new Date())
</script>

<template>
  <v-toolbar
    color="background"
    extended
    flat
    density="compact"
    extension-height="50px"
    class="pa-1"
  >
    <!-- Search -->
    <v-card
      color="transparent"
      height="32px"
      class="d-flex align-center"
    >
      <v-row no-gutters>
        <v-col cols="6" class="px-1">
          <v-text-field
            v-model="search"
            density="compact"
            :label="t('common.crud.search.label')"
            prepend-inner-icon="$mdi-magnify"
            variant="solo-filled"
            hide-details
            clearable
          />
        </v-col>
      </v-row>
    </v-card>

    <v-spacer />

    <!-- Column Selector -->
    <v-sheet min-width="240" color="transparent">
      <!--  <v-select
        v-model="preferences.columnsVisible"
        :items="Object.keys(columns)"
        :label="t('crud.columns.label')"
        density="compact"
        variant="solo-filled"
        hide-details
        item-value="key"
        item-title="title"
        multiple
      >
        <template #selection="{ index }">
          <span v-if="index === 0" class="text-grey text-caption align-self-center">
            {{ t('crud.columns.count', { count: visibleColumns.length }) }}
          </span>
        </template>
      </v-select> -->
    </v-sheet>

    <!-- Refresh Button -->
    <v-tooltip location="bottom">
      <template #activator="{ props: tooltipProps }">
        <v-btn
          v-bind="tooltipProps"
          density="compact"
          :loading="loading"
          :disabled="loading"
          icon="$mdi-reload"
          @click="emit('refresh')"
        />
      </template>
      <v-list-item
        density="compact"
        :title="t('common.crud.refresh.lastRefresh')"
        :subtitle="useDateFormat(lastRefresh, 'YYYY-MM-DD HH:mm:ss').value"
      />
    </v-tooltip>

    <!-- Bulk Actions -->
    <template #extension>
      <v-spacer />
      <slot name="bulk-actions" />
    </template>
  </v-toolbar>
</template>
