import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { kv } from '@vercel/kv'

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  // Time how long it takes to run kv.hgetall
  // const start = Date.now()
  const data = (await kv.hgetall('data')) as Record<string, string>
  // console.log('data', data)
  // console.log('middleware', request.url, request.nextUrl.pathname)
  // console.log('kv.hgetall took', Date.now() - start, 'ms')

  // Pull out the full path after /kv, and separate with colons
  // E.g. /kv/foo/bar/baz -> foo:bar:baz
  const path = request.nextUrl.pathname
    .split('/')
    .slice(2)
    .filter(Boolean)
    .join(':')
  console.log('newPath', path)

  // Redirect to the value of the path in KV
  const value = data[path]
  if (value && value.startsWith('http')) {
    return NextResponse.redirect(value)
  }
  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/kv/:path*',
}