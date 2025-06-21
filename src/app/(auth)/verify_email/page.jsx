"use client";

import { useState, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import sendEmailVerification from "@/src/app/api/auth/verify_email";

function EmailConfirmationContent() {
  const [loading, setLoading] = useState(false);
  const [resent, setResent] = useState(false);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const handleResend = async () => {
    if (!email) {
      setError("Email is required");
      return;
    }

    setLoading(true);
    setError("");
    setResent(false);

    try {
      await sendEmailVerification(email);
      setResent(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto bg-white p-8 rounded-xl border border-gray-200 mt-[10%]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center text-center space-y-6"
      >
        <div className="relative w-20 h-20 flex items-center justify-center">
          {resent ? (
            <>
              <CheckCircle className="text-green-500 w-12 h-12 absolute z-10" />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="absolute inset-0 bg-green-100 rounded-full"
              />
            </>
          ) : (
            <>
              <Mail className="text-brand w-12 h-12 absolute z-10" />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="absolute inset-0  rounded-full"
              />
            </>
          )}
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">
            {resent ? "Email Resent!" : "Check Your Email"}
          </h2>
          <p className="text-gray-600">
            {resent
              ? "We've resent the confirmation link to your inbox"
              : email
              ? `We've sent a confirmation link to ${email}`
              : "Please enter your email again."}
          </p>
        </div>

        <Button
          onClick={handleResend}
          disabled={loading || resent}
          className="w-full bg-brand hover:bg-brand/90 text-white"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
            className="text-red-500 text-sm"
          >
            {error}
          </motion.p>
        )}

        <p className="text-sm text-gray-500">
          Can't find it? Check your spam folder.
        </p>
      </motion.div>
    </div>
  );
}

export default function EmailConfirmation() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EmailConfirmationContent />
    </Suspense>
  );
}
