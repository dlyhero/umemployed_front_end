// components/dashboard/Dashboard.jsx
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import QuickActions from './QuickActions';
import Tips from './Tips';
import PostJob from './PostJob';
import AnalyticsOverview from './AnalyticsOverview';
import RecentJobListings from './RecentJobListings';

const Dashboard = ({ companyId, dashboardData }) => {
  return (
    <div className="flex flex-col lg:flex-row container mx-auto py-6 space-y-6 lg:space-x-4">
      <Sidebar />
      <main className="flex-1 space-y-6">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="text-3xl font-bold"
        >
          Hello, {dashboardData.company.name}!
        </motion.h2>
        <QuickActions />
        <Tips tips={dashboardData.tips} />
        <PostJob />
        <CandidateApplications applicationCount={dashboardData.newApplications} />
        <AnalyticsOverview metrics={dashboardData.metrics} />
        <RecentJobListings jobs={dashboardData.recentJobs} />
      </main>
    </div>
  );
};

export default Dashboard;