import type { ToastMessages } from './misc'
// Import the Ref type from the appropriate package

export interface PagingResponse {
  data: Record<string, unknown>[]
  currentPage: number
  firstPageUrl: string
  from: number
  lastPage: number
  lastPageUrl: string
  links: {
    url: string | null
    label: string
    active: boolean
  }[]
  nextPageUrl: string | null
  path: string
  perPage: number
  prevPageUrl: string | null
  to: number
  total: number
}

export interface ApiResponse<T = unknown> {
  result: T
  success: boolean
  message: string
}

export interface ApiError {
  errorMessage: string
  errorText: string
  errorCode: number
  errorStatus: string
}

export interface ApiRequestConfig {
  showToasts?: boolean | 'success' | 'error'
  toastMessages?: ToastMessages
}
export interface ApiRequestMethods<T> {
  config: (configOptions?: ApiRequestConfig) => ApiRequestMethods<T>
  index: (params?: Record<string, unknown>) => Promise<T>
  store: <U = unknown>(body?: U, headers?: Record<string, string>, params?: Record<string, string>) => Promise<T>
  update: <U = unknown>(body: U) => Promise<T>
  destroy: (ids: string | string[] | number | number[]) => Promise<T>
}
