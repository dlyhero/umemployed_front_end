'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Loader2, Menu } from 'lucide-react';
import { toast } from 'sonner';
import CandidateCard from '../Applicant/CandidateCard';
import CandidateModal from '../Applicant/CandidateModal';
import InterviewModal from '../Applicant/InterviewModal';
import CandidateTabs from '../Applicant/CandidateTabs';
import { TabsContent } from '@/components/ui/tabs';
import { MobileMenu } from '../../[companyId]/dashboard/MobileMenu';
import { Sideba } from '../../[companyId]/dashboard/recruiter/Sideba';
import  ShortlistFetch  from './ShortlistFetch';

const ShortlistComponent = () => {
  const { companyId, jobId } = useParams();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('shortlist');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [shortlisted, setShortlisted] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    console.log('ShortlistComponent mounted, path:', window.location.pathname);
    console.log('Shortlisted:', shortlisted?.length || 0, 'loading:', loading, 'hasFetched:', hasFetched);
    return () => {
      console.log('ShortlistComponent unmounted');
    };
  }, [shortlisted, loading, hasFetched]);

  const handleTabChange = (tab) => {
    console.log('Tab changed to:', tab);
    if (tab === 'candidates') {
      router.push(`/companies/${companyId}/jobs/${jobId}/applications`);
    } else if (tab === 'archived') {
      router.push(`/companies/${companyId}/jobs/${jobId}/archived`);
    } else {
      setActiveTab(tab);
    }
  };

  const handleEndorse = (candidateId) => {
    console.log('Endorse triggered for candidate:', candidateId);
  };

  const handleSchedule = (candidateId) => {
    console.log('Schedule interview for candidate:', candidateId);
    const candidate = shortlisted.find((app) => app.user_id === candidateId);
    if (candidate) {
      setSelectedCandidate(candidate);
      setIsInterviewModalOpen(true);
    } else {
      toast.error('Candidate not found.');
    }
  };

  const handleViewDetails = (candidate) => {
    console.log('View details for candidate:', candidate?.user_id);
    if (!candidate || !candidate.profile) {
      console.warn('Invalid candidate passed to handleViewDetails:', candidate);
      return;
    }
    setSelectedCandidate(candidate);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCandidate(null);
  };

  const closeInterviewModal = () => {
    setIsInterviewModalOpen(false);
    setSelectedCandidate(null);
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-brand/50" />
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-red-600">Please log in to view shortlisted candidates.</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gray-50 py-8"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 overflow-x-auto">
        <header className="flex justify-between items-center md:hidden mb-6">
          {/* <Button
            variant="ghost"
            className="p-2 text-gray-900 hover:bg-gray-100 rounded-full"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </Button> */}
        </header>
        <MobileMenu
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          activeTab={`/companies/${companyId}/jobs/${jobId}/shortlist`}
          setActiveTab={setActiveTab}
          companyId={companyId}
        />
        <div className="flex gap-6">
          <div className="hidden md:block w-64 flex-shrink-0">
            <Sideba
              activeTab={`/companies/${companyId}/jobs/${jobId}/shortlist`}
              setActiveTab={setActiveTab}
              companyId={companyId}
            />
          </div>
          <main className="flex-1">
            <div className="hidden md:block mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Shortlisted Candidates</h1>
            </div>
            {!hasFetched && (
              <ShortlistFetch
                companyId={companyId}
                jobId={jobId}
                session={session}
                status={status}
                setShortlisted={setShortlisted}
                setLoading={setLoading}
                setError={setError}
                setHasFetched={setHasFetched}
              />
            )}
            {loading ? (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-brand/50 mx-auto" />
                <p className="text-gray-600 mt-2">Loading shortlisted candidates...</p>
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
                  <TabsContent value="shortlist">
                    <div className="space-y-4">
                      <h2 className="text-xl font-semibold border-b-4 border-brand/50 w-fit">
                        Shortlisted Candidates
                      </h2>
                      {shortlisted && shortlisted.length > 0 ? (
                        shortlisted.map((app) => (
                          <CandidateCard
                            key={app.id}
                            candidate={app}
                            type="job"
                            handleViewDetails={handleViewDetails}
                            handleEndorse={handleEndorse}
                            handleSchedule={handleSchedule}
                            activeTab={activeTab}
                            isShortlisted={true}
                          />
                        ))
                      ) : (
                        <div className="flex justify-center items-center h-[200px]">
                          <p className="text-gray-500">No shortlisted candidates.</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </CandidateTabs>
              </section>
            )}
          </main>
        </div>
      </div>
      <CandidateModal
        isOpen={isModalOpen}
        onClose={closeModal}
        candidate={selectedCandidate}
        type="job"
      />
      {InterviewModal ? (
        <InterviewModal
          isOpen={isInterviewModalOpen}
          onClose={closeInterviewModal}
          candidate={selectedCandidate}
          companyId={companyId}
          jobId={jobId}
          accessToken={session?.accessToken}
        />
      ) : null}
    </motion.div>
  );
};

export default ShortlistComponent;