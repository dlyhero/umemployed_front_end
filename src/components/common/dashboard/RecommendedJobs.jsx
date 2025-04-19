'use client'

import JobCard from "@/src/app/(Jobs)/JobCard"

export const RecommendedJobs = ({ jobs, toggleSaveJob }) => (
  <section className="bg-white rounded-xl shadow-sm p-6 mb-6">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
      <h2 className="text-xl font-bold mb-2 sm:mb-0">Recommended For You</h2>
      <div className="flex space-x-2">
        <button className="px-4 py-2 bg-brand text-white rounded-lg text-sm font-medium hover:bg-brand700">
          Remote
        </button>
        <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
          Full-time
        </button>
        <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
          Hybrid
        </button>
      </div>
    </div>

    <div className="space-y-4 grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 gap-2">
    {jobs.slice(0, 3).map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onToggleSave={toggleSaveJob}
                />
              ))}
    </div>
  </section>
)