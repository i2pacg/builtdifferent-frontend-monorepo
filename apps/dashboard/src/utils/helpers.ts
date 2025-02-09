import type { Boolean } from 'pinia-orm'

export const isBoolean = (value: any): value is Boolean => typeof value === 'boolean'
