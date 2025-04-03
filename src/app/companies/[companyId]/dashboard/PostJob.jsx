'use client'; // Required for Framer Motion and interactivity

import { motion } from 'framer-motion';
import { 
  Briefcase, 
  PlusCircle, 
  ArrowRight, 
  Zap 
} from 'lucide-react';

const PostJob = ({ companyId }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        type: 'spring',
        stiffness: 100,
        damping: 10
      }}
      className="max-w-6xl mx-auto bg-white p-6 rounded-xl shadow-sm border border-blue-100 overflow-hidden relative"
    >
      {/* Decorative elements */}
      <div className="absolute -right-10 -top-10 w-32 h-32 bg-blue-200 rounded-full opacity-10"></div>
      <div className="absolute -left-5 -bottom-5 w-20 h-20 bg-indigo-200 rounded-full opacity-10"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <motion.div
            animate={{ 
              rotate: [0, 5, -5, 0],
              scale: [1, 1.1, 1.1, 1]
            }}
            transition={{ 
              repeat: Infinity, 
              repeatType: 'reverse', 
              duration: 2 
            }}
          >
            <Briefcase className="w-8 h-8 text-blue-600" strokeWidth={1.5} />
          </motion.div>
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Post a New Job
          </h2>
        </div>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-600 mb-6"
        >
          Reach thousands of qualified candidates and find your perfect hire today.
        </motion.p>
        
        <motion.div whileTap={{ scale: 0.95 }}>
          <a href={`/recruiter/company/${companyId}/post-job`}>
            <button className="group relative flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-full hover:shadow-lg transition-all duration-300 overflow-hidden">
              <span className="relative z-10 flex items-center gap-2">
                <PlusCircle className="w-5 h-5" />
                Post a Job
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
              {/* Button hover effect */}
              <motion.span 
                className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity"
                initial={{ opacity: 0 }}
              />
            </button>
          </a>
        </motion.div>
        
        <motion.div 
          className="flex items-center gap-2 mt-4 text-sm text-blue-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Zap className="w-4 h-4" />
          <span>Get your first 5 applicants free</span>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PostJob;