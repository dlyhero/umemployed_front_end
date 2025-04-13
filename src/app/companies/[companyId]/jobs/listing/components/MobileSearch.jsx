// src/app/companies/[companyId]/jobs/listing/components/MobileSearch.jsx
'use client';

import { Search } from 'lucide-react';

export const MobileSearch = ({ searchQuery, setSearchQuery }) => {
  const handleInputChange = (e) => setSearchQuery(e.target.value);

  return (
    <section className="md:hidden">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search jobs, companies, or locations"
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
          value={searchQuery}
          onChange={handleInputChange}
        />
      </div>
    </section>
  );
};