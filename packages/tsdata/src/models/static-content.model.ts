import type { Casts, ModelConfigOptions } from 'pinia-orm'
import type { DefaultLocaleMessageSchema } from 'vue-i18n'
import type TextContent from './text-content.model'
import { Model } from 'pinia-orm'
import { Attr } from 'pinia-orm/decorators'
import { type EntityConfig, TextContentCast } from '../types'

export default class StaticContent extends Model {
  static entity = 'static-content'
  static primaryKey = 'id'
  @Attr() declare id: number
  @Attr() declare key: string
  @Attr() declare name: TextContent
  @Attr() declare value: TextContent
  @Attr() declare description: TextContent

  toString() {
    return this.name.toString()
  }

  static casts(): Casts {
    return {
      name: TextContentCast,
      value: TextContentCast,
      description: TextContentCast,
    }
  }

  static piniaOptions = { persist: true }
  static config: ModelConfigOptions & { entityConfig: EntityConfig } = {
    entityConfig: {
      drawer: true,
      drawerIcon: '$mdi-translate',
      fields: {
        id: {
          form: {
            visible: false,
          },
        },
      },
      mediaCollections: {
        cover: {
          collection: 'cover',
          field: 'cover',
        },
      },
    },
  }

  get messages(): DefaultLocaleMessageSchema {
    const localizedMessages: DefaultLocaleMessageSchema = {}
    Object.keys(this.value.messages).forEach((lang) => {
      localizedMessages[lang] = {
        [this.key]: this.value.messages[lang],
      } as DefaultLocaleMessageSchema
    })
    return localizedMessages
  }
}
