'use client';

import { Book, Building, Pencil } from 'lucide-react';

export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black">
      {/* Icon Illustration */}
      <div className="flex space-x-4 mb-6">
        <Building className="text-gray-500 w-10 h-10" />
        <Book className="text-gray-400 w-10 h-10" />
        <Pencil className="text-red-500 w-10 h-10" />
      </div>

      {/* Text Content */}
      <h1 className="text-xl font-semibold mb-2">You are offline</h1>
      <p className="text-gray-600">Go back online to use Umemployed</p>
    </div>
  );
}
