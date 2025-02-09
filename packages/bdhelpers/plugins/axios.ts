import type {
  AxiosError,
  AxiosInstance,
  /*   AxiosError, */
  /* AxiosInterceptorOptions, */
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
  /*   AxiosInterceptorOptions,
  AxiosResponse,
  InternalAxiosRequestConfig, */
  RawAxiosRequestHeaders,
} from 'axios'

import axios from 'axios'

function ConcurrencyManager(axios: any, MAX_CONCURRENT: number = 10) {
  if (MAX_CONCURRENT < 1)
    throw new Error('Concurrency Manager Error: minimum concurrent requests is 1')

  const instance = {
    queue: [] as Array<{ request: any, resolver: (value: any) => void }>,
    running: [] as Array<{ request: any, resolver: (value: any) => void }>,
    shiftInitial: () => {
      setTimeout(() => {
        if (instance.running.length < MAX_CONCURRENT) {
          instance.shift()
        }
      }, 0)
    },
    push: (reqHandler: { request: any, resolver: (value: any) => void }) => {
      instance.queue.push(reqHandler)
      instance.shiftInitial()
    },
    shift: () => {
      if (instance.queue.length) {
        const queued = instance.queue.shift()
        if (queued) {
          queued.resolver(queued.request)
          instance.running.push(queued)
        }
      }
    },
    // Use as interceptor. Queue outgoing requests
    requestHandler: (req: any) => {
      return new Promise((resolve) => {
        instance.push({ request: req, resolver: resolve })
      })
    },
    // Use as interceptor. Execute queued request upon receiving a response
    responseHandler: (res: any) => {
      instance.running.shift()
      instance.shift()
      return res
    },
    responseErrorHandler: (errorResponse: AxiosError<ApiError, InternalAxiosRequestConfig>): Promise<AxiosError<ApiError, InternalAxiosRequestConfig>> => {
      return Promise.reject(instance.responseHandler(errorResponse))
    },
    interceptors: {
      request: null,
      response: null,
    },
    detach: () => {
      axios.interceptors.request.eject(instance.interceptors.request)
      axios.interceptors.response.eject(instance.interceptors.response)
    },
  }
  // queue concurrent requests
  instance.interceptors.request = axios.interceptors.request.use(
    instance.requestHandler,
  )
  instance.interceptors.response = axios.interceptors.response.use(
    instance.responseHandler,
    instance.responseErrorHandler,
  )
  return instance
}

export interface ApiError {
  errorMessage: string
  errorText: string
  errorCode: number
  errorStatus: string
}
const axiosInstance: AxiosInstance = axios.create({
  withCredentials: true,
  baseURL: import.meta.env.BASE_URL,
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
/* const interceptorOptions: AxiosInterceptorOptions = { synchronous: false } */
/*
 */
/* */
/* axiosInstance.interceptors.request.use(axiosQueueInterceptor, onRequestError, interceptorOptions)
 */

const axiosQueue = ConcurrencyManager(axiosInstance, 10)
export { axiosQueue }

axiosInstance.interceptors.response.use(onResponse, onResponseError)

export default axiosInstance
