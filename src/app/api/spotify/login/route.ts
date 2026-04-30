import { NextRequest, NextResponse } from 'next/server'
import { createAuthorizationUrl, setOAuthStateCookie } from '../_shared'

export async function GET(request: NextRequest) {
  try {
    const state = crypto.randomUUID()
    const spotifyAuthUrl = createAuthorizationUrl(request, state)

    const response = NextResponse.redirect(spotifyAuthUrl)
    setOAuthStateCookie(response, state)

    return response
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Erro ao iniciar autenticação.'

    return NextResponse.json({ error: message }, { status: 500 })
  }
}
