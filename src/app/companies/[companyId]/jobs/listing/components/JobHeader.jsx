// src/app/companies/[companyId]/jobs/listing/components/JobHeader.jsx
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export const JobHeader = () => {
  const router = useRouter();

  return (
    <section className="mb-8 flex flex-col md:flex-row justify-between items-center">
      <Button
        className="mt-4 md:mt-0 bg-blue-500 text-white rounded-lg px-6 py-3 font-semibold hover:bg-blue-600 transition-all shadow-md w-full md:w-auto"
        onClick={() => router.push('/companies/jobs/create/basicinformation')}
      >
        Post New Job
      </Button>
    </section>
  );
};