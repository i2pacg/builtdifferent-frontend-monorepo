<script setup lang="ts">
import type { LocaleStatusMap } from './BdFields.vue'
import { objectEntries } from '@vueuse/core'

const props = defineProps<{
  localeAvailabilityStatus: LocaleStatusMap
  isNewItem?: boolean

}>()

const emit = defineEmits<{
  (e: 'update:localeActive', value: {
    locale: string
    active: boolean
  }): void
}>()

const { t } = useI18n()

const { languages/* , codeToId */ } = useLocales()
const locales = defineModel<number[]>({
  get(v) {
    return Array.from(new Set(v)).sort((a, b) => {
      const aIndex = languages.value.findIndex(l => l.id === a)
      const bIndex = languages.value.findIndex(l => l.id === b)
      return aIndex - bIndex
    })
  },
  set(v) {
    return Array.from(new Set(v)).sort((a, b) => {
      const aIndex = languages.value.findIndex(l => l.id === a)
      const bIndex = languages.value.findIndex(l => l.id === b)
      return aIndex - bIndex
    })/*
    const sortedValue = Array.from(new Set(v)).sort((a, b) => {
      const aIndex = languages.value.findIndex(l => l.id === a)
      const bIndex = languages.value.findIndex(l => l.id === b)
      return aIndex - bIndex
    }) */
    // emit('update:modelValue', sortedValue)
    // return sortedValue
  },
})

function isSelected(value: number) {
  return locales.value?.includes(value) ?? false
}

onMounted(() => {

})

// Add helper function to get status summary
function getStatusSummary(code: string) {
  const status = props.localeAvailabilityStatus![code]
  const missingFields = objectEntries(status.fields)
    .filter(([_, value]) => !value)
    .map(([key]) => key)

  if (!status.active)
    return t('bdLocaleManager.status.header.inactive')

  if (missingFields.length === 0)
    return t('bdLocaleManager.status.header.success')

  return t('bdLocaleManager.status.header.warning', {
    fields: t('common.crud.fields.count', missingFields.length),
    list: missingFields.join(', '),
  })
}

// Remove getColor method - we'll use the logic directly in template
</script>

<template>
  <v-select
    v-model="locales"
    :items="languages"
    item-value="id"
    item-title="name"
    :list-props="{
      density: 'compact',
      class: 'compactor',
      selectable: false,
    }"
    :item-props="(item) => ({ disabled: locales?.length === 1 && locales[0] === item.id })"
    variant="solo-filled"
    density="compact"
    hide-details
    class="mr-2"
    :max-width="350"
    multiple
    tile
    chips
    closable-chips
    :center-affix="true"
  >
    <template #chip="{ item, props: chipProps }">
      <v-chip
        :key="item.value"
        v-bind="chipProps"
        :closable="locales!.length > 1"
      >
        <!-- Regular content for new items -->
        <template v-if="isNewItem">
          <span class="d-flex align-center">
            <span>{{ item.title }}</span>
            <v-icon
              size="12"
              color="blue"
              class="ms-1"
            >
              $mdi-star
            </v-icon>
          </span>
        </template>

        <!-- Tooltip content for existing items -->
        <v-tooltip
          v-else
          content-class="bg-background pa-2"
          location="bottom"
        >
          <template #activator="{ props: tooltipProps }">
            <span
              :style="{
                opacity: localeAvailabilityStatus![item.raw.code].active ? 1 : 0.5,
              }"
              v-bind="tooltipProps"
              class="d-flex align-center"
            >
              <v-icon
                :size="10"
                :color="localeAvailabilityStatus![item.raw.code].active
                  ? localeAvailabilityStatus![item.raw.code].status
                  : 'inactive'"
                class="me-1"
              >
                $mdi-circle
              </v-icon>
              <span>{{ item.title }}</span>
            </span>
          </template>

          <h4
            v-if="!localeAvailabilityStatus![item.raw.code].active"
          >
            <strong>
              {{ t(`bdLocaleManager.status.header.inactive`) }}
            </strong>
          </h4>
          <h5
            :class="`text-caption text-${localeAvailabilityStatus![item.raw.code].status}`"
          >
            <strong>
              {{ t(`bdLocaleManager.status.header.${localeAvailabilityStatus![item.raw.code].status}`, { fields: t('common.crud.fields.count', objectEntries(localeAvailabilityStatus![item.raw.code].fields).filter(([_, value]) => !value).length) }) }}
            </strong>
          </h5>
          <p
            v-for="field in objectEntries(localeAvailabilityStatus![item.raw.code].fields).filter(([_, value]) => !value).map(([key]) => key)"
            :key="field"
            class="text-caption"
          >
            <v-icon
              :size="12"
            >
              $mdi-close-circle
            </v-icon>
            {{ field }}
          </p>
        </v-tooltip>
      </v-chip>
    </template>

    <template #item="{ item, props: itemProps }">
      <v-list-item v-bind="itemProps" variant="tonal">
        <template v-if="!isNewItem" #subtitle>
          <div class="d-flex align-center">
            <v-icon
              :size="10"
              :color="localeAvailabilityStatus![item.raw.code].active
                ? localeAvailabilityStatus![item.raw.code].status
                : 'inactive'"
              class="me-1"
            >
              $mdi-circle
            </v-icon>
            <span
              class="text-caption"
              :class="`text-${localeAvailabilityStatus![item.raw.code].active
                ? localeAvailabilityStatus![item.raw.code].status
                : 'inactive'}`"
            >
              {{ getStatusSummary(item.raw.code) }}
            </span>
          </div>
        </template>
        <template #append>
          <v-btn
            :icon="isSelected(item.value) ? '$mdi-eye' : '$mdi-eye-off'"
            size="small"
            variant="text"
            :color="isSelected(item.value) ? 'primary' : 'grey'"
            class="me-2"
            :disabled="isSelected(item.value) && (locales?.length ?? 0) <= 1"
            @click.stop="isSelected(item.value)
              ? locales = locales?.filter(l => l !== item.value)
              : locales = [...(locales ?? []), item.value]"
          />
          <v-switch
            :model-value="localeAvailabilityStatus![item.raw.code].active"
            density="compact"
            hide-details
            @update:model-value="emit('update:localeActive', {
              locale: item.raw.code,
              active: $event ?? false,
            })"
            @click.stop
          />
        </template>
      </v-list-item>
    </template>
  </v-select>
</template>
