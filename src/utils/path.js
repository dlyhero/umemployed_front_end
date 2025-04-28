// utils/path.js
import { usePathname } from 'next/navigation'

export function useIsMessagesPage() {
  const pathname = usePathname()
  return pathname === '/messages'
}