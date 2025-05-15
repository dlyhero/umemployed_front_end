'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import QuickActions from './QuickActions';
import { RecruiterTips } from './RecruiterTips';
import PostJob from './PostJob';
import CandidateApplications from './CandidateApplications';
import AnalyticsOverview from './AnalyticsOverview';
import RecentJobListings from './RecentJobListings';
import { WelcomeSection } from './recruiter/WelcomeSection';
import { Sideba } from './recruiter/Sideba';
import { MobileMenu } from './MobileMenu';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { useSession } from 'next-auth/react';

const BASE_URL = 'https://umemployed-app-afec951f7ec7.herokuapp.com/api';

const Dashboard = ({ companyId, companyData }) => {
  const [activeTab, setActiveTab] = useState(`/companies/${companyId}/dashboard`);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [jobData, setJobData] = useState([]);
  const [applicationData, setApplicationData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: session } = useSession();

  // Mock tips (unchanged)
  const mockTips = [
    { title: 'Tip 1', content: 'Optimize your job postings.' },
    { title: 'Tip 2', content: 'Respond to candidates quickly.' },
    { title: 'Tip 3', content: 'Use clear job descriptions.' },
    { title: 'Tip 4', content: 'Provide feedback to candidates.' },
    { title: 'Tip 5', content: 'Engage with top talent early.' },
  ];

  // Fetch job and application data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (!session?.accessToken) throw new Error('Not authenticated');
        const headers = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.accessToken}`,
        };

        // Fetch jobs
        const jobsResponse = await fetch(`${BASE_URL}/company/company/${companyId}/jobs/`, {
          headers,
        });
        if (!jobsResponse.ok) throw new Error('Failed to fetch jobs');
        const jobs = await jobsResponse.json();

        // Fetch applications
        const applicationsResponse = await fetch(
          `${BASE_URL}/company/company/${companyId}/applications/`,
          { headers }
        );
        if (!applicationsResponse.ok) throw new Error('Failed to fetch applications');
        const applications = await applicationsResponse.json();

        setJobData(jobs);
        setApplicationData(applications);
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (session?.accessToken) {
      fetchData();
    }
  }, [companyId, session]);

  // Calculate metrics for AnalyticsOverview
  const metrics = {
    activeJobs: jobData.length,
    totalApplications: jobData.reduce((sum, job) => sum + (job.application_count || 0), 0),
  };

  // Calculate application count for CandidateApplications
  const applicationCount = applicationData.length;

  if (loading) {
    return <div className="text-center p-6">Loading...</div>;
  }

  if (error) {
    return <div className="text-center p-6 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 flex gap-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <Sideba activeTab={activeTab} setActiveTab={setActiveTab} companyId={companyId} />
      <div className="flex-1">
        <header className="flex justify-between items-center md:hidden mb-6">
          <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
          <Button
            variant="ghost"
            className="p-2 text-gray-900"
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
        <main className="space-y-6">
          <WelcomeSection companyName={companyData?.name || 'Company'} />
          <QuickActions companyId={companyId} />
          <RecruiterTips tips={mockTips} />
          <PostJob companyId={companyId} />
          <CandidateApplications applicationCount={applicationCount} companyId={companyId} />
          <AnalyticsOverview metrics={metrics} />
          <section className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-6">Recent Job Listings</h2>
            <RecentJobListings jobs={jobData} companyData={companyData} />
          </section>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;