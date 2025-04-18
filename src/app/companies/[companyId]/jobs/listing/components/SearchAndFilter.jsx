'use client';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input.jsx';

export const SearchAndFilter = ({ searchQuery, setSearchQuery }) => {
  const handleInputChange = (e) => setSearchQuery(e.target.value);

  return (
    <section className="hidden lg:block mb-6">
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search jobs, companies, or locations"
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e40af] text-gray-900 placeholder-gray-400"
          value={searchQuery}
          onChange={handleInputChange}
        />
      </div>
    </section>
  );
};