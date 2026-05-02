import { ChatPanel } from '@/ui/components/chat/chat-panel'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const mockUseChatUser = jest.fn()
const mockUseChatMessages = jest.fn()
const mockUseCreateChatMessage = jest.fn()
const mockUseSetChatUserName = jest.fn()
const mockUseChatConnectionState = jest.fn()
const mockUseIsChatNicknameLocked = jest.fn()

jest.mock('../../../src/ui/contexts/chat/hooks.ts', () => ({
  useChatUser: () => mockUseChatUser(),
  useChatMessages: () => mockUseChatMessages(),
  useCreateChatMessage: () => mockUseCreateChatMessage(),
  useSetChatUserName: () => mockUseSetChatUserName(),
  useChatConnectionState: () => mockUseChatConnectionState(),
  useIsChatNicknameLocked: () => mockUseIsChatNicknameLocked(),
}))

describe('ChatPanel', () => {
  beforeEach(() => {
    mockUseChatUser.mockReturnValue({
      id: 'self',
      name: 'Visitante',
    })
    mockUseChatMessages.mockReturnValue([])
    mockUseCreateChatMessage.mockReturnValue(jest.fn())
    mockUseSetChatUserName.mockReturnValue(jest.fn())
    mockUseChatConnectionState.mockReturnValue(false)
    mockUseIsChatNicknameLocked.mockReturnValue(false)
  })

  it('should render the chat panel with header, message list and composer', () => {
    mockUseChatUser.mockReturnValue({
      id: 'self',
      name: 'Visitante',
    })
    mockUseChatMessages.mockReturnValue([])
    mockUseCreateChatMessage.mockReturnValue(jest.fn())
    mockUseSetChatUserName.mockReturnValue(jest.fn())
    mockUseChatConnectionState.mockReturnValue(true)
    mockUseIsChatNicknameLocked.mockReturnValue(false)

    render(<ChatPanel />)

    const liveChatHeading = screen.getByRole('heading', {
      name: /chat ao vivo/i,
    })
    expect(liveChatHeading).toBeInTheDocument()

    const isConnectedText = screen.getByText(/conectado/i)
    expect(isConnectedText).toBeInTheDocument()

    const nameInput = screen.getByLabelText(/nome/i)
    expect(nameInput).toBeInTheDocument()
    expect(nameInput).toHaveValue('Visitante')

    const setNickNameButton = screen.getByRole('button', {
      name: /definir nick/i,
    })
    expect(setNickNameButton).toBeInTheDocument()
    expect(setNickNameButton).toBeEnabled()
  })

  it('should display "Conectando..." when not connected', () => {
    mockUseChatUser.mockReturnValue({
      id: 'self',
      name: 'Visitante',
    })
    mockUseChatMessages.mockReturnValue([])
    mockUseCreateChatMessage.mockReturnValue(jest.fn())
    mockUseSetChatUserName.mockReturnValue(jest.fn())
    mockUseChatConnectionState.mockReturnValue(false)
    mockUseIsChatNicknameLocked.mockReturnValue(false)

    render(<ChatPanel />)

    const connectingText = screen.getByText(/conectando.../i)
    expect(connectingText).toBeInTheDocument()
  })

  it('should change the name draft when the input value changes', async () => {
    const setNameFn = jest.fn()
    mockUseChatUser.mockReturnValue({
      id: 'self',
      name: 'Visitante',
    })
    mockUseChatMessages.mockReturnValue([])
    mockUseCreateChatMessage.mockReturnValue(jest.fn())
    mockUseSetChatUserName.mockReturnValue(setNameFn)
    mockUseChatConnectionState.mockReturnValue(true)
    mockUseIsChatNicknameLocked.mockReturnValue(false)

    render(<ChatPanel />)

    const nameInput = screen.getByLabelText(/nome/i)
    await userEvent.clear(nameInput)
    await userEvent.type(nameInput, 'New Name')

    expect(nameInput).toHaveValue('New Name')

    const setNickNameButton = screen.getByRole('button', {
      name: /definir nick/i,
    })
    await userEvent.click(setNickNameButton)

    expect(setNameFn).toHaveBeenCalledWith('New Name')
  })

  it('should disable the input and button when nickname is locked', () => {
    mockUseChatUser.mockReturnValue({
      id: 'self',
      name: 'Visitante',
    })
    mockUseChatMessages.mockReturnValue([])
    mockUseCreateChatMessage.mockReturnValue(jest.fn())
    mockUseSetChatUserName.mockReturnValue(jest.fn())
    mockUseChatConnectionState.mockReturnValue(true)
    mockUseIsChatNicknameLocked.mockReturnValue(true)

    render(<ChatPanel />)

    const nameInput = screen.getByLabelText(/nome/i)
    expect(nameInput).toBeDisabled()
    expect(nameInput).toHaveValue('Visitante')

    const setNickNameButton = screen.getByRole('button', {
      name: /nick definido/i,
    })
    expect(setNickNameButton).toBeDisabled()
  })

  it('should show "Nick definido" when nickname is locked', () => {
    mockUseChatUser.mockReturnValue({
      id: 'self',
      name: 'Visitante',
    })
    mockUseChatMessages.mockReturnValue([])
    mockUseCreateChatMessage.mockReturnValue(jest.fn())
    mockUseSetChatUserName.mockReturnValue(jest.fn())
    mockUseChatConnectionState.mockReturnValue(true)
    mockUseIsChatNicknameLocked.mockReturnValue(true)

    render(<ChatPanel />)

    const setNickNameButton = screen.getByRole('button', {
      name: /nick definido/i,
    })
    expect(setNickNameButton).toBeInTheDocument()
  })
})
