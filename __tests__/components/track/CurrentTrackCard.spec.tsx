import { CurrentTrackCard } from '@/ui/components/track/current-track-card'
import { render, screen } from '@testing-library/react'

const mockUseCurrentTrack = jest.fn()
const mockUseSpotifyAuthUrl = jest.fn()
const mockUseConnectSpotify = jest.fn()

jest.mock('../../../src/ui/contexts/hooks.ts', () => ({
  useCurrentTrack: () => mockUseCurrentTrack(),
  useSpotifyAuthUrl: () => mockUseSpotifyAuthUrl(),
  useConnectSpotify: () => mockUseConnectSpotify(),
}))

describe('CurrentTrackCard', () => {
  it('should render the current track information when a track is playing', () => {
    mockUseCurrentTrack.mockReturnValue({
      id: '1',
      title: 'Test Track',
      artist: 'Test Artist',
      album: 'Test Album',
      duration: 240,
      imageUrl: 'https://example.com/image.jpg',
    })
    mockUseSpotifyAuthUrl.mockReturnValue('https://example.com/auth')
    mockUseConnectSpotify.mockReturnValue(jest.fn())

    render(<CurrentTrackCard />)

    const playingNowText = screen.getByText(/tocando agora/i)
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
  })

  it('should render a message when no track is playing', () => {
    mockUseCurrentTrack.mockReturnValue(undefined)
    mockUseSpotifyAuthUrl.mockReturnValue(null)
    mockUseConnectSpotify.mockReturnValue(jest.fn())

    render(<CurrentTrackCard />)

    const noTrackText = screen.getByText(/nenhuma faixa tocando no momento/i)
    expect(noTrackText).toBeInTheDocument()
  })

  it('should render a connect button when spotifyAuthUrl is available', () => {
    mockUseCurrentTrack.mockReturnValue(undefined)
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
