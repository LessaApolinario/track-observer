'use client'

import { useCurrentTrack, useTracks } from '@/ui/contexts/hooks'
import { TrackCard } from './track-card'

export function Tracks() {
  const tracks = useTracks()
  const currentTrack = useCurrentTrack()

  if (!tracks.length) {
    return (
      <section className="rounded-panel border-border bg-surface/90 shadow-soft border border-dashed px-6 py-10 text-center">
        <p className="text-muted text-sm font-medium">Nenhuma faixa ainda.</p>
      </section>
    )
  }

  return (
    <section aria-label="Tracks" className="flex flex-col gap-2">
      {tracks.map((track) => (
        <TrackCard
          key={track.id}
          track={track}
          isCurrent={track.id === currentTrack?.id}
        />
      ))}
    </section>
  )
}
