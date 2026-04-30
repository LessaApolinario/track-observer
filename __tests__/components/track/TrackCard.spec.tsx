import { Track } from '@/core/domain/models/Track'
import { TrackCard } from '@/ui/components/track/track-card'
import { render, screen } from '@testing-library/react'

describe('TrackCard component', () => {
  it('should render a track card', () => {
    const mockTrack: Track = {
      id: '1',
      title: 'Test Track',
      artist: 'Test Artist',
      album: 'Test Album',
      duration: 240,
      imageUrl: '',
    }
    render(<TrackCard track={mockTrack} />)

    const titleHeading = screen.getByText(/test track/i)
    expect(titleHeading).toBeInTheDocument()

    const artistText = screen.getByText(/test artist/i)
    expect(artistText).toBeInTheDocument()

    const albumText = screen.getByText(/test album/i)
    expect(albumText).toBeInTheDocument()

    const durationText = screen.getByText(/4:00/i)
    expect(durationText).toBeInTheDocument()
  })

  it('should render null if track is undefined', () => {
    const { container } = render(<TrackCard track={undefined} />)
    expect(container.firstChild).toBeNull()
  })
})
