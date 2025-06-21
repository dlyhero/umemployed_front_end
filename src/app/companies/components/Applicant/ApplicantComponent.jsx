'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
import baseUrl from '../../../api/baseUrl';

const ApplicantComponent = ({ type = 'job' }) => {
  const { companyId, jobId } = useParams();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('candidates');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    console.log('ApplicantComponent: Session status:', status, 'session:', session);
  }, [status, session]);

  const handleTabChange = (tab) => {
    console.log('handleTabChange: Switching to tab:', tab);
    setActiveTab(tab);
  };

  const handleViewDetails = (candidate) => {
    if (!candidate || !candidate.profile) {
      console.warn('handleViewDetails: Invalid candidate:', candidate);
      toast.error('Invalid candidate data.');
      return;
    }
    setSelectedCandidate(candidate);
    setIsModalOpen(true);
  };

  const handleSchedule = (candidateId) => {
    setActionLoading((prev) => ({ ...prev, [candidateId]: { ...prev[candidateId], schedule: true } }));
    const candidate = applications.find((app) => app.user_id === candidateId);
    if (candidate) {
      setSelectedCandidate(candidate);
      setIsInterviewModalOpen(true);
    } else {
      toast.error('Candidate not found.');
    }
    setActionLoading((prev) => ({ ...prev, [candidateId]: { ...prev[candidateId], schedule: false } }));
  };

  const handleShortlist = async (candidateId) => {
    if (!session?.accessToken) {
      toast.error('Unauthorized: Please sign in.');
      return;
    }

    setActionLoading((prev) => ({ ...prev, [candidateId]: { ...prev[candidateId], shortlist: true } }));
    try {
      const response = await fetch(
        `${baseUrl}/company/company/${companyId}/job/${jobId}/shortlist/`,
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
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to shortlist candidate.');
      }

      toast.success('Candidate shortlisted successfully!');
      setApplications((prev) =>
        prev.map((app) =>
          app.user_id === candidateId ? { ...app, isShortlisted: true } : app
        )
      );
    } catch (err) {
      console.error('handleShortlist: Error:', err);
      toast.error(err.message || 'Failed to shortlist candidate.');
    } finally {
      setActionLoading((prev) => ({ ...prev, [candidateId]: { ...prev[candidateId], shortlist: false } }));
    }
  };

  const handleUnshortlist = async (candidateId) => {
    if (!session?.accessToken) {
      toast.error('Unauthorized: Please sign in.');
      return;
    }

    setActionLoading((prev) => ({ ...prev, [candidateId]: { ...prev[candidateId], unshortlist: true } }));
    try {
      const response = await fetch(
        `${baseUrl}/company/company/${companyId}/job/${jobId}/unshortlist/`,
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
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to unshortlist candidate.');
      }

      toast.success('Candidate removed from shortlist successfully!');
      setApplications((prev) =>
        prev.map((app) =>
          app.user_id === candidateId ? { ...app, isShortlisted: false } : app
        )
      );
    } catch (err) {
      console.error('handleUnshortlist: Error:', err);
      toast.error(err.message || 'Failed to unshortlist candidate.');
    } finally {
      setActionLoading((prev) => ({ ...prev, [candidateId]: { ...prev[candidateId], unshortlist: false } }));
    }
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
          setActiveTab={setActiveTab}
        />
        <div className="flex gap-6">
          <div className="hidden md:block w-64 flex-shrink-0">
            <Sideba
              activeTab={`/companies/${companyId}/applications`}
              setActiveTab={setActiveTab}
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
              handleUnshortlist={handleUnshortlist}
              handleSchedule={handleSchedule}
              companyId={companyId}
              jobId={jobId}
              type={type}
              actionLoading={actionLoading}
            />
          </main>
        </div>
      </div>
      <CandidateModal
        isOpen={isModalOpen}
        onClose={() => {
          console.log('CandidateModal: Closed');
          setIsModalOpen(false);
          setSelectedCandidate(null);
        }}
        candidate={selectedCandidate}
        type={type}
      />
      <InterviewModal
        isOpen={isInterviewModalOpen}
        onClose={() => {
          console.log('InterviewModal: Closed');
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