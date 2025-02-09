import type { ModelFields } from 'pinia-orm'
import { Model } from 'pinia-orm'

export default class Taggable extends Model {
  static entity = 'taggable'
  static primaryKey = ['tagId', 'taggableId', 'taggableType']

  declare tagId: number
  declare taggableId: number
  declare categorizableType: string

  static fields(): ModelFields {
    return {
      tagId: this.number(null),
      taggableId: this.number(null),
      taggableType: this.string(''),
    }
  }
}
