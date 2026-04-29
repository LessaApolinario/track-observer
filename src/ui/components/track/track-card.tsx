import { Track } from "@/core/domain/models/Track"

interface TrackCardProps {
  track: Track
  isCurrent?: boolean
}

export function TrackCard({ track, isCurrent }: TrackCardProps) {
  return (
    <div>
      <h3>{track.name}</h3>
      <p>{track.artist}</p>
      <p>{track.album}</p>
      <p>{track.duration} seconds</p>
      {isCurrent && <p>Currently Playing</p>}
    </div>
  )
}
