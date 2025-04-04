'use client'
import { JobCard } from './JobCard'

export const RecommendedJobs = ({ jobs, toggleSave }) => (
  <section className="bg-white rounded-xl shadow-sm p-6 mb-6">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
      <h2 className="text-xl font-bold mb-2 sm:mb-0">Recommended For You</h2>
      <div className="flex space-x-2">
        <button className="px-4 py-2 bg-brand text-white rounded-full text-sm font-medium hover:bg-indigo-700">
          Remote
        </button>
        <button className="px-4 py-2 bg-white border border-gray-300 rounded-full text-sm font-medium hover:bg-gray-50">
          Full-time
        </button>
        <button className="px-4 py-2 bg-white border border-gray-300 rounded-full text-sm font-medium hover:bg-gray-50">
          Hybrid
        </button>
      </div>
    </div>

    <div className="space-y-4">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} toggleSave={toggleSave} />
      ))}
    </div>
  </section>
)