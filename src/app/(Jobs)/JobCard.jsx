'use client';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Bookmark, Dot, MapPin, Clock, Briefcase } from "lucide-react";

const JobCard = ({ job, onToggleSave }) => {
  return (
    <motion.div
      className="bg-background border border-border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col"
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Top Section - Company & Salary */}
      <div className="flex justify-between items-start gap-2 mb-3">
        {/* Company Info */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex-shrink-0 w-8 h-8 rounded-md bg-muted flex items-center justify-center">
            {job.company.logo ? (
              <img 
                src={job.company.logo} 
                alt={job.company.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <Briefcase className="w-4 h-4 text-brand" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{job.company.name}</p>
            <div className="flex items-center text-xs text-muted-foreground">
              <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
              <span className="truncate">{job.location}</span>
            </div>
          </div>
        </div>

        {/* Salary & Save */}
        <div className="flex flex-col items-end gap-1">
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-brand/10 text-brand whitespace-nowrap">
            ${job.salary_range}/hr
          </span>
          <button 
            onClick={() => onToggleSave(job.id)}
            className={`p-1 rounded-md ${job.is_saved ? 'text-brand' : 'text-muted-foreground'}`}
          >
            <Bookmark className={`w-4 h-4 ${job.is_saved ? 'fill-brand' : ''}`} />
          </button>
        </div>
      </div>

      {/* Job Title */}
      <h3 className="text-base font-semibold text-foreground line-clamp-2 mb-2">
        {job.title}
      </h3>

      {/* Job Type Badges */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        <span className={`text-xs px-2 py-1 rounded-md ${
          job.remote ? 'bg-green-100 text-green-800' : 
          job.contract ? 'bg-purple-100 text-purple-800' : 
          'bg-brand/10 text-brand'
        }`}>
          {job.remote ? 'Remote' : job.contract ? 'Contract' : 'Full-Time'}
        </span>
        {job.onsite && (
          <span className="text-xs px-2 py-1 rounded-md bg-blue-100 text-blue-800">
            On-Site
          </span>
        )}
      </div>

      {/* Description - Always visible if exists */}
      {!job.description ? <p className="h-16 mb-2 flex items-center justify-center text-sm text-muted-foreground">            {job.description || "no description"}
      </p> : (
        <div className="flex-1 mb-2">
          <p className="text-sm text-muted-foreground h-16 line-clamp-3 my-auto">
            {job.description}
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="flex justify-between items-center pt-2 border-t border-border">
        <div className="flex items-center text-xs text-muted-foreground">
          <Clock className="w-3 h-3 mr-1" />
          {job.created_at}
        </div>
        <Button 
          size="sm" 
        className="h-8 px-2 text-sm group bg-brand text-white hover:bg-brand/ w-[40%] cursor-pointer  "
        >
          View
        </Button>
      </div>
    </motion.div>
  );
};

export default JobCard;