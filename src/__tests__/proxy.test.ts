// @vitest-environment node
import { describe, expect, test } from 'vitest'
import { NextRequest } from 'next/server'
import { proxy } from '../proxy'

function createRequest(path: string, cookie?: string): NextRequest {
  return new NextRequest(`http://localhost:3000${path}`, {
    headers: cookie ? { cookie } : undefined,
  })
}

describe('proxy', () => {
  test('redirects to the default locale when the url has no locale prefix and no cookie exists', () => {
    const response = proxy(createRequest('/dashboard'))

    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toBe('http://localhost:3000/fa/dashboard')
  })

  test('redirects the root path to the default locale', () => {
    const response = proxy(createRequest('/'))

    expect(response.headers.get('location')).toBe('http://localhost:3000/fa')
  })

  test('redirects to the saved locale cookie when the url has no locale prefix', () => {
    const response = proxy(createRequest('/dashboard', 'locale=en'))

    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toBe('http://localhost:3000/en/dashboard')
  })

  test('falls back to the default locale when the cookie value is not a known locale', () => {
    const response = proxy(createRequest('/dashboard', 'locale=fr'))

    expect(response.headers.get('location')).toBe('http://localhost:3000/fa/dashboard')
  })

  test('does not redirect urls that are already prefixed with a locale', () => {
    const response = proxy(createRequest('/fa/dashboard'))

    expect(response.status).toBe(200)
    expect(response.headers.get('x-middleware-next')).toBe('1')
  })

  test('preserves search params when redirecting', () => {
    const response = proxy(createRequest('/products?page=2', 'locale=en'))

    expect(response.headers.get('location')).toBe('http://localhost:3000/en/products?page=2')
  })
})
