import { AxiosError, type AxiosAdapter, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { api } from '@utils/axios'

const DEFAULT_ADAPTER: typeof api.defaults.adapter = api.defaults.adapter

function createResponse(config: InternalAxiosRequestConfig, status: number): AxiosResponse {
  return { data: {}, status, statusText: '', headers: {}, config }
}

function stubErrorAdapter(status: number): void {
  api.defaults.adapter = ((config) =>
    Promise.reject(
      new AxiosError(
        `Request failed with status code ${status}`,
        status < 500 ? AxiosError.ERR_BAD_REQUEST : AxiosError.ERR_BAD_RESPONSE,
        config,
        {},
        createResponse(config, status),
      ),
    )) as AxiosAdapter
}

function stubNetworkAdapter(): void {
  api.defaults.adapter = ((config) =>
    Promise.reject(new AxiosError('Network Error', AxiosError.ERR_NETWORK, config))) as AxiosAdapter
}

function stubSuccessAdapter(): void {
  api.defaults.adapter = ((config) => Promise.resolve(createResponse(config, 200))) as AxiosAdapter
}

describe('api', () => {
  test('uses NEXT_PUBLIC_API_URL as baseURL', () => {
    expect(api.defaults.baseURL).toBe(process.env.NEXT_PUBLIC_API_URL)
  })

  test('applies default timeout', () => {
    expect(api.defaults.timeout).toBe(30_000)
  })
})

describe('error interceptor', () => {
  let warnSpy: ReturnType<typeof vi.spyOn>
  let errorSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
    api.defaults.adapter = DEFAULT_ADAPTER
  })

  test('logs a 4xx response as warn with a structured payload', async () => {
    stubErrorAdapter(404)

    await expect(api.get('/orders/1')).rejects.toThrow('Request failed with status code 404')

    expect(warnSpy).toHaveBeenCalledTimes(1)
    expect(errorSpy).not.toHaveBeenCalled()

    const entry = warnSpy.mock.calls[0][0]
    expect(entry).toMatchObject({
      event: 'api_error',
      level: 'warn',
      method: 'GET',
      url: '/orders/1',
      status: 404,
      code: AxiosError.ERR_BAD_REQUEST,
    })
    expect(typeof entry.durationMs).toBe('number')
    expect(entry.timestamp).toBeTruthy()
  })

  test('logs a 5xx response as error', async () => {
    stubErrorAdapter(500)

    await expect(api.get('/orders')).rejects.toThrow()

    expect(errorSpy).toHaveBeenCalledTimes(1)
    expect(warnSpy).not.toHaveBeenCalled()
    expect(errorSpy.mock.calls[0][0]).toMatchObject({
      event: 'api_error',
      level: 'error',
      status: 500,
    })
  })

  test('logs a network error without a response as error with undefined status', async () => {
    stubNetworkAdapter()

    await expect(api.get('/orders')).rejects.toThrow('Network Error')

    expect(errorSpy).toHaveBeenCalledTimes(1)

    const entry = errorSpy.mock.calls[0][0]
    expect(entry).toMatchObject({
      event: 'api_error',
      level: 'error',
      method: 'GET',
      url: '/orders',
      code: AxiosError.ERR_NETWORK,
    })
    expect(entry.status).toBeUndefined()
  })

  test('re-throws the original error for callers', async () => {
    stubErrorAdapter(404)

    let caught: unknown
    await api.get('/orders/1').catch((error) => {
      caught = error
    })

    expect(caught).toBeInstanceOf(AxiosError)
    expect((caught as AxiosError).response?.status).toBe(404)
    expect((caught as AxiosError).config?.url).toBe('/orders/1')
  })

  test('does not log bodies or headers', async () => {
    stubErrorAdapter(404)

    await expect(
      api.post('/orders', { password: 'secret' }, { headers: { Authorization: 'Bearer token' } }),
    ).rejects.toThrow()

    const entry = warnSpy.mock.calls[0][0]
    expect(entry).not.toHaveProperty('data')
    expect(entry).not.toHaveProperty('body')
    expect(entry).not.toHaveProperty('headers')
  })

  test('does not log successful responses', async () => {
    stubSuccessAdapter()

    await expect(api.get('/orders')).resolves.toMatchObject({ status: 200 })

    expect(warnSpy).not.toHaveBeenCalled()
    expect(errorSpy).not.toHaveBeenCalled()
  })
})
