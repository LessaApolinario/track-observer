import { CurrentTrackCard } from '@/ui/components/track/current-track-card'
import { render, screen } from '@testing-library/react'

const mockUseRoomCurrentTracks = jest.fn()
const mockUseSpotifyAuthUrl = jest.fn()
const mockUseConnectSpotify = jest.fn()
const mockUseChatUser = jest.fn()

jest.mock('../../../src/ui/contexts/track/hooks.ts', () => ({
  useRoomCurrentTracks: () => mockUseRoomCurrentTracks(),
  useSpotifyAuthUrl: () => mockUseSpotifyAuthUrl(),
  useConnectSpotify: () => mockUseConnectSpotify(),
}))

jest.mock('../../../src/ui/contexts/chat/hooks.ts', () => ({
  useChatUser: () => mockUseChatUser(),
}))

describe('CurrentTrackCard', () => {
  beforeEach(() => {
    mockUseChatUser.mockReturnValue({
      id: 'self',
      name: 'Visitante',
    })
  })

  it('should render room tracks when someone is playing', () => {
    mockUseRoomCurrentTracks.mockReturnValue([
      {
        user: {
          id: 'self',
          name: 'Eu',
        },
        track: {
          id: '1',
          title: 'Test Track',
          artist: 'Test Artist',
          album: 'Test Album',
          duration: 240,
          imageUrl: 'https://example.com/image.jpg',
        },
        updatedAt: new Date().toISOString(),
      },
    ])
    mockUseSpotifyAuthUrl.mockReturnValue('https://example.com/auth')
    mockUseConnectSpotify.mockReturnValue(jest.fn())

    render(<CurrentTrackCard />)

    const playingNowText = screen.getByText(/tocando na sala/i)
    expect(playingNowText).toBeInTheDocument()

    const image = screen.getByRole('img')
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg')
    expect(image).toHaveAttribute('alt', 'Test Album')

    const titleHeading = screen.getByRole('heading', {
      name: /test track/i,
    })
    expect(titleHeading).toBeInTheDocument()

    const albumText = screen.getByText(/test artist/i)
    expect(albumText).toBeInTheDocument()

    const timeText = screen.getByText(/4:00/)
    expect(timeText).toBeInTheDocument()

    const youBadge = screen.getByText(/voce/i)
    expect(youBadge).toBeInTheDocument()
  })

  it('should render a message when no track is playing', () => {
    mockUseRoomCurrentTracks.mockReturnValue([])
    mockUseSpotifyAuthUrl.mockReturnValue(null)
    mockUseConnectSpotify.mockReturnValue(jest.fn())

    render(<CurrentTrackCard />)

    const noTrackText = screen.getByText(/ninguem esta tocando no momento/i)
    expect(noTrackText).toBeInTheDocument()
  })

  it('should render a connect button when spotifyAuthUrl is available', () => {
    mockUseRoomCurrentTracks.mockReturnValue([])
    mockUseSpotifyAuthUrl.mockReturnValue('https://example.com/auth')
    const mockConnectSpotify = jest.fn()
    mockUseConnectSpotify.mockReturnValue(mockConnectSpotify)

    render(<CurrentTrackCard />)

    const connectButton = screen.getByRole('button', {
      name: /conectar com spotify/i,
    })
    expect(connectButton).toBeInTheDocument()
  })
})
