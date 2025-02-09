<script setup lang="ts">
import type { EntityConfig } from '@i2pacg/builtdifferent-frontend-tsdata'
import type { Relation } from 'pinia-orm'

const props = defineProps<{
  relation: Relation
}>()
const { t } = useI18n()
const groupBy = defineModel('groupBy', {
  type: String,
  default: null,
})
const fields = computed(() => {
  if (!props.relation.related)
    return null
  return useRepo(props.relation.related.$self()).getModel().$fields()
})
const entityConfig = computed(() => {
  if (!props.relation.related)
    return null
  return (useRepo(props.relation.related.$self()).getModel().$config().entityConfig || {}) as EntityConfig
})

const groupableFields = computed(() => {
  if (!fields.value || !entityConfig.value)
    return []
  return Object.entries(fields.value)
    .filter(([key, _]) => entityConfig.value!.fields![key]?.table?.groupable)
    .flatMap(([key]) => key)
})
</script>

<template>
  <div>
    <!--  <pre>
    groupBy {{ groupBy }}
    </pre> -->
    <v-list-subheader>{{ t('common.listing.group.groupBy') }}</v-list-subheader>
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

    <!--
    <div v-for="field in groupableFields" :key="field">
      {{ field }}
    </div> -->
  </div>
</template>
