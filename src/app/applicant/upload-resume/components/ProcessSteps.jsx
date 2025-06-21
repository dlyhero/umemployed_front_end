import { motion } from "framer-motion";
import { Clock, UploadCloud, FileText, CheckCircle } from "lucide-react";

export const ProcessSteps = () => {
  const steps = [
    { 
      icon: <UploadCloud className="w-5 h-5 text-brand" />,
      title: "Instant Upload",
      description: "We'll process your resume in under 60 seconds"
    },
    { 
      icon: <FileText className="w-5 h-5 text-brand" />,
      title: "Smart Extraction",
      description: "AI-powered parsing of your skills and experience"
    },
    { 
      icon: <CheckCircle className="w-5 h-5 text-brand" />,
      title: "Profile Review",
      description: "Verify and enhance your automatically filled profile"
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="bg-gray-50 p-6 rounded-xl border border-gray-200"
    >
      <h3 className="text-lg font-medium mb-6 flex items-center gap-2">
        <Clock className="w-5 h-5 text-brand" />
        What happens next?
      </h3>
      
      <div className="space-y-6">
        {steps.map((step, index) => (
          <motion.div 
            key={index}
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            transition={{ delay: index * 0.1 + 0.4 }}
            className="flex gap-4"
          >
            <div className="flex-shrink-0 mt-1">{step.icon}</div>
            <div>
              <h4 className="font-medium">{step.title}</h4>
              <p className="text-gray-600 text-sm">{step.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};