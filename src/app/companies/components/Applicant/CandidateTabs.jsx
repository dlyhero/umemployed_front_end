'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const CandidateTabs = ({ activeTab, setActiveTab, companyId, jobId, children }) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3 bg-gray-100 rounded-lg p-1">
        <TabsTrigger
          value="candidates"
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            activeTab === 'candidates'
              ? 'bg-[#1e90ff] text-white'
              : 'text-gray-600 hover:bg-brand-100 hover:text-brand-600'
          }`}
        >
          Candidates
        </TabsTrigger>
        <TabsTrigger
          value="shortlist"
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            activeTab === 'shortlist'
              ? 'bg-[#1e90ff] text-white'
              : 'text-gray-600 hover:bg-brand-100 hover:text-brand-600'
          }`}
        >
          Shortlist
        </TabsTrigger>
        <TabsTrigger
          value="archived"
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            activeTab === 'archived'
              ? 'bg-[#1e90ff] text-white'
              : 'text-gray-600 hover:bg-brand-100 hover:text-brand-600'
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