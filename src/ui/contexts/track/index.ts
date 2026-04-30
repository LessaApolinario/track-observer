import { Track } from '@/core/domain/models/Track'
import { createContext } from 'use-context-selector'

interface TrackProps {
  currentTrack: Track | undefined
  spotifyAuthUrl: string | null
  tracks: Track[]
  addTrack: (track: Track) => void
  searchTrack: (query: string) => Track[]
  updateCurrentTrack: (track: Track | undefined) => void
  connectSpotify: () => void
}

export const TrackContext = createContext({} as TrackProps)
