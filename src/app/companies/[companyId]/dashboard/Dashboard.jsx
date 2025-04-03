"use client";

import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import QuickActions from './QuickActions';
import Tips from './Tips';
import PostJob from './PostJob';
import CandidateApplications from './CandidateApplications';
import AnalyticsOverview from './AnalyticsOverview';
import RecentJobListings from './RecentJobListings';

const Dashboard = ({ companyId, companyData }) => {
  const mockTips = [
    { title: 'Tip 1', content: 'Optimize your job postings. lkbsdlkfblbslkbksdbkjv jksd vkjbskjdbvkjsabdkjvkjbvkjbk' },
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
    <div className="flex flex-col lg:flex-row min-h-screen ">
      <Sidebar companyId={companyId} />
      <main className="flex-1 max-w-6xl justify-evenly   space-y-6 p-10 md:p-13 pt-5">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="text-3xl font-bold"
        >
          Hello, {companyData?.name || 'Eddy'}!
        </motion.h2>
        <QuickActions companyId={companyId} />
        <Tips tips={mockTips} />
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
  );
};

export default Dashboard;