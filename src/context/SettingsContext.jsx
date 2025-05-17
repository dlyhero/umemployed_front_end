'use client'
import { createContext, useContext, useState, ReactNode } from 'react'



const SettingsContext = createContext(undefined)

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState({
    profile: {
      firstName: 'John',
      lastName: 'Doe',
      headline: 'Software Engineer at Umemploy',
      location: 'San Francisco, CA',
      avatar: '/avatars/default.png'
    },
    account: {
      email: 'john@example.com',
      language: 'english',
      darkMode: false
    },
    security: {
      twoFactorAuth: false,
      loginAlerts: true
    },
    notifications: {
      jobAlerts: true,
      messages: true,
      applicationUpdates: true
    },
    billing: {
      plan: 'Premium ($9.99/month)',
      paymentMethod: 'Visa ending in 4242',
      nextBillingDate: 'Jan 30, 2024'
    }
  })

  const updateSettings = (section, data) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...data
      }
    }))
  }

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}