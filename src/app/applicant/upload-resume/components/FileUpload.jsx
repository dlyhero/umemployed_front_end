import { motion } from "framer-motion";
import { UploadCloud, FileText, ArrowRight, Loader2, XCircle } from "lucide-react";

export const FileUpload = ({
  fileName,
  isDragging,
  isUploading,
  uploadProgress,
  error,
  handleFileChange,
  handleDragOver,
  handleDragLeave,
  handleDrop
}) => (
  <div className="space-y-4">
    <motion.div 
      initial={{ scale: 1 }}
      animate={{ 
        scale: isDragging ? 1.02 : 1,
        borderColor: isDragging ? '#3b82f6' : error ? '#ef4444' : '#e5e7eb'
      }}
      className={`bg-white p-6 rounded-xl border-2 border-dashed hover:border-blue-400 transition-colors relative overflow-hidden shadow-md ${
        error ? 'border-red-500' : 'border-gray-300'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="absolute -left-5 -bottom-5 w-20 h-20 bg-blue-200 rounded-full opacity-10"></div>
      <form className="h-full flex flex-col relative z-10">
        <label 
          htmlFor="resume-upload" 
          className="flex flex-col items-center justify-center h-full cursor-pointer"
        >
          <motion.div
            animate={{ 
              y: isDragging ? [0, -5, 0] : 0,
              scale: isDragging ? 1.05 : 1
            }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            {isUploading ? (
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
            ) : (
              <UploadCloud className={`w-12 h-12 ${
                isDragging ? 'text-blue-500' : 
                error ? 'text-red-500' : 
                'text-gray-400'
              } transition-colors`} />
            )}
          </motion.div>
          
          <h3 className="text-lg font-medium mb-2 text-center">
            {isUploading ? "Uploading..." : 
             isDragging ? "Drop your resume here" : 
             error ? "Upload failed" : "Upload your resume"}
          </h3>
          
          <p className="text-gray-500 text-center mb-4">
            {isUploading ? `${uploadProgress}% complete` : 
             isDragging ? "Release to upload" : 
             error ? "Please try again" : "PDF, DOC, DOCX (Max 5MB)"}
          </p>
          
          <div className={`w-full px-4 py-2 rounded-lg mb-6 ${
            error ? 'bg-red-50' : 'bg-blue-50'
          }`}>
            {fileName ? (
              <p className={`font-medium flex items-center gap-2 truncate ${
                error ? 'text-red-500' : 'text-blue-500'
              }`}>
                <FileText className="w-4 h-4 flex-shrink-0" /> 
                <span className="truncate">{fileName}</span>
              </p>
            ) : (
              <p className={error ? 'text-red-500' : 'text-gray-500'}>
                {error ? 'No file selected' : 'No file selected'}
              </p>
            )}
          </div>
          
          <input 
            id="resume-upload" 
            type="file" 
            name="file" 
            className="hidden" 
            onChange={handleFileChange} 
            accept=".pdf,.doc,.docx"
            disabled={isUploading}
          />
          
          {!isUploading && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="button"
              className={`px-6 py-2 rounded-full font-medium flex items-center gap-2 ${
                error ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
              }`}
            >
              {error ? 'Try Again' : 'Browse Files'}
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          )}
        </label>
      </form>
    </motion.div>

    {error && (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-3 bg-red-50 text-red-600 rounded-lg flex items-start gap-2"
      >
        <XCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-medium">Upload Error</p>
          <p>{error}</p>
        </div>
      </motion.div>
    )}
  </div>
);