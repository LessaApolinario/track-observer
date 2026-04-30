import axios from 'axios'
import { NextRequest, NextResponse } from 'next/server'

export const SPOTIFY_ACCESS_TOKEN_COOKIE = 'spotify_access_token'
export const SPOTIFY_REFRESH_TOKEN_COOKIE = 'spotify_refresh_token'
export const SPOTIFY_TOKEN_EXPIRES_AT_COOKIE = 'spotify_token_expires_at'
export const SPOTIFY_OAUTH_STATE_COOKIE = 'spotify_oauth_state'

const SPOTIFY_SCOPE = [
  'user-read-currently-playing',
  'user-read-playback-state',
].join(' ')

const spotifyTokenEndpoint = 'https://accounts.spotify.com/api/token'

function cookieBaseConfig() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
  }
}

function getClientCredentials() {
  const clientId = process.env.SPOTIFY_CLIENT_ID
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error(
      'SPOTIFY_CLIENT_ID e SPOTIFY_CLIENT_SECRET precisam estar definidos.'
    )
  }

  return { clientId, clientSecret }
}

export function getPublicOrigin(request: NextRequest) {
  const configuredOrigin = process.env.SPOTIFY_APP_BASE_URL

  if (configuredOrigin) {
    return configuredOrigin
  }

  const forwardedHost = request.headers.get('x-forwarded-host')
  const forwardedProto = request.headers.get('x-forwarded-proto')

  if (forwardedHost) {
    const protocol = forwardedProto ?? 'https'
    return `${protocol}://${forwardedHost}`
  }

  return request.nextUrl.origin
}

export function getRedirectUri(request: NextRequest) {
  return (
    process.env.SPOTIFY_REDIRECT_URI ??
    `${getPublicOrigin(request)}/api/spotify/callback`
  )
}

export function createAuthorizationUrl(request: NextRequest, state: string) {
  const { clientId } = getClientCredentials()
  const redirectUri = getRedirectUri(request)
  const authUrl = new URL('https://accounts.spotify.com/authorize')

  authUrl.searchParams.set('client_id', clientId)
  authUrl.searchParams.set('response_type', 'code')
  authUrl.searchParams.set('redirect_uri', redirectUri)
  authUrl.searchParams.set('scope', SPOTIFY_SCOPE)
  authUrl.searchParams.set('state', state)

  return authUrl.toString()
}

function getAuthHeader(clientId: string, clientSecret: string) {
  return Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
}

export async function exchangeCodeForTokens(
  code: string,
  request: NextRequest
): Promise<{ accessToken: string; refreshToken: string; expiresIn: number }> {
  const { clientId, clientSecret } = getClientCredentials()
  const redirectUri = getRedirectUri(request)

  const formData = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri,
  })

  const response = await axios.post(spotifyTokenEndpoint, formData.toString(), {
    headers: {
      Authorization: `Basic ${getAuthHeader(clientId, clientSecret)}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })

  return {
    accessToken: response.data.access_token,
    refreshToken: response.data.refresh_token,
    expiresIn: response.data.expires_in,
  }
}

export async function refreshAccessToken(refreshToken: string) {
  const { clientId, clientSecret } = getClientCredentials()

  const formData = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
  })

  const response = await axios.post(spotifyTokenEndpoint, formData.toString(), {
    headers: {
      Authorization: `Basic ${getAuthHeader(clientId, clientSecret)}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })

  return {
    accessToken: response.data.access_token as string,
    refreshToken:
      (response.data.refresh_token as string | undefined) ?? refreshToken,
    expiresIn: response.data.expires_in as number,
  }
}

export function setTokenCookies(
  response: NextResponse,
  payload: { accessToken: string; refreshToken: string; expiresIn: number }
) {
  const expiresAt = Date.now() + payload.expiresIn * 1000

  response.cookies.set(SPOTIFY_ACCESS_TOKEN_COOKIE, payload.accessToken, {
    ...cookieBaseConfig(),
    maxAge: payload.expiresIn,
  })

  response.cookies.set(SPOTIFY_REFRESH_TOKEN_COOKIE, payload.refreshToken, {
    ...cookieBaseConfig(),
    maxAge: 60 * 60 * 24 * 30,
  })

  response.cookies.set(SPOTIFY_TOKEN_EXPIRES_AT_COOKIE, String(expiresAt), {
    ...cookieBaseConfig(),
    maxAge: 60 * 60 * 24 * 30,
  })
}

export function clearTokenCookies(response: NextResponse) {
  response.cookies.delete(SPOTIFY_ACCESS_TOKEN_COOKIE)
  response.cookies.delete(SPOTIFY_REFRESH_TOKEN_COOKIE)
  response.cookies.delete(SPOTIFY_TOKEN_EXPIRES_AT_COOKIE)
}

export function setOAuthStateCookie(response: NextResponse, state: string) {
  response.cookies.set(SPOTIFY_OAUTH_STATE_COOKIE, state, {
    ...cookieBaseConfig(),
    maxAge: 60 * 10,
  })
}

export function clearOAuthStateCookie(response: NextResponse) {
  response.cookies.delete(SPOTIFY_OAUTH_STATE_COOKIE)
}
