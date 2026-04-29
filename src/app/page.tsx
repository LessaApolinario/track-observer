"use client"

import { SearchTrack } from "@/ui/components/track/search-track"
import { TrackCard } from "@/ui/components/track/track-card"
import { Tracks } from "@/ui/components/track/tracks"

export default function Home() {
  const mockTrack = {
    id: "1",
    name: "Track 1",
    artist: "Artist 1",
    album: "Album 1",
    duration: 240,
  }

  return (
    <main>
      <SearchTrack />
      <TrackCard track={mockTrack} isCurrent={true} />
      <Tracks />
    </main>
  )
}
