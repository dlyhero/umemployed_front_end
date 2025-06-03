'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import JobListingCard from './JobListingCard';
import { Skeleton } from '@/components/ui/skeleton';

const RecentJobListings = ({ companyData }) => {
  const { companyId } = useParams();
  const { data: session, status } = useSession();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Country code to name mapping (partial, expand as needed)
  const countryCodeToName = {
    'AS': 'American Samoa',
    // Add more mappings as needed, e.g.:
    // 'US': 'United States of America',
    // 'CA': 'Canada',
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        if (status === 'loading') {
          return; // Wait for session to load
        }
        if (status === 'unauthenticated') {
          throw new Error('Not authenticated. Please log in.');
        }

        const token = session?.accessToken; // Adjust if token is elsewhere
        if (!token) {
          throw new Error('No authentication token found.');
        }

        // Step 1: Fetch the list of job IDs and titles
        const response = await fetch(
          `https://umemployed-f6fdddfffmhjhjcj.canadacentral-01.azurewebsites.net/api/company/company/${companyId}/jobs`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Unauthorized: Invalid or expired token');
          }
          throw new Error('Failed to fetch jobs');
        }

        const jobList = await response.json();

        // Step 2: Fetch full details for each job
        const jobDetailsPromises = jobList.map(async (job) => {
          const jobResponse = await fetch(
            `https://umemployed-f6fdddfffmhjhjcj.canadacentral-01.azurewebsites.net/api/job/jobs/${job.id}/`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!jobResponse.ok) {
            console.warn(`Failed to fetch details for job ID ${job.id}`);
            return null; // Handle gracefully
          }

          const jobDetails = await jobResponse.json();
          return {
            ...jobDetails,
            company_id: companyId, // Add company_id for routing
            application_count: job.application_count, // Retain application_count
            location: countryCodeToName[jobDetails.location] || jobDetails.location, // Map country code to name
          };
        });

        const jobDetails = (await Promise.all(jobDetailsPromises)).filter(
          (job) => job !== null
        );

        // Step 3: Sort by created_at (descending) and take top 5
        const sortedJobs = jobDetails
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 5);

        setJobs(sortedJobs);
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [companyId, status, session]);

  if (loading || status === 'loading') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(5)].map((_, index) => (
          <Skeleton key={index} className="h-64 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  if (jobs.length === 0) {
    return <div className="text-gray-500 text-center">No recent jobs found.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {jobs.map((job) => (
        <JobListingCard
          key={job.id}
          job={job}
        />
      ))}
    </div>
  );
};

export default RecentJobListings;