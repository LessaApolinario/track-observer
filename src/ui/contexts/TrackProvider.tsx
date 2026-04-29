'use client'

import { Track } from '@/core/domain/models/Track'
import { PropsWithChildren, useCallback, useState } from 'react'
import { TrackContext } from '.'

export function TrackProvider({ children }: PropsWithChildren) {
  const [currentTrack, setCurrentTrack] = useState<Track>()
  const [tracks, setTracks] = useState<Track[]>([])

  const addTrack = useCallback((newTrack: Track) => {
    setTracks((prevTracks) => [...prevTracks, newTrack])
  }, [])

  const searchTrack = useCallback((query: string) => {
    // Implement search logic here, e.g., filter tracks based on the query
    // For now, this is just a placeholder
    console.log(`Searching for track with query: ${query}`)
  }, [])

  const updateCurrentTrack = useCallback((newTrack: Track | undefined) => {
    setCurrentTrack(newTrack)
  }, [])

  return (
    <TrackContext.Provider
      value={{
        currentTrack,
        tracks,
        addTrack,
        searchTrack,
        updateCurrentTrack,
      }}
    >
      {children}
    </TrackContext.Provider>
  )
}
