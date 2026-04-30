import { SpotifyAlbum } from './album'
import { SpotifyArtist } from './artist'
import { SpotifyExternalUrls, SpotifyRestrictionReason } from './common'

export interface SpotifyTrackRestriction {
  reason: SpotifyRestrictionReason
}

export interface SpotifyTrackExternalIds {
  isrc?: string
  ean?: string
  upc?: string
}

export interface SpotifyTrackObject {
  album: SpotifyAlbum
  artists: SpotifyArtist[]
  available_markets: string[]
  disc_number: number
  duration_ms: number
  explicit: boolean
  external_ids: SpotifyTrackExternalIds
  external_urls: SpotifyExternalUrls
  href: string
  id: string
  is_playable?: boolean
  linked_from?: Record<string, unknown>
  restrictions?: SpotifyTrackRestriction
  name: string
  popularity: number
  preview_url: string | null
  track_number: number
  type: 'track'
  uri: string
  is_local: boolean
}
