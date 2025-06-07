"use client"

import Link from "next/link"
import { motion } from "framer-motion"

export function Logo() {
  const pathVariants = {
    initial: {
      pathLength: 0,
      opacity: 0,
    },
    animate: (i) => ({
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: {
          duration: 2,
          delay: i * 0.5,
          ease: "easeInOut",
        },
        opacity: {
          duration: 0.5,
          delay: i * 0.5,
        },
      },
    }),
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.3,
      },
    },
  }

  return (
    <Link href="/" className="inline-block text-brand text-4xl sm:text-5xl md:text-6xl font-bold rounded-lg sm:mb-2 ">
      <motion.svg
        viewBox="0 0 150 100" // Keep this fixed
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-[4em] h-[4Sem]" // This makes it scale with font-size
        whileHover="hover"
        initial="initial"
        animate="animate"
      >
        {/* Lowercase u - improved shape */}
        <motion.path
          d="M25 30 L25 70 Q25 80 40 80 Q55 80 55 70 L55 30"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          variants={pathVariants}
          custom={0}
        />

        {/* Uppercase E - moved closer */}
        <motion.path
          d="M70 20 L110 20 M70 20 L70 80 M70 50 L100 50 M70 80 L110 80"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          variants={pathVariants}
          custom={1}
        />
      </motion.svg>
    </Link>
  )
}