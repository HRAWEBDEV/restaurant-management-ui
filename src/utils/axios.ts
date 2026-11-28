import axios, { type AxiosError, type AxiosInstance } from 'axios'
import { logError, logWarn } from './logger'

declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    metadata?: {
      startTime?: number
    }
  }
}

type ApiConfig = {
  baseURL: string
  timeout: number
}

type ApiErrorLogPayload = {
  method?: string
  url?: string
  status?: number
  code?: string
  message?: string
  durationMs?: number
}

const DEFAULT_CONFIG: ApiConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api',
  timeout: 30_000,
}

const LOG_EVENT = 'api_error'

const api: AxiosInstance = axios.create({
  baseURL: DEFAULT_CONFIG.baseURL,
  timeout: DEFAULT_CONFIG.timeout,
})

api.interceptors.request.use((config) => {
  config.metadata = { startTime: performance.now() }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const { config, response, code, message } = error
    const startTime = config?.metadata?.startTime
    const durationMs =
      typeof startTime === 'number' ? Math.round(performance.now() - startTime) : undefined

    const payload: ApiErrorLogPayload = {
      method: config?.method?.toUpperCase(),
      url: config?.url,
      status: response?.status,
      code,
      message,
      durationMs,
    }

    if (typeof response?.status === 'number' && response.status < 500) {
      logWarn(LOG_EVENT, payload)
    } else {
      logError(LOG_EVENT, payload)
    }

    return Promise.reject(error)
  },
)

export { api }
export type { ApiConfig, ApiErrorLogPayload }
