'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';

const SearchFilter = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="flex items-center gap-2 mt-7 mb-4 bg-white w-full flex-col sm:flex-row">
      <div className="relative w-full sm:w-[70%] md:w-[55%]">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
        <Input
          type="search"
          placeholder="Search Candidates"
          className="pl-10 pr-4 py-2 rounded-full border border-gray-300 w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <Button variant="ghost" className="flex items-center text-blue-500 gap-2 w-full sm:w-auto justify-center">
        <Filter className="w-6 h-6" />
        Filters
      </Button>
    </div>
  );
};

export default SearchFilter;