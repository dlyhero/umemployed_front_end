// src/app/error.js
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import '@/src/app/globals.css'


export default function Error({ error, reset }) {
  const router = useRouter();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-sm text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
          <AlertTriangle className="h-6 w-6 text-red-600" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Something went wrong!</h2>
        <p className="text-gray-600 mb-6">
          {error.message || 'An unexpected error occurred. Please try again.'}
        </p>
        
        <div className="space-y-3">
          <Button onClick={() => reset()} className="w-full">
            Try again
          </Button>
          
          <Button variant="outline" onClick={() => router.push('/')} className="w-full">
            <Home className="mr-2 h-4 w-4" />
            Return home
          </Button>
        </div>
      </div>
    </div>
  );
}