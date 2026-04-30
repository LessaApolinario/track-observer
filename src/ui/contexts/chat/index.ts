import { ChatMessage } from '@/core/domain/models/ChatMessage'
import { User } from '@/core/domain/models/User'
import { createContext } from 'use-context-selector'

interface ChatContextProps {
  currentUser: User
  messages: ChatMessage[]
  isConnected: boolean
  isNicknameLocked: boolean
  setUserName: (name: string) => void
  createMessage: (text: string) => void
}

export const ChatContext = createContext({} as ChatContextProps)
