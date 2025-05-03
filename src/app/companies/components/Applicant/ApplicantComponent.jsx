'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Menu, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import CandidateCard from './CandidateCard';
import CandidateModal from './CandidateModal';
import CandidateTabs from './CandidateTabs';
import { TabsContent } from '@/components/ui/tabs';
import { MobileMenu } from '../../[companyId]/dashboard/MobileMenu';
import { Sideba } from '../../[companyId]/dashboard/recruiter/Sideba';
import { MobileSearch } from '../../[companyId]/jobs/listing/components/MobileSearch';

const ApplicantComponent = ({ type = 'job' }) => {
  const { companyId, jobId } = useParams();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('candidates');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const baseUrl = 'https://umemployed-app-afec951f7ec7.herokuapp.com';

  const handleTabChange = (tab) => {
    if (tab === 'shortlist') {
      router.push(`/companies/${companyId}/jobs/${jobId}/shortlist`);
    } else if (tab === 'archived') {
      router.push(`/companies/${companyId}/jobs/${jobId}/archived`);
    } else {
      setActiveTab(tab);
    }
  };

  // Fetch applications
  useEffect(() => {
    const fetchApplications = async () => {
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
        const apiUrl = `${baseUrl}/api/company/company/${companyId}/job/${jobId}/applications/`;

        const response = await fetch(apiUrl, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch applications: ${response.status}`);
        }

        const data = await response.json();
        console.log('Applications API Response:', data);

        const topCandidates = Array.isArray(data.top_5_candidates) ? data.top_5_candidates : [];
        const waitingList = Array.isArray(data.waiting_list_candidates) ? data.waiting_list_candidates : [];
        const applicationsArray = [...topCandidates, ...waitingList];

        if (applicationsArray.length === 0) {
          setError('No applications found.');
          setLoading(false);
          return;
        }

        const applicationsWithProfiles = await Promise.all(
          applicationsArray.map(async (app) => {
            try {
              const userProfileResponse = await fetch(
                `${baseUrl}/api/resume/user-profile/${app.user_id}/`,
                {
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.accessToken}`,
                  },
                }
              );
              if (!userProfileResponse.ok) {
                console.warn(`Failed to fetch profile for user ID ${app.user_id}: ${userProfileResponse.status}`);
                return null;
              }
              const userProfile = await userProfileResponse.json();
              return {
                id: app.application_id,
                user_id: app.user_id,
                job: { title: 'Unknown' },
                matchingPercentage: app.overall_match_percentage || 0,
                quizScore: app.quiz_score || 0,
                status: app.status,
                isShortlisted: false, // Shortlist status handled on shortlist page
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
                    email: userProfile.contact_info?.email || app.user || 'Unknown',
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
              console.warn(`Error fetching profile for user ID ${app.user_id}: ${err.message}`);
              return null;
            }
          })
        );

        const validApplications = applicationsWithProfiles.filter((app) => app !== null);
        setApplications(validApplications);

        if (validApplications.length === 0) {
          setError('No valid applications found.');
        } else {
          setError(null);
        }
      } catch (err) {
        console.error('Fetch applications error:', err);
        setError('Unable to load applications due to a server error.');
        toast.error(err.message || 'Failed to load applications.');
      } finally {
        setLoading(false);
      }
    };

    if (companyId && jobId && status === 'authenticated') {
      fetchApplications();
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

  const handleShortlist = async (candidateId) => {
    if (!session.accessToken) {
      toast.error('Unauthorized: No access token available');
      return;
    }

    try {
      const response = await fetch(
        `${baseUrl}/api/company/company/${companyId}/job/${jobId}/shortlist/`,
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

  const topCandidates = applications.slice(0, 5);
  const waitingList = applications.slice(5);

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
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <header className="flex justify-between items-center md:hidden mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Job Applications</h1>
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
          activeTab={`/companies/${companyId}/applications`}
          setActiveTab={setActiveTab}
          companyId={companyId}
        />
        <div className="md:hidden mb-6">
          <MobileSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} disabled />
        </div>
        <div className="flex gap-6">
          <div className="hidden md:block w-64 flex-shrink-0">
            <Sideba
              activeTab={`/companies/${companyId}/applications`}
              setActiveTab={setActiveTab}
              companyId={companyId}
            />
          </div>
          <main className="flex-1">
            <div className="hidden md:block mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Job Applications</h1>
            </div>
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
          </main>
        </div>
      </div>
      <CandidateModal
        isOpen={isModalOpen}
        onClose={closeModal}
        candidate={selectedCandidate}
        type={type}
      />
    </motion.div>
  );
};

export default ApplicantComponent;