'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import JobCard from '../../../jobs/_components/JobCard';
import { Skeleton } from '@/components/ui/skeleton';

const RecentJobListings = ({ companyData }) => {
  const { companyId } = useParams();
  const { data: session, status } = useSession();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        if (status === 'loading') {
          return; // Wait for session to load
        }
        if (status === 'unauthenticated') {
          throw new Error('Not authenticated. Please log in.');
        }

        const token = session?.accessToken; // Adjust if token is elsewhere (e.g., session.user.token)
        if (!token) {
          throw new Error('No authentication token found.');
        }

        const response = await fetch(
          `https://umemployed-app-afec951f7ec7.herokuapp.com/api/company/company/${companyId}/jobs`,
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

        const data = await response.json();
        setJobs(data.slice(0, 5));
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
        <JobCard
          key={job.id}
          job={{ ...job, company_id: companyId }}
          isRecruiter={true}
        />
      ))}
    </div>
  );
};

export default RecentJobListings;