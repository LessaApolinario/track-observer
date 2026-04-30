import { SpotifyExternalUrls } from './common'

export interface SpotifyPlaybackDevice {
  id: string | null
  is_active: boolean
  is_private_session: boolean
  is_restricted: boolean
  name: string
  type: string
  volume_percent: number | null
  supports_volume: boolean
}

export interface SpotifyPlaybackContext {
  type: string
  href: string
  external_urls: SpotifyExternalUrls
  uri: string
}

export interface SpotifyPlaybackActions {
  interrupting_playback?: boolean
  pausing?: boolean
  resuming?: boolean
  seeking?: boolean
  skipping_next?: boolean
  skipping_prev?: boolean
  toggling_repeat_context?: boolean
  toggling_shuffle?: boolean
  toggling_repeat_track?: boolean
  transferring_playback?: boolean
}
