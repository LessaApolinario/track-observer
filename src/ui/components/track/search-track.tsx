'use client'

import { Track } from '@/core/domain/models/Track'
import { useAddTrack, useSearchTrack } from '@/ui/contexts/hooks'
import { SyntheticEvent, useState } from 'react'

export function SearchTrack() {
  const addTrack = useAddTrack()
  const searchTrack = useSearchTrack()
  const [query, setQuery] = useState('')
  const [foundTrack, setFoundTrack] = useState<Track>()
  const [feedback, setFeedback] = useState('')

  function createMockTrackFromQuery(normalizedQuery: string): Track {
    return {
      id: `mock-${Date.now()}`,
      title: normalizedQuery,
      artist: 'Resultado da busca',
      album: 'Prévia local',
      duration: 180,
      imageUrl: '',
    }
  }

  function handleAddFoundTrack() {
    if (!foundTrack) {
      return
    }

    addTrack(foundTrack)
    setFeedback('Faixa adicionada na fila.')
    setFoundTrack(undefined)
    setQuery('')
  }

  function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault()
    const normalizedQuery = query.trim()

    if (!normalizedQuery) {
      return
    }

    searchTrack(normalizedQuery)
    setFoundTrack(createMockTrackFromQuery(normalizedQuery))
    setFeedback('')
  }

  return (
    <section className="space-y-3">
      <form
        className="rounded-panel border-border bg-surface shadow-soft grid gap-3 border px-4 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end"
        onSubmit={handleSubmit}
      >
        <label className="space-y-2" htmlFor="track-query">
          <span className="text-primary text-xs font-bold tracking-[0.18em] uppercase">
            Buscar
          </span>
          <input
            id="track-query"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Faixa ou artista"
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

      {foundTrack && (
        <article className="border-border bg-surface-strong/35 rounded-xl border px-4 py-3">
          <p className="text-primary text-xs font-bold tracking-widest uppercase">
            Resultado encontrado
          </p>
          <p className="text-foreground mt-2 font-semibold">
            {foundTrack.title}
          </p>
          <p className="text-muted text-sm">
            {foundTrack.artist} • {foundTrack.album}
          </p>
          <button
            type="button"
            onClick={handleAddFoundTrack}
            className="bg-primary hover:bg-primary-strong mt-3 inline-flex rounded-lg px-4 py-2 text-sm font-semibold text-white"
          >
            Adicionar à fila
          </button>
        </article>
      )}

      {feedback && <p className="text-primary-strong text-sm">{feedback}</p>}
    </section>
  )
}
