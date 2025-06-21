"use client";
import { Camera, Edit3, Sparkles, User } from "lucide-react";
import { motion } from "framer-motion";

export function ProfileHeader() {
  return (
    <div className="bg-white rounded-xl  border border-gray-200 p-6 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 opacity-10">
        <Sparkles className="w-24 h-24 text-brand" />
      </div>
      
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        {/* Profile picture with animation */}
        <motion.div 
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="relative"
        >
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-50 to-purple-50 overflow-hidden border-4 border-white shadow-md flex items-center justify-center">
            <User className="w-12 h-12 text-gray-400" />
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md border border-gray-200"
          >
            <Camera className="w-4 h-4 text-brand" />
          </motion.button>
        </motion.div>

        {/* Profile info */}
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              Edit Your Profile
              <span className="text-xs bg-brand/10 text-brand px-2 py-1 rounded-full">
                PRO
              </span>
            </h1>
            <p className="text-gray-500 mt-1">
              Complete your profile to increase visibility by up to 80%
            </p>
            
          
          </motion.div>
        </div>

        {/* Edit button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-4 py-2 bg-brand/10 text-brand rounded-lg font-medium hover:bg-brand/20 transition-colors"
        >
          <Edit3 className="w-4 h-4" />
          Quick Edit
        </motion.button>
      </div>

      {/* Tips section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-6 pt-6 border-t border-gray-100"
      >
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Sparkles className="w-4 h-4 text-brand" />
          </div>
          <div>
            <h3 className="font-medium text-gray-800">Pro Tip</h3>
            <p className="text-sm text-gray-600 mt-1">
              Profiles with complete information receive 3x more views from recruiters. 
              Add your skills, experience, and education to stand out.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}