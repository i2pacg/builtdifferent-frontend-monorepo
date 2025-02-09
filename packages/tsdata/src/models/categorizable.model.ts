import type { ModelFields } from 'pinia-orm'
import { Model } from 'pinia-orm'

export default class Categorizable extends Model {
  static entity = 'categorizable'
  static primaryKey = ['categoryId', 'categorizableId', 'categorizableType']

  declare categoryId: number
  declare categorizableId: number
  declare categorizableType: string

  static fields(): ModelFields {
    return {
      categoryId: this.number(null),
      categorizableId: this.number(null),
      categorizableType: this.string(''),
    }
  }
}
