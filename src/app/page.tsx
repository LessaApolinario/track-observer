'use client'

import { ChatPanel } from '@/components/chat/chat-panel'
import { CurrentTrackCard } from '@/ui/components/track/current-track-card'
import { SearchTrack } from '@/ui/components/track/search-track'
import { Tracks } from '@/ui/components/track/tracks'

export default function Home() {
  return (
    <main className="mx-auto grid min-h-screen w-full max-w-6xl gap-6 px-5 py-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
      <section className="flex min-w-0 flex-col gap-6">
        <header>
          <span className="text-primary text-[11px] font-bold tracking-widest uppercase">
            Track Observer
          </span>
        </header>

        <CurrentTrackCard />

        <SearchTrack />

        <section className="space-y-3">
          <h2 className="text-muted text-xs font-bold tracking-widest uppercase">
            Fila
          </h2>
          <Tracks />
        </section>
      </section>

      <section className="lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)]">
        <ChatPanel />
      </section>
    </main>
  )
}
