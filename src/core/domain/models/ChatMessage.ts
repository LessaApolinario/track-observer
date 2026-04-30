import { User } from './User'

export interface ChatMessage {
  id: string
  text: string
  user: User
  createdAt: string
}
