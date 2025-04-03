"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Bookmark, MapPin, Clock, DollarSign } from "lucide-react";

// Using shadcn/ui example images
const companyLogos = [
  "/examples/company1.png",
  "/examples/company2.png",
  "/examples/company3.png",
  "/examples/company4.png",
  "/examples/company5.png"
];

// Mock job data matching your structure
const mockJobs = [
  {
    id: 1,
    title: "Software Engineer",
    company: {
      name: "Tech Corp",
      logo: companyLogos[0],
    },
    job_location_type: "Remote",
    location: "New York",
    salary_range: "80,000 - 100,000",
    created_at: "2 days ago",
    is_saved: false,
    is_applied: false,
  },
  {
    id: 2,
    title: "Product Manager",
    company: {
      name: "Innovate Inc",
      logo: companyLogos[1],
    },
    job_location_type: "On-site",
    location: "San Francisco",
    salary_range: "90,000 - 120,000",
    created_at: "1 week ago",
    is_saved: true,
    is_applied: true,
  },
  {
    id: 3,
    title: "Data Scientist",
    company: {
      name: "DataWorks",
      logo: companyLogos[2],
    },
    job_location_type: "Hybrid",
    location: "Chicago",
    salary_range: "85,000 - 110,000",
    created_at: "3 days ago",
    is_saved: false,
    is_applied: false,
  },
  {
    id: 4,
    title: "UX Designer",
    company: {
      name: "DesignCo",
      logo: companyLogos[3],
    },
    job_location_type: "Remote",
    location: "Austin",
    salary_range: "75,000 - 95,000",
    created_at: "5 days ago",
    is_saved: true,
    is_applied: false,
  },
  {
    id: 5,
    title: "DevOps Engineer",
    company: {
      name: "CloudSystems",
      logo: companyLogos[4],
    },
    job_location_type: "Hybrid",
    location: "Seattle",
    salary_range: "95,000 - 125,000",
    created_at: "4 days ago",
    is_saved: false,
    is_applied: false,
  }
];

const RecentJobListings = () => {
  const [jobs, setJobs] = useState(mockJobs);

  const toggleSave = (jobId) => {
    setJobs(jobs.map(job => 
      job.id === jobId ? { ...job, is_saved: !job.is_saved } : job
    ));
  };

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-16 bg-slate-100">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Featured Opportunities</h2>
          <p className="text-lg text-gray-600">
            Find the best jobs tailored to your skills and preferences
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm h-full flex flex-col"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <img 
                    src={job.company.logo} 
                    alt={job.company.name}
                    className="w-12 h-12 rounded-lg object-contain border border-gray-200 p-1"
                  />
                  <span className="text-sm font-medium px-3 py-1 rounded-full bg-blue-100 text-brand">
                    {job.job_location_type}
                  </span>
                </div>
                <button 
                  onClick={() => toggleSave(job.id)}
                  className={`p-1 rounded-full hover:bg-gray-100 ${
                    job.is_saved ? "text-brand" : "text-gray-400"
                  }`}
                >
                  <Bookmark 
                    className={`w-5 h-5 ${job.is_saved ? "fill-brand" : ""}`} 
                  />
                </button>
              </div>

              <div className="flex-grow space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 line-clamp-2 min-h-[56px]">
                    {job.title}
                  </h3>
                  <p className="text-gray-600 mt-1">{job.company.name}</p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-1 text-brand" />
                    {job.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign className="w-4 h-4 mr-1 text-brand" />
                    ${job.salary_range}
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-1 text-brand" />
                  {job.created_at}
                </div>
              </div>

              <div className="pt-6 mt-auto">
                {job.is_applied ? (
                  <Button variant="outline" className="w-full border-brand text-brand" disabled>
                    Applied
                  </Button>
                ) : (
                  <Button className="w-full bg-brand hover:bg-brand/90 text-white">
                    Apply Now
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentJobListings;