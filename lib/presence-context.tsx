'use client'

import { createContext, useContext } from 'react'

interface OnlinePresenceContextValue {
  onlineUserIds: Set<string>
}

export const OnlinePresenceContext = createContext<OnlinePresenceContextValue>({
  onlineUserIds: new Set(),
})

export function useOnlinePresence() {
  return useContext(OnlinePresenceContext)
}
