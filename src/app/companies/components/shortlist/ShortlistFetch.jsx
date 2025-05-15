'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';

const ShortlistFetch = ({
  companyId,
  jobId,
  session,
  status,
  setShortlisted,
  setLoading,
  setError,
  setHasFetched,
}) => {
  const baseUrl = 'https://umemployed-app-afec951f7ec7.herokuapp.com';

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
        const apiUrl = `${baseUrl}/api/company/company/${companyId}/job/${jobId}/shortlisted/`;
        const response = await fetch(apiUrl, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.accessToken}`,
          },
        });

        if (!response.ok) {
          let errorData;
          try {
            errorData = await response.json();
          } catch {
            errorData = { message: `Server error: ${response.statusText || 'Unknown error'}` };
          }
          throw new Error(`Failed to fetch shortlisted candidates: ${response.status} - ${errorData.message || 'Unknown error'}`);
        }

        const data = await response.json();
        console.log('Shortlist API Response:', data);

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
                isShortlisted: true,
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
              console.warn(`Error processing profile for user ID ${app.candidate_id}: ${err.message}`);
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
        setHasFetched(true);
      } catch (err) {
        console.error('Fetch shortlist error:', err);
        setError(err.message || 'Unable to load shortlisted candidates due to a server error.');
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
  }, [companyId, jobId, session?.accessToken, status, setShortlisted, setLoading, setError, setHasFetched]);

  return null;
};

export default ShortlistFetch;