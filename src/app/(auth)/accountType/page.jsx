// src/app/(auth)/accountType/page.jsx (Alternative Design 1 - Centralized)
"use client";

import { useRouter } from "next/navigation";
import { FaSearch, FaBriefcase } from "react-icons/fa";
import { motion } from "framer-motion";

export default function ChooseAccountType() {
  const router = useRouter();

  const handleJobSeekerClick = () => router.push("/upload");
  const handleEmployerClick = () => router.push("/create_company");

  const headingVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8, delay: 0.2 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: i * 0.2, ease: "easeOut" },
    }),
    hover: {
      y: -10,
      boxShadow: "4px 4px 0 #1e90ff",
      transition: { duration: 0.3 },
    },
  };

  return (
    <main className="container flex flex-col items-center justify-center min-h-[calc(100vh-120px)] max-w-4xl mx-auto p-3 rounded-lg">
      <motion.h2
        className="text-3xl font-bold text-center mb-6 text-gray-900"
        variants={headingVariants}
        initial="hidden"
        animate="visible"
      >
        Choose Your Account Type
      </motion.h2>

      <motion.div
        className="text-center mb-6 max-w-md"
        variants={fadeInVariants}
        initial="hidden"
        animate="visible"
      >
        <p className="text-base text-gray-600">
          Select the account type that best fits your goals.
        </p>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-6 w-full max-w-2xl">
        <motion.div
          custom={0}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          onClick={handleJobSeekerClick}
          className="flex-1 p-6 bg-gradient-to-br from-blue-50 to-blue-100 border border-gray-200 rounded-lg cursor-pointer flex flex-col items-center"
        >
          <div className="text-brand mb-4">
            <FaSearch className="text-2xl" />
          </div>
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Job Seeker</h2>
            <p className="text-sm text-gray-600">
              Find and apply to your dream job.
            </p>
          </div>
        </motion.div>

        <motion.div
          custom={1}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          onClick={handleEmployerClick}
          className="flex-1 p-6 bg-gradient-to-br from-blue-50 to-blue-100 border border-gray-200 rounded-lg cursor-pointer flex flex-col items-center"
        >
          <div className="text-brand mb-4">
            <FaBriefcase className="text-2xl" />
          </div>
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Employer</h2>
            <p className="text-sm text-gray-600">
              Hire the best talent for your team.
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}