'use client';
import { useState } from 'react';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Bookmark, MapPin, DollarSign, Clock, Briefcase, CheckCircle } from "lucide-react";

const JobCard = ({ job, onToggleSave, onApplyJob }) => {
  const [isSaved, setIsSaved] = useState(job.is_saved || false);
  const [isApplied, setIsApplied] = useState(job.is_applied || false);

  const handleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const newSavedState = !isSaved;
    setIsSaved(newSavedState);
    if (onToggleSave) onToggleSave(job.id, newSavedState);
  };

  const handleApply = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isApplied) {
      setIsApplied(true);
      if (onApplyJob) onApplyJob(job.id);
    }
  };

  return (
    <motion.div
      className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col mx-2"
    >
      <div className="flex justify-between items-start gap-2 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex-shrink-0 w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center">
            {job.company.logo ? (
              <img 
                src={job.company.logo} 
                alt={job.company.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.parentElement.innerHTML = `
                    <div class="flex items-center justify-center w-full h-full">
                      <Briefcase className="w-4 h-4 text-gray-600" />
                    </div>
                  `;
                }}
              />
            ) : (
              <Briefcase className="w-4 h-4 text-gray-600" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{job.company.name}</p>
            <div className="flex items-center text-xs text-gray-500">
              <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
              <span className="truncate">{job.location}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-sm font-medium bg-blue-100 text-brand whitespace-nowrap">
            ${job.salary_range}
          </span>
          <button 
            onClick={handleSave}
            className={`p-1 rounded-md cursor-pointer ${job.is_saved ? 'text-brand' : 'text-muted-foreground'}`}
          >
            <Bookmark className={`w-4 h-4 ${job.is_saved ? 'fill-brand' : ''}`} />
          </button>
        </div>
      </div>

      <h3 className="text-base font-semibold text-gray-900 line-clamp-2 mb-2">
        {job.title}
      </h3>

      <div className="flex flex-wrap gap-1.5 mb-3">
        <span className={`text-xs px-2 py-1 rounded-md ${
          job.job_location_type?.toLowerCase() === 'remote' ? 'bg-green-100 text-green-800' : 
          job.job_location_type?.toLowerCase() === 'contract' ? 'bg-blue-50 text-brand' : 
          'bg-gray-200 text-gray-800'
        }`}>
          {job.job_location_type || 'Full-Time'}
        </span>
      </div>

      {!job.description ? <p className="h-16 mb-2 flex items-center justify-center text-sm text-muted-foreground">            {job.description || "no description"}
      </p> : (
        <div className="flex-1 mb-2">
          <p className="text-sm text-muted-foreground h-16 line-clamp-3 my-auto">
            {job.description}
          </p>
        </div>
      )}

      <div className="flex justify-between items-center pt-2 border-t border-gray-200">
        <div className="flex items-center text-xs text-gray-500">
          <Clock className="w-3 h-3 mr-1" />
          {job.created_at}
        </div>
        {isApplied ? (
          <Button 
            size="sm" 
            variant="outline" 
            className="h-8 px-3 text-sm"
            disabled
          >
            <CheckCircle className="w-4 h-4 mr-1" />
            Applied
          </Button>
        ) : (
          <Button 
            size="sm" 
            className="h-8 px-3 text-sm bg-brand text-white hover:bg-brand/70 w-[45%]"
            onClick={handleApply}
          >
            Apply Now
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default JobCard;