"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import Loader from "@/src/components/common/Loader/Loader";
import { ACCOUNT_TYPES, selectAccountType } from "@/src/app/api/auth/select-role";

export default function SelectRolePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const user = useSession();

  console.log(user);
    

  const handleAccountTypeSelect = async (accountType) => {

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = session?.accessToken || session?.user?.accessToken;

      await selectAccountType(accountType, token);
      
      setSuccess("Account type selected successfully!");

      console.log("accont", accountType);
      
      // Immediate redirect without delay
      if (accountType === ACCOUNT_TYPES.RECRUITER.value) {
         router.push("/companies/create");

      } else {
        router.push("/applicant/upload-resume");
      }


    } catch (err) {
      setError(err.message);
      if (err.message.includes("expired") || err.message.includes("required")) {
        
      }
    } finally {
      setLoading(false);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, delay: i * 0.1 }
    }),
    hover: {
      y: -4,
      transition: { duration: 0.2 }
    },
    tap: {
      scale: 0.98
    }
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <Loader className="h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <motion.div 
        className="w-full max-w-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Choose Your Account Type
          </h1>
          <p className="text-gray-600">
            Select the option that best describes your goals
          </p>
        </header>

        {error && (
          <motion.div
            className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg border border-red-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {error}
          </motion.div>
        )}

        {success && (
          <motion.div
            className="mb-6 p-4 bg-green-50 text-green-600 rounded-lg border border-green-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {success}
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.values(ACCOUNT_TYPES).map((type, index) => (
            <motion.button
              key={type.value}
              variants={cardVariants}
              custom={index}
              initial="hidden"
              animate="visible"
              whileHover={!loading ? "hover" : {}}
              whileTap={!loading ? "tap" : {}}
              onClick={() => handleAccountTypeSelect(type.value)}
              disabled={loading}
              className={`p-6 bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col items-center text-center transition-all ${
                loading ? "opacity-70 cursor-not-allowed" : "hover:shadow-md"
              }`}
            >
              <div className="mb-4 p-3 bg-blue-50 rounded-full">
                <type.icon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                {type.label}
              </h3>
              <p className="text-sm text-gray-500">
                {type.description}
              </p>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}