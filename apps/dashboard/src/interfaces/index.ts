import type { ArgumentsType } from '@vueuse/core'
import type {
  VAutocomplete,
  VBreadcrumbs,
  VDataIterator,
  VDataTableServer,
  VIcon,
  VList,
  VSelect,
  VTab,
  VTabs,
  VTextField,
} from 'vuetify/components'

/**
 *
 * @param {number} ms The number of milliseconds to wait.
 */
export async function timeout(ms: number): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, ms))
}
export type SortItem = InstanceType<typeof VDataTableServer>['sortBy']

/* export type TableHeaders = InstanceType<typeof VDataTableServer>['headers']
 */
export type TableHeaders = VDataTableServer['$props']['headers']
type UnwrapReadonlyArrayType<A> = A extends Readonly<Array<infer I>> ? UnwrapReadonlyArrayType<I> : A
export type TableHeader = UnwrapReadonlyArrayType<TableHeaders>

// make a type of single header from the above type
export type TableSlots = InstanceType<typeof VDataTableServer>['$slots']
export type InternalDataTableHeader = ArgumentsType<TableSlots['header.data-table-select']>['0']['column']
export type BreadcrumbsSlots = InstanceType<typeof VBreadcrumbs>['$slots']
export type InternalBreadcrumbItem = ArgumentsType<BreadcrumbsSlots['item']>['0']['item']
export type InternalListItem = ArgumentsType<InstanceType<typeof VAutocomplete>['$slots']['item']>['0']['item']

export type AutoCompleteProps = InstanceType<typeof VAutocomplete>['$props']
export type CustomFilter = Exclude<AutoCompleteProps['customFilter'], undefined>
export type OnClickSelectSelectArg = ArgumentsType<InstanceType<typeof VList>['$props']['onClick:select']>[0]
/*
"onClick:select"?: (value: {
  id: unknown;
  value: boolean;
  path: unknown[];
}) => void; */
export type InternalItem = Exclude<ArgumentsType<CustomFilter>[2], undefined>
export type ValidationRules = InstanceType<typeof VTextField>['rules']
export type IconValue = InstanceType<typeof VIcon>['icon']
export type TabItem = Record<string, any>
export const getTyped = <T>(value: any, defaultValue: T | null = null): T | null => value as T || defaultValue

/**
 * Type helper to access properties that exist at runtime but aren't reflected in type definitions
 * @example
 * interface User { name: string }
 * const user = { name: 'John', id: 1 } as User
 * const id = getExistingProp<User, number>(user, 'id') // works and returns number
 */
export function getExistingProp<T extends object, V>(
  obj: T,
  prop: PropertyKey & keyof (T extends unknown ? Record<PropertyKey, unknown> : never),
): V {
  return (obj as Record<PropertyKey, V>)[prop]
}

/**
 * Type guard to check if a property exists on an object
 * @example
 * interface User { name: string }
 * const user = { name: 'John', id: 1 } as User
 * if (hasExistingProp(user, 'id')) {
 *   console.log(user.id) // TypeScript now knows id exists
 * }
 */
export function hasExistingProp<T extends object>(
  obj: T,
  prop: PropertyKey & keyof (T extends unknown ? Record<PropertyKey, unknown> : never),
): boolean {
  return prop in obj
}

export type SelectableItem = ArgumentsType<ArgumentsType<TableSlots['item.data-table-select']>['0']['toggleSelect']>['0']

export interface GroupableItem<T = any> {
  type: 'item'
  raw: T
}

export interface Group<T = any> {
  type: 'group'
  depth: number
  id: string
  key: string
  value: any
  items: readonly (T | Group<T>)[]

}
export interface DataIteratorItem<T = any> extends GroupableItem<T>, SelectableItem {
  value: unknown
}

/* type Grouped = ArgumentsType<InstanceType<typeof VDataIterator>['$slots']['default']>['0']['groupedItems'][number] */
/**
 * Type guard to check if an item is a group.
 */
export function isGroup<T = unknown>(
  item: DataIteratorItem<unknown> | Group<DataIteratorItem<unknown>>,
): item is Group<DataIteratorItem<T>> {
  return typeof item === 'object' && item !== null && 'type' in item && item.type === 'group'
}

/**
 * Universal type checker that can validate any type without setup
 * @example
 * if (isType<InternalListItem>(someObject)) {
 *   console.log(someObject.title) // TypeScript knows it's InternalListItem
 * }
 */
export function isType<T extends object>(value: unknown): value is T {
  if (!value || typeof value !== 'object')
    return false

  // Create a type-safe proxy target
  const target = {} as Record<keyof T, unknown>

  const shape = new Proxy(target, {
    get: () => true,
    has: (_, prop) => prop in (value as object),
  })

  return Object.keys(value as object).every(key => key in shape)
}

export * from './api'
export * from './auth'
export * from './misc'
export * from './models'
