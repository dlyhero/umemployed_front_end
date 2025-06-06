'use client';
import { Briefcase } from 'lucide-react';
import { useRouter } from 'next/navigation';

const PostJob = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push('/companies/jobs/create/basicinformation'); // Updated route
  };

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 rounded-lg shadow text-white">
      <div className="flex items-center gap-3 mb-4">
        <Briefcase className="w-8 h-8" />
        <h2 className="text-2xl font-bold">Post a New Job</h2>
      </div>
      <p className="mb-4">Reach thousands of qualified candidates today.</p>
      
      <button
        onClick={handleClick}
        className="bg-white text-blue-600 px-4 py-2 rounded-full hover:bg-gray-100"
      >
        Post a Job
      </button>
    </div>
  );
};

export default PostJob;