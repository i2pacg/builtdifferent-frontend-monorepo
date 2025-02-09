<!-- eslint-disable unused-imports/no-unused-vars -->
<!-- eslint-disable vue/no-unused-vars -->
<script setup lang="ts">
import type { FormDataType } from '@/interfaces/crud'
import type { UserFormPreferences } from '@i2pacg/builtdifferent-frontend-tsdata'
import type { Constructor, Element, Model } from 'pinia-orm'
import type { SortableEvent } from 'sortablejs'
// Imports
import { DISPLAY_MODES, LOG_COMPONENTS_COLOR } from '@/constants'
import { Localizable, TextContent } from '@i2pacg/builtdifferent-frontend-tsdata'
import { objectEntries } from '@vueuse/core'
import { cloneDeep } from 'lodash-unified'
import { BooleanAttr, DateAttr, Relation } from 'pinia-orm'
import { Sortable } from 'sortablejs-vue3'

// Props & Emits
const props = defineProps<{
  model: Constructor<Model>
  item?: Element
  isModal?: boolean
}>()

const emit = defineEmits<{
  (e: 'confirm', form: FormDataType): void
  (e: 'cancel'): void
}>()
const isEditingFormConfig = ref(false)
const showContentFields = ref(true)
const showMediaFields = ref(false)
// Types
enum LocaleAvailability {
  Available = 'success',
  Partial = 'warning',
  NotAvailable = 'error',
}

/* const groupableFields = computed(() => {
  return Object.entries(entity.value?.modelFields || {})
    .filter(([key, _]) => entity.value.entityConfig.fields[key]?.table?.groupable)
    .flatMap(([key]) => key)
})
 */
interface LocaleStatus {
  status: LocaleAvailability
  fields: Record<string, boolean>
  active: boolean
}

export type LocaleStatusMap = Record<string, LocaleStatus>

// Core state
const { modelFields, fields, entityName, entityConfig, entityPreferences } = useEntity(props.model)

function getGroupableFieldsForRelation(relation: Relation) {
  const entity = useEntity(relation.related.$self())
  console.lo
  return []
  /* return Object.entries(entity?.modelFields || {})
    .filter(([key, _]) => entity.entityConfig.fields[key]?.table?.groupable)
    .flatMap(([key]) => key) */
}
/* const getGroupableFields = (entity: Constructor<Model>) => {
  useEntity(props.relation.related.$self())
  return Object.entries(entity.modelFields || {})
    .filter(([key, _]) => entity.entityConfig.fields[key]?.table?.groupable)
    .flatMap(([key]) => key)
} */
const { t } = useI18n()
const isMultiLocale = computed(() => {
  return Object.values(entityConfig?.fields || {}).some(field => field!.textType)
})

const form = ref(reactive(initForm()))
const locales: Ref<number[] | undefined> = ref([useLocales().currentLanguage.value?.id as number])
const isNewItem = computed(() => !props.item?.id)
// Change activeTab to use string type (field key) instead of number
const activeTab = ref<string>('info')

// Computed properties

const operation = computed(() => props.item?.id ? 'edit' : 'create')

const updatedForm = computed(() => {
  const updatedData: Partial<FormDataType> = {}
  const originalData = props.item ? JSON.parse(JSON.stringify(props.item)) : {}

  for (const key in form.value) {
    if (JSON.stringify(form.value[key]) !== JSON.stringify(originalData[key]))
      updatedData[key] = form.value[key]
  }

  return updatedData as FormDataType
})

const isDefaultConfig = computed(() => {
  return false
  /* const defaultConfig = entity.entityConfig.defaultfields || {}
  // Simple deep comparison:
  return JSON.stringify(fields.value) === JSON.stringify(
    Object.keys(entity.formFields).reduce((acc, key, index) => {
      acc[key] = {
        position: index,
        size: 12,
        offsetStart: 0,
        offsetEnd: 0,
        ...defaultConfig[key],
      }
      return acc
    }, {} as Record<string, fields>),
  ) */
})

const hasChanges = computed(() => {
  return Object.keys(updatedForm.value).length > 0
})

const textFields = computed(() => {
  return Object.keys(fields.value).filter(key => entityConfig?.fields?.[key]?.textType)
})

const htmlFieldKeys = computed(() => {
  return Object.keys(fields.value)
    .filter(key => entityConfig?.fields?.[key]?.textType === 'html')
})
// Locale handling
const localeAvailabilityStatus = computed<LocaleStatusMap | undefined>(() => {
  const textFields = Object.fromEntries(objectEntries(entityConfig?.fields || {}).filter(([_, field]) => field?.textType).map(([key, _]) => [key, _?.textType]))
  if (!Object.keys(textFields).length)
    return undefined
  const langCodes = useLocales().languages.value?.map(l => l.code) ?? []
  if (!langCodes.length)
    return undefined

  return langCodes.reduce<LocaleStatusMap>((acc, langCode) => {
    const fieldStatus = objectEntries(textFields).reduce<Record<string, boolean>>((fieldAcc, [fieldKey, textType]) => {
      if (!props.item) {
        fieldAcc[fieldKey] = false
        return fieldAcc
      }
      const textContent = props.item![fieldKey] as TextContent | undefined
      const content = textContent?.content?.[langCode]
      fieldAcc[fieldKey] = content !== undefined && content !== null
      return fieldAcc
    }, {})
    const fieldValues = Object.values(fieldStatus)
    const hasAllFields = fieldValues.length > 0 && fieldValues.every(status => status)
    const hasSomeFields = fieldValues.some(status => status)
    const itemLocales = (form.value.locales ?? []) as Localizable[]
    const langId = useLocales().codeToId(langCode)
    const localeItem = itemLocales.find(l => l.languageId === langId)

    acc[langCode] = {
      status: hasAllFields ? LocaleAvailability.Available : hasSomeFields ? LocaleAvailability.Partial : LocaleAvailability.NotAvailable,
      fields: fieldStatus,
      active: localeItem?.isActive ?? false,
    }
    return acc
  }, {})
  /*
  // ...old code...
  return langCodes.reduce<LocaleStatusMap>((acc, langCode) => {
    // ...existing code...
    textFields
     return langCodes.reduce<LocaleStatusMap>((acc, langCode) => {
    const fieldStatus = textFields.reduce<Record<string, boolean>>((fieldAcc, fieldKey) => {
      if (!props.item) {
        fieldAcc[fieldKey] = false
        return fieldAcc
      }
      const textContent = props.item![fieldKey] as TextContent | undefined
      const content = textContent?.content?.[langCode]
      fieldAcc[fieldKey] = content !== undefined && content !== null
      return fieldAcc
    }, {})

    const fieldValues = Object.values(fieldStatus)
    const hasAllFields = fieldValues.length > 0 && fieldValues.every(status => status)
    const hasSomeFields = fieldValues.some(status => status)
    const itemLocales = (form.value.locales ?? []) as Localizable[]
    const langId = useLocales().codeToId(langCode)
    const localeItem = itemLocales.find(l => l.languageId === langId)

    acc[langCode] = {
      status: hasAllFields ? LocaleAvailability.Available : hasSomeFields ? LocaleAvailability.Partial : LocaleAvailability.NotAvailable,
      fields: fieldStatus,
      active: localeItem?.isActive ?? false,
    }

    return acc
  }, {})
  }, {})
  */
  // New approach:
})

// Utility functions
const sortedFields = computed(() => {
  return Object.keys(fields.value)
    .filter(key => activeTab.value === 'info'
      ? (showContentFields.value || entityConfig?.fields?.[key]?.textType !== 'html')
      : key === activeTab.value,
    )
    .sort((a, b) => (fields.value[a]?.position ?? 0) - (fields.value[b]?.position ?? 0))
})

function initFieldValue(key: string) {
  const clonedItem = cloneDeep(props.item)
  if (entityConfig?.fields?.[key]?.textType) {
    return clonedItem?.[key] || new TextContent({
      type: entityConfig.fields?.[key]?.textType,
    })
  }
  return clonedItem?.[key] ?? null
}

function initForm() {
  const formData = Object.fromEntries(objectEntries(fields.value).map(([key, field]) => {
    return [key, initFieldValue(key)]
  }))
  if (isMultiLocale.value) {
    formData.locales = cloneDeep(props.item?.locales) || [
      new Localizable({
        languageId: useLocales().currentLanguage.value?.id as number,
        isActive: true,
      }),
    ]
  }
  return formData
  /* const formData = fields.value.reduce((acc, key) => {
    acc[key] = initFieldValue(key)
    return acc
  }, {} as FormDataType) */

  return {}
/*   const fields = Object.keys(entity.formFields || {}).sort((a, b) => {
    return (fields.value[a]?.position ?? 0) - (fields.value[b]?.position ?? 0)
  })
  */
}

function updateFieldSize(key: string, increase: boolean) {
  const currentSize = fields.value[key].size
  const newSize = increase ? Math.min(currentSize + 2, 12) : Math.max(currentSize - 2, 2)

  const validOffsets = getValidOffsets(newSize)
  const currentOffset = fields.value[key].offsetStart
  // Find the closest valid offset for the new size
  const newOffset = validOffsets.reduce((closest, offset) =>
    Math.abs(offset - currentOffset) < Math.abs(closest - currentOffset) ? offset : closest, validOffsets[0])
  Object.assign(entityPreferences.fieldsConfig[key], {
    size: newSize,
    offsetStart: newOffset,
  })

/*   fields.value = {
    ...fields.value,
    [key]: {
      ...fields.value[key],
      size: newSize,
      offsetStart: newOffset,
    },
  } */
}

function getValidOffsets(fieldSize: number, currentStartOffset: number = 0, currentEndOffset: number = 0): number[] {
  if (fieldSize === 12)
    return [0]

  const offsets: number[] = [0]
  let currentOffset = 0

  // Calculate total space used by field and existing offsets
  const totalUsedSpace = fieldSize + currentStartOffset + currentEndOffset

  // Add all possible offsets that would allow the component to fit in a row
  while (currentOffset + totalUsedSpace < 12) {
    currentOffset += 1
    if ((currentOffset + totalUsedSpace) <= 12)
      offsets.push(currentOffset)
  }

  return offsets.filter(offset => offset % 1 === 0)
}

function updateFieldOffset(key: string, direction: boolean) {
  /*  const currentSize = fields.value[key].size
  const currentOffset = fields.value[key].offsetStart
  const currentEndOffset = fields.value[key].offsetEnd ?? 0
  const validOffsets = getValidOffsets(currentSize, 0, currentEndOffset) // Consider end offset

  if (validOffsets.length === 0) {
    console.warn('No valid offsets available for current size')
    return
  }

  // Find next or previous valid offset
  const currentIndex = validOffsets.indexOf(currentOffset)
  const newIndex = direction
    ? Math.min(currentIndex + 1, validOffsets.length - 1)
    : Math.max(currentIndex - 1, 0)

  fields.value = {
    ...fields.value,
    [key]: {
      ...fields.value[key],
      offsetStart: validOffsets[newIndex],
    },
  } */
}

function canDecreaseOffset(key: string): boolean {
/*   const currentOffset = fields.value[key].offsetStart
  const currentEndOffset = fields.value[key].offsetEnd ?? 0
  const validOffsets = getValidOffsets(fields.value[key].size, 0, currentEndOffset)
  const currentIndex = validOffsets.indexOf(currentOffset)
  return currentIndex > 0 */
  return true
}

function canIncreaseOffset(key: string): boolean {
/*   const currentOffset = fields.value[key].offsetStart
  const currentEndOffset = fields.value[key].offsetEnd ?? 0
  const validOffsets = getValidOffsets(fields.value[key].size, 0, currentEndOffset)
  const currentIndex = validOffsets.indexOf(currentOffset)
  return currentIndex < validOffsets.length - 1 */
  return true
}

function canDecreaseSize(key: string): boolean {
  /*  const currentSize = fields.value[key].size
  return currentSize > 2 */
  return true
}

function canIncreaseSize(key: string): boolean {
  /*  const currentSize = fields.value[key].size
  return currentSize < 12 */
  return true
}

function clearOffset(key: string) {
  /* fields.value = {
    ...fields.value,
    [key]: {
      ...fields.value[key],
      offsetStart: 0,
    },
  } */
}

// Add end offset utility functions
function updateEndOffset(key: string, direction: boolean) {
  /*  const currentSize = fields.value[key].size
  const currentStartOffset = fields.value[key].offsetStart
  const currentEndOffset = fields.value[key].offsetEnd ?? 0
  const validOffsets = getValidOffsets(currentSize, currentStartOffset, 0) // Consider start offset

  if (validOffsets.length === 0)
    return

  const currentIndex = validOffsets.indexOf(currentEndOffset)
  const newIndex = direction
    ? Math.min(currentIndex + 1, validOffsets.length - 1)
    : Math.max(currentIndex - 1, 0)

  fields.value = {
    ...fields.value,
    [key]: {
      ...fields.value[key],
      offsetEnd: validOffsets[newIndex],
    },
  } */
}

function canDecreaseEndOffset(key: string): boolean {
  /* const currentEndOffset = fields.value[key].offsetEnd ?? 0
  const currentStartOffset = fields.value[key].offsetStart
  const validOffsets = getValidOffsets(fields.value[key].size, currentStartOffset, 0)
  const currentIndex = validOffsets.indexOf(currentEndOffset)
  return currentIndex > 0 */
  return true
}

function canIncreaseEndOffset(key: string): boolean {
  /*  const currentEndOffset = fields.value[key].offsetEnd ?? 0
  const currentStartOffset = fields.value[key].offsetStart
  const validOffsets = getValidOffsets(fields.value[key].size, currentStartOffset, 0)
  const currentIndex = validOffsets.indexOf(currentEndOffset)
  return currentIndex < validOffsets.length - 1 */
  return true
}

function clearEndOffset(key: string) {
  /*  fields.value = {
    ...fields.value,
    [key]: {
      ...fields.value[key],
      offsetEnd: 0,
    },
  } */
}

/* interface SortableEvent {
  newIndex: number
  oldIndex: number
  to: HTMLElement
  from: HTMLElement
  item: HTMLElement
  clone: HTMLElement
  pullMode: string
} */

function saveNewOrder(event: SortableEvent): any {
  const { newIndex, oldIndex } = event
  console.log(`%c[BdFields] %c[saveNewOrder]`, LOG_COMPONENTS_COLOR, 'color: lightblue;', newIndex, oldIndex)
  if (newIndex === undefined || oldIndex === undefined || newIndex === oldIndex)
    return

  try {
    console.log(`Moving field from ${oldIndex} to ${newIndex}`)
    const sortedFields = objectEntries(fields.value)
      .sort(([, a], [, b]) => a.position! - b.position!)
      .map(([key]) => key)
    const [movedField] = sortedFields.splice(oldIndex, 1)
    sortedFields.splice(newIndex, 0, movedField)
    Object.assign(
      entityPreferences.fieldsConfig,
      sortedFields.reduce((acc, field, idx) => {
        acc[field] = {
          ...fields.value[field],
          position: idx,
        }
        return acc
      }, {} as Record<string, UserFormPreferences>),
    )
  }
  catch (error) {
    console.error(`%c[BdFields] %c[saveNewOrder]`, LOG_COMPONENTS_COLOR, 'color: lightblue;', error)
  }
}
/* Object.assign(
    fields.value,
    sortedColumns.reduce((acc, column, idx) => {
      acc[column] = {
        ...columns.value[column],
        position: idx,
      }
      return acc
    }, {} as Record<string, UserColumnPreferences>),
  ) */
/*
  const orderedKeys = sortedFields.value
 const movedKey = orderedKeys[oldIndex]

  // Create new config with updated order values
  const updatedConfig = { ...fields.value }

  // If moving down, decrease order of items in between
  if (newIndex > oldIndex) {
    for (const key of orderedKeys) {
      const order = updatedConfig[key].position
      if (order > oldIndex && order <= newIndex) {
        updatedConfig[key] = { ...updatedConfig[key], position: order - 1 }
      }
    }
  }
  // If moving up, increase order of items in between
  else if (newIndex < oldIndex) {
    for (const key of orderedKeys) {
      const order = updatedConfig[key].position
      if (order >= newIndex && order < oldIndex) {
        updatedConfig[key] = { ...updatedConfig[key], position: order + 1 }
      }
    }
  }

  // Set new position for moved item
  updatedConfig[movedKey] = { ...updatedConfig[movedKey], position: newIndex }

  console.log('Updated config', updatedConfig) */
// fields.value = updatedConfig
// Add reset function
function resetFormConfig() {
  /*  const defaultConfig = entity.entityConfig.defaultfields
  const fields = Object.keys(entity.formFields)
  console.log(`%c[BdFields] %c[resetFormConfig]`, LOG_COMPONENTS_COLOR, 'color: lightblue;', fields, defaultConfig)
  // Create a new configuration object
  fields.value = fields.reduce((acc, key, index) => {
    // Start with default values
    acc[key] = {
      position: index,
      size: 12,
      offsetStart: 0,
      offsetEnd: 0,
    }

    // If default config exists and has configuration for this field, use those values
    if (defaultConfig?.[key]) {
      acc[key] = {
        ...acc[key],
        ...defaultConfig[key],
      }
    }

    return acc
  }, {} as Record<string, fields>)

  // Ensure order is sequential and valid
  const orderedKeys = fields.sort((a, b) =>
    (fields.value[a].position ?? 0) - (fields.value[b].position ?? 0),
  )

  // Rewrite orders to ensure they are sequential
  orderedKeys.forEach((key, index) => {
    fields.value[key].position = index
  }) */
}

// Watchers & Lifecycle
watch(() => props.item, () => {
  form.value = reactive(initForm())
}, { deep: true })

onMounted(() => {
})

// Debug functionality
const showDebug = ref(false)
const toggleDebug = () => showDebug.value = !showDebug.value

/* const filedConfig = computed(() => {
  return Object.keys(entity.formFields).reduce()
(acc, key) => {
  acc[key] = {
    size: 12, // Default size, can be 3, 6, or 12
    // Additional properties can be added here as needed
  }
  return acc
}, {} as Record<string, { size: number }>)
}) */
</script>

<template>
  <v-tabs
    v-if="!showContentFields"
    v-model="activeTab"
  >
    <v-tab value="info">
      Info
    </v-tab>
    <v-tab
      v-for="htmlKey in htmlFieldKeys"
      :key="htmlKey"
      :value="htmlKey"
    >
      {{ t(`entities.${entityName}.columns.${htmlKey}.label`) }}
    </v-tab>
  </v-tabs>

  <!-- <pre>

    {{ form }}
  </pre> -->
  <v-card-title
    class="d-flex align-center px-0"
    :class="{
      'position-sticky bg-background z-index-1 top-0': isModal,
    }"
  >
    <i18n-t scope="global" :keypath="`common.crud.${operation}.header`">
      <template #entity>
        {{ t(`entities.${entityName}.name`) }}
      </template>
    </i18n-t>
    <v-spacer />
    <v-tooltip>
      <template #activator="{ props: btnProps }">
        <v-btn
          v-bind="btnProps"
          :icon="isEditingFormConfig ? '$mdi-check' : '$mdi-pencil-ruler'"
          :color="isEditingFormConfig ? 'success' : 'primary'"
          variant="tonal"
          density="compact"
          @click="isEditingFormConfig = !isEditingFormConfig"
        />
      </template>
      <template #default>
        {{ isEditingFormConfig ? 'Finish Editing Layout' : 'Edit Layout' }}
      </template>
    </v-tooltip>
    <v-tooltip
      v-if="!isDefaultConfig && isEditingFormConfig"
    >
      <template #activator="{ props: resetProps }">
        <v-btn
          v-bind="resetProps"
          icon="$mdi-restore"
          variant="tonal"
          color="error"
          density="compact"
          :disabled="isDefaultConfig"
          class="ms-2"
          @click="resetFormConfig"
        />
      </template>
      <template #default>
        Reset Layout
      </template>
    </v-tooltip>
    <bd-locale-manager
      v-if="isMultiLocale && localeAvailabilityStatus"
      :locale-availability-status="localeAvailabilityStatus!"
      :is-new-item="isNewItem"
      :model-value="locales"
      @update:model-value="(value) => locales = value"
      @update:locale-active="(localeActive) => {
        if (form.locales && Array.isArray(form.locales) && form.locales.every(l => l instanceof Localizable)) {
          const langId = useLocales().codeToId(localeActive.locale)
          if (langId) {
            const existingLocaleIndex = form.locales.findIndex(l => l.languageId === langId)
            if (existingLocaleIndex !== -1) {
              form.locales[existingLocaleIndex].isActive = localeActive.active
            }
            else {
              form.locales.push(new Localizable({
                languageId: langId,
                isActive: localeActive.active,
                localizableId: props.item?.id,
                localizableType: entityName,
              }))
            }
          }
        }
      }"
    />
    <!-- Switch for content fields -->
    <v-switch
      v-model="showContentFields"
      class="ms-2"
      hide-details
      variant="tonal"
      :label="showContentFields ? 'Content Fields ON' : 'Content Fields OFF'"
    />

    <!-- Switch for media fields -->
    <v-switch
      v-model="showMediaFields"
      class="ms-2"
      variant="tonal"
      hide-details
      :label="showMediaFields ? 'Media Fields ON' : 'Media Fields OFF'"
    />
  </v-card-title>
  <sortable
    :list="sortedFields"
    :options="{
      disabled: !isEditingFormConfig,
      animation: 150,
      easing: 'cubic-bezier(1, 0, 0, 1)',
      handle: '.handle',
    }"
    :item-key="key => key"
    class="v-row v-row--dense flex-grow-0"
    :class="{
      isEditingFormConfig,
      'mt-16': isModal,
    }"
    @end="saveNewOrder"
  >
    <template #item="{ element: key }">
      <v-col
        :key="key"
        :md="fields[key].size"
        :lg="fields[key].size"
        :xl="fields[key].size"
        :cols="12"
        :offset="fields[key].offsetStart"
        class="position-relative offset-base mb-2"
        :class="{
          'start-offset': fields[key].offsetStart > 0,
          'end-offset': fields[key].offsetEnd > 0,
        }"
        :style="{
          '--offset-width': `calc(${(100 / fields[key].size) * fields[key].offsetStart}% - 8px)`,
          '--end-offset-width': `calc(${(100 / fields[key].size) * (fields[key].offsetEnd ?? 0)}% - 8px)`,
          'margin-right': fields[key].offsetEnd ? `calc(${(100 / fields[key].size) * fields[key].offsetEnd}% + 8px)` : undefined,
        }"
      >
        <div
          class="position-relative d-flex flex-wrap"
        >
          <v-sheet
            class="w-100"
            position="relative"
            :class="{ 'disabled pa-2': isEditingFormConfig }"
          >
            <date-time-field
              v-if="(modelFields[key] instanceof DateAttr)"
              v-model="(form[key] as Date | null)"
              :label="t(`entities.${entityName}.columns.${key}.label`)"
            />
            <bd-relation-field
              v-else-if="(modelFields[key] instanceof Relation)"
              v-model="(form[key] as Model | Model[] | undefined)"
              :relation="(modelFields[key] as Relation)"
              :label="`entities.${entityName}.columns.${key}.label`"
              :item="(props.item as Model)"
              :relation-config="entityConfig?.fields?.[key]?.relation"
              :display-mode="entityPreferences.fieldsConfig[key].displayMode"
              :group-by="entityPreferences.fieldsConfig[key].groupBy"
            />
            <text-content-field
              v-else-if="entityConfig?.fields?.[key]?.textType"
              v-model="(form[key] as TextContent)"
              :label="`entities.${entityName}.columns.${key}.label`"
              :text-type="entityConfig?.fields?.[key]?.textType"
              :locales="locales?.map(l => useLocales().idToCode(l)).filter(l => l !== undefined)"
            />
            <v-switch
              v-else-if="(modelFields[key] instanceof BooleanAttr)"
              v-model="(form[key] as Boolean)"
              hide-details
              color="primary"
              :label="t(`entities.${entityName}.columns.${key}.label`)"
            />
            <v-text-field
              v-else
              v-model="form[key]"
              :label="t(`entities.${entityName}.columns.${key}.label`)"
              density="compact"
              tile
              variant="outlined"
              :hide-details="!entityConfig?.fields?.[key]?.form?.messages || entityConfig?.fields?.[key]?.form?.messages.length === 0"
              :messages="entityConfig?.fields?.[key]?.form?.messages"
            >
              <template
                #message="{ message }"
              >
                <i18n-t :keypath="message" scope="global" tag="small">
                  <template #entity>
                    <strong>{{ t(`entities.${entityName}.name`) }}</strong>
                  </template>
                </i18n-t>
              </template>
            </v-text-field>
          </v-sheet>
          <v-expand-transition>
            <v-sheet
              v-if="isEditingFormConfig"
              class="d-flex justify-space-between align-center pa-1 w-100"
              style="background: transparent"
            >
              <small
                class="text-overline-jr font-weight-black bg-surface-variant px-2 py-0 rounded"
              >
                {{ t(`entities.${entityName}.columns.${key}.label`) }}
              </small>

              <v-icon
                icon="$mdi-drag"
                size="small"
                class="handle"
              />
              <v-spacer />
              <v-menu

                v-if="(modelFields[key] instanceof Relation)"
                location="bottom end" :close-on-content-click="false"
              >
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
                      v-model="entityPreferences.fieldsConfig[key].displayMode"
                      density="compact"
                      color="primary"
                      variant="outlined"
                      mandatory
                      class="w-100"
                      @update:model-value="value => entityPreferences.fieldsConfig[key].displayMode = value"
                    >
                      <v-btn
                        v-for="(mode, dKey) in DISPLAY_MODES"
                        :key="mode.value.name"
                        :value="dKey"
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
                </v-list>
              </v-menu>
              <v-menu
                location="end"
                :close-on-content-click="false"
              >
                <template #activator="{ props: menuProps }">
                  <v-btn
                    icon="$mdi-view-grid-plus"
                    variant="tonal"
                    v-bind="menuProps"
                    density="compact"
                    :rounded="0"
                    class="ms-2"
                  />
                </template>

                <v-card min-width="240" class="pa-2">
                  <v-card-text class="px-2 py-1">
                    <div class="d-flex align-center justify-space-between">
                      <span class="text-caption text-medium-emphasis">Size</span>
                      <div class="d-flex align-center">
                        <v-btn
                          :disabled="!canDecreaseSize(key)"
                          icon="$mdi-arrow-collapse-horizontal"
                          size="x-small"
                          variant="text"
                          @click="updateFieldSize(key, false)"
                        />
                        <span class="mx-2 text-body-2">{{ fields[key].size }}</span>
                        <v-btn
                          :disabled="!canIncreaseSize(key)"
                          icon="$mdi-arrow-expand-horizontal"
                          size="x-small"
                          variant="text"
                          @click="updateFieldSize(key, true)"
                        />
                      </div>
                    </div>
                  </v-card-text>

                  <v-divider class="my-1" />

                  <v-card-text class="px-2 py-1">
                    <div class="d-flex align-center justify-space-between">
                      <span class="text-caption text-medium-emphasis">Start Offset</span>
                      <div class="d-flex align-center">
                        <template v-if="fields[key].offsetStart > 0">
                          <span class="text-body-2 me-2">{{ fields[key].offsetStart }}</span>
                          <v-btn
                            icon="$mdi-close"
                            size="x-small"
                            variant="text"
                            @click="clearOffset(key)"
                          />
                        </template>
                        <v-btn-group density="comfortable" variant="text">
                          <v-btn
                            :disabled="!canDecreaseOffset(key)"
                            icon="$mdi-chevron-left"
                            size="x-small"
                            @click="updateFieldOffset(key, false)"
                          />
                          <v-btn
                            :disabled="!canIncreaseOffset(key)"
                            icon="$mdi-chevron-right"
                            size="x-small"
                            @click="updateFieldOffset(key, true)"
                          />
                        </v-btn-group>
                      </div>
                    </div>
                  </v-card-text>

                  <v-card-text class="px-2 py-1">
                    <div class="d-flex align-center justify-space-between">
                      <span class="text-caption text-medium-emphasis">End Offset</span>
                      <div class="d-flex align-center">
                        <template v-if="fields[key].offsetEnd > 0">
                          <span class="text-body-2 me-2">{{ fields[key].offsetEnd }}</span>
                          <v-btn
                            icon="$mdi-close"
                            size="x-small"
                            variant="text"
                            @click="clearEndOffset(key)"
                          />
                        </template>
                        <v-btn-group density="comfortable" variant="text">
                          <v-btn
                            :disabled="!canDecreaseEndOffset(key)"
                            icon="$mdi-chevron-left"
                            size="x-small"
                            @click="updateEndOffset(key, false)"
                          />
                          <v-btn
                            :disabled="!canIncreaseEndOffset(key)"
                            icon="$mdi-chevron-right"
                            size="x-small"
                            @click="updateEndOffset(key, true)"
                          />
                        </v-btn-group>
                      </div>
                    </div>
                  </v-card-text>
                </v-card>
              </v-menu>
            </v-sheet>
          </v-expand-transition>
          <!--           <pre>
            key:    {{ key }}
            {{ entityPreferences.fieldsConfig[key] }}
          </pre> -->
          <bd-relation-field-options
            v-if="(modelFields[key] instanceof Relation)"
            v-model:group-by="entityPreferences.fieldsConfig[key].groupBy"
            :relation="(modelFields[key] as Relation)"
          />
          <!--      <v-menu
            v-if="(modelFields[key] instanceof Relation)"
            location="bottom end" :close-on-content-click="false"
          >
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
                  :model-value="entityPreferences.fieldsConfig[key].displayMode"
                  density="compact"
                  color="primary"
                  variant="outlined"
                  mandatory
                  class="w-100"
                  @update:model-value="value => entityPreferences.fieldsConfig[key].displayMode = value"
                >
                  <v-btn
                    v-for="(mode, dKey) in DISPLAY_MODES"
                    :key="mode.value.name"
                    :value="dKey"
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
            </v-list>
          </v-menu> -->
          <!-- <v-overlay
            :model-value="isEditingFormConfig"
            class="align-center justify-center"
            scrim="background-lighten-4"
            :opacity="0.9"
            contained
            content-class="w-100 h-100"
          >
            <v-sheet
              class="d-flex justify-space-between align-center pa-1 w-100"
              style="background: transparent"
            >
              <small
                class="text-overline-jr font-weight-black bg-surface-variant px-2 py-0 rounded"
              >
                {{ t(`entities.${entityName}.columns.${key}.label`) }}
              </small>

              <v-icon
                icon="$mdi-drag"
                size="small"
                class="handle"
              />
              <v-spacer />
              <v-menu

                v-if="(modelFields[key] instanceof Relation)"
                location="bottom end" :close-on-content-click="false"
              >
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

              </v-menu>
              <v-menu
                location="end"
                :close-on-content-click="false"
              >
                <template #activator="{ props: menuProps }">
                  <v-btn
                    icon="$mdi-view-grid-plus"
                    variant="tonal"
                    v-bind="menuProps"
                    density="compact"
                    :rounded="0"
                    class="ms-2"
                  />
                </template>

                <v-card min-width="240" class="pa-2">
                  <v-card-text class="px-2 py-1">
                    <div class="d-flex align-center justify-space-between">
                      <span class="text-caption text-medium-emphasis">Size</span>
                      <div class="d-flex align-center">
                        <v-btn
                          :disabled="!canDecreaseSize(key)"
                          icon="$mdi-arrow-collapse-horizontal"
                          size="x-small"
                          variant="text"
                          @click="updateFieldSize(key, false)"
                        />
                        <span class="mx-2 text-body-2">{{ fields[key].size }}</span>
                        <v-btn
                          :disabled="!canIncreaseSize(key)"
                          icon="$mdi-arrow-expand-horizontal"
                          size="x-small"
                          variant="text"
                          @click="updateFieldSize(key, true)"
                        />
                      </div>
                    </div>
                  </v-card-text>

                  <v-divider class="my-1" />

                  <v-card-text class="px-2 py-1">
                    <div class="d-flex align-center justify-space-between">
                      <span class="text-caption text-medium-emphasis">Start Offset</span>
                      <div class="d-flex align-center">
                        <template v-if="fields[key].offsetStart > 0">
                          <span class="text-body-2 me-2">{{ fields[key].offsetStart }}</span>
                          <v-btn
                            icon="$mdi-close"
                            size="x-small"
                            variant="text"
                            @click="clearOffset(key)"
                          />
                        </template>
                        <v-btn-group density="comfortable" variant="text">
                          <v-btn
                            :disabled="!canDecreaseOffset(key)"
                            icon="$mdi-chevron-left"
                            size="x-small"
                            @click="updateFieldOffset(key, false)"
                          />
                          <v-btn
                            :disabled="!canIncreaseOffset(key)"
                            icon="$mdi-chevron-right"
                            size="x-small"
                            @click="updateFieldOffset(key, true)"
                          />
                        </v-btn-group>
                      </div>
                    </div>
                  </v-card-text>

                  <v-card-text class="px-2 py-1">
                    <div class="d-flex align-center justify-space-between">
                      <span class="text-caption text-medium-emphasis">End Offset</span>
                      <div class="d-flex align-center">
                        <template v-if="fields[key].offsetEnd > 0">
                          <span class="text-body-2 me-2">{{ fields[key].offsetEnd }}</span>
                          <v-btn
                            icon="$mdi-close"
                            size="x-small"
                            variant="text"
                            @click="clearEndOffset(key)"
                          />
                        </template>
                        <v-btn-group density="comfortable" variant="text">
                          <v-btn
                            :disabled="!canDecreaseEndOffset(key)"
                            icon="$mdi-chevron-left"
                            size="x-small"
                            @click="updateEndOffset(key, false)"
                          />
                          <v-btn
                            :disabled="!canIncreaseEndOffset(key)"
                            icon="$mdi-chevron-right"
                            size="x-small"
                            @click="updateEndOffset(key, true)"
                          />
                        </v-btn-group>
                      </div>
                    </div>
                  </v-card-text>
                </v-card>
              </v-menu>
            </v-sheet>
          </v-overlay> -->
        </div>
      </v-col>
    </template>
  </sortable>
  <!--  <v-list density="compact" class="compactor" width="200">
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
                </v-list> -->
  <v-btn
    class="my-4"
    variant="tonal"
    color="primary"
    :text="t(`common.crud.${operation}.confirm`, { entity: t(`entities.${entityName}.name`) })"
    type="submit"
    :disabled="!hasChanges"
    @click="emit('confirm', updatedForm)"
  />

  <div v-if="showDebug" class="debug-panel">
    <v-card>
      <v-card-title class="d-flex align-center">
        Debug Panel
        <v-spacer />
        <v-btn icon="mdi-close" size="small" @click="toggleDebug" />
      </v-card-title>
      <v-card-text>
        <pre class="debug-content">
            FormFieldsConfig: {{ fields }}
            sortedFields: {{ sortedFields }}
            localeAvailabilityStatus: {{ localeAvailabilityStatus }}
            isEditingFormConfig: {{ isEditingFormConfig }}
           <!--  Model: {{ entityName }}
            Form Data: {{ form }}
            Relations: {{ entity.relations }}
            Operation: {{ operation }}
            Item: {{ JSON.parse(JSON.stringify(props.item)) }} -->
        </pre>
      </v-card-text>
    </v-card>
  </div>

  <v-btn
    icon="mdi-bug"
    color="grey"
    size="small"
    class="debug-toggle"
    @click="toggleDebug"
  />
</template>

<style scoped>
.debug-panel {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  max-width: 400px;
  max-height: 80vh;
  overflow: auto;
  opacity: 0.9;
}

.debug-toggle {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9998;
}

.debug-content {
  font-size: 12px;
  white-space: pre-wrap;
  word-break: break-all;
}

.offsetStart-base {
  position: relative;
}

.isEditingFormConfig .start-offset > .v-sheet::before {
  content: '';
  position: absolute;
  left: calc(var(--offset-width)* -1);
  top: 4px;
  bottom: 4px;
  width: var(--offset-width);
  background: rgb(var(--v-theme-background));
  border-right: 2px dashed rgba(0, 0, 0, 0.1);
  pointer-events: none;
}

.isEditingFormConfig .end-offset > .v-sheet::after {
  content: '';
  position: absolute;
  right: calc(var(--end-offset-width) * -1);
  top: 4px;
  bottom: 4px;
  width: var(--end-offset-width);
  background: rgb(var(--v-theme-background));
  border-left: 2px dashed rgba(0, 0, 0, 0.1);
  pointer-events: none;
}

.field-config-menu {
  position: absolute;
  top: 4px;
  right: 4px;
  opacity: 0.7;
  z-index: 1;
}

.field-config-menu:hover {
  opacity: 1;
}

.v-btn-group .v-btn {
  height: 24px;
  width: 24px;
}

.field-name {
  position: absolute;
  top: 8px;
  left: 8px;
  color: rgba(var(--v-theme-on-surface), 0.7);
  font-weight: 500;
}

/* .handle {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  cursor: grab;
  color: rgba(var(--v-theme-on-surface), 0.5);
  transition: color 0.2s ease;
} */

.handle:hover {
  color: rgba(var(--v-theme-on-surface), 0.8);
}

.handle:active {
  cursor: grabbing;
}

.v-sheet.disabled::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(var(--v-theme-background-lighten-2),0.5);
    z-index: 1;
    pointer-events: all;
}
/*
.v-card {
  border-radius: 4px;
}

.v-card-text {
  min-height: 36px;
}

.text-caption {
  font-weight: 500;
} */
</style>
