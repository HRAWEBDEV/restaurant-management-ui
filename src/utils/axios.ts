import axios, { type AxiosInstance } from 'axios'

type ApiConfig = {
  baseURL: string
  timeout: number
}

const DEFAULT_CONFIG: ApiConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api',
  timeout: 30_000,
}

const api: AxiosInstance = axios.create({
  baseURL: DEFAULT_CONFIG.baseURL,
  timeout: DEFAULT_CONFIG.timeout,
})

export { api }
export type { ApiConfig }
