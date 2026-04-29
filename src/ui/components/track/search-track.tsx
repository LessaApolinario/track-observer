"use client"

import { useSearchTrack } from "@/ui/contexts/hooks"

export function SearchTrack() {
  const searchTrack = useSearchTrack()

  function handleSearchTrack(query: string) {
    searchTrack(query)
  }

  return <div>SearchTrack</div>
}
