"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const Tips = ({ tips }) => {
  const [visibleTips, setVisibleTips] = useState(tips);

  const removeTip = (index) => {
    setVisibleTips(visibleTips.filter((_, i) => i !== index));
  };

  // Animation variants for the X button
  const buttonVariants = {
    hover: { scale: 1.2, rotate: 90 },
    tap: { scale: 0.9 },
  };

  return (
    <div className=" rounded-lg">
      <div
        className="flex space-x-6 overflow-x-auto"
        style={{
          maxWidth: '1200px',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        <AnimatePresence>
          {visibleTips.map((tip, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="w-full max-w-[384px] bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm flex-shrink-0 relative"
            >
              <motion.button
                onClick={() => removeTip(index)}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="absolute top-2 right-2 text-red-500 hover:text-red-600 transition-colors"
              >
                <X size={16} />
              </motion.button>
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