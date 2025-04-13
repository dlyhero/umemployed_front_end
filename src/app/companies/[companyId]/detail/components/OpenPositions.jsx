// src/app/companies/[companyId]/detail/components/OpenPositions.jsx
import { motion } from 'framer-motion';
import { Briefcase, MapPin, DollarSign, Clock, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function OpenPositions({ jobs, companyId }) {
  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
    >
      <Card className="bg-white/90 backdrop-blur-sm shadow-md hover:shadow-lg transition-shadow rounded-xl border-none">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-2xl sm:text-3xl font-semibold text-gray-800">
            <Briefcase size={28} className="text-blue-600" />
            Open Positions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {jobs && jobs.length > 0 ? (
            jobs.map((job, index) => (
              <motion.div
                key={job.id || index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="space-y-2">
                  <h4 className="text-base sm:text-lg font-semibold text-gray-800">
                    {job.title || 'Untitled Job'}
                  </h4>
                  <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <MapPin size={16} />
                      {job.location || 'N/A'} | {job.job_location_type || 'N/A'}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign size={16} />
                      {job.salary_range || 'N/A'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={16} />
                      {job.job_type || 'N/A'}
                    </span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="mt-4 w-full text-blue-600 border-blue-600 hover:bg-blue-50 flex items-center gap-2 text-sm"
                >
                  Apply Now <ArrowRight size={16} />
                </Button>
              </motion.div>
            ))
          ) : (
            <p className="text-gray-600 text-center text-sm sm:text-base">
              No jobs available at the moment.
            </p>
          )}
          <Button
            asChild
            variant="default"
            className="w-full mt-4 bg-blue-600 text-white hover:bg-blue-700 text-sm sm:text-base"
          >
            <Link href={`/companies/${companyId}/jobs`}>
              View All Jobs <ArrowRight size={16} />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}