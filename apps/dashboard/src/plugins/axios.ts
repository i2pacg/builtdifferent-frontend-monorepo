import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
  RawAxiosRequestHeaders,
} from 'axios'

import axios from 'axios'

export interface ApiError {
  errorMessage: string
  errorText: string
  errorCode: number
  errorStatus: string
}

const axiosInstance: AxiosInstance = axios.create({
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  } as RawAxiosRequestHeaders,
  withXSRFToken: true,
})

async function onResponse(response: AxiosResponse<unknown, unknown>): Promise<AxiosResponse<unknown, unknown>> {
  return response
}

async function onResponseError(error: AxiosError<ApiError, InternalAxiosRequestConfig>): Promise<AxiosError<ApiError, InternalAxiosRequestConfig>> {
  if (error.response?.status === 419) {
    console.log('419 error')
    const token = await axiosInstance.get('/sanctum/csrf-cookie')
    axiosInstance.defaults.headers.common['X-XSRF-TOKEN'] = token.data
    return axiosInstance(error.config as AxiosRequestConfig)
  }
  return Promise.reject(error)
}

axiosInstance.interceptors.response.use(onResponse, onResponseError)

export default axiosInstance
