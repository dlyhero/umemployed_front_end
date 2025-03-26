"use client";
import { Button } from "@/components/ui/button";
import { FaTimesCircle } from "react-icons/fa";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

export default function VerificationFailure() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  const handleResend = () => {
    if (!email) {
      console.error("No email provided");
      return;
    }
    router.push(`/verify_email?email=${encodeURIComponent(email)}`);
  };

  return (
    <div className="max-w-md w-full mx-auto bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 mt-[10%]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center text-center space-y-6"
      >
        <div className="relative w-20 h-20 flex items-center justify-center">
          <FaTimesCircle className="text-red-500 text-3xl absolute z-10" />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute inset-0 bg-red-100 dark:bg-red-900/20 rounded-full"
          />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Verification Failed
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            {email 
              ? `The verification link for ${email} is invalid or has expired.`
              : "The verification link is invalid or has expired."}
          </p>
        </div>

        <div className="w-full space-y-3">
          <Button
            onClick={handleResend}
            className="w-full rounded-full bg-white text-brand border border-brand hover:bg-whitw"
            disabled={!email}
          >
            {email ? "Resend Verification Email" : "No Email Provided"}
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push('/')}
            className="w-full gap-2 bg-brand text-white rounded-full font-semibold hover:bg-brand/70 hover:text-white"
          >
            Return Home
          </Button>
        </div>
      </motion.div>
    </div>
  );
}