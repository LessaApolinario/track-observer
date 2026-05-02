import { Track } from '@/core/domain/models/Track'
import { RoomCurrentTrack } from '@/core/domain/models/RoomCurrentTrack'
import { createContext } from 'use-context-selector'

interface TrackProps {
  currentTrack: Track | undefined
  roomCurrentTracks: RoomCurrentTrack[]
  spotifyAuthUrl: string | null
  tracks: Track[]
  addTrack: (track: Track) => void
  searchTrack: (query: string) => Track[]
  updateCurrentTrack: (track: Track | undefined) => void
  connectSpotify: () => void
}

export const TrackContext = createContext({} as TrackProps)
