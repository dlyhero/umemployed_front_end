'use client';

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Bookmark, MapPin, Clock, Briefcase } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";
import { Suitcase } from "@phosphor-icons/react";
import useUser from "@/src/hooks/useUser";

const JobCard = ({ job, onToggleSave, loading }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const user = useUser();

  const isRecruiter = (session?.user?.role === 'recruiter' && user?.user.has_company)  && user.user?.company_id === company.id;



  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return `${interval} year${interval === 1 ? '' : 's'} ago`;

    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return `${interval} month${interval === 1 ? '' : 's'} ago`;

    interval = Math.floor(seconds / 604800);
    if (interval >= 1) return `${interval} week${interval === 1 ? '' : 's'} ago`;

    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return `${interval} day${interval === 1 ? '' : 's'} ago`;

    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return `${interval} hour${interval === 1 ? '' : 's'} ago`;

    interval = Math.floor(seconds / 60);
    if (interval >= 1) return `${interval} minute${interval === 1 ? '' : 's'} ago`;

    return 'Just now';
  };

  const formatSalary = (salaryRange) => {
    if (!salaryRange || typeof salaryRange !== 'string') return 'N/A';

    if (salaryRange.includes('$')) {
      return salaryRange.split('/')[0];
    }

    if (!salaryRange.includes('-')) return salaryRange;

    const [minStr, maxStr] = salaryRange.split('-');
    const min = parseInt(minStr);
    const max = maxStr ? parseInt(maxStr) : null;

    if (isNaN(min)) return 'N/A';

    const format = (value) => {
      if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
      if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
      return value.toLocaleString();
    };

    return max && !isNaN(max) ? `${format(min)}-${format(max)}` : format(min);
  };

  const handleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleSave?.(job.id);
  };

  const handleViewJob = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isRecruiter) {
      router.push(`/companies/${job.company_id}/jobs/${job.id}/applications`);
    } else {
      router.push(`/jobs/${job.id}`);
    }
  };

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm h-full flex flex-col mx-2">
        <div className="flex justify-between items-start gap-2 mb-3">
          <div className="flex items-center gap-2 min-w-0">
            <Skeleton className="w-8 h-8 rounded-md" />
            <div className="min-w-0">
              <Skeleton className="w-28 h-4 mb-1" />
              <Skeleton className="w-20 h-3" />
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            <Skeleton className="w-20 h-5 rounded-md" />
            <Skeleton className="w-5 h-5 rounded-md" />
          </div>
        </div>

        <Skeleton className="w-full h-5 mb-2" />
        
        <div className="flex gap-2 mb-3">
          <Skeleton className="w-16 h-5 rounded-md" />
          <Skeleton className="w-12 h-5 rounded-md" />
        </div>

        <div className="flex-1 mb-2">
          <Skeleton className="w-full h-[3.6rem] rounded-md" />
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-gray-200">
          <Skeleton className="w-20 h-4" />
          <Skeleton className="w-[55%] h-8 rounded-md" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="bg-white border border-gray-200 rounded-xl p-4  h-full flex flex-col mx-2 cursor-pointer"
      onClick={handleViewJob}
    >
      <div className="flex justify-between items-start gap-2 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex-shrink-0 w-14 h-14 rounded-md bg-blue-100 flex items-center justify-center overflow-hidden">
            <Suitcase  className="w-10 h-10 text-brand"/>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{job.company?.name}</p>
            <div className="flex items-center text-xs text-gray-500">
              <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
              <span className="truncate">{job.location}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-sm font-medium  text-brand whitespace-nowrap">
            ${formatSalary(job.salary_range || job.formattedSalary)}/year
          </span>
          {!isRecruiter && (
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
          job.job_location_type?.toLowerCase() === 'remote' ? 'bg-green-100 text-brand ' : 
          job.job_location_type?.toLowerCase() === 'contract' ? 'bg-blue-50 text-brand' : 
          'text-brand'
        }`}>
          {job?.job_location_type || 'Full-Time'}
        </span>
      </div>

      <div className="flex-1 mb-2">
        {job?.description ? <p className="text-sm text-muted-foreground line-clamp-3 min-h-[3.6rem] my-auto">
          {job?.description}
        </p>: <p className="text-sm text-muted-foreground line-clamp-3 min-h-[3.6rem] my-auto flex justify-center items-center">No description</p>}
      </div>

      <div className="flex justify-between items-center pt-2 border-t border-gray-200">
        <div className="flex items-center text-xs text-gray-500">
          <Clock className="w-3 h-3 mr-1" />
          {formatRelativeTime(job?.created_at)}
        </div>

        {(session && session.user.role !== 'recruiter') && (
          <Button 
            size="xl" 
            className="h-8 px-3 text-sm bg-brand text-white hover:bg-brand/70 w-[55%]"
            onClick={handleViewJob}
            disabled={!isRecruiter && job.is_applied}
          >
            {isRecruiter ? 'Candidates' : job.is_applied ? 'Applied' : 'Apply'}
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default JobCard;