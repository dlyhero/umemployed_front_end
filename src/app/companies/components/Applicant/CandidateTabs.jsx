'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const CandidateTabs = ({ activeTab, setActiveTab, companyId, jobId, children }) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="flex max-w-2xl rounded-lg p-1 mb-6  shadow-sm">
        <TabsTrigger
          value="candidates"
          className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors text-sm sm:text-base ${
            activeTab === 'candidates'
              ? 'bg-brand text-white shadow'
              : 'text-gray-600 hover:bg-brand/10 hover:text-brand'
          }`}
        >
          Candidates
        </TabsTrigger>
        <TabsTrigger
          value="shortlist"
          className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors text-sm sm:text-base ${
            activeTab === 'shortlist'
              ? 'bg-brand text-white shadow'
              : 'text-gray-600 hover:bg-brand/10 hover:text-brand'
          }`}
        >
          Shortlist
        </TabsTrigger>
      </TabsList>
      {children}
    </Tabs>
  );
};

export default CandidateTabs;