'use client';

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Bookmark, MapPin, Clock } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";
import { CompanyLogo, formatRelativeTime, formatSalary } from "@/src/utils/jobFormater";

const JobCard = ({ job, onToggleSave, loading }) => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleSave?.(job.id);
  };

  const handleViewJob = (e) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/jobs/${job.id}`);
  };

  return (
    <div>
      <div className="item md:min-w-[400px] sm:min-w-[350px] min-w-[300px]">
        <motion.div className="relative bg-white border border-gray-200 rounded-xl p-4 cursor-pointer max-w-md mx-2">
          <div className="flex items-center justify-between">

            {/* Logo */}
            <a className="logo block mb-3" onClick={handleViewJob}>
              <div className="w-15 h-15 p-1 rounded-md bg-blue-100 flex items-center justify-center overflow-hidden m-auto">
                {CompanyLogo(job.company)}
              </div>
            </a>

            {session && (
              <button
                className={`absolute top-4 right-4 p-3 rounded-full hover:bg-gray-100 transition-colors border rounded-full cursor-pointer ${job.is_saved ? 'text-brand' : 'text-gray-400'
                  }`}
                title={job.is_saved ? 'Unsave Job' : 'Save Job'}
                onClick={handleSave}
              >
                <Bookmark
                  className={`w-5 h-5 ${job.is_saved ? 'fill-current' : ''}`}
                />
              </button>
            )}
          </div>

          {/* Job Duration */}
          <div className="mb-2">
            <a
              className={`job-duration block mb-1 cursor-pointer font-bold bg-gray-50 rounded-md px-2 py-1 w-fit border ${job?.job_location_type === 'remote'
                ? 'text-green-600'
                : job?.job_location_type === 'hybrid'
                  ? 'text-yellow-600'
                  : job?.job_location_type === 'onsite'
                    ? 'text-brand'
                    : job?.job_location_type === 'freelance'
                      ? 'text-purple-600'
                      : job?.job_location_type === 'internship'
                        ? 'text-blue-400'
                        : 'text-gray-600'
                }`}
              onClick={handleViewJob}
            >
              {job?.job_location_type.charAt(0).toUpperCase() + job?.job_location_type.slice(1).toLowerCase()
              }
            </a>
          </div>

          {/* Job Title */}
          <div className="mb-3 text-nowrap truncate  max-w-[300px]">
            <a className="title w-[100px]   text-lg font-semibold text-gray-900 hover:text-brand transition-colors duration-300 cursor-pointer" onClick={handleViewJob}>
              {job.title}
            </a>
          </div>

          {/* Job Salary */}
          <div className="job-salary mb-4">
            <span className="fw-500 text-dark font-semibold text-gray-900">
              ${formatSalary(job.salary_range || job.formattedSalary)}
            </span>
            <span className="text-gray-600"> / Monthly</span>
          </div>

          {/* Bottom Section - Location and Apply Button */}
          <div className="d-flex align-items-center justify-content-between mt-auto flex justify-between items-center">
            <div className="job-location">
              <a
                className="text-sm text-gray-600 hover:text-brand transition-colors duration-300 cursor-pointer"
                onClick={handleViewJob}
              >
                {job.company?.location}, {job.company?.country_name}
              </a>
            </div>

            {session && (
              <button
                disabled={job.is_applied}
                className={`apply-btn text-center tran3s ${job.is_applied ? "" : "bg-brand hover:bg-brand/90 text-white transition-all duration-300"} px-4 py-2 rounded-md text-sm font-medium    cursor-pointer`}
                onClick={handleViewJob}
              >
                {job.is_applied ? 'Applied' : 'Apply'}
              </button>
            )}
          </div>

        </motion.div>
      </div>
    </div>
  );
};

export default JobCard;