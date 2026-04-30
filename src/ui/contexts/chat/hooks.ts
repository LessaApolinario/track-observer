'use client'

import { useContextSelector } from 'use-context-selector'
import { ChatContext } from '.'

export function useChatMessages() {
  return useContextSelector(ChatContext, (ctx) => ctx.messages)
}

export function useCreateChatMessage() {
  return useContextSelector(ChatContext, (ctx) => ctx.createMessage)
}

export function useChatUser() {
  return useContextSelector(ChatContext, (ctx) => ctx.currentUser)
}

export function useSetChatUserName() {
  return useContextSelector(ChatContext, (ctx) => ctx.setUserName)
}

export function useChatConnectionState() {
  return useContextSelector(ChatContext, (ctx) => ctx.isConnected)
}

export function useIsChatNicknameLocked() {
  return useContextSelector(ChatContext, (ctx) => ctx.isNicknameLocked)
}
