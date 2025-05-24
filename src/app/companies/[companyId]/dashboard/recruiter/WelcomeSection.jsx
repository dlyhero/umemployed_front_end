'use client';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export const WelcomeSection = ({ companyName = '' }) => {
  const router = useRouter();

  const handlePostJobClick = () => {
    router.push('/companies/jobs/create/basicinformation'); // Updated route
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-[#1e90ff] to-purple-600 rounded-2xl p-6 text-white shadow-lg mb-6"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome, {companyName}!</h1>
          <p className="opacity-90 max-w-lg">
            Your personalized dashboard to help you find and hire top talent faster.
          </p>
        </div>
        <button
          onClick={handlePostJobClick}
          className="mt-4 md:mt-0 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-6 py-2 rounded-full font-medium transition"
        >
          Post a Job
        </button>
      </div>
    </motion.section>
  );
};

export default WelcomeSection;