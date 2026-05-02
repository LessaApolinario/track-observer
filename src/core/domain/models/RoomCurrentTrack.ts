import { Track } from './Track'
import { User } from './User'

export interface RoomCurrentTrack {
  user: User
  track: Track
  updatedAt: string
}
