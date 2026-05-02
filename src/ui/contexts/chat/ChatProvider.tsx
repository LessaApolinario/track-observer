'use client'

import { ChatMessage } from '@/core/domain/models/ChatMessage'
import { User } from '@/core/domain/models/User'
import axios from 'axios'
import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { ChatContext } from '.'

interface ListMessagesResponse {
  action: 'list'
  payload: {
    messages: ChatMessage[]
  }
}

interface CreateMessageResponse {
  action: 'create'
  payload: {
    message: ChatMessage
  }
}

function createAnonymousUser(): User {
  return {
    id: crypto.randomUUID(),
    name: 'Visitante',
  }
}

export function ChatProvider({ children }: PropsWithChildren) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [isNicknameLocked, setIsNicknameLocked] = useState(false)
  const [currentUser, setCurrentUser] = useState<User>(() =>
    createAnonymousUser()
  )

  const syncMessages = useCallback(async () => {
    try {
      const response = await axios.get<ListMessagesResponse>('/api/chat', {
        params: {
          action: 'list',
        },
      })

      if (response.data.action !== 'list') {
        return
      }

      setMessages(response.data.payload.messages)
      setIsConnected(true)
    } catch {
      setIsConnected(false)
    }
  }, [])

  const createMessage = useCallback(
    async (text: string) => {
      const normalizedText = text.trim()

      if (!normalizedText) {
        return
      }

      try {
        const response = await axios.post<CreateMessageResponse>('/api/chat', {
          action: 'create',
          payload: {
            text: normalizedText,
            user: currentUser,
          },
        })

        const created = response.data.payload.message

        setMessages((previousMessages) => {
          const alreadyExists = previousMessages.some(
            (message) => message.id === created.id
          )

          if (alreadyExists) {
            return previousMessages
          }

          return [...previousMessages, created]
        })
      } catch {
        setIsConnected(false)
      }
    },
    [currentUser]
  )

  const setUserName = useCallback(
    (name: string) => {
      if (isNicknameLocked) {
        return
      }

      const normalizedName = name.trim()

      if (!normalizedName) {
        return
      }

      setCurrentUser((previousUser) => ({
        ...previousUser,
        name: normalizedName,
      }))
      setIsNicknameLocked(true)
    },
    [isNicknameLocked]
  )

  useEffect(() => {
    const kickoff = window.setTimeout(() => {
      void syncMessages()
    }, 0)

    const timer = window.setInterval(() => {
      void syncMessages()
    }, 2000)

    return () => {
      window.clearTimeout(kickoff)
      window.clearInterval(timer)
    }
  }, [syncMessages])

  const value = useMemo(
    () => ({
      currentUser,
      messages,
      isConnected,
      isNicknameLocked,
      setUserName,
      createMessage,
    }),
    [
      createMessage,
      currentUser,
      isConnected,
      isNicknameLocked,
      messages,
      setUserName,
    ]
  )

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}
