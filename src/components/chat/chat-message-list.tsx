'use client'

import { useChatMessages, useChatUser } from '@/ui/contexts/chat/hooks'
import { ChatMessageItem } from './chat-message-item'

export function ChatMessageList() {
  const currentUser = useChatUser()
  const messages = useChatMessages()

  if (!messages.length) {
    return (
      <div className="border-border bg-surface/60 flex h-full items-center justify-center rounded-xl border border-dashed p-4">
        <p className="text-muted text-sm">
          Sem mensagens ainda. Inicie a conversa.
        </p>
      </div>
    )
  }

  return (
    <ul className="flex h-full flex-col gap-2 overflow-y-auto pr-1">
      {messages.map((message) => (
        <ChatMessageItem
          key={message.id}
          message={message}
          currentUser={currentUser}
        />
      ))}
    </ul>
  )
}
