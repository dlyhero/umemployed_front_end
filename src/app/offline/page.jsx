// components/OfflinePage.tsx
'use client'
import { WifiOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Logo } from '@/src/components/common/Header/Logo'

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f6f8fa] dark:bg-[#0d1117] px-4">
      <div className="mb-8">
        <Logo className="h-12 w-auto text-gray-900 dark:text-gray-100" />
      </div>
      
      <div className="w-full max-w-md bg-white dark:bg-[#161b22] border border-gray-200 dark:border-gray-700 rounded-lg p-8 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 rounded-full">
            <WifiOff className="h-8 w-8 text-red-500 dark:text-red-400" />
          </div>
          
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Lost Connection
          </h1>
          
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Umemploy can't connect to the internet right now. Check your network and try again.
          </p>
          
          <div className="w-full space-y-3">
            <Button
              variant="brand"
              className="w-full py-2.5 text-white bg-brand/80 hover:bg-brand/70 dark:bg-brand dark:hover:bg-brand/90"
              onClick={() => window.location.reload()}
            >
              Retry Connection
            </Button>
            
            <Button
              variant="outline"
              className="w-full py-2.5 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1f242e]"
            >
              View Cached Content
            </Button>
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
        <p>Need help? Contact our <a href="mailto:support@umemploy.com" className="text-brand dark:text-brand/40 hover:underline">support team</a></p>
      </div>
    </div>
  )
}