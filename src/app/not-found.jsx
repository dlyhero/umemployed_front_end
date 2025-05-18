import { FileSearch } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import "@/src/app/globals.css"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 text-center">
      <div className="bg-white p-8 rounded-xl shadow-sm border max-w-md w-full">
        <div className="flex justify-center mb-6">
        </div>
        <h1 className="text-3xl md:text-5xl font-bold mb-2">404</h1>
        <h2 className='font-bold mb-2 text-xl md:text-2xl'>Page Not Found</h2>
        <p className="text-gray-600 mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="space-y-3">
          <Button variant={'brand'} asChild className="w-full">
            <Link href="/">
              Return Home
            </Link>
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/contact">
              Contact Support
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}