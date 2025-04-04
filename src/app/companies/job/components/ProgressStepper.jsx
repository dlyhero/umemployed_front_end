// /job/components/ProgressStepper.jsx
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const ProgressStepper = ({ currentStep, totalSteps }) => {
  const progress = (currentStep / (totalSteps - 1)) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div className="relative h-2 bg-gray-200 rounded-full">
        <motion.div
          className="absolute h-2 bg-brand rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
      <div className="flex justify-between mt-2">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <span
            key={index}
            className={cn(
              "text-sm",
              currentStep >= index ? "text-brand" : "text-gray-400"
            )}
          >
            Step {index + 1}
          </span>
        ))}
      </div>
    </div>
  );
};