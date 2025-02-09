import type { PagingResponse, ValidationError } from '@/interfaces'
import type { RuleFunction } from '@i2pacg/bd-vue'
import type { Model } from 'pinia-orm'
import { isObject } from '@vueuse/core'

export const isOdd = (n: number): boolean => Math.abs(n % 2) === 1
export function slugIt(str: string): string {
  // check if word is not english
  return str
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
export function guid() {
  const segment = () =>
    Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1)
  return `${segment()}${segment()}-${segment()}-${segment()}-${segment()}-${segment()}${segment()}${segment()}`
}
export const hasName = (o: object): o is { name: string } => isObject(o) && 'name' in o

export const hasId = (o: unknown): o is { id: string | number } => isObject(o) && 'id' in o
export const hasSlug = (o: unknown): o is { slug: string } => isObject(o) && 'slug' in o
export const hasMessage = (o: unknown): o is { message: string } => isObject(o) && 'message' in o
export const isValidationError = (o: unknown): o is ValidationError => isObject(o) && 'message' in o && 'errors' in o
/*
export function isValidationError(e: unknown): e is ValidationError {
  return (e as ValidationError).message !== undefined
    && (e as ValidationError).errors !== undefined
} */
/*
Record<string, Array<RuleFunction>> */

export const isI18nRules = (o: unknown): o is Record<string, Array<RuleFunction>> => isObject(o) && Object.keys(o).every(key => Array.isArray(o[key as keyof typeof o]))

export const isRuleFunction = (o: unknown): o is RuleFunction => typeof o === 'function'

export const isPagingResponse = (o: unknown): o is PagingResponse => isObject(o) && 'data' in o && 'currentPage' in o && 'firstPageUrl' in o && 'from' in o && 'lastPage' in o && 'lastPageUrl' in o && 'links' in o && 'nextPageUrl' in o && 'path' in o && 'perPage' in o && 'prevPageUrl' in o && 'to' in o && 'total' in o

export function keyOrDefault<T extends Record<string, any>, D>(item: T | null | undefined, key: keyof T, defaultValue: D): D {
  return item && key in item ? item[key] as unknown as D : defaultValue
}

export function keyOrDefaultModel<T extends Model, D>(item: T | null | undefined, key: keyof T, defaultValue: D): D {
  return item && key in item ? item[key] as unknown as D : defaultValue
}
