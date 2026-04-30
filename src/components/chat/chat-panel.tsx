'use client'

import {
  useChatConnectionState,
  useChatUser,
  useIsChatNicknameLocked,
  useSetChatUserName,
} from '@/ui/contexts/chat/hooks'
import { SyntheticEvent, useState } from 'react'
import { ChatComposer } from './chat-composer'
import { ChatMessageList } from './chat-message-list'

export function ChatPanel() {
  const currentUser = useChatUser()
  const setUserName = useSetChatUserName()
  const isConnected = useChatConnectionState()
  const isNicknameLocked = useIsChatNicknameLocked()
  const [nameDraft, setNameDraft] = useState(currentUser.name)

  function handleSetNickname(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault()
    setUserName(nameDraft)
  }

  return (
    <aside className="rounded-panel border-border bg-surface shadow-soft flex h-full min-h-[70vh] flex-col border p-4">
      <header className="mb-4 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-primary text-xs font-bold tracking-widest uppercase">
            Chat ao vivo
          </h2>
          <span
            className={`text-[11px] font-semibold ${
              isConnected ? 'text-primary-strong' : 'text-muted'
            }`}
          >
            {isConnected ? 'Conectado' : 'Conectando...'}
          </span>
        </div>

        <form className="grid gap-2" onSubmit={handleSetNickname}>
          <label className="grid gap-1" htmlFor="chat-username">
            <span className="text-muted text-[11px] font-semibold tracking-wide uppercase">
              Nome
            </span>
            <input
              id="chat-username"
              value={isNicknameLocked ? currentUser.name : nameDraft}
              onChange={(event) => setNameDraft(event.target.value)}
              maxLength={30}
              disabled={isNicknameLocked}
              className="border-border bg-background text-foreground placeholder:text-muted/80 focus:border-primary rounded-xl border px-3 py-2 text-sm focus:outline-none disabled:cursor-not-allowed disabled:opacity-70"
            />
          </label>

          <button
            type="submit"
            disabled={isNicknameLocked}
            className="bg-primary hover:bg-primary-strong inline-flex cursor-pointer items-center justify-center rounded-xl px-3 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isNicknameLocked ? 'Nick definido' : 'Definir nick'}
          </button>
        </form>
      </header>

      <div className="mb-3 min-h-0 flex-1">
        <ChatMessageList />
      </div>

      <ChatComposer />
    </aside>
  )
}
