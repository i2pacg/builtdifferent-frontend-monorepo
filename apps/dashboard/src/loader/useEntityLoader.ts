import type { EntityConfig, EntityFieldConfig, Safe, UserColumnPreferences } from '@i2pacg/builtdifferent-frontend-tsdata'
import type { EntityPreferences } from '@i2pacg/builtdifferent-frontend-tsdata/models'
import type { Constructor, Model, ModelFields, Relation } from 'pinia-orm'
import { loadModelClasses } from '@/utils/loadModelClasses'
import { useBdLogger } from '@i2pacg/builtdifferent-frontend-bdhelpers'
import { TextContent } from '@i2pacg/builtdifferent-frontend-tsdata/models'
import { objectEntries, objectPick } from '@vueuse/core'

import { useChangeCase } from '@vueuse/integrations/useChangeCase.mjs'
import { BelongsTo, HasMany, MorphedByMany, MorphToMany } from 'pinia-orm'
import { defineBasicLoader } from 'unplugin-vue-router/data-loaders/basic'

export const useEntityLoader = defineBasicLoader('entities', async (to): Promise<Entity> => {
  const logger = useBdLogger()
  logger.log({
    source: 'useEntityLoader',
    message: 'Starting entity load',
  })

  const entityName = useChangeCase(to.params.entity, 'camelCase').value
  console.log('entityName', entityName)
  const { getEntityPreferences } = useAppStore()
  const entityPreferences = reactive(getEntityPreferences(entityName))
  const model = await loadModelClasses(to.params.entity) as Constructor<Model>
  const ent = useEntity(model)
  logger.log({
    source: 'useEntityLoader',
    message: 'Entity instance:',
    data: ent,
  })

  const entityConfig: EntityConfig = useRepo(model).getModel().$config().entityConfig || {
    textContentFields: {},
    fieldsComponents: {},
    multiLocale: false,
  } as EntityConfig
  logger.log({
    source: 'useEntityLoader',
    message: 'Entity config:',
    data: entityConfig,
  })

  const fields = objectEntries(useRepo(model).getModel().$fields()).filter(([key, _]) => !key.startsWith('pivot')).reduce((acc, [key, value]) => {
    acc[key] = value
    return acc
  }, {} as ModelFields)
  logger.log({
    source: 'useEntityLoader',
    message: 'Fields:',
    data: { keys: Object.keys(fields), fields },
  })

  const relations: Record<string, Relation> = Object.fromEntries(
    objectEntries(fields)
      .filter(([_, value]) => Object.keys(value).includes('related'))
      .map(([key, value]) => [key, value as Relation]),
  )

  logger.log({
    source: 'useEntityLoader',
    message: 'Relations:',
    data: relations,
  })

  const cellComponents: Record<string, string | Component> = Object.fromEntries(Object.entries(relations).map(([key, relation]) =>
    [key, relation.related.$config() && relation.related.$config().entityConfig
      ? relation.related.$config().entityConfig?.components?.cell
      : null]).filter(([, component]) => component !== null && component !== undefined))
  logger.log({
    source: 'useEntityLoader',
    message: 'Cell components:',
    data: cellComponents,
  })

  const formFieldsComponents = Object.fromEntries(objectEntries(entityConfig.fieldsComponents!)
    .map(([key, value]) => [key, value!.form])
    .concat(Object.entries(Object.fromEntries(Object.entries(relations).map(([key, relation]) => {
      return [key, relation.related.$config() && relation.related.$config().entityConfig
        ? relation.related.$config().entityConfig?.components?.form
        : null]
    })))).filter(([, component]) => component))
  logger.log({
    source: 'useEntityLoader',
    message: 'Form field components:',
    data: formFieldsComponents,
  })
  const hasManyRelations: Record<string, HasMany> = Object.fromEntries(objectEntries(relations)
    .filter(([_, value]) => value instanceof HasMany)
    .map(([key, value]) => [key, value as HasMany]))
  const morphToManyRelations: Record<string, MorphToMany> = Object.fromEntries(objectEntries(relations)
    .filter(([_, value]) => value instanceof MorphToMany)
    .map(([key, value]) => [key, value as MorphToMany]))
  const morphedByManyRelations: Record<string, MorphedByMany> = Object.fromEntries(objectEntries(relations)
    .filter(([_, value]) => value instanceof MorphedByMany)
    .map(([key, value]) => [key, value as MorphedByMany]))

  const belongsToRelations: Record<string, BelongsTo> = Object.fromEntries(objectEntries(relations)
    .filter(([_, value]) => value instanceof BelongsTo)
    .map(([key, value]) => [key, value as BelongsTo]))
  logger.log({
    source: 'useEntityLoader',
    message: 'Belongs to relations:',
    data: belongsToRelations,
  })

  const htmlFields = objectEntries(entityConfig.textContentFields || {}).filter(([_, value]) => value === 'html').map(([key, _]) => key)

  const filterFields = Object.fromEntries(Object.entries(belongsToRelations)
    .filter(([_, relation]) => !(relation.related instanceof TextContent))
    .map(([key, relation]) => [key, relation]))
  logger.log({
    source: 'useEntityLoader',
    message: 'Filter fields:',
    data: filterFields,
  })
  const formFields = Object.fromEntries(Object.entries(fields)
    .filter(([key, _]) =>
      !htmlFields.includes(key)
      && (entityConfig.fieldsComponents?.[key]?.form ?? true) !== false
      && !Object.values(belongsToRelations).some(relation => relation.foreignKey === key),
    ).map(([key, value]) => [key, value]))
  logger.log({
    source: 'useEntityLoader',
    message: 'Form fields:',
    data: formFields,
  })
  const columns = objectPick(fields, Object.keys(fields).filter(key =>
    !htmlFields.includes(key)
    && (entityConfig.fieldsComponents?.[key]?.cell ?? true) !== false
    && !Object.keys(belongsToRelations).map(btr => belongsToRelations[btr].foreignKey).includes(key),
  ))
  logger.log({
    source: 'useEntityLoader',
    message: 'Columns:',
    data: columns,
  })

  if (!entityPreferences.columnsVisible.length && entityConfig.defaultVisibleFields && entityConfig.defaultVisibleFields.length) {
    entityPreferences.columnsVisible = entityConfig.defaultVisibleFields
  }
  entityPreferences.columnsVisible = (entityPreferences.columnsVisible.length ? entityPreferences.columnsVisible.filter(c => c in columns) : Object.keys(columns))
  logger.log({
    source: 'useEntityLoader',
    message: 'Visible columns:',
    data: entityPreferences.columnsVisible,
  })
  return {
    entityName,
    model,
    entityConfig,
    entityPreferences,
    fields,
    columns,
    relations,
    belongsToRelations,
    hasManyRelations,
    morphToManyRelations,
    morphedByManyRelations,
    formFields,
    cellComponents,
    formFieldsComponents,
    htmlFields,
  } as Entity
}, {
  lazy: false,
  key: 'entity',
})
