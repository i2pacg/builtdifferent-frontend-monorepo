import type { ModelConfigOptions } from 'pinia-orm'
import type { EntityConfig } from '../types'
import { Model } from 'pinia-orm'
import { Attr } from 'pinia-orm/decorators'

type LanguageDirection = 'ltr' | 'rtl'
export default class Language extends Model {
  static entity = 'language'
  static primaryKey = 'id'
  @Attr() declare id: number
  @Attr() declare name: string
  @Attr() declare code: string
  @Attr() declare direction: LanguageDirection
  @Attr() declare locale: string
  static piniaOptions = { persist: true }

  toString(): string {
    return this.name ?? ''
  }

  static config: ModelConfigOptions & { entityConfig: EntityConfig } = {
    entityConfig: {
      fieldsComponents: {

      },
      mediaCollections: {
        cover: {
          collection: 'cover',
          field: 'cover',
        },
      },
    },
  }
}
