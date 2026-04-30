'use client'

import { Track } from '@/core/domain/models/Track'
import axios from 'axios'
import { PropsWithChildren, useCallback, useEffect, useState } from 'react'
import { TrackContext } from '.'

interface CurrentTrackApiResponse {
  requiresAuth: boolean
  authUrl: string | null
  track: Track | null
}

export function TrackProvider({ children }: PropsWithChildren) {
  const [currentTrack, setCurrentTrack] = useState<Track>()
  const [tracks, setTracks] = useState<Track[]>([])
  const [spotifyAuthUrl, setSpotifyAuthUrl] = useState<string | null>(null)

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

  const connectSpotify = useCallback(() => {
    const url = spotifyAuthUrl ?? '/api/spotify/login'
    window.location.href = url
  }, [spotifyAuthUrl])

  const syncCurrentTrack = useCallback(async () => {
    try {
      const response = await axios.get<CurrentTrackApiResponse>(
        '/api/spotify/current-track'
      )

      if (response.data.requiresAuth) {
        setSpotifyAuthUrl(response.data.authUrl ?? '/api/spotify/login')
        setCurrentTrack(undefined)
        return
      }

      setSpotifyAuthUrl(null)

      if (!response.data.track) {
        setCurrentTrack(undefined)
        return
      }

      setCurrentTrack(response.data.track)
      setTracks((previousTracks) => {
        const alreadyInQueue = previousTracks.some(
          (track) => track.id === response.data.track?.id
        )

        if (alreadyInQueue) {
          return previousTracks
        }

        return [...previousTracks, response.data.track as Track]
      })
    } catch {
      setCurrentTrack(undefined)
    }
  }, [])

  useEffect(() => {
    void syncCurrentTrack()

    const timer = window.setInterval(() => {
      void syncCurrentTrack()
    }, 15000)

    return () => {
      window.clearInterval(timer)
    }
  }, [syncCurrentTrack])

  return (
    <TrackContext.Provider
      value={{
        currentTrack,
        spotifyAuthUrl,
        tracks,
        addTrack,
        searchTrack,
        updateCurrentTrack,
        connectSpotify,
      }}
    >
      {children}
    </TrackContext.Provider>
  )
}
