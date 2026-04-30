'use client'

import { Track } from '@/core/domain/models/Track'
import { useSearchTrack } from '@/ui/contexts/track/hooks'
import { SyntheticEvent, useState } from 'react'

export function SearchTrack() {
  const searchTrack = useSearchTrack()
  const [query, setQuery] = useState('')
  const [foundTracks, setFoundTracks] = useState<Track[]>([])
  const [feedback, setFeedback] = useState('')

  function handleQueryChange(value: string) {
    setQuery(value)

    if (!value.trim()) {
      setFoundTracks([])
      setFeedback('')
    }
  }

  function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault()
    const normalizedQuery = query.trim()

    if (!normalizedQuery) {
      setFoundTracks([])
      setFeedback('')
      return
    }

    const result = searchTrack(normalizedQuery)
    setFoundTracks(result)
    setFeedback(
      result.length
        ? `${result.length} faixa(s) encontrada(s) na fila.`
        : 'Nenhuma faixa encontrada na fila.'
    )
  }

  return (
    <section className="space-y-3">
      <form
        className="rounded-panel border-border bg-surface shadow-soft grid gap-3 border px-4 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end"
        onSubmit={handleSubmit}
      >
        <label className="space-y-2" htmlFor="track-query">
          <span className="text-primary text-xs font-bold tracking-[0.18em] uppercase">
            Buscar na fila
          </span>
          <input
            id="track-query"
            value={query}
            onChange={(event) => handleQueryChange(event.target.value)}
            placeholder="Faixa, artista ou album"
            className="border-border bg-background text-foreground placeholder:text-muted/80 focus:border-primary w-full rounded-2xl border px-4 py-3 text-sm focus:outline-none"
          />
        </label>

        <button
          type="submit"
          className="bg-primary hover:bg-primary-strong inline-flex cursor-pointer items-center justify-center rounded-2xl px-5 py-3 text-sm font-bold text-white hover:-translate-y-0.5 focus:outline-none"
        >
          Buscar
        </button>
      </form>

      {!!foundTracks.length && (
        <section className="space-y-2" aria-label="Resultados da busca">
          {foundTracks.map((track) => (
            <article
              key={track.id}
              className="border-border bg-surface-strong/35 rounded-xl border px-4 py-3"
            >
              <p className="text-foreground font-semibold">{track.title}</p>
              <p className="text-muted text-sm">
                {track.artist} • {track.album}
              </p>
            </article>
          ))}
        </section>
      )}

      {feedback && <p className="text-primary-strong text-sm">{feedback}</p>}
    </section>
  )
}
