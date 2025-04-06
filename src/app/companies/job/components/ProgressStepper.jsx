// /job/components/ProgressStepper.jsx
'use client';
import { motion } from 'framer-motion';

export const ProgressStepper = ({ step }) => {
  const steps = ['Basic Info', 'Requirements', 'Description', 'Skills'];

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        {steps.map((label, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber <= step;
          return (
            <div key={label} className="flex-1 text-center">
              <div className="relative">
                <motion.div
                  className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-sm font-semibold ${
                    isActive ? 'bg-[#1e90ff] text-white' : 'bg-gray-200 text-gray-600'
                  }`}
                  animate={{ scale: isActive ? 1.1 : 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {stepNumber}
                </motion.div>
                {stepNumber < steps.length && (
                  <motion.div
                    className="absolute top-1/2 left-1/2 w-full h-1 bg-gray-200"
                    animate={{ backgroundColor: isActive ? '#1e90ff' : '#e5e7eb' }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </div>
              <p className={`mt-2 text-sm ${isActive ? 'text-[#1e90ff]' : 'text-gray-600'}`}>
                {label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};