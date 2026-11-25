import { afterEach, describe, expect, test, vi } from 'vitest'
import { getLocaleCookie, setLocaleCookie } from '@utils/locale'

describe('setLocaleCookie', () => {
  test('writes the locale cookie with default sameSite', () => {
    const setter = vi.spyOn(document, 'cookie', 'set')

    setLocaleCookie('fa')

    expect(setter.mock.calls[0][0]).toBe('locale=fa; path=/; samesite=lax')
  })

  test('accepts en locale', () => {
    const setter = vi.spyOn(document, 'cookie', 'set')

    setLocaleCookie('en')

    expect(setter.mock.calls[0][0]).toBe('locale=en; path=/; samesite=lax')
  })

  test('passes through extra cookie options', () => {
    const setter = vi.spyOn(document, 'cookie', 'set')

    setLocaleCookie('fa', { secure: true, sameSite: 'strict' })

    expect(setter.mock.calls[0][0]).toBe('locale=fa; path=/; secure; samesite=strict')
  })

  test('throws for an invalid locale', () => {
    expect(() => setLocaleCookie('fr' as 'fa')).toThrow('Invalid locale: fr')
  })
})

describe('getLocaleCookie', () => {
  test('returns the stored locale', () => {
    setLocaleCookie('en')

    expect(getLocaleCookie()).toBe('en')
  })

  test('falls back to the default locale when the cookie is missing', () => {
    expect(getLocaleCookie()).toBe('fa')
  })

  test('falls back to the default locale when the value is invalid', () => {
    document.cookie = 'locale=fr; path=/'

    expect(getLocaleCookie()).toBe('fa')
  })
})

afterEach(() => {
  vi.restoreAllMocks()
  for (const part of document.cookie.split(';')) {
    const name = part.split('=')[0].trim()
    if (name) document.cookie = `${name}=; max-age=0; path=/`
  }
})
