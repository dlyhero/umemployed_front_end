"use client";
import { Button } from "@/components/ui/button";
import { FaCheckCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function VerificationSuccess() {
  const router = useRouter();

  return (
    <div className="max-w-md w-full mx-auto bg-white dark:bg-gray-900 p-8 rounded-xl shawdow-lg border border-gray-200 dark:border-gray-800 mt-[10%]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center text-center space-y-6"
      >
        <div className="relative w-20 h-20 flex items-center justify-center">
          <FaCheckCircle className="text-green-500 text-3xl absolute z-10" />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute inset-0 bg-green-100 dark:bg-green-900/20 rounded-full"
          />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Email Verified!
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Your email has been successfully verified. You can now login to your account.
          </p>
        </div>

        <Button
          onClick={() => router.push('/login')}
          className="w-full  gap-2 bg-brand text-white rounded-full font-semibold hover:bg-brand/70 hover:text-white"
        >
          Proceed to Login
        </Button>
      </motion.div>
    </div>
  );
}