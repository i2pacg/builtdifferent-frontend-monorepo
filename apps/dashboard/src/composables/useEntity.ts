/* eslint-disable unused-imports/no-unused-imports */
import type { TableHeaders } from '@/interfaces'
import type { EntityConfig, EntityFieldConfig, EntityPreferences, Safe, TableHandling, UserColumnPreferences, UserFormPreferences } from '@i2pacg/builtdifferent-frontend-tsdata'
import type { Attribute, Constructor, Model, ModelFields } from 'pinia-orm'
import type { SortableEvent } from 'sortablejs'
import { LOG_COMPOSABLES_COLOR } from '@/constants'
import { objectEntries, objectPick } from '@vueuse/core'
import { useChangeCase } from '@vueuse/integrations/useChangeCase.mjs'
import { BelongsTo, HasMany, MorphedByMany, MorphToMany, Relation } from 'pinia-orm'

export interface Entity {
  entityName: string
  model: Constructor<Model>
  entityConfig: Safe<EntityConfig>
  entityPreferences: EntityPreferences
  modelFields: ModelFields
  columns: ComputedRef<Record<string, UserColumnPreferences>>
  fields: ComputedRef<Record<string, UserFormPreferences>>
  relations: Record<string, Relation>

}
export function useEntity(model: Constructor<Model>): Entity {
  const entityName = useChangeCase(model.name, 'camelCase').value
  const { getEntityPreferences } = useAppStore()
  const entityPreferences = reactive(getEntityPreferences(model, entityName))
  const entityConfig = (useRepo(model).getModel().$config().entityConfig || {}) as EntityConfig
  const modelFields = useRepo(model).getModel().$fields()
  const foreignKeys = Object.values(useRepo(model).getModel().$fields())
    .filter(val => val instanceof BelongsTo)
    .flatMap((val: BelongsTo) => Array.isArray(val.foreignKey) ? val.foreignKey : [val.foreignKey])
    .reduce((set, key) => set.add(key), new Set<string>())

  const relations: Record<string, Relation> = Object.fromEntries(objectEntries(useRepo(model).getModel().$fields())
    .filter(([_, value]) => value instanceof Relation).map(([key, value]) => [key, value] as [string, Relation]))

  const columns = computed(() => {
    return Object.fromEntries(
      objectEntries(entityPreferences.columnsConfig)
        .filter(([column]) => !foreignKeys.has(column) && !(entityConfig.fields![column]?.textType === 'html'))
        .sort(([, a], [, b]) => Number(!a.visible) - Number(!b.visible) || a.position - b.position),
    )
  })
  const fields = computed(() => {
    return Object.fromEntries(
      objectEntries(entityPreferences.fieldsConfig)
        .filter(([field]) => !foreignKeys.has(field) && !(entityConfig.fields![field]?.form?.hidden))
        .sort(([, a], [, b]) => Number(!a.visible) - Number(!b.visible) || a.position - b.position),
    )
  })
  return {
    entityName,
    model,
    entityConfig,
    entityPreferences,
    modelFields,
    columns,
    fields,
    relations,
  } as Entity
}
