export type CookieOptions = {
  path?: string
  domain?: string
  expires?: Date
  maxAge?: number
  secure?: boolean
  sameSite?: 'strict' | 'lax' | 'none'
  partitioned?: boolean
}

const DEFAULT_OPTIONS: Required<Pick<CookieOptions, 'path' | 'sameSite'>> = {
  path: '/',
  sameSite: 'lax',
}

export function setCookie(name: string, value: string, options: CookieOptions = {}): void {
  if (typeof document === 'undefined') return

  const { path, domain, expires, maxAge, secure, sameSite, partitioned } = {
    ...DEFAULT_OPTIONS,
    ...options,
  }

  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`

  if (path) cookieString += `; path=${path}`
  if (domain) cookieString += `; domain=${domain}`
  if (expires) cookieString += `; expires=${expires.toUTCString()}`
  if (typeof maxAge === 'number') cookieString += `; max-age=${maxAge}`
  if (secure) cookieString += '; secure'
  if (partitioned) cookieString += '; partitioned'
  if (sameSite) cookieString += `; samesite=${sameSite}`

  document.cookie = cookieString
}

export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null

  const target = `${encodeURIComponent(name)}=`
  for (const part of document.cookie.split(';')) {
    const trimmed = part.trim()
    if (trimmed.startsWith(target)) {
      return decodeURIComponent(trimmed.slice(target.length))
    }
  }
  return null
}
