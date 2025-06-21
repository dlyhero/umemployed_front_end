"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StarRating from "../../components/rate-candidate/StarRating";
import EndorsementForm from "../../components/rate-candidate/EndorsementForm";
import SidebarLinks from "../../components/rate-candidate/SidebarLinks";
import SidebarWhyEndorse from "../../components/rate-candidate/SidebarWhyEndorse";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";

export default function RateCandidatePage() {
  const { candidateId } = useParams();
  const [rating, setRating] = useState(null);
  const [showEndorsement, setShowEndorsement] = useState(false);

  console.log("Candidate ID in RateCandidatePage:", candidateId);

  const handleRating = (value) => {
    setRating(value);
  };

  const handleProceed = () => {
    setShowEndorsement(true);
  };

  return (
    <main className="min-h-screen flex flex-col items-center p-4 bg-gray-50">
      <div className="max-w-6xl w-full">
        <AnimatePresence mode="wait">
          {!showEndorsement ? (
            <motion.div
              key="star-rating"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center flex flex-col items-center justify-center min-h-[60vh]"
            >
              <h1 className="text-3xl font-semibold text-brand mb-6">
                Rate the Candidate
              </h1>
              <StarRating rating={rating} onRatingChange={handleRating} />
              <Button
                onClick={handleProceed}
                disabled={!rating}
                className={`mt-6 py-3 px-6 rounded-full font-semibold transition-colors ${
                  rating
                    ? "bg-brand text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Proceed
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="endorsement"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col lg:flex-row gap-8 my-8"
            >
              <SidebarLinks />
              <EndorsementForm candidateId={candidateId} stars={rating} />
              <SidebarWhyEndorse />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}