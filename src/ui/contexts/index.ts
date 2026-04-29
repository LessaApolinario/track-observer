import { Track } from "@/core/domain/models/Track"
import { createContext } from "use-context-selector"

interface TrackProps {
  currentTrack: Track | undefined
  tracks: Track[]
  addTrack: (track: Track) => void
  searchTrack: (query: string) => void
  updateCurrentTrack: (track: Track | undefined) => void
}

export const TrackContext = createContext({} as TrackProps)
