'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export const JobTabs = () => {
  const router = useRouter();

  return (
    <div className="flex justify-between items-center mb-8">
      <Button
        className="bg-[#15803d] text-white rounded-md px-6 py-2.5 font-medium hover:bg-[#166534] transition-all shadow-sm"
        onClick={() => router.push(`/companies/jobs/create/basicinformation`)}
      >
        Post a Job
      </Button>
    </div>
  );
};