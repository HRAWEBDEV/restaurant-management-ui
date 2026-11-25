import { NextResponse, type NextRequest } from 'next/server'
import { defaultLocale, isLocale } from '../internalization/localications'
import { LOCALE_COOKIE_NAME } from '../utils/locale'

function getLocaleFromCookie(request: NextRequest): typeof defaultLocale {
  const value = request.cookies.get(LOCALE_COOKIE_NAME)?.value
  return value && isLocale(value) ? value : defaultLocale
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (isLocale(pathname.split('/')[1])) {
    return NextResponse.next()
  }

  const url = request.nextUrl.clone()
  url.pathname = `/${getLocaleFromCookie(request)}${pathname === '/' ? '' : pathname}`
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\..*).*)'],
}
