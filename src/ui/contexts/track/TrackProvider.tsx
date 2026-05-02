'use client'

import { RoomCurrentTrack } from '@/core/domain/models/RoomCurrentTrack'
import { Track } from '@/core/domain/models/Track'
import { useChatUser } from '@/ui/contexts/chat/hooks'
import axios from 'axios'
import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { TrackContext } from '.'

interface CurrentTrackApiResponse {
  requiresAuth: boolean
  authUrl: string | null
  track: Track | null
  isPlaying: boolean
}

interface RoomTracksApiResponse {
  tracks: RoomCurrentTrack[]
}

export function TrackProvider({ children }: PropsWithChildren) {
  const currentUser = useChatUser()
  const [currentTrack, setCurrentTrack] = useState<Track>()
  const [roomCurrentTracks, setRoomCurrentTracks] = useState<
    RoomCurrentTrack[]
  >([])
  const [tracks, setTracks] = useState<Track[]>([])
  const [spotifyAuthUrl, setSpotifyAuthUrl] = useState<string | null>(null)

  const addTrack = useCallback((newTrack: Track) => {
    setTracks((prevTracks) => [...prevTracks, newTrack])
  }, [])

  const searchTrack = useCallback(
    (query: string) => {
      const normalizedQuery = query.trim().toLowerCase()

      if (!normalizedQuery) {
        return tracks
      }

      return tracks.filter((track) => {
        const haystack =
          `${track.title} ${track.artist} ${track.album}`.toLowerCase()
        return haystack.includes(normalizedQuery)
      })
    },
    [tracks]
  )

  const updateCurrentTrack = useCallback((newTrack: Track | undefined) => {
    setCurrentTrack(newTrack)
  }, [])

  const connectSpotify = useCallback(() => {
    const url = spotifyAuthUrl ?? '/api/spotify/login'
    window.location.href = url
  }, [spotifyAuthUrl])

  const syncRoomTracks = useCallback(async () => {
    try {
      const response = await axios.get<RoomTracksApiResponse>(
        '/api/room/current-tracks'
      )

      setRoomCurrentTracks(response.data.tracks)
    } catch {
      setRoomCurrentTracks([])
    }
  }, [])

  const syncPresenceWithRoom = useCallback(
    async (payload: {
      action: 'upsert'
      user: { id: string; name: string }
      track: Track
    }) => {
      const response = await axios.post<RoomTracksApiResponse>(
        '/api/room/current-tracks',
        {
          action: payload.action,
          payload: {
            user: payload.user,
            track: payload.track,
          },
        }
      )

      setRoomCurrentTracks(response.data.tracks)
    },
    []
  )

  const removePresenceFromRoom = useCallback(async (userId: string) => {
    if (!userId) {
      return
    }

    try {
      const response = await axios.post<RoomTracksApiResponse>(
        '/api/room/current-tracks',
        {
          action: 'remove',
          payload: {
            userId,
          },
        }
      )

      setRoomCurrentTracks(response.data.tracks)
    } catch {
      // Ignore cleanup errors during teardown flows.
    }
  }, [])

  const syncCurrentTrack = useCallback(async () => {
    try {
      const response = await axios.get<CurrentTrackApiResponse>(
        '/api/spotify/current-track'
      )

      if (response.data.requiresAuth) {
        setSpotifyAuthUrl(response.data.authUrl ?? '/api/spotify/login')
        setCurrentTrack(undefined)
        await removePresenceFromRoom(currentUser.id)
        return
      }

      setSpotifyAuthUrl(null)

      if (!response.data.track || !response.data.isPlaying) {
        setCurrentTrack(undefined)
        await removePresenceFromRoom(currentUser.id)
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

      await syncPresenceWithRoom({
        action: 'upsert',
        user: currentUser,
        track: response.data.track,
      })
    } catch {
      setCurrentTrack(undefined)
    }
  }, [currentUser, removePresenceFromRoom, syncPresenceWithRoom])

  useEffect(() => {
    const kickoff = window.setTimeout(() => {
      void syncRoomTracks()
      void syncCurrentTrack()
    }, 0)

    const timer = window.setInterval(() => {
      void syncCurrentTrack()
    }, 15000)

    return () => {
      window.clearTimeout(kickoff)
      window.clearInterval(timer)
    }
  }, [syncCurrentTrack, syncRoomTracks])

  useEffect(() => {
    const userId = currentUser.id

    const sendBeaconRemoval = () => {
      if (!userId || typeof navigator === 'undefined') {
        return
      }

      const payload = JSON.stringify({
        action: 'remove',
        payload: {
          userId,
        },
      })

      const blob = new Blob([payload], { type: 'application/json' })
      navigator.sendBeacon('/api/room/current-tracks', blob)
    }

    const handlePageExit = () => {
      sendBeaconRemoval()
    }

    window.addEventListener('pagehide', handlePageExit)
    window.addEventListener('beforeunload', handlePageExit)

    return () => {
      window.removeEventListener('pagehide', handlePageExit)
      window.removeEventListener('beforeunload', handlePageExit)
      void removePresenceFromRoom(userId)
    }
  }, [currentUser.id, removePresenceFromRoom])

  const value = useMemo(
    () => ({
      currentTrack,
      roomCurrentTracks,
      spotifyAuthUrl,
      tracks,
      addTrack,
      searchTrack,
      updateCurrentTrack,
      connectSpotify,
    }),
    [
      addTrack,
      connectSpotify,
      currentTrack,
      roomCurrentTracks,
      searchTrack,
      spotifyAuthUrl,
      tracks,
      updateCurrentTrack,
    ]
  )

  return <TrackContext.Provider value={value}>{children}</TrackContext.Provider>
}
