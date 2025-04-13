// src/app/companies/[companyId]/jobs/listing/components/JobItem.jsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MoreVertical, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Link from 'next/link';

export const JobItem = ({ job, companyId }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-xl p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all border border-gray-100"
    >
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <Link href={`/companies/${companyId}/jobs/${job.id}/applications`}>
            <h4 className="text-lg font-semibold text-gray-800 hover:text-blue-500 transition-colors">
              {job.title || 'Untitled Job'}
            </h4>
          </Link>
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
          asChild
          variant="outline"
          className="w-full sm:w-auto text-blue-500 border-blue-500 hover:bg-blue-50 flex items-center gap-2 text-sm font-semibold"
        >
          <Link href={`/companies/${companyId}/jobs/${job.id}/applications`}>
            View Proposals <ArrowRight size={16} />
          </Link>
        </Button>
      </div>
      {menuOpen && (
        <div className="absolute right-4 top-16 w-48 bg-white border border-gray-100 shadow-lg rounded-md z-20">
          <ul className="py-1 text-sm text-gray-700">
            <li>
              <Link
                href={`/companies/${companyId}/jobs/${job.id}/applications`}
                className="block px-4 py-2 hover:bg-gray-50"
              >
                View Proposals
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="block px-4 py-2 hover:bg-gray-50"
                onClick={() => toast.error('This feature is not yet implemented.')}
              >
                Invite Freelancer
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="block px-4 py-2 hover:bg-gray-50"
                onClick={() => toast.error('This feature is not yet implemented.')}
              >
                Edit Posting
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="block px-4 py-2 hover:bg-gray-50 text-red-600"
                onClick={() => toast.error('This feature is not yet implemented.')}
              >
                Delete Posting
              </Link>
            </li>
          </ul>
        </div>
      )}
    </motion.div>
  );
};