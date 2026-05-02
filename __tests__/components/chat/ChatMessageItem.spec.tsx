import { ChatMessage } from '@/core/domain/models/ChatMessage'
import { User } from '@/core/domain/models/User'
import { ChatMessageItem } from '@/ui/components/chat/chat-message-item'
import { render, screen } from '@testing-library/react'

describe('ChatMessageItem', () => {
  it('should render a chat message item', () => {
    const currentUser: User = {
      id: '1',
      name: 'John Doe',
    }
    const message: ChatMessage = {
      id: '1',
      text: 'Hello, world!',
      createdAt: new Date().toISOString(),
      user: {
        id: '2',
        name: 'Jane Doe',
      },
    }

    render(<ChatMessageItem message={message} currentUser={currentUser} />)

    const messageUserName = screen.getByText(new RegExp(message.user.name, 'i'))
    expect(messageUserName).toBeInTheDocument()

    const messageHours = screen.getByText(/\d{2}:\d{2}/)
    expect(messageHours).toBeInTheDocument()

    const messageText = screen.getByText(new RegExp(message.text, 'i'))
    expect(messageText).toBeInTheDocument()
  })

  it('should render to the right when the message is from the current user', () => {
    const currentUser: User = {
      id: '1',
      name: 'John Doe',
    }
    const message: ChatMessage = {
      id: '1',
      text: 'Hello, world!',
      createdAt: new Date().toISOString(),
      user: {
        id: '1',
        name: 'John Doe',
      },
    }

    render(<ChatMessageItem message={message} currentUser={currentUser} />)

    const listItem = screen.getByRole('listitem')
    expect(listItem).toHaveClass('justify-end')
  })
})
