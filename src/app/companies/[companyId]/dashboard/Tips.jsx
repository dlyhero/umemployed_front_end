"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const Tips = ({ tips }) => {
  const [visibleTips, setVisibleTips] = useState(tips);

  const removeTip = (index) => {
    setVisibleTips(visibleTips.filter((_, i) => i !== index));
  };

  // Animation variants for slow continuous movement
  const moveVariants = {
    animate: {
      x: [0, 10, 0], // Moves slightly right and back
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 4, // Slow movement over 4 seconds
          ease: "easeInOut",
        },
      },
    },
  };

  return (
    <div className="p-4 rounded-lg">
      <div
        className="flex space-x-6 overflow-x-auto"
        style={{ 
          maxWidth: '1200px', // Matches the max-width from RecentJobListings
          scrollbarWidth: 'none', // Firefox
          msOverflowStyle: 'none', // IE/Edge
          WebkitOverflowScrolling: 'touch', // Smooth scrolling on mobile
        }}
      >
        {/* Hide scrollbar for Webkit browsers */}
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        <AnimatePresence>
          {visibleTips.map((tip, index) => (
            <motion.div
              key={index}
              variants={moveVariants}
              initial={{ opacity: 0, x: -20 }}
              animate="animate"
              exit={{ 
                opacity: 0, 
                x: 20,
                scale: 0.95,
                transition: { duration: 0.3, ease: 'easeInOut' }
              }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-[384px] bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm flex-shrink-0" // Matches RecentJobListings size and styling
            >
              <button
                onClick={() => removeTip(index)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-600 transition-colors"
              >
                <X size={16} />
              </button>
              <h4 className="text-xl font-semibold text-gray-900 line-clamp-2 min-h-[56px]">{tip.title}</h4>
              <p className="text-gray-600 mt-1 text-sm">{tip.content}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Tips;