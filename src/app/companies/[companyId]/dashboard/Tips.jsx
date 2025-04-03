"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const Tips = ({ tips }) => {
  const [visibleTips, setVisibleTips] = useState(tips);
  const [currentIndex, setCurrentIndex] = useState(0);

  const removeTip = (index) => {
    setVisibleTips(prev => prev.filter((_, i) => i !== index));
    if (currentIndex >= visibleTips.length - 1) {
      setCurrentIndex(prev => Math.max(0, prev - 1));
    }
  };

  const nextTip = () => {
    setCurrentIndex(prev => (prev + 1) % visibleTips.length);
  };

  const prevTip = () => {
    setCurrentIndex(prev => (prev - 1 + visibleTips.length) % visibleTips.length);
  };

  if (visibleTips.length === 0) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
        <p className="text-gray-500">No tips to display</p>
      </div>
    );
  }

  return (
    <div className="relative rounded-lg">
      {/* Navigation Arrows */}
      {visibleTips.length > 1 && (
        <>
          <button
            onClick={prevTip}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-all"
            aria-label="Previous tip"
          >
            <ChevronLeft size={20} className="text-gray-700" />
          </button>
          <button
            onClick={nextTip}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-all"
            aria-label="Next tip"
          >
            <ChevronRight size={20} className="text-gray-700" />
          </button>
        </>
      )}

      {/* Tips Carousel */}
      <div className="overflow-hidden relative h-48">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentIndex}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-lg border border-gray-200 shadow-sm"
          >
            <button
              onClick={() => removeTip(currentIndex)}
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors"
              aria-label="Remove tip"
            >
              <X size={18} />
            </button>
            <div className="h-full flex flex-col justify-between">
              <div>
                <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                  Tip {currentIndex + 1} of {visibleTips.length}
                </span>
                <h4 className="mt-3 text-xl font-bold text-gray-900">
                  {visibleTips[currentIndex].title}
                </h4>
              </div>
              <p className="text-gray-600">
                {visibleTips[currentIndex].content}
              </p>
              <div className="flex justify-center space-x-2 mt-4">
                {visibleTips.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${index === currentIndex ? 'bg-blue-500' : 'bg-gray-300'}`}
                    aria-label={`Go to tip ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Mobile Horizontal Scroll (Fallback) */}
      <div className="md:hidden mt-4">
        <div className="flex space-x-4 overflow-x-auto pb-4 -mx-4 px-4">
          {visibleTips.map((tip, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-72 bg-gradient-to-br from-blue-50 to-purple-50 p-5 rounded-lg border border-gray-200 shadow-sm flex-shrink-0 relative"
            >
              <button
                onClick={() => removeTip(index)}
                className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors"
              >
                <X size={18} />
              </button>
              <h4 className="text-lg font-bold text-gray-900">{tip.title}</h4>
              <p className="text-gray-600 mt-2">{tip.content}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tips;