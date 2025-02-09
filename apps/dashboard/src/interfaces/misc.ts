import type { SortItem } from '@/interfaces'
import type { Model } from 'pinia-orm'
import type {
  Component,
  Ref,
  ShallowRef,
} from 'vue'
import type { BaseModelProps, TableHeaders } from '.'
/* import type {
  ColDef,
  Columns,
  Field,
  Header,
  TableKey,
  TablePreferences,
} from './preferences/admin/tables' */

export interface ToastMessages {
  error?: string
  success?: string
}
export type PostCreateOption = 'info' | 'content' | 'media' | 'done' | 'another'
export type PostUpdateOption = 'close' | 'more'

export interface LoadDataParams {
  groupBy?: unknown[]
  itemsPerPage?: number
  page?: number
  search?: { key: string, value: string }[] | Ref<string> | string
  sortBy?: unknown[]
}
export class HttpException {
  constructor(public readonly message: string) { }
}
export interface ErrorData {
  errorMessage: string
  errorText: string
  errorCode: number
  errorStatus: string
  /*
'errorMessage' => $errorMessage,
          'errorText' => $errorText ? $errorText : $errorMessage,
          'errorCode' => $code,
          'errorStatus' => $errorStatus, */
}
export interface StoreParams {
  itemsPerPage: number
  orderBy: SortItem
  searchBy: SearchItem[]
  page: number
  bulk?: number
}
export interface DataStore<T extends BaseModelProps> {
  items: Ref<T[]>
  loadData: (extraParams?: Record<string, unknown>) => Promise<void>
  refreshData: () => Promise<void>
  lastRefresh: Ref<number>
  loading: Ref<boolean>
  pages: Ref<number>
  columnsToDisplay: Ref<string[]>
  refreshTable: () => Promise<void>
  page: Ref<number>
  totalLength: Ref<number>
  getLocalItem: (slugOrId: string | number) => T | null
  getItem: (slugOrId: string | number) => Promise<T | null>
  deleteItem: (item: T) => Promise<boolean | void>
  updateItem: (item: T | FormData, id: number) => Promise<T>
  deleteItems: (items: number | number[]) => Promise<void>
  createItem: (item: T) => Promise<T | void>
}

export interface DataFunctions<T extends BaseModelProps> {
  items: Ref<T[]>
}
export interface DataStoreE<T extends BaseModelProps> {
  data: ShallowRef<T[]>
  get: () => Promise<void>
}
export interface MediaFunctions {
  upload: (media: File | File[], idOrSlug: number | string, collectionName: string) => Promise<void>
  deleteMedia: (ids: number[]) => Promise<void>
  updateMedia: (media: FormData) => Promise<void>
}

export interface SearchItem {
  key: string
  value: string
}

export interface AllowedFileType {
  maxSize?: number
  maxFiles?: number
}

export interface MediaFileLoadedEvent {
  component: Component
  props: Record<string, unknown>
}
export interface UpdateFileParams {
  data?: string
  type?: string
}

export interface ValidationError {
  message: string
  errors: {
    [key: string]: string[]
  }
}

/* export interface ImageDimensions {
  height: number
  width: number
  aspectRatio: number
} */
