import axios from 'axios'

import type {
/*   AxiosError, */
  AxiosInstance,
  /*   AxiosInterceptorOptions,
  AxiosResponse,
  InternalAxiosRequestConfig, */
  RawAxiosRequestHeaders,
} from 'axios'

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
    responseErrorHandler: (res: any) => {
      return Promise.reject(instance.responseHandler(res))
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
  baseURL: import.meta.env.VITE_APP_URL as string,
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  } as RawAxiosRequestHeaders,
  withXSRFToken: true,
})

/* new AxiosQueue(axiosInstance)
 */
/* async function onResponse(response: AxiosResponse<unknown, unknown>): Promise<AxiosResponse<unknown, unknown>> {
  return response
} */
/* let retryCounter = 0
 */
/* async function onResponseError(error: AxiosError<ApiError, InternalAxiosRequestConfig>): Promise<AxiosError<ApiError, InternalAxiosRequestConfig>> {
  console.log('::Global onResponseError::', error)
  return Promise.reject(error)
}
const interceptorOptions: AxiosInterceptorOptions = { synchronous: false } */
/*
 */
/* axiosInstance.interceptors.response.use(onResponse, onResponseError, interceptorOptions) */
/* axiosInstance.interceptors.request.use(axiosQueueInterceptor, onRequestError, interceptorOptions)
 */

const axiosQueue = ConcurrencyManager(axiosInstance, 10)

export { axiosQueue }
export default axiosInstance
