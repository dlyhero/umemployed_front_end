// src/context/AuthContext.js
"use client";
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [showAuthButtons, setShowAuthButtons] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  return (
    <AuthContext.Provider value={{ 
      showAuthButtons, 
      setShowAuthButtons, 
      isLoggingOut, 
      setIsLoggingOut 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}