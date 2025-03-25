// src/components/common/Loader/Loader.jsx
import { motion } from "framer-motion";

export default function Loader() {
  // Variants for the circular spinner (rotating animation)
  const circleVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "linear",
      },
    },
  };

  // Variants for the "UE" text (pulsing animation)
  const textVariants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.8, 1, 0.8],
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Background with blur effect */}
      <motion.div
        className="absolute inset-0 backdrop-blur-md bg-black/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Circular Loader */}
      <div className="relative flex items-center justify-center">
        {/* Rotating Circle */}
        <motion.div
          className="w-24 h-24 rounded-full border-4 border-t-transparent border-brand"
          variants={circleVariants}
          animate="animate"
        />

        {/* "UE" Text in the Center */}
        <motion.div
          className="absolute text-4xl font-bold text-brand"
          variants={textVariants}
          animate="animate"
        >
          UE
        </motion.div>
      </div>
    </div>
  );
}