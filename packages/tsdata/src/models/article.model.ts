import type { Casts, ModelConfigOptions, ModelFields } from 'pinia-orm'
import type { EntityConfig } from '../types'
import type TextContent from './text-content.model'
import { Model } from 'pinia-orm'
import { DateCast } from 'pinia-orm/casts'
import { TextContentCast } from '../types'
import Categorizable from './categorizable.model'
import Category from './category.model'
import Localizable from './localizable.model'
import Tag from './tag.model'
import Taggable from './taggable.model'

export default class Article extends Model {
  static entity = 'article'
  static primaryKey = 'id'
  static displayField = 'title'
  declare id: number
  declare slug: string
  declare title: TextContent

  declare subtitle: TextContent
  declare description: TextContent
  declare body: TextContent
  declare categories: Category[]
  declare locales: Localizable[]

  declare tags: Tag[]
  declare isFeatured: boolean
  declare isEditorsChoice: boolean
  declare isFromContributors: boolean
  declare isPublished: boolean
  declare createdAt: Date
  declare updatedAt: Date

  get defaultLocale(): string {
    return 'en'
  }

  static fields(): ModelFields {
    return {
      id: this.number(null),
      slug: this.string(''),
      title: this.attr(null),
      description: this.attr(null),
      subtitle: this.attr(null),
      body: this.attr(null),
      categories: this.morphToMany(
        Category,
        Categorizable,
        'categoryId',
        'categorizableId',
        'categorizableType',
      ),
      tags: this.morphToMany(
        Tag,
        Taggable,
        'tagId',
        'taggableId',
        'taggableType',
      ),
      locales: this.morphMany(Localizable, 'localizableId', 'localizableType'),

      /* locales: this.morphToMany(
        Language,
        Localizable,
        'languageId',
        'localizableId',
        'localizableType',
      ), */ /*
      , */

      isFeatured: this.boolean(false),
      isEditorsChoice: this.boolean(false),
      isFromContributors: this.boolean(false),
      isPublished: this.boolean(false),
      createdAt: this.date(null),
      updatedAt: this.date(null),
    }
  }

  static casts(): Casts {
    return {
      title: TextContentCast,
      body: TextContentCast,
      description: TextContentCast,
      subtitle: TextContentCast,
      createdAt: DateCast,
      updatedAt: DateCast,
    }
  }

  static piniaOptions = { persist: true }
  static config: ModelConfigOptions & { entityConfig: EntityConfig<Article> } = {
    entityConfig: {
      fields: {
        id: {
          table: {
            visible: false,
          },
          form: {
            hidden: true,
          },
        },
        title: {
          textType: 'short_text',
          table: {
            position: 1,
            minWidth: '200px',
            visible: true,
          },
          form: {
            hidden: false,
            layout: {
              position: 0,
            },
          },
        },
        slug: {
          table: {
            visible: false,
          },
          form: {
            hidden: true,
            layout: {
              position: 1,
            },
          },
        },
        subtitle: {
          textType: 'short_text',
          table: {
            visible: false,
          },
          form: {
            hidden: true,
            layout: {
              position: 2,
            },
          },
        },
        description: {
          textType: 'long_text',
          table: {
            visible: false,
          },
          form: {
            hidden: true,
            layout: {
              position: 3,
            },
          },
        },
        createdAt: {
          table: {
            position: 0,
            visible: true,
          },
          form: {
            hidden: true,
            layout: {
              position: 4,
            },
          },
        },
        categories: {
          table: {
            visible: false,
          },
          relation: {
            displayMode: 'checkbox',
            groupBy: 'parentId',
            canCreate: true,
            group: {
              groupKey: 'parentId',
              groupName: 'parent',
              itemKey: 'subCategories',
            },
          },
          form: {
            layout: {
              position: 5,
            },
          },
        },
        tags: {
          table: {
            visible: false,
          },
          relation: {
            canCreate: true,
          },
          form: {
            hidden: true,
            layout: {
              position: 6,
            },
          },
        },
        body: {
          table: {
            visible: false,
          },
          textType: 'html',
          form: {
            hidden: true,
            layout: {
              position: 7,
            },
          },
        },
        isPublished: {
          table: {
            position: 2,
            visible: true,
            align: 'center',
          },
          form: {
            hidden: true,
            layout: {
              size: 3,
              position: 8,
            },
          },
        },
        isFeatured: {
          table: {
            visible: true,
          },
          form: {
            hidden: true,
            layout: {
              size: 3,
              position: 9,
            },
          },
        },
        isEditorsChoice: {
          table: {
            position: 3,
            visible: true,
            align: 'center',
          },
          form: {
            hidden: true,
            layout: {
              size: 3,
              position: 10,
            },
          },
        },
        isFromContributors: {
          table: {
            visible: false,
          },
          form: {
            hidden: true,
            layout: {
              size: 3,
              position: 11,
            },
          },
        },
        updatedAt: {
          table: {
            visible: false,
          },
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
    return this.title.toString()
  }
}
