'use client';
import { JobItem } from './JobItem';
import { Card, CardContent } from '@/components/ui/card';

export const JobListContainer = ({ jobs, companyId }) => {
  return (
    <section className="flex-1">
      {jobs.length > 0 ? (
        <div className="grid gap-4">
          {jobs.map((job) => (
            <JobItem key={job.id} job={job} companyId={companyId} />
          ))}
        </div>
      ) : (
        <Card className="bg-white border border-gray-200 rounded-md">
          <CardContent className="flex justify-center items-center h-64">
            <p className="text-gray-600 text-lg font-medium">No job postings found</p>
          </CardContent>
        </Card>
      )}
    </section>
  );
};