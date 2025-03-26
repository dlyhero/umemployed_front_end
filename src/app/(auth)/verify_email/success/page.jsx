"use client";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function VerificationSuccess() {
  const router = useRouter();

  return (
    <div className="max-w-md w-full mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200 mt-[10%]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center text-center space-y-6"
      >
        <div className="relative w-20 h-20 flex items-center justify-center">
          <CheckCircle className="text-green-500 w-12 h-12 absolute z-10" />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="absolute inset-0 bg-green-100 rounded-full"
          />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">
            Email Verified!
          </h2>
          <p className="text-gray-600">
            Your email has been successfully verified. You can now login to your account.
          </p>
        </div>

        <Button
          onClick={() => router.push('/login')}
          className="w-full bg-brand hover:bg-brand/90 text-white"
        >
          Proceed to Login
        </Button>
      </motion.div>
    </div>
  );
}