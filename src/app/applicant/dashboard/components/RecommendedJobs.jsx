'use client'

import JobCard from "@/src/app/jobs/_components/JobCard"
import JobCardListing from "@/src/app/jobs/_components/JobCardListing";
import { useJobs } from "@/src/hooks/useJob"
import { useEffect, useState } from "react";

export const RecommendedJobs = () => {
    const { allJobs, toggleSaveJob, saveJobs } = useJobs();
    const [displayJobs, setDisplayJobs] = useState([]);
  
    // Set jobs from allJobs
    useEffect(() => {
      if (Array.isArray(allJobs)) {
        setDisplayJobs(allJobs);
      }
    }, [allJobs]);


 return( <section className="bg-white rounded-xl  p-6 mb-6">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
      <h2 className="text-xl font-bold mb-2 sm:mb-0">Recommended For You</h2>
    
    </div>

    <div className="space-y-4">
      {displayJobs.slice(0, 4).map((job) => (
        <JobCard
          job={job}
          onToggleSave={() => toggleSaveJob(job.id)}
        />
      ))}
    </div>
  </section>
)
}