import {
  SpotifyPlaybackActions,
  SpotifyPlaybackContext,
  SpotifyPlaybackDevice,
} from './playback'
import { SpotifyTrackObject } from './track'

export type SpotifyCurrentlyPlayingType = 'track' | 'episode' | 'ad' | 'unknown'

export interface SpotifyCurrentlyPlayingResponse {
  device: SpotifyPlaybackDevice
  repeat_state: 'off' | 'track' | 'context'
  shuffle_state: boolean
  context: SpotifyPlaybackContext | null
  timestamp: number
  progress_ms: number | null
  is_playing: boolean
  item: SpotifyTrackObject | null
  currently_playing_type: SpotifyCurrentlyPlayingType
  actions?: SpotifyPlaybackActions
}
