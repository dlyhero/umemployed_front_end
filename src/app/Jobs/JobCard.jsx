'use client';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Bookmark, MapPin, DollarSign, Clock } from "lucide-react";
import { useState } from "react";

const JobCard = ({ 
  job,
  onToggleSave
}) => {
  const {
    id,
    title,
    company,
    job_location_type,
    location,
    salary_range,
    created_at,
    is_saved,
    is_applied
  } = job;

  const [isApplied, setIsApplied] = useState(is_applied);

  const handleToggleSave = () => {
    onToggleSave();
  };

  const handleApply = () => {
    setIsApplied(true);
    // You could add an API call here if needed
  };

  return (
    <motion.div
      className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm h-full flex flex-col max-w-sm"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-4">
          <img
            src={company.logo}
            alt={company.name}
            className="w-12 h-12 rounded-lg object-contain border border-gray-200 p-1"
          />
          <span className="text-sm font-medium px-3 py-1 rounded-full bg-blue-100 text-brand">
            {job_location_type}
          </span>
        </div>
        <button
          onClick={handleToggleSave}
          className={`p-1 rounded-full hover:bg-gray-100 ${
            is_saved ? "text-brand" : "text-gray-400"
          }`}
        >
          <Bookmark
            className={`w-5 h-5 ${is_saved ? "fill-brand" : ""}`}
          />
        </button>
      </div>

      <div className="flex-grow space-y-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 line-clamp-2 min-h-[56px]">
            {title}
          </h3>
          <p className="text-gray-600 mt-1">{company.name}</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-1 text-brand" />
            {location}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <DollarSign className="w-4 h-4 mr-1 text-brand" />
            ${salary_range}
          </div>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="w-4 h-4 mr-1 text-brand" />
          {created_at}
        </div>
      </div>

      <div className="pt-6 mt-auto">
        {isApplied ? (
          <Button variant="outline" className="w-full border-brand text-brand" disabled>
            Applied
          </Button>
        ) : (
          <Button 
            className="w-full bg-brand hover:bg-brand/90 text-white"
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