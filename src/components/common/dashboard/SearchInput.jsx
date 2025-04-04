'use client'
import { Search } from 'lucide-react'

export const SearchInput = () => (
  <div className="relative">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
    <input
      type="text"
      placeholder="Search..."
      className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300"
    />
  </div>
)