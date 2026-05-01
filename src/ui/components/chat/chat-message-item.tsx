'use client'

import { ChatMessage } from '@/core/domain/models/ChatMessage'
import { User } from '@/core/domain/models/User'

interface ChatMessageItemProps {
  message: ChatMessage
  currentUser: User
}

function formatHour(date: string) {
  return new Date(date).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

export function ChatMessageItem({
  message,
  currentUser,
}: ChatMessageItemProps) {
  const isOwnMessage = message.user.id === currentUser.id

  return (
    <li className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      <article
        className={`max-w-[85%] rounded-2xl border px-3 py-2 ${
          isOwnMessage
            ? 'border-primary/30 bg-primary/15'
            : 'border-border bg-surface-strong/35'
        }`}
      >
        <header className="mb-1 flex items-center justify-between gap-3">
          <span className="text-primary-strong text-xs font-semibold">
            {message.user.name}
          </span>
          <time className="text-muted text-[11px]">
            {formatHour(message.createdAt)}
          </time>
        </header>
        <p className="text-foreground text-sm leading-relaxed wrap-break-word">
          {message.text}
        </p>
      </article>
    </li>
  )
}
