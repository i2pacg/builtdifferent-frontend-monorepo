import type { Casts, ModelConfigOptions, ModelFields } from 'pinia-orm'
import type { EntityConfig } from '../types'
import type TextContent from './text-content.model'
import { Model } from 'pinia-orm'
import { DateCast } from 'pinia-orm/casts'
import { ModelCast, TextContentCast } from '../types'
import Article from './article.model'
import Language from './language.model'
import Taggable from './taggable.model'

export default class Tag extends Model {
  static entity = 'tag'
  static primaryKey = 'id'

  declare id: number
  declare languageId: number
  declare language: Language
  declare slug: string
  declare name: TextContent
  declare articles: Article[]
  declare createdAt: Date
  declare updatedAt: Date

  get defaultLocale(): string {
    if (!this.language)
      return 'en'
    return this.language.code ?? 'en'
  }

  static fields(): ModelFields {
    return {
      id: this.number(null),
      languageId: this.attr(null),
      language: this.belongsTo(Language, 'languageId'),
      slug: this.string(''),
      name: this.attr(null),
      articles: this.morphedByMany(
        Article,
        Taggable,
        'taggableId',
        'tagId',
        'taggableType',
        'id',
        'id',
      ),
      createdAt: this.attr(null),
      updatedAt: this.attr(null),
    }
  }

  static casts(): Casts {
    return {
      name: TextContentCast,
      language: ModelCast.withParameters({ model: Language }),
      createdAt: DateCast,
      updatedAt: DateCast,
    }
  }

  static piniaOptions = { persist: true }
  static config: ModelConfigOptions & { entityConfig: EntityConfig<Tag> } = {
    entityConfig: {
      mediaCollections: {
        cover: {
          collection: 'cover',
          field: 'cover',
        },
      },
    },
  }

  toString(): string {
    return this.name.toString()
  }
}
