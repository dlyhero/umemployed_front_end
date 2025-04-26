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
import CandidateTabs from '../Applicant/CandidateTabs';
import { TabsContent } from '@/components/ui/tabs';
import { MobileMenu } from '../../[companyId]/dashboard/MobileMenu';
import { Sideba } from '../../[companyId]/dashboard/recruiter/Sideba';

const ShortlistComponent = () => {
  const { companyId, jobId } = useParams();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('shortlist');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [shortlisted, setShortlisted] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const baseUrl = 'https://umemployed-app-afec951f7ec7.herokuapp.com';

  // Handle tab change with navigation
  const handleTabChange = (tab) => {
    if (tab === 'candidates') {
      router.push(`/companies/${companyId}/jobs/${jobId}/applications`);
    } else if (tab === 'archived') {
      router.push(`/companies/${companyId}/jobs/${jobId}/archived`);
    } else {
      setActiveTab(tab);
    }
  };

  // Fetch shortlisted candidates
  useEffect(() => {
    const fetchShortlisted = async () => {
      if (status === 'loading' || !session) {
        return;
      }

      if (!session.accessToken) {
        setError('Unauthorized: No access token available');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(
          `/api/companies/shortlist?companyId=${companyId}&jobId=${jobId}`,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session.accessToken}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch shortlisted candidates');
        }

        const shortlistedArray = Array.isArray(data) ? data : data.results || [];

        if (!Array.isArray(shortlistedArray)) {
          throw new Error('Invalid data format: Expected an array of shortlisted candidates.');
        }

        if (shortlistedArray.length === 0) {
          setError('No shortlisted candidates found.');
          setLoading(false);
          return;
        }

        const shortlistedWithProfiles = await Promise.all(
          shortlistedArray.map(async (app) => {
            try {
              const userProfileResponse = await fetch(
                `${baseUrl}/api/resume/user-profile/${app.candidate_id}/`,
                {
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.accessToken}`,
                  },
                }
              );
              if (!userProfileResponse.ok) {
                console.warn(`Failed to fetch profile for user ID ${app.candidate_id}: ${userProfileResponse.status}`);
                return null;
              }
              const userProfile = await userProfileResponse.json();
              return {
                id: app.id,
                user_id: app.candidate_id,
                job: { title: app.job_title || 'Unknown' },
                matchingPercentage: app.matching_percentage || 85,
                quizScore: app.quiz_score || 90,
                status: 'shortlisted',
                profile: {
                  firstName: userProfile.contact_info?.name?.split(' ')[0] || 'Unknown',
                  lastName: userProfile.contact_info?.name?.split(' ').slice(1).join(' ') || '',
                  location: userProfile.contact_info?.city
                    ? `${userProfile.contact_info.city}, ${userProfile.contact_info.country}`
                    : userProfile.contact_info?.country || 'Unknown',
                  jobTitle: userProfile.contact_info?.job_title_name || 'Unknown',
                  profileImage: userProfile.profile_image || 'https://umemployeds1.blob.core.windows.net/umemployedcont1/resume/images/default.jpg',
                  resumeLink: '#',
                  coverLetter: userProfile.description || 'No description provided',
                  skills: Array.isArray(userProfile.skills) ? userProfile.skills.map((skill) => skill.name || '') : [],
                  contacts: {
                    email: userProfile.contact_info?.email || 'Unknown',
                    phone: userProfile.contact_info?.phone || 'Unknown',
                  },
                  experiences: Array.isArray(userProfile.work_experience)
                    ? userProfile.work_experience.map((exp) => ({
                        title: exp.role || 'Unknown',
                        duration: `${exp.start_date || 'Unknown'} - ${exp.end_date || 'Present'}`,
                      }))
                    : [],
                  languages: Array.isArray(userProfile.languages) ? userProfile.languages.map((lang) => lang.name || '') : [],
                },
              };
            } catch (err) {
              console.warn(`Error fetching profile for user ID ${app.candidate_id}: ${err.message}`);
              return null;
            }
          })
        );

        const validShortlisted = shortlistedWithProfiles.filter((app) => app !== null);
        setShortlisted(validShortlisted);

        if (validShortlisted.length === 0) {
          setError('No valid user profiles found for shortlisted candidates.');
        } else {
          setError(null);
        }
      } catch (err) {
        console.error('Fetch shortlist error:', err);
        setError(err.message);
        toast.error(err.message || 'Failed to load shortlisted candidates.');
      } finally {
        setLoading(false);
      }
    };

    if (companyId && jobId && status === 'authenticated') {
      fetchShortlisted();
    } else {
      setLoading(false);
      setError('Invalid company or job ID');
    }
  }, [companyId, jobId, session, status]);

  const handleViewDetails = (candidate) => {
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

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <header className="flex justify-between items-center md:hidden mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Shortlisted Candidates</h1>
          <Button
            variant="ghost"
            className="p-2 text-gray-900 hover:bg-gray-100 rounded-full"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </Button>
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
            <CandidateTabs
              activeTab={activeTab}
              setActiveTab={handleTabChange}
              companyId={companyId}
              jobId={jobId}
            >
              <TabsContent value="shortlist">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold border-b-4 border-brand-500 w-fit">
                    Shortlisted Candidates
                  </h2>
                  {shortlisted.length > 0 ? (
                    shortlisted.map((app) => (
                      <CandidateCard
                        key={app.id}
                        candidate={app}
                        type="job"
                        handleViewDetails={handleViewDetails}
                        activeTab={activeTab}
                        isShortlisted
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
            {loading ? (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-brand-500 mx-auto" />
                <p className="text-gray-600 mt-2">Loading shortlisted candidates...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-600">{error}</div>
            ) : null}
          </main>
        </div>
      </div>
      <CandidateModal
        isOpen={isModalOpen}
        onClose={closeModal}
        candidate={selectedCandidate}
        type="job"
      />
    </motion.div>
  );
};

export default ShortlistComponent;