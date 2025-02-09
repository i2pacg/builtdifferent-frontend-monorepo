import type { Constructor, Element, NonMethodKeys } from 'pinia-orm'
import type { Component } from 'vue'
import { CastAttribute, Model } from 'pinia-orm'
import TextContent from '../models/text-content.model'

/**
 * Represents a sorting configuration item for data ordering.
 * @interface SortItem
 * @property {string} key - The property key to sort by
 * @property {boolean | 'asc' | 'desc'} [order] - Sort direction - true/'asc' for ascending, false/'desc' for descending
 */
export interface SortItem {
  key: string
  order?: boolean | 'asc' | 'desc'
}

/**
 * Type representing valid language codes from the global languages configuration
 */
export type LanguageCodes = (typeof window.languages)[number]['code']

/**
 * Type representing translations mapped by language code
 */
export type Translations = Record<LanguageCodes, string | null>

/**
 * Type utility for creating strings that must start with a specific prefix
 * @template Prefix - The required string prefix
 */
export type StartsWithType<Prefix extends string> = `${Prefix}${string}`

/**
 * Type representing valid field icons that start with '$' or '<svg'
 */
export type FieldIcon = StartsWithType<'$' | '<svg'>

/**
 * Type guard to validate if a string is a valid FieldIcon
 * @param value - String to check
 * @returns True if string matches FieldIcon pattern
 */
export function isFieldIcon(value: string): value is string & FieldIcon {
  return value != null && /^(?:\$|<svg)/.test(value.toString())
}

/**
 * Configuration for a media collection including storage and validation settings
 * @interface MediaCollection
 */
export interface MediaCollection {
  /** Name of the storage disk */
  diskName: string
  /** Name of the disk for storing conversions */
  conversionsDiskName: string
  /** Registered media conversion configurations */
  mediaConversionRegistrations: any[]
  /** Whether to generate responsive image variants */
  generateResponsiveImages: boolean
  /** Accepted file types */
  acceptsFile: any[]
  /** Accepted MIME types */
  acceptsMimeTypes: string[]
  /** Maximum size limit for the collection */
  collectionSizeLimit: number
  /** Whether only a single file is allowed */
  singleFile: boolean
  /** Fallback URLs if media is missing */
  fallbackUrls: any[]
  /** Fallback file paths if media is missing */
  fallbackPaths: any[]
  /** Collection identifier */
  name: string
}

/**
 * Component configuration for field display and form input
 * @interface FieldComponents
 */
interface FieldComponents {
  /** Component for cell display in tables */
  cell: string | Component | boolean
  /** Component for form input */
  form: string | Component | boolean
}

/**
 * Valid text input types for content fields
 */
export type TextType = 'text' | 'short_text' | 'long_text' | 'html'

/**
 * Complete entity configuration type
 * @interface EntityConfig
 * @template T - Entity type being configured
 */
export interface EntityConfig<T = any> {
  /**
   * Whether the entity should be displayed in a drawer.
   */
  drawer?: boolean

  /**
   * The icon to be used for the drawer.
   */
  drawerIcon?: FieldIcon

  /**
   * Custom components for the entity fields.
   */
  components?: Partial<FieldComponents>

  /**
   * Configuration for the entity fields.
   */
  fields?: {
    [key in NonMethodKeys<T>]?: EntityFieldConfig
  }

  /**
   * Configuration for the media collections of the entity.
   */
  mediaCollections?: {
    [key: string]: {
      /**
       * The name of the media collection.
       */
      collection: string

      /**
       * The field associated with the media collection.
       */
      field: string
    }
  }
}

/**
 * Configuration for how a field should be displayed in tables
 * @interface TableHandling
 */
export interface TableHandling {
  hidden?: boolean
  visible?: boolean
  position?: number
  sortable?: boolean
  groupable?: {
    parentKey: string
    childrenKey: string
  }
  nowrap?: boolean
  minWidth?: string
  filterable?: boolean
  width?: number | string
  fixed?: 'left' | 'right'
  align?: 'left' | 'center' | 'right'
}

/**
 * Configuration for how a field should be handled in forms
 * @interface FormHandling
 */
export interface FormHandling {
  visible?: boolean
  hidden?: boolean
  messages?: string[]
  layout?: Partial<FormLayout>
}

/**
 * Layout configuration for form fields
 * @interface FormLayout
 */
export interface FormLayout {
  /** Column width (1-12 grid system) */
  size: number
  /** Display order position */
  position: number
  /** Grid offset from start */
  offsetStart: number
  /** Grid offset from end */
  offsetEnd: number

  /** Variant */
  variant?: 'outlined' | 'plain' | 'underlined' | 'filled' | 'solo' | 'solo-inverted' | 'solo-filled'
}

/**
 * Valid field types for entity properties
 */
export type FieldType = 'text' | 'number' | 'boolean' | 'date' | 'select' | 'relation'

/**
 * Configuration for hierarchical grouping of related items
 * @interface GroupConfig
 */
export interface GroupConfig {
  /**
   * Key to identify the parent/group property
   */
  groupKey: string

  /**
   * Key to identify the parent name
   */
  groupName: string

  /**
   * Key to identify the children/items
   */
  itemKey: string

  /**
   * Optional transform function for group values
   */
  transform?: (value: any) => any
}

/**
 * Configuration for relation fields
 * @interface RelationConfig
 */
export interface RelationConfig {
  /**
   * Display mode for related items
   */
  displayMode?: 'autocomplete' | 'checkbox' | 'radio' | 'toggle'

  /**
   * Key to group related items by
   */
  groupBy?: string
  /**
   * Filter function for related items
   * @param item - The item being checked
   */
  filter?: (item: Element, originalItem?: Element) => boolean

  /**
   * Grouping configuration for hierarchical data
   * @example
   * {
   *   groupKey: 'parentId',
   *   itemKey: 'id'
   * }
   */
  group?: GroupConfig

  /**
   * Whether new related items can be created
   */
  canCreate?: boolean

  /**
   * Maximum number of related items allowed
   */
  maxItems?: number

  /**
   * Default sort order for related items
   */
  defaultSort?: SortItem[]

  /**
   * Whether to allow reordering of related items
   */
  allowReorder?: boolean
}

/**
 * Complete configuration for an entity field
 * @interface EntityFieldConfig
 */
export interface EntityFieldConfig {
  type?: FieldType
  components?: Partial<FieldComponents>
  table?: TableHandling
  form?: FormHandling
  textType?: TextType
  relation?: RelationConfig
}

/**
 * Utility type to make all properties of T required
 * @template T - Type to make required
 */
export type Safe<T> = {
  [P in keyof T]-?: T[P]
}

// Type aliases with Safe utility
export type SafeTableHandling = Safe<TableHandling>
export type SafeFormHandling = Safe<FormHandling>
export type SafeEntityFieldConfig = Safe<EntityFieldConfig>
export type SafeEntityConfig<T = any> = Safe<EntityConfig<T>>

/**
 * Cast attribute for handling Model types in Pinia ORM
 * @class ModelCast
 * @extends CastAttribute
 */
export class ModelCast extends CastAttribute {
  static parameters = {
    model: Model,
  }

  /**
   * Casts a value to a Model instance or array of Model instances
   * @param value - Raw value to cast
   * @returns Instantiated Model(s)
   */
  get(value: any): Model | Model[] {
    const CastModel = this.getParameters()!.model as Constructor<Model>
    if (Array.isArray(value)) {
      return value.map((v: any) => new CastModel(v))
    }
    return new CastModel(value)
  }
}

/**
 * Cast attribute for method-based transformations
 * @class MethodCast
 * @extends CastAttribute
 */
export class MethodCast extends CastAttribute {
  static parameters = {
    make: Function,
  }

  /**
   * Transforms a value using the provided make function
   * @param value - Value to transform
   */
  get(value: any): any {
    return this.getParameters()!.make(value)
  }

  /**
   * Transforms a value for setting using the provided make function
   * @param value - Value to transform
   */
  set(value?: any) {
    return this.getParameters()!.make(value)
  }
}

/**
 * Cast attribute for handling TextContent fields
 * @class TextContentCast
 * @extends CastAttribute
 */
export class TextContentCast extends CastAttribute {
  /**
   * Casts a value to a TextContent instance
   * @param value - Raw value to cast
   */
  get(value: any): TextContent {
    return value instanceof TextContent ? value : new TextContent(value)
  }

  /**
   * Casts a value for setting as TextContent
   * @param value - Value to cast
   */
  set(value?: any) {
    return value instanceof TextContent ? value : new TextContent(value)
  }
}

/**
 * User preferences for column display
 * @interface UserColumnPreferences
 */
export interface UserColumnPreferences {
  /** Whether the column should be visible */
  visible?: boolean
  /** Display order position */
  position?: number
}

/**
 * User preferences for form layout
 * @interface UserFormPreferences
 * @extends FormLayout
 */
export interface UserFormPreferences extends FormLayout, Pick<RelationConfig, 'displayMode' | 'groupBy'> {}
