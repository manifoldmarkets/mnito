import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { kv } from '@vercel/kv'
import { HARD_PATHS } from './hardcode'

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  // Time how long it takes to run kv.hgetall
  const start = Date.now()
  const data = ((await kv.hgetall('data')) as Record<string, string>) ?? {}
  console.log('middleware', request.url, request.nextUrl.pathname)
  console.log('kv.hgetall took', Date.now() - start, 'ms')

  // Pull out the full path after /kv, and separate with colons
  // E.g. /kv/foo/bar/baz -> foo:bar:baz
  const path = request.nextUrl.pathname
    .split('/')
    .slice(1)
    .filter(Boolean)
    .join(':')
  console.log('newPath', path)

  // Augment data with the shortcuts from HARD_PATHS
  Object.assign(data, HARD_PATHS)

  // Redirect to the value of the path in KV
  const value = data[path]
  if (value && value.startsWith('http')) {
    return NextResponse.redirect(value)
  }
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
