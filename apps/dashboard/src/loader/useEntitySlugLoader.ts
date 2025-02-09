import type { EntityConfig } from '@i2pacg/builtdifferent-frontend-tsdata'
import type { EntityPreferences } from '@i2pacg/builtdifferent-frontend-tsdata/models'
import type { BelongsTo, Constructor, HasMany, Model, ModelFields, MorphedByMany, MorphToMany, Relation } from 'pinia-orm'
import { LOG_LOADER_COLOR } from '@/constants'

import { defineBasicLoader } from 'unplugin-vue-router/data-loaders/basic'

export interface Entity {
  entityName: string
  model: Constructor<Model>
  entityConfig: EntityConfig
  pref: EntityPreferences
  fields: ModelFields
  columns: Pick<ModelFields, string>
  relations: Record<string, Relation>
  belongsToRelations: Record<string, BelongsTo>
  hasManyRelations: Record<string, HasMany>
  morphToManyRelations: Record<string, MorphToMany>
  morphedByManyRelations: Record<string, MorphedByMany>
  textContentRelations: Record<string, BelongsTo>
  formFields: ModelFields
  cellComponents: Record<string, string | Component | boolean>
  formFieldsComponents: Record<string, string | Component | boolean>
  htmlFields: string[]
}
export const useEntitySlugLoader = defineBasicLoader('entities.details', async (to): Promise<Entity> => {
  console.groupCollapsed('%c[useEntitySlugLoader]', LOG_LOADER_COLOR)
  console.log(`%c[userEntitySlugLoader] %c[to]`, LOG_LOADER_COLOR, 'color:white', to)
  /*   const entityData = await useEntityLoader()
  console.log('got it ere', entityData) */
  console.groupEnd()
  return {
    entityName: 'entityName',
  } as Entity
}, {
  lazy: false,
})
