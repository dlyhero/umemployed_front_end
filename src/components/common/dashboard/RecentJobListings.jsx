import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';

const RecentJobListings = ({ jobs }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {jobs.map((job) => (
      <motion.div
        key={job.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-4 rounded-lg shadow"
      >
        <h3 className="text-lg font-semibold">{job.title}</h3>
        <p className="text-gray-600">{job.location}</p>
        <div className="flex items-center mt-2">
          <Briefcase className="w-4 h-4 mr-2 text-blue-500" />
          <span>{job.applications} applications</span>
        </div>
      </motion.div>
    ))}
  </div>
);

export default RecentJobListings;