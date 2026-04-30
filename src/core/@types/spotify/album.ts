import { SpotifyArtist } from './artist'
import {
  SpotifyAlbumType,
  SpotifyExternalUrls,
  SpotifyRestrictionReason,
} from './common'
import { SpotifyImage } from './image'

export interface SpotifyAlbumRestriction {
  reason: SpotifyRestrictionReason
}

export interface SpotifyAlbum {
  album_type: SpotifyAlbumType
  total_tracks: number
  available_markets: string[]
  external_urls: SpotifyExternalUrls
  href: string
  id: string
  images: SpotifyImage[]
  name: string
  release_date: string
  release_date_precision: 'year' | 'month' | 'day'
  restrictions?: SpotifyAlbumRestriction
  type: 'album'
  uri: string
  artists: SpotifyArtist[]
}
