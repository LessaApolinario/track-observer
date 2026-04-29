'use client'

import { Track } from '@/core/domain/models/Track'
import { SearchTrack } from '@/ui/components/track/search-track'
import { CurrentTrackCard } from '@/ui/components/track/current-track-card'
import { Tracks } from '@/ui/components/track/tracks'

export default function Home() {
  const mockTrack: Track = {
    id: '1',
    title: 'Golden Hour Frequency',
    artist: 'Luna Arcade',
    album: 'Signals at Dusk',
    duration: 240,
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 px-5 py-10">
      <header>
        <span className="text-primary text-[11px] font-bold tracking-widest uppercase">
          Track Observer
        </span>
      </header>

      <CurrentTrackCard track={mockTrack} />

      <SearchTrack />

      <section className="space-y-3">
        <h2 className="text-muted text-xs font-bold tracking-widest uppercase">
          Fila
        </h2>
        <Tracks />
      </section>
    </main>
  )
}
