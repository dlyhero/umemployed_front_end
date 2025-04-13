'use client';

import { motion } from 'framer-motion';
import { JobItem } from './JobItem';

export const JobListContainer = ({ jobs, companyId }) => {
  return (
    <section className="flex-1">
      {jobs.length > 0 ? (
        <div className="grid gap-4">
          {jobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <JobItem job={job} companyId={companyId} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
          <p className="text-gray-600 text-lg font-medium">No job postings found</p>
        </div>
      )}
    </section>
  );
};