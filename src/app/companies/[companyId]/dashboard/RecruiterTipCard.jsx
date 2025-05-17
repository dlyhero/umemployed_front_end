'use client'
import { useState } from 'react'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export const RecruiterTipCard = ({ tip, onClose }) => {
  const [isClosing, setIsClosing] = useState(false)

  const handleClose = () => {
    setIsClosing(true)
  }

  // Animation for breaking apart effect
  const breakVariants = {
    initial: { opacity: 1, scale: 1 },
    animate: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.3,
        when: 'beforeChildren',
      },
    },
  }

  const pieceVariants = {
    initial: { opacity: 1, x: 0, y: 0, rotate: 0 },
    animate: (i) => ({
      opacity: 0,
      x: i % 2 === 0 ? -50 : 50,
      y: i < 2 ? -50 : 50,
      rotate: i % 2 === 0 ? -45 : 45,
      transition: { duration: 0.5 },
    }),
  }

  return (
    <AnimatePresence>
      {!isClosing && (
        <motion.div
          variants={breakVariants}
          initial="initial"
          animate="initial"
          exit="animate"
          onAnimationComplete={() => isClosing && onClose()}
          className="relative border border-gray-200 rounded-xl p-4 bg-white shadow-sm"
          whileHover={{ y: -3 }}
        >
          <button
            onClick={handleClose}
            className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100"
            aria-label="Close tip"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-[#1e90ff]/10 rounded-lg flex-shrink-0">
              {tip.icon}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-base leading-tight">{tip.title}</h3>
              <p className="text-gray-600 text-sm line-clamp-2">{tip.description}</p>
            </div>
          </div>
          {/* Breaking pieces for animation */}
          {isClosing && (
            <>
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  custom={i}
                  variants={pieceVariants}
                  initial="initial"
                  animate="animate"
                  className="absolute inset-0 bg-white border border-gray-200 rounded-xl"
                  style={{
                    clipPath:
                      i === 0
                        ? 'polygon(0 0, 50% 0, 50% 50%, 0 50%)'
                        : i === 1
                        ? 'polygon(50% 0, 100% 0, 100% 50%, 50% 50%)'
                        : i === 2
                        ? 'polygon(0 50%, 50% 50%, 50% 100%, 0 100%)'
                        : 'polygon(50% 50%, 100% 50%, 100% 100%, 50% 100%)',
                  }}
                />
              ))}
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}