import { SpotifyExternalUrls } from './common'

export interface SpotifyArtist {
  external_urls: SpotifyExternalUrls
  href: string
  id: string
  name: string
  type: 'artist'
  uri: string
}
