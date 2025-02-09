import type { ApiError, ApiRequestConfig, ApiRequestMethods, ApiResponse } from '@/interfaces/api'
import type { ToastMessages } from '@/interfaces/misc'
import type { AxiosError, AxiosResponse } from 'axios'
import axiosInstance from '@/plugins/axios'
import { useBdLogger } from '@i2pacg/builtdifferent-frontend-bdhelpers'
import { isAxiosError } from 'axios'
import { ref } from 'vue'
import { useToast } from 'vue-toastification'

function useApiRequest<T>(path: string): ApiRequestMethods<T> {
  const { log } = useBdLogger()
  const showToast = useToast()
  const showToasts = ref<boolean | 'success' | 'error'>(false)
  const toastMessages = ref<ToastMessages>({})

  const handleError = (error: unknown | AxiosError<ApiError>): Promise<T> => {
    if (isAxiosError<ApiError>(error)) {
      if (showToasts.value === true || showToasts.value === 'error') {
        // TODO: add error message to toast
        log('useApiRequest', 'error response', error.response?.data.errorMessage)
        /*    showToast.error(toastMessages.value.error ?? error.response?.data.errorMessage); */
      }
      throw error.response?.data
    }
    throw error
  }

  const index = async (params?: Record<string, unknown>): Promise<T> => {
    try {
      const {
        data: { result },
      } = await axiosInstance.get<ApiResponse<T>>(path, { params })

      if (showToasts.value === true || showToasts.value === 'success') {
        showToast.success(toastMessages.value.success ?? 'Request successful')
      }
      return result
    }
    catch (error) {
      log('useApiRequest', 'index error', error)
      return handleError(error)
    }
  }
  const store = async <U = unknown>(body?: U, headers?: Record<string, string>, params?: Record<string, string>): Promise<T> => {
    try {
      log('useApiRequest', 'store request', { body, headers, params })
      const response = await axiosInstance.post<ApiResponse<T>, AxiosResponse<ApiResponse<T>>, U>(path, body, {
        headers: headers!,
        params: params!,

      })
      log('useApiRequest', 'store response', response)
      if (response.data && !response.data.result && response.data.data) {
        log('useApiRequest', 'store response.data', response.data)
        return response.data.data as unknown as T
      }
      const {
        data: { result },
      } = response
      if (showToasts.value === true || showToasts.value === 'success') {
        log('useApiRequest', 'showing success toast', showToasts.value)
        showToast.success(toastMessages.value.success ?? 'Request successful')
      }
      return result
    }
    catch (error) {
      log('useApiRequest', 'store error', error)
      return handleError(error)
    }
  }

  const update = async <U = unknown>(data: U): Promise<T> => {
    try {
      const {
        data: { result },
      } = await axiosInstance.put<ApiResponse<T>>(path, JSON.parse(JSON.stringify(data)))
      if (showToasts.value === true || showToasts.value === 'success') {
        showToast.success(toastMessages.value.success ?? 'Update successful')
      }
      return result
    }
    catch (error) {
      log('useApiRequest', 'update error', error)
      return handleError(error)
    }
  }

  const destroy = async (ids: string | number): Promise<T> => {
    try {
      const {
        data: { result },
      } = await axiosInstance.delete<ApiResponse<T>>(`${path}/${ids}`)
      if (showToasts.value === true || showToasts.value === 'success') {
        showToast.success(toastMessages.value.success ?? 'Update successful')
      }
      return result
    }
    catch (error) {
      log('useApiRequest', 'destroy error', error)
      return handleError(error)
    }
  }

  const config = ({ showToasts: st, toastMessages: tm }: ApiRequestConfig = {}): ApiRequestMethods<T> => {
    if (st !== undefined) {
      showToasts.value = st
    }
    if (tm) {
      toastMessages.value = tm
    }
    return { index, store, update, destroy, config }
  }

  return { index, store, update, destroy, config }
}

export default useApiRequest
