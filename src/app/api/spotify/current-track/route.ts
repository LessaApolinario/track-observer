import { SpotifyCurrentlyPlayingResponse } from '@/core/@types/spotify'
import { SpotifyToTrackMapper } from '@/core/mappers/spotifyToTrackMapper'
import axios from 'axios'
import { NextRequest, NextResponse } from 'next/server'
import {
  SPOTIFY_ACCESS_TOKEN_COOKIE,
  SPOTIFY_REFRESH_TOKEN_COOKIE,
  SPOTIFY_TOKEN_EXPIRES_AT_COOKIE,
  clearTokenCookies,
  refreshAccessToken,
  setTokenCookies,
} from '../_shared'

const spotifyCurrentTrackEndpoint =
  'https://api.spotify.com/v1/me/player/currently-playing'

function unauthorizedResponse() {
  return NextResponse.json({
    requiresAuth: true,
    authUrl: '/api/spotify/login',
    track: null,
  })
}

async function getValidAccessToken(
  request: NextRequest,
  response: NextResponse
) {
  const accessToken = request.cookies.get(SPOTIFY_ACCESS_TOKEN_COOKIE)?.value
  const refreshToken = request.cookies.get(SPOTIFY_REFRESH_TOKEN_COOKIE)?.value
  const expiresAtCookie = request.cookies.get(
    SPOTIFY_TOKEN_EXPIRES_AT_COOKIE
  )?.value

  if (!refreshToken && !accessToken) {
    return null
  }

  const expiresAt = Number(expiresAtCookie ?? 0)
  const isExpired =
    !accessToken || !expiresAt || Date.now() >= expiresAt - 30_000

  if (!isExpired && accessToken) {
    return accessToken
  }

  if (!refreshToken) {
    return null
  }

  const refreshedTokens = await refreshAccessToken(refreshToken)
  setTokenCookies(response, refreshedTokens)

  return refreshedTokens.accessToken
}

export async function GET(request: NextRequest) {
  const response = NextResponse.json({
    requiresAuth: false,
    authUrl: null,
    track: null,
    isPlaying: false,
  })

  try {
    const accessToken = await getValidAccessToken(request, response)

    if (!accessToken) {
      return unauthorizedResponse()
    }

    const spotifyResponse = await axios.get<SpotifyCurrentlyPlayingResponse>(
      spotifyCurrentTrackEndpoint,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        validateStatus: (status) => [200, 204, 401].includes(status),
      }
    )

    if (spotifyResponse.status === 204) {
      return response
    }

    if (spotifyResponse.status === 401) {
      clearTokenCookies(response)
      return unauthorizedResponse()
    }

    const mappedTrack = SpotifyToTrackMapper.mapCurrentlyPlaying(
      spotifyResponse.data
    )

    if (!mappedTrack) {
      return response
    }

    return NextResponse.json({
      requiresAuth: false,
      authUrl: null,
      isPlaying: Boolean(spotifyResponse.data.is_playing),
      track: mappedTrack,
    })
  } catch {
    return NextResponse.json(
      {
        requiresAuth: false,
        authUrl: null,
        track: null,
        isPlaying: false,
        error: 'Não foi possível obter a faixa atual do Spotify.',
      },
      { status: 500 }
    )
  }
}
