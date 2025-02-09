export { Category } from './models/category.model'
export interface ArticleQueryParams {
  properties: {
    [key: string]: string | number | number[] | boolean | null | undefined
    category?: number | number[]
  }
  itemsPerPage: number
  page: number
}
