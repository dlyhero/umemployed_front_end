'use client'
import { motion } from 'framer-motion'
import { Bookmark } from 'lucide-react'

export const JobCard = ({ job, toggleSave }) => (
  <motion.div
    whileHover={{ scale: 1.01 }}
    className="p-5 border border-gray-200 rounded-xl hover:border-brand transition-colors"
  >
    <div className="flex flex-col md:flex-row md:items-center">
      <div className="flex items-start space-x-4 mb-4 md:mb-0">
        <img
          src={job.logo}
          alt={job.company}
          className="w-12 h-12 rounded-lg object-contain border border-gray-200"
        />
        <div>
          <h3 className="font-bold text-lg">{job.title}</h3>
          <p className="text-gray-600">{job.company} • <span className="text-brand">{job.type}</span></p>
        </div>
      </div>
      <div className="ml-auto flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
        <div className="text-right">
          <p className="font-medium">{job.salary}</p>
          <p className="text-sm text-gray-500">{job.posted}</p>
        </div>
        <button
          onClick={() => toggleSave(job.id)}
          className={`p-2 rounded-full ${job.isSaved ? 'bg-indigo-50 text-brand' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
        >
          <Bookmark className={`w-5 h-5 ${job.isSaved ? 'fill-brand' : ''}`} />
        </button>
        <button className="px-4 py-2 bg-brand text-white rounded-lg hover:bg-indigo-700 transition-colors">
          Apply
        </button>
      </div>
    </div>
  </motion.div>
)