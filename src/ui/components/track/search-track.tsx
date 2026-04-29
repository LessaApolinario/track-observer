'use client'

import { useSearchTrack } from '@/ui/contexts/hooks'
import { SyntheticEvent, useState } from 'react'

export function SearchTrack() {
  const searchTrack = useSearchTrack()
  const [query, setQuery] = useState('')

  function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault()
    const normalizedQuery = query.trim()

    if (!normalizedQuery) {
      return
    }

    searchTrack(normalizedQuery)
  }

  return (
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
  )
}
