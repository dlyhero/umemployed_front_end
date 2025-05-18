// app/offline/layout.tsx
'use client'

import { useOffline } from "@/src/hooks/useOffline"
import OfflinePage from "./page"

export default function OfflineLayout({
  children,
}) {
  const isOffline = useOffline()

  if (isOffline) {
    return <OfflinePage />
  }

  return children
}