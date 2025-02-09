export interface ArticleQueryParams {
  properties: {
    [key: string]: string | number | number[] | boolean | null | undefined
    category?: number | number[]
  }
  itemsPerPage: number
  page: number
}
export { default as useAppStore } from './stores/app'
