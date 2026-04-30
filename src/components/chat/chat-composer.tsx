'use client'

import { useCreateChatMessage } from '@/ui/contexts/chat/hooks'
import { SyntheticEvent, useState } from 'react'

export function ChatComposer() {
  const createMessage = useCreateChatMessage()
  const [text, setText] = useState('')

  function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault()

    const normalized = text.trim()

    if (!normalized) {
      return
    }

    createMessage(normalized)
    setText('')
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-2">
      <label htmlFor="chat-message" className="sr-only">
        Mensagem do chat
      </label>
      <textarea
        id="chat-message"
        value={text}
        onChange={(event) => setText(event.target.value)}
        maxLength={280}
        rows={3}
        placeholder="Digite uma mensagem..."
        className="border-border bg-background text-foreground placeholder:text-muted/80 focus:border-primary resize-none rounded-xl border px-3 py-2 text-sm focus:outline-none"
      />
      <button
        type="submit"
        className="bg-primary hover:bg-primary-strong inline-flex cursor-pointer items-center justify-center rounded-xl px-4 py-2 text-sm font-bold text-white"
      >
        Enviar
      </button>
    </form>
  )
}
