import { defaultLocale, isLocale } from '../internalization/localications'
import { getCookie, setCookie } from './cookies'
import type { CookieOptions } from './cookies'
import type { Locale } from '../internalization/localications'

const LOCALE_COOKIE_NAME = 'locale'

function setLocaleCookie(locale: Locale, options: CookieOptions = {}): void {
  if (!isLocale(locale)) {
    throw new Error(`Invalid locale: ${locale}`)
  }
  setCookie(LOCALE_COOKIE_NAME, locale, { sameSite: 'lax', ...options })
}

function getLocaleCookie(): Locale {
  const value = getCookie(LOCALE_COOKIE_NAME)
  if (value && isLocale(value)) {
    return value
  }
  return defaultLocale
}

export { setLocaleCookie, getLocaleCookie, LOCALE_COOKIE_NAME }
export type { Locale }
