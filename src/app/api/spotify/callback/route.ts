import { NextRequest, NextResponse } from 'next/server'
import {
  SPOTIFY_OAUTH_STATE_COOKIE,
  clearOAuthStateCookie,
  exchangeCodeForTokens,
  getPublicOrigin,
  setTokenCookies,
} from '../_shared'

function redirectToHome(request: NextRequest, error?: string) {
  const destination = new URL('/', getPublicOrigin(request))

  if (error) {
    destination.searchParams.set('spotify_error', error)
  }

  return NextResponse.redirect(destination)
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')
  const state = request.nextUrl.searchParams.get('state')
  const error = request.nextUrl.searchParams.get('error')

  if (error || !code) {
    return redirectToHome(request, error ?? 'missing_code')
  }

  const storedState = request.cookies.get(SPOTIFY_OAUTH_STATE_COOKIE)?.value

  if (!state || !storedState || state !== storedState) {
    return redirectToHome(request, 'state_mismatch')
  }

  try {
    const tokenPayload = await exchangeCodeForTokens(code, request)
    const response = redirectToHome(request)

    setTokenCookies(response, tokenPayload)
    clearOAuthStateCookie(response)

    return response
  } catch {
    return redirectToHome(request, 'token_exchange_failed')
  }
}
