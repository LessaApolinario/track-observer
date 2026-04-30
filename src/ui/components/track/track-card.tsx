'use client'

import { Track } from '@/core/domain/models/Track'

interface TrackCardProps {
  track: Track | undefined
  isCurrent?: boolean
}

export function TrackCard({ track, isCurrent }: TrackCardProps) {
  if (!track) {
    return null
  }

  const minutes = Math.floor(track.duration / 60)
  const seconds = String(track.duration % 60).padStart(2, '0')

  return (
    <article
      className={`flex items-center justify-between gap-4 rounded-xl border px-4 py-3 transition-colors ${
        isCurrent
          ? 'border-primary/40 bg-primary/8'
          : 'border-border bg-surface'
      }`}
    >
      <div className="min-w-0 space-y-0.5">
        <div className="flex items-center gap-2">
          {isCurrent && (
            <span
              className="bg-primary h-2 w-2 shrink-0 animate-pulse rounded-full"
              aria-label="Tocando agora"
            />
          )}
          <p className="text-foreground truncate font-semibold">
            {track.title}
          </p>
        </div>
        <p className="text-muted truncate text-sm">{track.artist}</p>
      </div>

      <div className="text-muted shrink-0 text-right text-sm">
        <p>{track.album}</p>
        <p>
          {minutes}:{seconds}
          <span className="sr-only"> ({track.duration} segundos)</span>
        </p>
      </div>
    </article>
  )
}
