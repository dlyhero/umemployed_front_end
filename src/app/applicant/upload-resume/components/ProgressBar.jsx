import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

export const ProgressBar = ({ isUploading, isProcessing, uploadProgress }) => (
  <AnimatePresence>
    {isUploading && (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        className="mb-12 overflow-hidden"
      >
        <div className="bg-gray-50 p-6 rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-brand" />
              {isProcessing ? "Processing..." : "Upload Progress"}
            </h3>
            <span className="text-sm font-medium text-brand">
              {uploadProgress}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${uploadProgress}%` }}
              transition={{ type: 'tween', ease: 'linear' }}
              className={`h-2.5 rounded-full ${
                isProcessing 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600' 
                  : 'bg-gradient-to-r from-blue-400 to-blue-600'
              }`}
            />
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-sm text-gray-500">
            <span className={!isProcessing ? 'font-medium text-blue-600' : ''}>
              Uploading...
            </span>
            <span className={`text-center ${
              isProcessing ? 'font-medium text-purple-600' : ''
            }`}>
              Processing
            </span>
            <span className="text-right">
              Validating
            </span>
          </div>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);