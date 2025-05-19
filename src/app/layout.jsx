'use client' // Add this at the top
import { useEffect } from 'react'
import OfflineLayout from './offline/layout'
import { AuthProvider } from '../context/AuthContext'

export default function RootLayout({
  children,
}) {
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
          <AuthProvider>
           {children}
          </AuthProvider>
         
        </AuthProvider>
        </OfflineLayout>

      </body>
    </html>
  )
}