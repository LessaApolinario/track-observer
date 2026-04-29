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
    <article className="border-border bg-surface flex items-center justify-between gap-4 rounded-xl border px-4 py-3">
      <div className="min-w-0 space-y-0.5">
        <p className="text-foreground truncate font-semibold">{track.title}</p>
        <p className="text-muted truncate text-sm">{track.artist}</p>
      </div>

      <div className="text-muted shrink-0 text-right text-sm">
        <p>{track.album}</p>
        <p>
          {minutes}:{seconds}
          <span className="sr-only"> ({track.duration} segundos)</span>
        </p>
      </div>

      {isCurrent && (
        <span
          className="bg-primary h-1.5 w-1.5 shrink-0 rounded-full"
          aria-label="Tocando agora"
        />
      )}
    </article>
  )
}
