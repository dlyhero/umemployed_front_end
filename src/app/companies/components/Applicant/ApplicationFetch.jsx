
'use client';

import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { toast } from 'react-hot-toast';
import baseUrl from '../../../api/baseUrl';

const ApplicationFetch = ({
  companyId,
  jobId,
  session,
  status,
  setApplications,
  setLoading,
  setError,
}) => {
  useEffect(() => {
    const fetchApplications = async () => {
      if (status === 'loading' || !session) {
        return;
      }

      if (!session.accessToken) {
        setError('Unauthorized: No access token available');
        setLoading(false);
        toast.error('Please sign in to view applications');
        return;
      }

      try {
        setLoading(true);

        // Fetch job details
        const jobResponse = await fetch(`${baseUrl}/job/jobs/${jobId}/`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.accessToken}`,
          },
        });

        let jobTitle = 'Unknown';
        if (jobResponse.ok) {
          const jobData = await jobResponse.json();
          jobTitle = jobData.title || 'Unknown';
        } else {
          console.warn('Failed to fetch job details:', jobResponse.status);
          toast.error('Failed to fetch job details');
        }

        // Fetch applications
        const apiUrl = `${baseUrl}/company/company/${companyId}/job/${jobId}/applications/`;
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
          toast.error('No applications found');
          return;
        }

        // Fetch shortlisted candidates
        const shortlistApiUrl = `${baseUrl}/company/company/${companyId}/job/${jobId}/shortlisted/`;
        const shortlistResponse = await fetch(shortlistApiUrl, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.accessToken}`,
          },
        });

        let shortlistedCandidates = [];
        if (shortlistResponse.ok) {
          const shortlistData = await shortlistResponse.json();
          shortlistedCandidates = Array.isArray(shortlistData) ? shortlistData : shortlistData.results || [];
        } else {
          console.warn('Failed to fetch shortlisted candidates:', shortlistResponse.status);
          toast.error('Failed to fetch shortlisted candidates');
        }

        const shortlistedIds = new Set(shortlistedCandidates.map((candidate) => candidate.candidate_id));

        const applicationsWithProfiles = await Promise.all(
          applicationsArray.map(async (app) => {
            try {
              const userProfileResponse = await fetch(
                `${baseUrl}/resume/user-profile/${app.user_id}/`,
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
                job: { title: jobTitle },
                matchingPercentage: app.overall_match_percentage * 100 || 0,
                quizScore: app.quiz_score || 0,
                status: app.status,
                isShortlisted: shortlistedIds.has(app.user_id),
                profile: {
                  firstName: userProfile.contact_info?.name?.split(' ')[0] || app.user || 'Unknown',
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
          toast.error('No valid applications found');
        } else {
          setError(null);
          toast.success('Applications loaded successfully');
        }
      } catch (err) {
        console.error('Fetch applications error:', err);
        setError('Unable to load applications due to a server error.');
        toast.error(err.message || 'Failed to load applications');
      } finally {
        setLoading(false);
      }
    };

    if (companyId && jobId && status === 'authenticated') {
      fetchApplications();
    }
  }, [companyId, jobId, session, status, setApplications, setLoading, setError]);

  return <Toaster />;
};

export default ApplicationFetch;
