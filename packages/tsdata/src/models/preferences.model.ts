import type { EntityConfig, SortItem, UserColumnPreferences, UserFormPreferences } from 'src/types'
import { type Constructor, type Model, useRepo } from 'pinia-orm'

/**
 * Represents the preferences of a user in the system.
 * @property {string} theme - The theme preference of the user.
 * @property {string} language - The language preference of the user.
 * @augments BaseModel
 */
export default class Preferences {
  /**
   * The theme preference of the user.
   */
  theme: string

  /**
   * The language preference of the user.
   */
  language: string

  /**
   * The drawer preference of the user.
   */
  drawer: boolean

  /**
   * The entities preferences of the user.
   */
  entities: Record<string, EntityPreferences>

  /**
   * Constructs a new Preferences instance.
   * @param {Record<string, any>} props - The properties of the preferences.
   */
  constructor(props?: Record<string, any>) {
    if (!props) {
      props = Preferences.default()
    }
    this.theme = props.theme ?? 'light'
    this.language = props.language ?? 'en'
    this.drawer = props.drawer ?? true
    this.entities = Object.fromEntries(Object.entries((props.entities ?? {}) as Record<string, EntityPreferences>)
      .map(([entity, entityProps]) => [entity, new EntityPreferences(entityProps)]))
  }

  /**
   * Returns default preferences.
   * @returns {Preferences}
   */
  static default(): Preferences {
    return new Preferences({
      theme: 'light',
      language: 'en',
      drawer: true,
      entities: {},
      /* entities: EntityPreferences.defaultEntities(), */
    })
  }
}

/* Class removed as it's already imported as a type from 'src/types' */
export class EntityPreferences {
  itemsPerPage: number
  columnsConfig: Record<string, UserColumnPreferences>
  fieldsConfig: Record<string, UserFormPreferences>
  sortBy: SortItem[]
  constructor(props: Record<string, any>) {
    this.itemsPerPage = props.itemsPerPage ?? 10
    this.sortBy = props.sortBy ?? []
    this.columnsConfig = Object.fromEntries(
      Object.entries(props.columnsConfig ?? {}).map(([column, columnProps]) => [
        column,
        {
          visible: (columnProps as UserColumnPreferences)?.visible ?? true,
          position: (columnProps as UserColumnPreferences)?.position ?? (Number.MAX_SAFE_INTEGER /2 ),
        },
      ]),
    )
    this.fieldsConfig = Object.fromEntries(
      Object.entries(props.fieldsConfig ?? {}).map(([field, fieldProps]) => [
        field,
        {
          groupBy: (fieldProps as UserFormPreferences)?.groupBy ?? undefined,
          displayMode: (fieldProps as UserFormPreferences)?.displayMode ?? 'autocomplete',
          size: (fieldProps as UserFormPreferences)?.size ?? 12,
          position: (fieldProps as UserFormPreferences)?.position ?? (Number.MAX_SAFE_INTEGER /2 ),
          offsetStart: (fieldProps as UserFormPreferences)?.offsetStart ?? 0,
          offsetEnd: (fieldProps as UserFormPreferences)?.offsetEnd ?? 0,
        } as UserFormPreferences,
      ]),
    )
  }

  static default(): EntityPreferences {
    return new EntityPreferences({
      itemsPerPage: 10,
      columnsConfig: {},
      fieldsConfig: {},
      sortBy: [],
    })
  }

  static for(model: Constructor<Model>, entityPreferences?: EntityPreferences): EntityPreferences {
    const modelDefaultConfig = useRepo(model).getModel().$config().entityConfig as EntityConfig
    return new EntityPreferences({
      itemsPerPage: entityPreferences?.itemsPerPage ?? 10,
      columnsConfig: Object.keys(useRepo(model).getModel().$fields())
        .filter(field => !field.startsWith('pivot_'))
        .reduce((acc, field) => {
          acc[field] = {
            visible: entityPreferences?.columnsConfig?.[field]?.visible ?? modelDefaultConfig.fields![field]?.table?.visible ?? true,
            position: entityPreferences?.columnsConfig?.[field]?.position ?? modelDefaultConfig.fields![field]?.table?.position ?? (Number.MAX_SAFE_INTEGER /2 ),
          }
          return acc
        }, {} as Record<string, UserColumnPreferences>),
      fieldsConfig: Object.keys(useRepo(model).getModel().$fields())
        .filter(field => !field.startsWith('pivot_'))
        .reduce((acc, field) => {
          acc[field] = {
            groupBy: entityPreferences?.fieldsConfig?.[field]?.groupBy ?? modelDefaultConfig.fields![field]?.relation?.groupBy ?? undefined,
            displayMode: entityPreferences?.fieldsConfig?.[field]?.displayMode ?? modelDefaultConfig.fields![field]?.relation?.displayMode ?? 'autocomplete',
            size: entityPreferences?.fieldsConfig?.[field]?.size ?? modelDefaultConfig.fields![field]?.form?.layout?.size ?? 12,
            position: entityPreferences?.fieldsConfig?.[field]?.position ?? modelDefaultConfig.fields![field]?.form?.layout?.position ?? (Number.MAX_SAFE_INTEGER /2 ),
            offsetStart: entityPreferences?.fieldsConfig?.[field]?.offsetStart ?? modelDefaultConfig.fields![field]?.form?.layout?.offsetStart ?? 0,
            offsetEnd: entityPreferences?.fieldsConfig?.[field]?.offsetEnd ?? modelDefaultConfig.fields![field]?.form?.layout?.offsetEnd ?? 0,
          }
          return acc
        }, {} as Record<string, UserFormPreferences>),
      sortBy: [],
    })
  }
}
