import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';

const PostJob = ({ companyId }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
    className="bg-white p-6 rounded-lg shadow"
  >
    <h2 className="text-xl font-semibold mb-2">Post a New Job</h2>
    <p className="text-gray-600 mb-4">Reach thousands of candidates.</p>
    <a href={`/recruiter/company/${companyId}/post-job`}>
      <button className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600">
        Post a Job
      </button>
    </a>
  </motion.div>
);

export default PostJob;