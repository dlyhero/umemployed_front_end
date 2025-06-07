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
    <motion.div
      className="bg-white border border-gray-200 rounded-xl p-4 h-full flex flex-col mx-2 cursor-pointer"
      onClick={handleViewJob}
    >
      <div className="flex justify-between items-start gap-2 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex-shrink-0 w-14 h-14 p-1 rounded-md bg-blue-100 flex items-center justify-center overflow-hidden">
            {CompanyLogo(job.company)}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{job.company?.name}</p>
            <div className="flex items-center text-xs text-gray-500">
              <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
              <span className="truncate">{job.company?.location}, {job.company?.country_name}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-sm font-medium text-brand whitespace-nowrap">
            ${formatSalary(job.salary_range || job.formattedSalary)}/year
          </span>
          {session && (
            <button 
              onClick={handleSave}
              className={`p-1 rounded-md cursor-pointer ${job.is_saved ? 'text-brand' : 'text-muted-foreground'}`}
            >
              <Bookmark className={`w-4 h-4 ${job.is_saved ? 'fill-brand' : ''}`} />
            </button>
          )}
        </div>
      </div>

      <h3 className="text-base font-semibold text-gray-900 line-clamp-2 mb-2">
        {job.title}
      </h3>

      <div className="flex flex-wrap gap-1.5 mb-3">
        <span className={`px-2 py-1 rounded-md text-sm ${
          job.job_location_type?.toLowerCase() === 'remote' ? 'text-brand' : 
          job.job_location_type?.toLowerCase() === 'contract' ? 'text-brand' : 
          'text-brand'
        }`}>
          {job?.job_location_type || 'Full-Time'}
        </span>
      </div>

      <div className="flex-1 mb-2">
        {job?.description ? <p className="text-sm text-muted-foreground line-clamp-3 min-h-[3.6rem] my-auto">
          {job?.description}
        </p> : <p className="text-sm text-muted-foreground line-clamp-3 min-h-[3.6rem] my-auto flex justify-center items-center">No description</p>}
      </div>

      <div className="flex justify-between items-center pt-2 border-t border-gray-200">
        <div className="flex items-center text-xs text-gray-500">
          <Clock className="w-3 h-3 mr-1" />
          {formatRelativeTime(job?.created_at)}
        </div>

        {session && (
          <Button 
            size="xl" 
            className="h-8 px-3 text-sm bg-brand text-white hover:bg-brand/70 w-[55%]"
            onClick={handleViewJob}
            disabled={job.is_applied}
          >
            {job.is_applied ? 'Applied' : 'Apply'}
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default JobCard;