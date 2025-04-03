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
  "/examples/company5.png",
];

// Mock job data
const mockJobs = [
  {
    id: 1,
    title: "Software Engineer",
    company: { name: "Tech Corp", logo: companyLogos[0] },
    job_location_type: "Remote",
    location: "New York",
    salary_range: "80k - 100k",
    created_at: "2d ago",
    is_saved: false,
    is_applied: false,
  },
  {
    id: 2,
    title: "Product Manager",
    company: { name: "Innovate Inc", logo: companyLogos[1] },
    job_location_type: "On-site",
    location: "San Francisco",
    salary_range: "90k - 120k",
    created_at: "1w ago",
    is_saved: true,
    is_applied: true,
  },
  {
    id: 3,
    title: "Data Scientist",
    company: { name: "DataWorks", logo: companyLogos[2] },
    job_location_type: "Hybrid",
    location: "Chicago",
    salary_range: "85k - 110k",
    created_at: "3d ago",
    is_saved: false,
    is_applied: false,
  },
  {
    id: 4,
    title: "UX Designer",
    company: { name: "DesignCo", logo: companyLogos[3] },
    job_location_type: "Remote",
    location: "Austin",
    salary_range: "75k - 95k",
    created_at: "5d ago",
    is_saved: true,
    is_applied: false,
  },
  {
    id: 5,
    title: "DevOps Engineer",
    company: { name: "CloudSystems", logo: companyLogos[4] },
    job_location_type: "Hybrid",
    location: "Seattle",
    salary_range: "95k - 125k",
    created_at: "4d ago",
    is_saved: false,
    is_applied: false,
  },
];

const RecentJobListings = () => {
  const [jobs, setJobs] = useState(mockJobs);

  const toggleSave = (jobId) => {
    setJobs(jobs.map((job) =>
      job.id === jobId ? { ...job, is_saved: !job.is_saved } : job
    ));
  };

  return (
    <section className="w-full px-4 py-8 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          className="mb-6"
        >
          <h2 className="text-xl font-semibold text-gray-800">Featured Jobs</h2>
          <p className="text-sm text-gray-500">Explore top opportunities for you</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map((job) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm flex flex-col"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <img
                    src={job.company.logo}
                    alt={job.company.name}
                    className="w-8 h-8 rounded-md object-contain border border-gray-100 p-0.5"
                  />
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
                    {job.job_location_type}
                  </span>
                </div>
                <button
                  onClick={() => toggleSave(job.id)}
                  className={`p-1 rounded-full hover:bg-gray-100 ${
                    job.is_saved ? "text-blue-600" : "text-gray-400"
                  }`}
                >
                  <Bookmark
                    className={`w-4 h-4 ${job.is_saved ? "fill-blue-600" : ""}`}
                  />
                </button>
              </div>

              <div className="flex-grow space-y-2">
                <h3 className="text-lg font-medium text-gray-900 line-clamp-1">
                  {job.title}
                </h3>
                <p className="text-sm text-gray-600">{job.company.name}</p>
                <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                  <span className="flex items-center">
                    <MapPin className="w-3 h-3 mr-1 text-blue-500" />
                    {job.location}
                  </span>
                  <span className="flex items-center">
                    <DollarSign className="w-3 h-3 mr-1 text-blue-500" />
                    ${job.salary_range}
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-3 h-3 mr-1 text-blue-500" />
                    {job.created_at}
                  </span>
                </div>
              </div>

              <div className="mt-3">
                {job.is_applied ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-blue-500 text-blue-500 text-xs"
                    disabled
                  >
                    Applied
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs"
                  >
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