// src/app/companies/[companyId]/jobs/listing/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Menu, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { fetchCompanyJobs } from '../../../../api/companies/job_listing';
import { JobListContainer } from './components/JobListContainer';
import { MobileMenu } from '../../dashboard/MobileMenu';
import { Sideba } from '../../dashboard/recruiter/Sideba';
import { MobileSearch } from './components/MobileSearch';
import { JobHeader } from './components/JobHeader';

export default function CompanyJobsListing() {
  const { companyId } = useParams();
  const { data: session, status } = useSession();
  const [jobs, setJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [jobTypeFilters, setJobTypeFilters] = useState([]);
  const [salaryFilters, setSalaryFilters] = useState([]);
  const [locationFilter, setLocationFilter] = useState('');
  const [keywordFilter, setKeywordFilter] = useState('');
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [activeTab, setActiveTab] = useState(`/companies/${companyId}/jobs/listing`);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getJobs() {
      if (status === 'loading' || !session) {
        return; // Wait for session
      }

      if (!session.accessToken) {
        setError('Unauthorized: No access token available');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetchCompanyJobs(companyId, session.accessToken);
        setJobs(response);
        setFilteredJobs(response);
      } catch (error) {
        console.error('Error fetching company jobs:', error);
        setError(error.message || 'Failed to load job listings. Please try again.');
        toast.error(error.message || 'Failed to load job listings.');
      } finally {
        setIsLoading(false);
      }
    }

    if (companyId && status === 'authenticated') {
      getJobs();
    }
  }, [companyId, session, status]);

  useEffect(() => {
    let result = [...jobs];

    if (searchQuery) {
      result = result.filter(
        (job) =>
          job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.location?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (jobTypeFilters.length > 0) {
      result = result.filter((job) => jobTypeFilters.includes(job.job_type));
    }

    if (salaryFilters.length > 0) {
      result = result.filter((job) => salaryFilters.includes(job.salary_range));
    }

    if (locationFilter) {
      result = result.filter((job) =>
        job.location?.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    if (keywordFilter) {
      result = result.filter(
        (job) =>
          job.description?.toLowerCase().includes(keywordFilter.toLowerCase()) ||
          job.title?.toLowerCase().includes(keywordFilter.toLowerCase())
      );
    }

    setFilteredJobs(result);
  }, [searchQuery, jobTypeFilters, salaryFilters, locationFilter, keywordFilter, jobs]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-red-600">Please log in to view job listings.</div>
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
        {/* Mobile Header */}
        <header className="flex justify-between items-center md:hidden mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Available Jobs</h1>
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
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          companyId={companyId}
        />

        {/* Mobile Search */}
        <div className="md:hidden mb-6">
          <MobileSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </div>

        <div className="flex gap-6">
          {/* Sidebar (Desktop, Scrolls with Content) */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <Sideba activeTab={activeTab} setActiveTab={setActiveTab} companyId={companyId} />
          </div>

          {/* Main Content */}
          <main className="flex-1">
            {/* Desktop Header */}
            <div className="hidden md:block mb-6">
              <JobHeader />
            </div>

            {/* Job List */}
            {isLoading ? (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto" />
                <p className="text-gray-600 mt-2">Loading jobs...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-600">{error}</div>
            ) : (
              <JobListContainer jobs={filteredJobs} companyId={companyId} />
            )}
          </main>
        </div>
      </div>
    </motion.div>
  );
}