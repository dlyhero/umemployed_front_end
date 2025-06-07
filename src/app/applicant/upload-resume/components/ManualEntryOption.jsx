import { motion } from "framer-motion";
import { FileText, SkipForwardIcon } from "lucide-react";

export const ManualEntryOption = () => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100 relative overflow-hidden"
  >
    <div className="absolute -right-10 -top-10 w-32 h-32 bg-blue-200 rounded-full opacity-10"></div>
    <div className="relative z-10 flex flex-col h-full justify-between">
      <div>
        <FileText className="w-10 h-10 text-brand mb-4" strokeWidth={1.5} />
        <h2 className="text-lg md:text-xl font-semibold mb-2">Manual Profile Setup</h2>
        <p className="text-gray-600 mb-6">Build your profile step-by-step without uploading files</p>
      </div>
      <motion.a 
        whileTap={{ scale: 0.95 }}
        href="/applicant/update-profile"
        className="group flex items-center justify-between px-4 py-3 bg-white rounded-lg border border-blue-200 hover:border-blue-400 transition-colors"
      >
        <span className="font-medium text-brand">Enter details manually</span>
        <div className="flex items-center gap-1">
          <span className="text-sm text-gray-500 group-hover:text-brand transition-colors">Skip</span>
          <SkipForwardIcon className="w-4 h-4 text-gray-500 group-hover:text-brand transition-colors" />
        </div>
      </motion.a>
    </div>
  </motion.div>
);