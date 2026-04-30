'use client'

import {
  useConnectSpotify,
  useCurrentTrack,
  useSpotifyAuthUrl,
} from '@/ui/contexts/track/hooks'

export function CurrentTrackCard() {
  const currentTrack = useCurrentTrack()
  const spotifyAuthUrl = useSpotifyAuthUrl()
  const connectSpotify = useConnectSpotify()

  if (!currentTrack) {
    return (
      <div className="rounded-panel border-border bg-surface border px-6 py-8 text-center">
        <p className="text-muted text-sm">Nenhuma faixa tocando no momento.</p>
        {spotifyAuthUrl && (
          <button
            type="button"
            onClick={connectSpotify}
            className="bg-primary hover:bg-primary-strong mt-4 inline-flex cursor-pointer rounded-2xl px-5 py-2 text-sm font-bold text-white"
          >
            Conectar com Spotify
          </button>
        )}
      </div>
    )
  }

  const minutes = Math.floor(currentTrack.duration / 60)
  const seconds = String(currentTrack.duration % 60).padStart(2, '0')

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

        <div className="grid gap-4 sm:grid-cols-[120px_minmax(0,1fr)] sm:items-center">
          <div className="border-border bg-surface-strong/40 aspect-square overflow-hidden rounded-xl border">
            {currentTrack.imageUrl ? (
              <img
                src={currentTrack.imageUrl}
                alt={currentTrack.album}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="text-muted flex h-full w-full items-center justify-center text-xs font-semibold uppercase">
                Sem capa
              </div>
            )}
          </div>

          <div className="space-y-1">
            <h2 className="text-foreground text-3xl font-bold">
              {currentTrack.title}
            </h2>
            <p className="text-muted text-base">{currentTrack.artist}</p>
          </div>
        </div>

        <div className="text-muted flex items-center gap-3 text-sm">
          <span>{currentTrack.album}</span>
          <span aria-hidden>·</span>
          <span>
            {minutes}:{seconds}
            <span className="sr-only"> ({currentTrack.duration} segundos)</span>
          </span>
        </div>
      </div>
    </article>
  )
}
