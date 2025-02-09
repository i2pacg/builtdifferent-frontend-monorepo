import type { Casts, ModelConfigOptions, ModelFields } from 'pinia-orm'
import type { EntityConfig } from '../types'
import type TextContent from './text-content.model'
import { Model } from 'pinia-orm'
import { ModelCast, TextContentCast } from '../types'
import Article from './article.model'
import Categorizable from './categorizable.model'
import Localizable from './localizable.model'

export default class Category extends Model {
  static entity = 'category'
  static primaryKey = 'id'
  static displayField = 'name'

  declare id: number
  declare slug: string
  declare name: TextContent
  declare description: TextContent
  declare page: TextContent
  declare parentId: number
  declare orderColumn: number
  declare articles: Article[]
  declare parent: Category
  declare subCategories: Category[]
  declare locales: Localizable[]
  declare createdAt: Date
  declare updatedAt: Date
  get defaultLocale(): string {
    return 'en'
  }

  static fields(): ModelFields {
    return {
      id: this.attr(null),
      slug: this.string(''),
      name: this.attr(null),
      description: this.attr(null),
      page: this.attr(null),
      articles: this.morphedByMany(
        Article,
        Categorizable,
        'categorizableId',
        'categoryId',
        'categorizableType',
        'id',
        'id',
      ),
      locales: this.morphMany(Localizable, 'localizableId', 'localizableType'),
      parentId: this.attr(null),
      parent: this.belongsTo(Category, 'parentId'),
      subCategories: this.hasMany(Category, 'parentId'),
      createdAt: this.date(null),
      updatedAt: this.date(null),
    }
  }

  static casts(): Casts {
    return {
      name: TextContentCast,
      description: TextContentCast,
      page: TextContentCast,
      parent: ModelCast.withParameters({ model: Category }),
      subCategories: ModelCast.withParameters({ model: Category }),
      locales: ModelCast.withParameters({ model: Localizable }),
    }
  }

  static piniaOptions = { persist: true }
  static config: ModelConfigOptions & { entityConfig: EntityConfig<Category> } = {
    entityConfig: {
      drawer: true,
      drawerIcon: '$mdi-folder',
      fields: {
        id: {
          table: {
            visible: false,
          },
          form: {
            hidden: true,
            layout: {
              size: 12,
              position: 1,
              offsetStart: 0,
              offsetEnd: 0,
            },
          },
        },
        slug: {
          table: {
            minWidth: '100px',
          },
          form: {
            hidden: true,
            messages: ['common.crud.fields.slug.hint'],
            layout: {
              size: 12,
            },
          },
        },
        page: {
          table: {
            position: 1,
          },
          form: {
            hidden: true,
            layout: {
              position: Number.MAX_SAFE_INTEGER,
              size: 12,
            },
          },
          textType: 'html',
        },
        name: {
          table: {
            minWidth: '200px',
          },
          form: {
            hidden: false,
          },
          textType: 'short_text',
        },
        description: {
          textType: 'long_text',
          form: {
            hidden: true,
          },
        },
        articles: {
          form: {
            hidden: true,
          },
        },
        locales: {
          table: {
            visible: false,
          },
          form: {
            hidden: true,
          },
        },
        createdAt: {
          table: {
            nowrap: true,
          },
          form: {
            hidden: true,
            layout: {
              size: 6,
            },
          },
        },
        updatedAt: {
          form: {
            hidden: true,
            layout: {
              size: 6,
            },
          },
        },
        parentId: {
          table: {
            groupable: {
              parentKey: 'parent',
              childrenKey: 'subCategories',
            },
          },
        },
        parent: {
          relation: {
            filter: (item, originalItem) => item.id !== originalItem!.id,
            canCreate: false,
          },
          form: {
            layout: {
              size: 12,
            },
          },
        },
        subCategories: {
          relation: {
            filter: (item, originalItem) => item.id !== originalItem!.id && item.id !== originalItem!.parentId,
            canCreate: false,
          },
          form: {
            hidden: true,
            layout: {
              size: 12,
            },

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

  toString(): string {
    if (!this.name)
      return ''
    return this.name.toString()
  }
}
