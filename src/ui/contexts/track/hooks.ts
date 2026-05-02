'use client'

import { useContextSelector } from 'use-context-selector'
import { TrackContext } from '.'

export function useCurrentTrack() {
  return useContextSelector(TrackContext, (ctx) => ctx.currentTrack)
}

export function useRoomCurrentTracks() {
  return useContextSelector(TrackContext, (ctx) => ctx.roomCurrentTracks)
}

export function useSpotifyAuthUrl() {
  return useContextSelector(TrackContext, (ctx) => ctx.spotifyAuthUrl)
}

export function useTracks() {
  return useContextSelector(TrackContext, (ctx) => ctx.tracks)
}

export function useAddTrack() {
  return useContextSelector(TrackContext, (ctx) => ctx.addTrack)
}

export function useSearchTrack() {
  return useContextSelector(TrackContext, (ctx) => ctx.searchTrack)
}

export function useUpdateCurrentTrack() {
  return useContextSelector(TrackContext, (ctx) => ctx.updateCurrentTrack)
}

export function useConnectSpotify() {
  return useContextSelector(TrackContext, (ctx) => ctx.connectSpotify)
}
