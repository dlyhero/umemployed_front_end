// src/app/companies/[companyId]/jobs/listing/components/JobItem.jsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { MoreVertical, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export const JobItem = ({ job, companyId }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const handleViewProposals = () => {
    router.push(`/companies/${companyId}/jobs/${job.id}/applications`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-xl p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all border border-gray-100"
    >
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <h4
            className="text-lg font-semibold text-gray-800 hover:text-blue-500 transition-colors cursor-pointer"
            onClick={handleViewProposals}
          >
            {job.title || 'Untitled Job'}
          </h4>
          <p className="text-sm text-gray-500 mt-1">
            Posted {job.created_at ? new Date(job.created_at).toLocaleDateString() : 'Unknown'}
          </p>
          <div className="flex gap-2 mt-3">
            {job.job_type && (
              <span className="inline-flex items-center px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                {job.job_type}
              </span>
            )}
            {job.job_location_type && (
              <span className="inline-flex items-center px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full">
                {job.job_location_type}
              </span>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          className="text-gray-500 hover:text-blue-500 hover:bg-gray-100 p-2 rounded-full"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <MoreVertical className="w-5 h-5" />
        </Button>
      </div>
      <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
          <div>
            <span className="text-blue-500 font-semibold">{job.application_count || 0}</span>{' '}
            Proposals
          </div>
          <div className="hidden sm:block w-px h-6 bg-gray-300" />
          <div>
            <span className="text-blue-500 font-semibold">{job.hired_count || 0}</span> Hired
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full sm:w-auto text-blue-500 border-blue-500 hover:bg-blue-50 flex items-center gap-2 text-sm font-semibold"
          onClick={handleViewProposals}
        >
          View Proposals <ArrowRight size={16} />
        </Button>
      </div>
      {menuOpen && (
        <div className="absolute right-4 top-16 w-48 bg-white border border-gray-100 shadow-lg rounded-md z-20">
          <ul className="py-1 text-sm text-gray-700">
            <li>
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-50"
                onClick={handleViewProposals}
              >
                View Proposals
              </button>
            </li>
            <li>
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-50"
                onClick={() => toast.error('This feature is not yet implemented.')}
              >
                Invite Freelancer
              </button>
            </li>
            <li>
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-50"
                onClick={() => toast.error('This feature is not yet implemented.')}
              >
                Edit Posting
              </button>
            </li>
            <li>
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-red-600"
                onClick={() => toast.error('This feature is not yet implemented.')}
              >
                Delete Posting
              </button>
            </li>
          </ul>
        </div>
      )}
    </motion.div>
  );
};