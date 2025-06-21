'use client'
import { useEffect } from 'react'
import OfflineLayout from './offline/layout'
import { AuthProvider } from '../context/AuthContext'
import { usePathname } from 'next/navigation'

export default function RootLayout({ children }) {
  const pathname = usePathname()
  
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(registration => {
            console.log('SW registered:', registration)
          })
          .catch(registrationError => {
            console.log('SW registration failed:', registrationError)
          })
      })
    }
  }, [])

  return (
    <html lang="en">
      <body>
        <OfflineLayout>
          <AuthProvider>
            {/* AuthModal will handle showing login prompt */}
            {children}
          </AuthProvider>
        </OfflineLayout>
      </body>
    </html>
  )
}