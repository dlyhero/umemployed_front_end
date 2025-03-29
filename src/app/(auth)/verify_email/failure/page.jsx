"use client";

import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

export default function VerificationFailure() {
  const router = useRouter();

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <VerificationFailureContent router={router} />
    </Suspense>
  );
}

function VerificationFailureContent({ router }) {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const handleResend = () => {
    if (!email) return;
    router.push(`/verify_email?email=${encodeURIComponent(email)}`);
  };

  return (
    <div className="max-w-md w-full mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200 mt-[10%]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center text-center space-y-6"
      >
        <div className="relative w-20 h-20 flex items-center justify-center">
          <XCircle className="text-red-500 w-12 h-12 absolute z-10" />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="absolute inset-0 bg-red-100 rounded-full"
          />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">Verification Failed</h2>
          <p className="text-gray-600">
            {email
              ? `The verification link for ${email} is invalid or has expired.`
              : "The verification link is invalid or has expired."}
          </p>
        </div>

        <div className="w-full space-y-3">
          <Button
            onClick={handleResend}
            variant="outline"
            className="w-full border-brand text-brand hover:bg-brand/5"
            disabled={!email}
          >
            {email ? "Resend Verification Email" : "No Email Provided"}
          </Button>
          <Button
            onClick={() => router.push("/")}
            className="w-full bg-brand hover:bg-brand/90 text-white"
          >
            Return Home
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
