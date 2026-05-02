import { ChatMessageList } from '@/ui/components/chat/chat-message-list'
import { render, screen } from '@testing-library/react'

const mockCurrentUser = jest.fn()
const mockMessages = jest.fn()

jest.mock('../../../src/ui/contexts/chat/hooks.ts', () => ({
  useChatUser: () => mockCurrentUser(),
  useChatMessages: () => mockMessages(),
}))

describe('ChatMessageList', () => {
  beforeEach(() => {
    mockCurrentUser.mockReturnValue({
      id: 'self',
      name: 'Visitante',
    })
    mockMessages.mockReturnValue([])
  })

  it('should render empty state when there are no messages', () => {
    mockCurrentUser.mockReturnValue({
      id: 'self',
      name: 'Visitante',
    })
    mockMessages.mockReturnValue([])

    render(<ChatMessageList />)

    const emptyStateText = screen.getByText(
      /sem mensagens ainda. inicie a conversa./i
    )
    expect(emptyStateText).toBeInTheDocument()
  })

  it('should render a list of chat messages', () => {
    mockCurrentUser.mockReturnValue({
      id: 'self',
      name: 'Visitante',
    })
    mockMessages.mockReturnValue([
      {
        id: '1',
        text: 'Hello, world!',
        createdAt: new Date().toISOString(),
        user: {
          id: '2',
          name: 'Jane Doe',
        },
      },
    ])

    render(<ChatMessageList />)

    const messageText = screen.getByText(/hello, world!/i)
    expect(messageText).toBeInTheDocument()
  })
})
