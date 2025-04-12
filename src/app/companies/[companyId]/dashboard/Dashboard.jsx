'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
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

const Dashboard = ({ companyId, companyData }) => {
  const [activeTab, setActiveTab] = useState(`/companies/${companyId}/dashboard`);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const mockTips = [
    { title: 'Tip 1', content: 'Optimize your job postings.' },
    { title: 'Tip 2', content: 'Respond to candidates quickly.' },
    { title: 'Tip 3', content: 'Use clear job descriptions.' },
    { title: 'Tip 4', content: 'Provide feedback to candidates.' },
    { title: 'Tip 5', content: 'Engage with top talent early.' },
  ];

  const mockJobs = companyData?.job_openings
    ? companyData.job_openings.split(',').map((title, index) => ({
        id: index + 1,
        title: title.trim(),
        location: companyData.location || 'Unknown',
        applications: Math.floor(Math.random() * 10),
      }))
    : [];

  return (
    <div className="max-w-6xl mx-auto p-6 flex gap-6">
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
          <WelcomeSection companyName={companyData?.name || "Eddy"} />
          <QuickActions companyId={companyId} />
          <RecruiterTips tips={mockTips} />
          <PostJob companyId={companyId} />
          <CandidateApplications applicationCount={mockJobs.length} />
          <AnalyticsOverview
            metrics={{
              activeJobs: mockJobs.length,
              totalApplications: mockJobs.reduce((sum, job) => sum + job.applications, 0),
            }}
          />
          <RecentJobListings jobs={mockJobs} />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;