import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { getCookie, setCookie } from '@utils/cookies'

describe('setCookie', () => {
  let cookieSetter: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    cookieSetter = vi.spyOn(document, 'cookie', 'set')
  })

  test('writes cookie with default path and sameSite', () => {
    setCookie('theme', 'dark')

    expect(cookieSetter.mock.calls[0][0]).toBe('theme=dark; path=/; samesite=lax')
  })

  test('serializes provided options', () => {
    setCookie('session', 'abc', {
      domain: 'example.com',
      maxAge: 3600,
      secure: true,
      partitioned: true,
      sameSite: 'strict',
    })

    expect(cookieSetter.mock.calls[0][0]).toBe(
      'session=abc; path=/; domain=example.com; max-age=3600; secure; partitioned; samesite=strict',
    )
  })

  test('serializes expires as UTC string', () => {
    const expires = new Date('2026-01-01T00:00:00Z')
    setCookie('token', 'x', { expires })

    expect(cookieSetter.mock.calls[0][0]).toBe(
      `token=x; path=/; expires=${expires.toUTCString()}; samesite=lax`,
    )
  })

  test('encodes name and value', () => {
    setCookie('cart item', 'milk; 2 bottles')

    expect(cookieSetter.mock.calls[0][0]).toBe(
      'cart%20item=milk%3B%202%20bottles; path=/; samesite=lax',
    )
  })
})

describe('getCookie', () => {
  test('returns value of an existing cookie', () => {
    setCookie('theme', 'dark')

    expect(getCookie('theme')).toBe('dark')
  })

  test('returns null for a missing cookie', () => {
    expect(getCookie('nonexistent')).toBeNull()
  })

  test('decodes encoded values', () => {
    setCookie('cart item', 'milk; 2 bottles')

    expect(getCookie('cart item')).toBe('milk; 2 bottles')
  })

  test('does not match cookies with similar names as prefixes', () => {
    setCookie('user', 'hamid')
    setCookie('userId', '42')

    expect(getCookie('userId')).toBe('42')
    expect(getCookie('user')).toBe('hamid')
  })
})

describe('server-side rendering guard', () => {
  test('setCookie is a no-op and getCookie returns null without document', () => {
    vi.stubGlobal('document', undefined)

    expect(() => setCookie('theme', 'dark')).not.toThrow()
    expect(getCookie('theme')).toBeNull()

    vi.unstubAllGlobals()
  })
})

afterEach(() => {
  vi.restoreAllMocks()
  for (const part of document.cookie.split(';')) {
    const name = part.split('=')[0].trim()
    if (name) document.cookie = `${name}=; max-age=0; path=/`
  }
})
