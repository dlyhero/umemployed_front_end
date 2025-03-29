import { motion } from 'framer-motion';
import { BarChart } from 'lucide-react';

const AnalyticsOverview = ({ metrics }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-white p-6 rounded-lg shadow"
  >
    <h2 className="text-xl font-semibold mb-4">Analytics Overview</h2>
    <div className="grid grid-cols-2 gap-4">
      <div className="text-center">
        <p className="text-2xl font-bold">{metrics.activeJobs}</p>
        <p className="text-gray-600">Active Jobs</p>
      </div>
      <div className="text-center">
        <p className="text-2xl font-bold">{metrics.totalApplications}</p>
        <p className="text-gray-600">Total Applications</p>
      </div>
    </div>
  </motion.div>
);

export default AnalyticsOverview;