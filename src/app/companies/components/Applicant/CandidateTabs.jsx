'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const CandidateTabs = ({ activeTab, setActiveTab, companyId, jobId, children }) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid  max-w-4xl grid-cols-3 bg-brand rounded-lg p-1 mb-6">
        <TabsTrigger
          value="candidates"
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            activeTab === 'candidates'
              ? 'bg-[#1e90ff] text-white'
              : 'text-gray-600 hover:bg-gray-200 hover:text-gray-800'
          }`}
        >
          Candidates
        </TabsTrigger>
        <TabsTrigger
          value="shortlist"
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            activeTab === 'shortlist'
              ? 'bg-[#1e90ff] text-white'
              : 'text-gray-600 hover:bg-gray-200 hover:text-gray-800'
          }`}
        >
          Shortlist
        </TabsTrigger>
        <TabsTrigger
          value="archived"
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            activeTab === 'archived'
              ? 'bg-[#1e90ff] text-white'
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