'use client'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEffect } from 'react'

export default function Error({
    error,
    reset,
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 text-center">
            <div className="bg-white p-8 rounded-xl shadow-sm border max-w-md w-full">
                <div className="flex justify-center mb-6">
                    <AlertCircle className="h-12 w-12 text-red-500" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Something Went Wrong!</h1>
                <p className="text-gray-600 mb-4">
                    {error.message || 'An unexpected error occurred.'}
                </p>
                <p className="text-sm text-gray-500 mb-6">
                    Error code: {error.digest || 'UNKNOWN'}
                </p>
                <div className="space-y-3">
                    <Button
                        className="w-full"
                        onClick={() => reset()}
                    >
                        Try Again
                    </Button>
                    <Button variant="outline" className="w-full" asChild>
                        <a href="/">
                            Go to Homepage
                        </a>
                    </Button>
                </div>
            </div>
        </div>
    )
}