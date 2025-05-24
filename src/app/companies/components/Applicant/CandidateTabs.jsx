'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const CandidateTabs = ({ activeTab, setActiveTab, companyId, jobId, children }) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="flex max-w-4xl rounded-lg p-1 mb-6 shadow-sm">
        <TabsTrigger
          value="candidates"
          className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors text-sm sm:text-base ${
            activeTab === 'candidates'
              ? 'bg-brand text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-200 hover:text-gray-800'
          }`}
        >
          Candidates
        </TabsTrigger>
        <TabsTrigger
          value="shortlist"
          className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors text-sm sm:text-base ${
            activeTab === 'shortlist'
              ? 'bg-brand text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-200 hover:text-gray-800'
          }`}
        >
          Shortlist
        </TabsTrigger>
        <TabsTrigger
          value="archived"
          className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors text-sm sm:text-base ${
            activeTab === 'archived'
              ? 'bg-brand text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-200 hover:text-gray-800'
          }`}
        >
          Archived
        </TabsTrigger>
      </TabsList>
      {children}
    </Tabs>
  );
};

export default CandidateTabs;