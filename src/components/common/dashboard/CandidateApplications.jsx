import { motion } from 'framer-motion';
import { Users } from 'lucide-react';

const CandidateApplications = ({ applicationCount }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-white p-6 rounded-lg shadow"
  >
    <h2 className="text-xl font-semibold mb-2">Candidate Applications</h2>
    <p className="text-gray-600 mb-4">
      You have <span className="font-bold">{applicationCount}</span> new applications.
    </p>
    <a href="/recruiter/applications">
      <button className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600">
        View Applications
      </button>
    </a>
  </motion.div>
);

export default CandidateApplications;