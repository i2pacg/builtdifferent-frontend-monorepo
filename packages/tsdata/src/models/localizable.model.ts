import type { ModelConfigOptions, ModelFields } from 'pinia-orm'
import type { EntityConfig } from 'src/types'
import { Model, useRepo } from 'pinia-orm'
import Language from './language.model'

export default class Localizable extends Model {
  static entity = 'localizable'
  static primaryKey = ['languageId', 'localizableId', 'localizableType']

  declare languageId: number
  declare localizableId: number
  declare localizableType: string
  declare isActive: boolean
  declare language: Language
  static fields(): ModelFields {
    return {
      languageId: this.number(null),
      localizableId: this.number(null),
      localizableType: this.string(''),
      isActive: this.boolean(false),
      language: this.belongsTo(Language, 'languageId'),
    }
  }

  static config: ModelConfigOptions & { entityConfig: EntityConfig<Localizable> } = {
    entityConfig: {
      fieldsComponents: {
        localizableId: {
          form: false,
        },
        localizableType: {
          form: false,
        },
      },
    },
  }

  toString() {
    if (!this.language)
      return useRepo(Language).find(this.languageId)?.name
    return this.language.name
  }
}
/* 'id' => 1,
'localizable_type' => 'category',
'localizable_id' => 110000,
'language_id' => 300000,
'is_default' => 1,
'created_at' => NULL,
'updated_at' => NULL, */
