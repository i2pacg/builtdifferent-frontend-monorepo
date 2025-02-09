<script setup lang="ts">
import type { Entity } from '@/loader/useEntityLoader'
import type { Element, Model } from 'pinia-orm'
import { TextContent } from '@i2pacg/builtdifferent-frontend-tsdata/models'
import { BelongsTo, Boolean as BooleanAttr, HasMany, MorphedByMany, MorphToMany } from 'pinia-orm'

const props = defineProps<{
  isModal?: boolean
  isLoading?: boolean
  entity: Entity
  item: Element
}>()
const emit = defineEmits<{
  (e: 'confirm', form: FormDataType): void
  (e: 'cancel'): void
}>()
const { t } = useI18n()
const isValid = ref(false)

const form = ref(reactive({
  ...Object.keys(props.entity.formFields || {}).sort((a, b) => {
    const rA = props.entity.relations?.[a]
    const rB = props.entity.relations?.[b]
    if ((rA instanceof HasMany && !(rB instanceof HasMany))
      || (rA instanceof MorphedByMany && !(rB instanceof MorphedByMany))
      || (rA instanceof MorphToMany && !(rB instanceof MorphToMany))) {
      return 1
    }
    if ((!(rA instanceof HasMany) && rB instanceof HasMany)
      || (!(rA instanceof MorphedByMany) && rB instanceof MorphedByMany)
      || (!(rA instanceof MorphToMany) && rB instanceof MorphToMany)) {
      return -1
    }
    return 0
  }).reduce((acc, key) => {
    const relation = props.entity.relations?.[key]
    if (relation instanceof BelongsTo) {
      acc[key] = props.item?.[key] || props.item?.[relation.foreignKey?.toString()] || null
    }
    else if (relation instanceof HasMany) {
      acc[key] = props.item?.[key] || []
    }
    else if (relation instanceof MorphedByMany) {
      acc[key] = props.item?.[key] || []
    }
    else if (props.entity.entityConfig.textContentFields[key]) {
      acc[key] = props.item?.[key] || new TextContent({
        type: props.entity.entityConfig.textContentFields[key],
      })
    }
    else {
      acc[key] = props.item?.[key] ?? null
    }
    return acc
  }, {} as const as FormDataType),
}))
watch(props, () => {
  console.log(`%c[BdForm] [watch] item`, 'color: lightblue;', props.item)
  form.value = reactive({
    ...Object.keys(props.entity.formFields || {}).sort((a, b) => {
      const rA = props.entity.relations?.[a]
      const rB = props.entity.relations?.[b]
      if ((rA instanceof HasMany && !(rB instanceof HasMany))
        || (rA instanceof MorphedByMany && !(rB instanceof MorphedByMany))
        || (rA instanceof MorphToMany && !(rB instanceof MorphToMany))) {
        return 1
      }
      if ((!(rA instanceof HasMany) && rB instanceof HasMany)
        || (!(rA instanceof MorphedByMany) && rB instanceof MorphedByMany)
        || (!(rA instanceof MorphToMany) && rB instanceof MorphToMany)) {
        return -1
      }
      return 0
    }).reduce((acc, key) => {
      const relation = props.entity.relations?.[key]
      if (relation instanceof BelongsTo) {
        acc[key] = props.item?.[key] || props.item?.[relation.foreignKey?.toString()] || null
      }
      else if (relation instanceof HasMany) {
        acc[key] = props.item?.[key] || []
      }
      else if (props.entity.entityConfig.textContentFields[key]) {
        acc[key] = props.item?.[key] || new TextContent({
          type: props.entity.entityConfig.textContentFields[key],
        })
      }
      else {
        acc[key] = props.item?.[key] ?? null
      }
      return acc
    }, {} as const as FormDataType),
  })
})
const operation = computed(() => props.item && props.item!.id ? 'edit' : 'create')

const { availableLocales } = useI18n()
const selectedLocale = ref(null)
</script>

<template>
  <or-modal :is-modal="isModal" :title="t(`common.crud.${operation}.header`, { entity: t(`entities.${entity.entityName}.name`) })">
    <template #footer>
      <v-btn
        variant="tonal"
        :disabled="!isValid"
        title="Save"
        color="primary"
        :text="t(`common.crud.${operation}.confirm`, { entity: t(`entities.${entity.entityName}.name`) })"
        @click="emit('confirm', form)"
      />
    </template>
    <template #header>
      <v-card-title class="bg-background d-flex align-center">
        <i18n-t scope="global" :keypath="`common.crud.${operation}.header`">
          <template #entity>
            {{ t(`entities.${entity.entityName}.name`) }}
          </template>
        </i18n-t>
        <v-spacer />
        <v-select
          v-if="Object.keys(entity.entityConfig.textContentFields).length > 0"
          v-model="selectedLocale"
          :items="[{ title: 'All', value: null }, ...availableLocales]"
          density="compact"
          hide-details
          label="Language"
          variant="outlined"
          max-width="100px"
        />
      </v-card-title>
    </template>
    <v-card
      id="formDialog"
      elevation="0"
      class="w-100"
      :loading="isLoading"
      :disabled="isLoading"
    >
      <v-form v-model="isValid" class="d-flex flex-wrap">
        <v-col
          v-for="field, key in form"
          :key="key"
          :cols="(entity.fields[key] instanceof BooleanAttr) ? 6 : 12"
          class="pa-0"
        >
          <v-list-item
            density="compact"
          >
            <bd-relation-field
              v-if="entity.relations[key]"
              v-model="(form[key] as Model | Model[] | null)"
              :item="item"
              :relation="entity.relations[key]"
              :label="`entities.${entity.entityName}.columns.${key}.label`"
            />

          <!--   <component
              :is="entity.formFieldsComponents[key]"
              v-if="entity.formFieldsComponents[key]"
              v-model="form[key]"
              :label="`entities.${entity.entityName}.columns.${key}.label`"
            /> -->
          <!--   <bd-relation-field
              v-else-if="entity.relations[key]"
              v-model="form[key]"
              :item="item"
              :relation="entity.relations[key]"
              :label="`entities.${entity.entityName}.columns.${key}.label`"
            /> -->
            <!--    <text-content-field
              v-else-if="entity.entityConfig.textContentFields![key]"
              v-model="(form[key] as TextContent)"
              :label="`entities.${entity.entityName}.columns.${key}.label`"
              :locale="selectedLocale"
              default-locale="en"
              :text-type="entity.entityConfig.textContentFields![key]"
            />
            <v-switch
              v-else-if="(entity.fields[key] instanceof BooleanAttr)"
              v-model="(form[key] as TextContent)"
              hide-details
              color="primary"
              :label="t(`entities.${entity.entityName}.columns.${key}.label`)"
            /> -->

            <!--
            <component
              :is="useChangeCase(`${entity.relations[key].constructor.name}Field`, 'pascalCase').value"
              v-else-if="entity.relations[key]"
              v-model="form[key]"
              :item="item"
              :relation="entity.relations[key]"
              :label="`entities.${entity.entityName}.columns.${key}.label`"
            /> -->

            <!--  -->
            <!--  <v-text-field
              v-else
              v-model="form[key]"
              density="compact"
              variant="solo-filled"
              :label="t(`entities.${entity.entityName}.columns.${key}.label`)"
              hide-details
            /> -->
          </v-list-item>
        </v-col>
      </v-form>
    </v-card>
  </or-modal>
</template>
