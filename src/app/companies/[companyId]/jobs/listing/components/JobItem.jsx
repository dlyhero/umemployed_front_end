'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MoreVertical } from 'lucide-react';
import Link from 'next/link';

export const JobItem = ({ job, companyId }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="bg-white rounded-md border border-gray-200 p-6 hover:shadow-md transition-all relative">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <Link href={`/companies/${companyId}/jobs/${job.id}/applications`}>
            <h4 className="text-lg font-medium text-gray-900 hover:text-[#1e40af] transition-colors">
              {job.title}
            </h4>
          </Link>
          <p className="text-sm text-gray-500 mt-1">
            Posted {new Date(job.created_at).toLocaleDateString()}
          </p>
          <div className="flex gap-2 mt-3">
            <span className="text-xs bg-[#15803d]/10 text-[#15803d] px-2.5 py-1 rounded-full font-medium">
              {job.job_type}
            </span>
            <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium">
              {job.job_location_type}
            </span>
          </div>
        </div>
        <Button
          variant="ghost"
          className="text-gray-500 hover:text-[#1e40af] p-2"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <MoreVertical className="w-5 h-5" />
        </Button>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <div className="flex gap-6 text-sm">
          <div>
            <span className="text-[#1e40af] font-medium">{job.application_count || 0}</span> Proposals
          </div>
          <div>
            <span className="text-[#1e40af] font-medium">{job.hired_count || 0}</span> Hired
          </div>
          <div>
            <span className="text-[#1e40af] font-medium">{job.hire_number}</span> Openings
          </div>
        </div>
        <Link
          href={`/companies/${companyId}/jobs/${job.id}/applications`}
          className="inline-flex items-center px-4 py-1.5 text-sm font-medium text-[#1e40af] border border-[#1e40af] rounded-md hover:bg-[#1e40af] hover:text-white transition-colors"
        >
          View Proposals
        </Link>
      </div>
      {menuOpen && (
        <div className="absolute right-4 top-14 w-48 bg-white border border-gray-200 shadow-lg rounded-md z-10">
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
                onClick={() => alert('Feature not implemented')}
              >
                Invite Freelancer
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="block px-4 py-2 hover:bg-gray-50"
                onClick={() => alert('Feature not implemented')}
              >
                Edit Posting
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="block px-4 py-2 hover:bg-gray-50 text-red-600"
                onClick={() => alert('Feature not implemented')}
              >
                Delete Posting
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};