// src/app/not-found.js
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Search, Briefcase, User } from 'lucide-react';
import '@/src/app/globals.css'
import { Dancing_Script } from 'next/font/google';
// or
import { Satisfy } from 'next/font/google';
// or
import { Pacifico } from 'next/font/google';

const dance= Dancing_Script({
    weight: '400',
    subsets: ['latin'],
  });


export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center  p-6">
      <div className="max-w-md w-full bg-white p-8 rounded-lg  text-center">
      <h1 className={`text-8xl text-brand mb-4 ${dance.className}`}>404</h1>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          {`The page you're looking for doesn't exist or may have been moved.`}
        </p>
        
        <div className="space-y-4">
          <Button variant={'outline'} asChild className="w-full">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Return to Homepage
            </Link>
          </Button>
          
          <div className="grid grid-cols-2 gap-4">
            <Button variant="brand" asChild className="w-full">
              <Link href="/jobs">
                <Search className="mr-2 h-4 w-4" />
                Browse Jobs
              </Link>
            </Button>
            
            <Button variant="brand" asChild className="w-full">
              <Link href="/companies/listing">
                <Briefcase className="mr-2 h-4 w-4" />
                Companies
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}