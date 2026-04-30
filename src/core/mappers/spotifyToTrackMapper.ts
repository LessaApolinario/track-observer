import { Track } from '@/core/domain/models/Track'
import {
  SpotifyCurrentlyPlayingResponse,
  SpotifyTrackObject,
} from '@/core/@types/spotify'

export class SpotifyToTrackMapper {
  static mapTrack(spotifyTrack: SpotifyTrackObject): Track {
    return {
      id: spotifyTrack.id,
      title: spotifyTrack.name,
      artist: spotifyTrack.artists.map((artist) => artist.name).join(', '),
      album: spotifyTrack.album.name,
      duration: Math.floor(spotifyTrack.duration_ms / 1000),
      imageUrl: spotifyTrack.album.images[0]?.url || '',
    }
  }

  static mapCurrentlyPlaying(
    response: SpotifyCurrentlyPlayingResponse
  ): Track | null {
    if (!response.item || response.currently_playing_type !== 'track') {
      return null
    }

    return this.mapTrack(response.item)
  }
}
