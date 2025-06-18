'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

// Debug component to check environment and authentication status
// Remove this component after confirming everything works in production
export default function DeploymentDebug() {
  const { data: session, status } = useSession();
  const [envCheck, setEnvCheck] = useState({});

  useEffect(() => {
    // Check environment variables (only client-side accessible ones)
    setEnvCheck({
      NODE_ENV: process.env.NODE_ENV,
      // Don't log sensitive variables in production!
      hasNextAuthURL: !!process.env.NEXTAUTH_URL,
      baseURL: window.location.origin,
    });
  }, []);

  // Only show in development or when explicitly needed
  if (process.env.NODE_ENV === 'production') {
    return null; // Remove this line if you want to see debug info in production
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h3 className="font-bold mb-2">Debug Info</h3>
      
      <div className="mb-2">
        <strong>Environment:</strong> {envCheck.NODE_ENV}
      </div>
      
      <div className="mb-2">
        <strong>Base URL:</strong> {envCheck.baseURL}
      </div>
      
      <div className="mb-2">
        <strong>Auth Status:</strong> {status}
      </div>
      
      {session && (
        <div className="mb-2">
          <strong>User Role:</strong> {session.user?.role || 'none'}
        </div>
      )}
      
      <div className="mb-2">
        <strong>NextAuth URL Set:</strong> {envCheck.hasNextAuthURL ? '✅' : '❌'}
      </div>

      <button 
        onClick={() => console.log('Session:', session)}
        className="bg-blue-500 px-2 py-1 rounded text-xs"
      >
        Log Session
      </button>
    </div>
  );
}
