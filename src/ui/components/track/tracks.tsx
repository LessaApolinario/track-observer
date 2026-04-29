"use-client"

import { useCurrentTrack, useTracks } from "@/ui/contexts/hooks"
import { TrackCard } from "./track-card"

export function Tracks() {
  const tracks = useTracks()
  const currentTrack = useCurrentTrack()

  return (
    <div>
      {tracks.map((track) => (
        <TrackCard
          key={track.id}
          track={track}
          isCurrent={track.id === currentTrack?.id}
        />
      ))}
    </div>
  )
}
