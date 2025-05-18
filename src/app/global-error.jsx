'use client'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import "@/src/app/globals.css"

export default function GlobalError({
  error,
  reset,
}) {
  return (
    <html>
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 text-center">
          <div className="bg-white p-8 rounded-xl shadow-sm border max-w-md w-full">
            <div className="flex justify-center mb-6">
              <AlertTriangle className="h-12 w-12 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Critical Error</h1>
            <p className="text-gray-600 mb-6">
              A serious problem occurred. Please try refreshing the page.
            </p>
            <Button 
            variant={'outline'}
              className="w-full" 
              onClick={() => reset()}
            >
              Reload Application
            </Button>
          </div>
        </div>
      </body>
    </html>
  )
}