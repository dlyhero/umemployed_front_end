import { motion } from 'framer-motion';
import { BarChart as LucideBarChart } from 'lucide-react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const AnalyticsOverview = ({ metrics }) => {
  const data = [
    { name: 'Active Jobs', value: metrics.activeJobs },
    { name: 'Applications', value: metrics.totalApplications },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-6 rounded-lg shadow"
    >
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <LucideBarChart className="w-5 h-5 mr-2" />
        Analytics Overview
      </h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center">
          <p className="text-2xl font-bold">{metrics.activeJobs}</p>
          <p className="text-gray-600">Active Jobs</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold">{metrics.totalApplications}</p>
          <p className="text-gray-600">Total Applications</p>
        </div>
      </div>
      {/* <div className="flex justify-center">
        <RechartsBarChart width={300} height={200} data={data} className="bg-gray-50 p-4 rounded">
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#1e90ff" /> 
        </RechartsBarChart>
      </div> */}
    </motion.div>
  );
};

export default AnalyticsOverview;