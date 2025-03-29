import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import QuickActions from './QuickActions';
import Tips from './Tips';
import PostJob from './PostJob';
import CandidateApplications from './CandidateApplications';
import AnalyticsOverview from './AnalyticsOverview';
import RecentJobListings from './RecentJobListings';

const Dashboard = ({ companyId, companyData }) => {
  // Mock tips since API might not provide them
  const mockTips = [
    { title: 'Tip 1', content: 'Optimize your job postings.' },
    { title: 'Tip 2', content: 'Respond to candidates quickly.' },
    { title: 'Tip 2', content: 'Respond to candidates quickly.' },

    { title: 'Tip 2', content: 'Respond to candidates quickly.' },
    { title: 'Tip 2', content: 'Respond to candidates quickly.' },
    { title: 'Tip 2', content: 'Respond to candidates quickly.' },
    { title: 'Tip 2', content: 'Respond to candidates quickly.' },
    { title: 'Tip 2', content: 'Respond to candidates quickly.' },
    { title: 'Tip 2', content: 'Respond to candidates quickly.' },
    { title: 'Tip 2', content: 'Respond to candidates quickly.' },
    { title: 'Tip 2', content: 'Respond to candidates quickly.' },
    { title: 'Tip 2', content: 'Respond to candidates quickly.' },
    { title: 'Tip 2', content: 'Respond to candidates quickly.' },
    { title: 'Tip 2', content: 'Respond to candidates quickly.' },

  ];

  // Mock job listings from job_openings string
  const mockJobs = companyData.job_openings
    ? companyData.job_openings.split(',').map((title, index) => ({
        id: index + 1,
        title: title.trim(),
        location: companyData.location || 'Unknown',
        applications: Math.floor(Math.random() * 10), // Mock data
      }))
    : [];

  return (
    <div className="flex flex-col lg:flex-row container mx-auto py-6 space-y-6 lg:space-x-4">
      <Sidebar companyId={companyId} />
      <main className="flex-1 space-y-6">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="text-3xl font-bold"
        >
          Hello, {companyData.name}!
        </motion.h2>
        <QuickActions companyId={companyId} />
        <Tips tips={mockTips} />
        <PostJob companyId={companyId} />
        <CandidateApplications applicationCount={mockJobs.length} />
        <AnalyticsOverview metrics={{ activeJobs: mockJobs.length, totalApplications: mockJobs.reduce((sum, job) => sum + job.applications, 0) }} />
        <RecentJobListings jobs={mockJobs} />
      </main>
    </div>
  );
};

export default Dashboard;