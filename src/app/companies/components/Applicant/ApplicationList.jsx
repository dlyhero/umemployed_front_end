'use client';

import { Loader2 } from 'lucide-react'; // Ensure Loader2 is imported
import CandidateCard from './CandidateCard';
import CandidateTabs from './CandidateTabs';
import { TabsContent } from '@/components/ui/tabs';

const ApplicationList = ({
  applications,
  loading,
  error,
  activeTab,
  handleTabChange,
  handleViewDetails,
  handleShortlist,
  handleSchedule,
  companyId,
  jobId,
  type,
}) => {
  const topCandidates = applications.slice(0, 5);
  const waitingList = applications.slice(5);

  return (
    <>
      {loading ? (
        <div className="text-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-brand-500 mx-auto" />
          <p className="text-gray-600 mt-2">Loading applications...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-600">{error}</div>
      ) : (
        <section className="w-full">
          <CandidateTabs
            activeTab={activeTab}
            setActiveTab={handleTabChange}
            companyId={companyId}
            jobId={jobId}
          >
            <TabsContent value="candidates">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold border-b-4 border-brand-500 w-fit">
                  Top 5 Candidates
                </h2>
                {topCandidates.length > 0 ? (
                  topCandidates.map((app) => (
                    <CandidateCard
                      key={app.id}
                      candidate={app}
                      type={type}
                      handleViewDetails={handleViewDetails}
                      handleShortlist={handleShortlist}
                      handleSchedule={handleSchedule}
                      activeTab={activeTab}
                      isShortlisted={app.isShortlisted}
                    />
                  ))
                ) : (
                  <div className="flex justify-center items-center h-[200px]">
                    <p className="text-gray-500">No candidates found.</p>
                  </div>
                )}
                <h2 className="text-xl font-semibold mt-8 border-b-4 border-brand-400 w-fit">
                  Waiting List
                </h2>
                {waitingList.length > 0 ? (
                  waitingList.map((app) => (
                    <CandidateCard
                      key={app.id}
                      candidate={app}
                      type={type}
                      handleViewDetails={handleViewDetails}
                      handleShortlist={handleShortlist}
                      handleSchedule={handleSchedule}
                      activeTab={activeTab}
                      isShortlisted={app.isShortlisted}
                    />
                  ))
                ) : (
                  <div className="flex justify-center items-center h-[200px]">
                    <p className="text-gray-500">No candidates in waiting list.</p>
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="shortlist">
              <div className="space-y-4">
                <p className="text-gray-600">
                  View shortlisted candidates at{' '}
                  <a
                    href={`/companies/${companyId}/jobs/${jobId}/shortlist`}
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    Shortlist Page
                  </a>
                </p>
              </div>
            </TabsContent>
            <TabsContent value="archived">
              <div className="flex justify-center items-center h-[200px]">
                <p className="text-gray-500">No archived candidates.</p>
              </div>
            </TabsContent>
          </CandidateTabs>
        </section>
      )}
    </>
  );
};

export default ApplicationList;