"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { FaSearch, FaBriefcase } from "react-icons/fa";
import { motion } from "framer-motion";
import Loader from "@/src/components/common/Loader/Loader";

export default function ChooseAccountType() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/accountType");
    }
  }, [status, router]);

  // Function to handle API call with timeout
  const handleAccountTypeSelection = async (accountType) => {
    if (status !== "authenticated") {
      setError("You are not authenticated. Please log in.");
      router.push("/login?callbackUrl=/accountType");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    // Get the token from the session
    const token = session?.user?.accessToken || session?.accessToken;

    if (!token) {
      setError("Authentication token not found. Please log in again.");
      setLoading(false);
      router.push("/login?callbackUrl=/accountType");
      return;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5-second timeout

      const response = await fetch(
        "https://umemployed-app-afec951f7ec7.herokuapp.com/api/users/choose-account-type/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({
            account_type: accountType,
          }),
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);
      setLoading(false);

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 400) {
          throw new Error(
            errorData.message ||
              errorData.account_type?.[0] ||
              "Invalid request. Please check your input and try again."
          );
        }
        if (response.status === 401) {
          throw new Error("Unauthorized: Invalid or expired token. Please log in again.");
        }
        throw new Error("Failed to select account type. Please try again.");
      }

      await response.json();
      setSuccess("Account type selected successfully!");

      // Wait 2 seconds before redirecting
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Redirect based on account type
      if (accountType === "job_seeker") {
        router.push("/upload");
      } else if (accountType === "recruiter") {
        router.push("/recruiter/company/create"); // Updated redirect URL
      }
    } catch (err) {
      setLoading(false);
      if (err.name === "AbortError") {
        setError("Request timed out. Please check your internet connection and try again.");
      } else if (err.message.includes("Failed to fetch")) {
        setError("Unable to reach the server. Please check your internet connection or try again later.");
      } else {
        setError(err.message);
        if (err.message.includes("Unauthorized")) {
          router.push("/login?callbackUrl=/accountType");
        }
      }
    }
  };

  const handleJobSeekerClick = () => {
    if (!loading) {
      handleAccountTypeSelection("job_seeker");
    }
  };

  const handleEmployerClick = () => {
    if (!loading) {
      handleAccountTypeSelection("recruiter");
    }
  };

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

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-120px)]">
        <Loader />
      </div>
    );
  }

  return (
    <main className="container flex flex-col items-center justify-center min-h-[calc(100vh-120px)] max-w-4xl mx-auto p-3 rounded-lg">
      {loading && <Loader />}

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

      {success && (
        <motion.div
          className="p-4 border shadow-lg bg-green-50 rounded-lg mb-5 text-center border-l-4 border-l-green-400 shadow-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-green-600">{success}</p>
        </motion.div>
      )}

      {error && (
        <motion.div
          className="p-4 border shadow-lg bg-red-50 rounded-lg mb-5 text-center border-l-4 border-l-red-400 shadow-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-red-600">{error}</p>
        </motion.div>
      )}

      <div className="flex flex-col md:flex-row gap-6 w-full max-w-2xl">
        <motion.div
          custom={0}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover={!loading ? "hover" : ""}
          onClick={handleJobSeekerClick}
          className={`flex-1 p-6 bg-gradient-to-br from-blue-50 to-blue-100 border border-gray-200 rounded-lg cursor-pointer flex flex-col items-center ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
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
          whileHover={!loading ? "hover" : ""}
          onClick={handleEmployerClick}
          className={`flex-1 p-6 bg-gradient-to-br from-blue-50 to-blue-100 border border-gray-200 rounded-lg cursor-pointer flex flex-col items-center ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
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