import { describe, expect, test } from 'vitest'
import { api } from '@utils/axios'

describe('api', () => {
  test('uses NEXT_PUBLIC_API_URL as baseURL', () => {
    expect(api.defaults.baseURL).toBe(process.env.NEXT_PUBLIC_API_URL)
  })

  test('applies default timeout', () => {
    expect(api.defaults.timeout).toBe(30_000)
  })
})
