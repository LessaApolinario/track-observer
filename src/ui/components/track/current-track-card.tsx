import { Track } from '@/core/domain/models/Track'

interface CurrentTrackCardProps {
  track: Track | undefined
}

export function CurrentTrackCard({ track }: CurrentTrackCardProps) {
  if (!track) {
    return (
      <div className="rounded-panel border-border bg-surface border px-6 py-8 text-center">
        <p className="text-muted text-sm">Nenhuma faixa tocando no momento.</p>
      </div>
    )
  }

  const minutes = Math.floor(track.duration / 60)
  const seconds = String(track.duration % 60).padStart(2, '0')

  return (
    <article className="rounded-panel border-primary/25 bg-surface relative overflow-hidden border">
      <div className="from-primary/20 via-accent/5 absolute inset-0 bg-linear-to-br to-transparent" />

      <div className="relative space-y-5 px-6 py-7">
        <div className="flex items-center gap-2">
          <span className="bg-primary h-2 w-2 animate-pulse rounded-full" />
          <span className="text-primary text-[11px] font-bold tracking-widest uppercase">
            Tocando agora
          </span>
        </div>

        <div className="space-y-1">
          <h2 className="text-foreground text-3xl font-bold">{track.title}</h2>
          <p className="text-muted text-base">{track.artist}</p>
        </div>

        <div className="text-muted flex items-center gap-3 text-sm">
          <span>{track.album}</span>
          <span aria-hidden>·</span>
          <span>
            {minutes}:{seconds}
            <span className="sr-only"> ({track.duration} segundos)</span>
          </span>
        </div>
      </div>
    </article>
  )
}
