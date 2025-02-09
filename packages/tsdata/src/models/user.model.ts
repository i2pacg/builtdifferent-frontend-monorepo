import type { Casts, ModelConfigOptions, ModelFields } from 'pinia-orm'
import { Model } from 'pinia-orm'
import { type EntityConfig, MethodCast } from '../types'
import Preferences from './preferences.model'

/* with<T extends WithKeys<M>>(name: string & {} | T, callback?: M[T] extends Model | Model[] | null ? EagerLoadConstraint<GetElementType<NonNullable<M[T]>>> : never): Query<M> {
  return this.query().with(name, callback)
} */
export default class User extends Model {
  static entity = 'users'
  static primaryKey = 'id'
  declare id: number | null
  declare email: string
  declare name: string
  declare emailVerifiedAt: string
  declare preferences: Preferences
  declare createdAt: Date | null
  declare updatedAt: Date | null

  toString(): string {
    return this.name || this.email
  }

  static fields(): ModelFields {
    return {
      id: this.number(null),
      email: this.attr(''),
      name: this.string(''),
      emailVerifiedAt: this.string(''),
      preferences: this.attr(Preferences.default()),
      createdAt: this.attr(null),
      updatedAt: this.attr(null),
    }
  }

  static casts(): Casts {
    return {
      preferences: MethodCast.withParameters({ make: (value: any) => new Preferences(value) }),
    }
  }

  static piniaOptions = { persist: true }
  static config: ModelConfigOptions & { entityConfig: EntityConfig<User> } = {
    entityConfig: {
      mediaCollections: {
        cover: {
          collection: 'cover',
          field: 'cover',
        },
      },
    },
  }
}
