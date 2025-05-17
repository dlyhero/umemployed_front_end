'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import ApplicationHeader from './ApplicationHeader';
import ApplicationFetch from './ApplicationFetch';
import ApplicationList from './ApplicationList';
import CandidateModal from './CandidateModal';
import InterviewModal from './InterviewModal';
import { Sideba } from '../../[companyId]/dashboard/recruiter/Sideba';

const ApplicantComponent = ({ type = 'job' }) => {
  const { companyId, jobId } = useParams();
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState(
    pathname === `/companies/${companyId}/applications` ? 'candidates' : 'candidates'
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('Active tab:', activeTab, 'Pathname:', pathname);
  }, [activeTab, pathname]);

  const handleTabChange = (tab) => {
    if (tab === 'shortlist') {
      router.push(`/companies/${companyId}/jobs/${jobId}/shortlist`);
    } else if (tab === 'archived') {
      router.push(`/companies/${companyId}/jobs/${jobId}/archived`);
    } else if (tab === `/companies/${companyId}/applications`) {
      setActiveTab('candidates'); // Map Applications path to candidates tab
    } else {
      setActiveTab(tab);
    }
  };

  const handleViewDetails = (candidate) => {
    if (!candidate || !candidate.profile) {
      console.warn('Invalid candidate passed to handleViewDetails:', candidate);
      return;
    }
    setSelectedCandidate(candidate);
    setIsModalOpen(true);
  };

  const handleSchedule = (candidateId) => {
    const candidate = applications.find((app) => app.user_id === candidateId);
    if (candidate) {
      setSelectedCandidate(candidate);
      setIsInterviewModalOpen(true);
    } else {
      toast.error('Candidate not found.');
    }
  };

  const handleShortlist = async (candidateId) => {
    if (!session?.accessToken) {
      toast.error('Unauthorized: No access token available');
      return;
    }

    try {
      const response = await fetch(
        `https://umemployed-f6fdddfffmhjhjcj.canadacentral-01.azurewebsites.net/api/company/company/${companyId}/job/${jobId}/shortlist/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.accessToken}`,
          },
          body: JSON.stringify({ candidate_id: candidateId }),
        }
      );

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { message: `Server error: ${response.statusText || 'Unknown error'}` };
        }
        throw new Error(`Failed to shortlist candidate: ${response.status} - ${errorData.message || 'Unknown error'}`);
      }

      toast.success('Candidate shortlisted successfully!');
      setApplications((prev) =>
        prev.map((app) =>
          app.user_id === candidateId ? { ...app, isShortlisted: true } : app
        )
      );
      router.push(`/companies/${companyId}/jobs/${jobId}/shortlist`);
    } catch (err) {
      console.error('Shortlist error:', err);
      toast.error(err.message || 'Failed to shortlist candidate.');
    }
  };

  const handleEndorse = (candidateId) => {
    if (!session?.accessToken) {
      toast.error('Unauthorized: No access token available');
      return;
    }
    router.push(`/companies/candidate/${candidateId}/endorsements`);
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
        <div className="text-center text-red-600">Please log in to view applications.</div>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 overflow-x-auto">
        <ApplicationHeader
          companyId={companyId}
          activeTab={activeTab}
          setActiveTab={handleTabChange} // Use handleTabChange for consistency
        />
        <div className="flex gap-6">
          <div className="hidden md:block w-64 flex-shrink-0">
            <Sideba
              activeTab={activeTab} // Use activeTab state
              setActiveTab={handleTabChange} // Use handleTabChange for consistency
              companyId={companyId}
            />
          </div>
          <main className="flex-1">
            <ApplicationFetch
              companyId={companyId}
              jobId={jobId}
              session={session}
              status={status}
              setApplications={setApplications}
              setLoading={setLoading}
              setError={setError}
            />
            <ApplicationList
              applications={applications}
              loading={loading}
              error={error}
              activeTab={activeTab}
              handleTabChange={handleTabChange}
              handleViewDetails={handleViewDetails}
              handleShortlist={handleShortlist}
              handleSchedule={handleSchedule}
              handleEndorse={handleEndorse}
              companyId={companyId}
              jobId={jobId}
              type={type}
            />
          </main>
        </div>
      </div>
      <CandidateModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCandidate(null);
        }}
        candidate={selectedCandidate}
        type={type}
      />
      <InterviewModal
        isOpen={isInterviewModalOpen}
        onClose={() => {
          setIsInterviewModalOpen(false);
          setSelectedCandidate(null);
        }}
        candidate={selectedCandidate}
        companyId={companyId}
        jobId={jobId}
        accessToken={session?.accessToken}
      />
    </motion.div>
  );
};

export default ApplicantComponent;