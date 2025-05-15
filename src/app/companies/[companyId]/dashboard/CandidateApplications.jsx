'use client';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import { useRouter } from 'next/navigation';

const CandidateApplications = ({ applicationCount, companyId }) => {
  const router = useRouter();

  const handleViewApplications = () => {
    router.push(`/companies/${companyId}/applications`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-6 rounded-lg shadow"
    >
      <h2 className="text-xl font-semibold mb-2">Candidate Applications</h2>
      <p className="text-gray-600 mb-4">
        You have{' '}
        <span className="font-bold">
          {applicationCount !== undefined ? applicationCount : '0'}
        </span>{' '}
        new applications.
      </p>
      <button
        onClick={handleViewApplications}
        className="bg-brand/600 text-white px-4 py-2 rounded-full hover:bg-brand/700"
      >
        View Applications
      </button>
    </motion.div>
  );
};

export default CandidateApplications;