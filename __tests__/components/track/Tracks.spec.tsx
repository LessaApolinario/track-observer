import { Tracks } from '@/ui/components/track/tracks'
import { render, screen } from '@testing-library/react'

const mockUseTracks = jest.fn()
const mockUseCurrentTrack = jest.fn()

jest.mock('../../../src/ui/contexts/hooks.ts', () => ({
  useTracks: () => mockUseTracks(),
  useCurrentTrack: () => mockUseCurrentTrack(),
}))

describe('Tracks component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render "Nenhuma faixa ainda." when there are no tracks', () => {
    mockUseTracks.mockReturnValue([
      {
        id: '1',
        title: 'Track 1',
        artist: 'Artist 1',
        album: 'Album 1',
        duration: 200,
        imageUrl: '',
      },
      {
        id: '2',
        title: 'Track 2',
        artist: 'Artist 2',
        album: 'Album 2',
        duration: 240,
        imageUrl: '',
      },
    ])
    mockUseCurrentTrack.mockReturnValue({
      id: '1',
      title: 'Track 1',
      artist: 'Artist 1',
      album: 'Album 1',
      duration: 200,
      imageUrl: '',
    })

    render(<Tracks />)

    const tracksContainer = screen.getByRole('region', {
      name: /Tracks/i,
    })
    expect(tracksContainer).toBeInTheDocument()

    const trackCards = screen.getAllByRole('article')
    expect(trackCards).toHaveLength(2)
  })

  it('should render a list of tracks', () => {
    mockUseTracks.mockReturnValue([])
    mockUseCurrentTrack.mockReturnValue(undefined)

    render(<Tracks />)

    const noTracksMessage = screen.getByText('Nenhuma faixa ainda.')
    expect(noTracksMessage).toBeInTheDocument()
  })
})
