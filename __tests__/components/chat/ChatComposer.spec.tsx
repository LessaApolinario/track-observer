import { ChatComposer } from '@/ui/components/chat/chat-composer'
import { render, screen } from '@testing-library/react'

describe('ChatComposer', () => {
  it('should render the chat composer form', () => {
    render(<ChatComposer />)

    const chatMessageLabel = screen.getByLabelText(/mensagem do chat/i)
    expect(chatMessageLabel).toBeInTheDocument()

    const chatMessageTextarea = screen.getByPlaceholderText(
      /digite uma mensagem.../i
    )
    expect(chatMessageTextarea).toBeInTheDocument()
    expect(chatMessageTextarea).toHaveAttribute('maxLength', '280')

    const submitButton = screen.getByRole('button', {
      name: /enviar/i,
    })
    expect(submitButton).toBeInTheDocument()
  })
})
