'use client'

import { useChatUser } from '@/ui/contexts/chat/hooks'
import {
  useConnectSpotify,
  useRoomCurrentTracks,
  useSpotifyAuthUrl,
} from '@/ui/contexts/track/hooks'
import Image from 'next/image'

export function CurrentTrackCard() {
  const roomCurrentTracks = useRoomCurrentTracks()
  const spotifyAuthUrl = useSpotifyAuthUrl()
  const connectSpotify = useConnectSpotify()
  const currentUser = useChatUser()

  if (!roomCurrentTracks.length) {
    return (
      <div className="rounded-panel border-border bg-surface border px-6 py-8 text-center">
        <p className="text-muted text-sm">Ninguem esta tocando no momento.</p>
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

  return (
    <section className="space-y-4" aria-label="Tocando agora na sala">
      <header className="flex items-center gap-2">
        <span className="bg-primary h-2 w-2 animate-pulse rounded-full" />
        <span className="text-primary text-[11px] font-bold tracking-widest uppercase">
          Tocando na sala
        </span>
      </header>

      <div className="grid gap-3 sm:grid-cols-2">
        {roomCurrentTracks.map((item) => {
          const minutes = Math.floor(item.track.duration / 60)
          const seconds = String(item.track.duration % 60).padStart(2, '0')
          const isCurrentUser = item.user.id === currentUser.id

          return (
            <article
              key={item.user.id}
              className="rounded-panel border-primary/20 bg-surface relative overflow-hidden border p-4"
            >
              <div className="from-primary/20 via-accent/5 absolute inset-0 bg-linear-to-br to-transparent" />

              <div className="relative space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-foreground truncate text-sm font-bold">
                    {item.user.name}
                  </p>

                  <span className="border-border bg-surface-strong/60 text-muted rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-widest uppercase">
                    {isCurrentUser ? 'Voce' : 'Online'}
                  </span>
                </div>

                <div className="grid grid-cols-[56px_minmax(0,1fr)] items-center gap-3">
                  <div className="border-border bg-surface-strong/40 aspect-square overflow-hidden rounded-lg border">
                    {item.track.imageUrl ? (
                      <Image
                        src={item.track.imageUrl}
                        alt={item.track.album}
                        width={56}
                        height={56}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="text-muted flex h-full w-full items-center justify-center text-[10px] font-semibold uppercase">
                        Sem capa
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <h2 className="text-foreground truncate text-base font-bold">
                      {item.track.title}
                    </h2>
                    <p className="text-muted truncate text-sm">
                      {item.track.artist}
                    </p>
                  </div>
                </div>

                <div className="text-muted flex items-center gap-2 text-xs">
                  <span className="truncate">{item.track.album}</span>
                  <span aria-hidden>·</span>
                  <span>
                    {minutes}:{seconds}
                    <span className="sr-only">
                      {' '}
                      ({item.track.duration} segundos)
                    </span>
                  </span>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
