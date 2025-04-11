import { motion } from "framer-motion";
import { UploadCloud, FileText, ArrowRight, Loader2 } from "lucide-react";

export const FileUpload = ({
  fileName,
  isDragging,
  isUploading,
  handleFileChange,
  handleDragOver,
  handleDragLeave,
  handleDrop
}) => (
  <motion.div 
    initial={{ scale: 1 }}
    animate={{ scale: isDragging ? 1.02 : 1 }}
    className="bg-white p-6 rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors relative overflow-hidden shadow-md"
    onDragOver={handleDragOver}
    onDragLeave={handleDragLeave}
    onDrop={handleDrop}
  >
    <div className="absolute -left-5 -bottom-5 w-20 h-20 bg-blue-200 rounded-full opacity-10"></div>
    <form className="h-full flex flex-col relative z-10">
      <label 
        htmlFor="input-file" 
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
            <Loader2 className="w-12 h-12 text-brand animate-spin" />
          ) : (
            <UploadCloud className={`w-12 h-12 ${isDragging ? 'text-brand' : 'text-gray-400'} transition-colors`} />
          )}
        </motion.div>
        
        <h3 className="text-lg font-medium mb-2 text-center">
          {isUploading ? "Processing your resume..." : (isDragging ? "Drop your resume here" : "Upload your resume")}
        </h3>
        <p className="text-gray-500 text-center mb-4">
          {isUploading ? "Extracting your information..." : (isDragging ? "Release to upload" : "PDF, DOC, DOCX (Max 5MB)")}
        </p>
        
        <div className="w-full bg-blue-50 px-4 py-2 rounded-lg mb-6">
          {fileName ? (
            <p className="text-brand font-medium flex items-center gap-2 truncate">
              <FileText className="w-4 h-4 flex-shrink-0" /> 
              <span className="truncate">{fileName}</span>
            </p>
          ) : (
            <p className="text-gray-500">No file selected</p>
          )}
        </div>
        
        <input 
          id="input-file" 
          type="file" 
          name="file" 
          className="hidden" 
          onChange={handleFileChange} 
          accept=".pdf,.doc,.docx"
        />
        
        {!isUploading && (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            className="px-6 py-2 bg-brand text-white rounded-full font-medium flex items-center gap-2"
          >
            Browse Files
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        )}
      </label>
    </form>
  </motion.div>
);