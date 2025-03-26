"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FaEnvelope, FaCheckCircle, FaSpinner } from "react-icons/fa";
import { motion } from "framer-motion";
import { useSearchParams } from 'next/navigation';
import sendEmailVerification from "@/src/app/api/auth/verify_email";

export default function EmailConfirmation() {
  const [loading, setLoading] = useState(false);
  const [resent, setResent] = useState(false);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  const handleResend = async () => {
    if (!email) {
      setError("Email is required");
      return;
    }

    setLoading(true);
    setError("");
    setResent(false);
    
    try {
      await sendEmailVerification(email); // Pass the email directly
      setResent(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto bg-white dark:bg-gray-900 p-8 rounded-xl border border-gray-200 dark:border-gray-800 mt-[10%]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center text-center space-y-6"
      >
        <div className="relative w-20 h-20 flex items-center justify-center">
          {resent ? (
            <>
              <FaCheckCircle className="text-green-500 text-3xl absolute z-10" />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute inset-0 bg-green-100 dark:bg-green-900/20 rounded-full"
              />
            </>
          ) : (
            <>
              <FaEnvelope className="text-brand text-3xl absolute z-10" />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute inset-0 bg-blue-100 dark:bg-blue-900/20 rounded-full"
              />
            </>
          )}
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {resent ? "Email Resent!" : "Check Your Email"}
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            {resent
              ? "We've resent the confirmation link to your inbox"
              : `We've sent a confirmation link to ${email}`}
          </p>
        </div>

        <Button
          onClick={handleResend}
          disabled={loading}
          variant={resent ? "outline" : "default"}
          className="w-full gap-2 bg-brand text-white rounded-full font-semibold hover:bg-brand/70 hover:text-white"
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin" />
              Processing...
            </>
          ) : (
            "Resend Email"
          )}
        </Button>

        {error && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 dark:text-red-400 text-sm"
          >
            {error}
          </motion.p>
        )}

        <p className="text-sm text-gray-500 dark:text-gray-400">
          Can't find it? Check your spam folder.
        </p>
      </motion.div>
    </div>
  );
}