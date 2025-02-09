import type { TextContent } from '@i2pacg/builtdifferent-frontend-tsdata'
import type { Model } from 'pinia-orm'

export type FieldType = 'text' | 'html' | 'image' | 'icon' | 'date' | 'datetime' | 'string' | 'number' | 'array'
export type MediaCollections = Record<string, MediaCollection>

export interface FormDataType {
  [key: string]: number | number[] | string | Date | Model | Model[] | TextContent | null
}
