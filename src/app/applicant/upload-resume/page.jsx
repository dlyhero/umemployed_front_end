'use client';
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, User, FileText, Clock, CheckCircle, ArrowRight, SkipForward, Loader2 } from "lucide-react";
import Footer from "@/src/components/common/Footer/Footer";

export default function ResumeUploadPage() {
  const [fileName, setFileName] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (event) => {
    if (event.target.files.length > 0) {
      startUpload(event.target.files[0]);
    }
  };

  const startUpload = (file) => {
    setFileName(file.name);
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsUploading(false), 500);
          return 100;
        }
        return prev + (10 + Math.random() * 15);
      });
    }, 300);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      startUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <main className="bg-white min-h-screen">
      <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl lg:max-w-4xl mx-auto p-6"
    >
      {/* Hero Section */}
      <motion.section 
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="mb-12"
      >
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              repeat: Infinity, 
              repeatType: "reverse", 
              duration: 3 
            }}
          >
            <User className="w-8 h-8 text-brand" strokeWidth={1.5} />
          </motion.div>
          <h1 className="text-xl md:text-2xl text-3xl font-bold bg-gradient-to-r from-brand to-brand/60 bg-clip-text text-transparent">
            Welcome back, <span className="text-gray-800">Angelina!</span>
          </h1>
        </div>
        <p className="text-gray-600 mt-2">Let's complete your profile to unlock all features</p>
      </motion.section>

      {/* Upload Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Manual Entry Option */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100 shadow-md relative overflow-hidden"
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
              href="/resume/update-resume/"
              className="group flex items-center justify-between px-4 py-3 bg-white rounded-lg border border-blue-200 hover:border-blue-400 transition-colors"
            >
              <span className="font-medium text-brand">Enter details manually</span>
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-500 group-hover:text-brand transition-colors">Skip</span>
                <SkipForward className="w-4 h-4 text-gray-500 group-hover:text-brand transition-colors" />
              </div>
            </motion.a>
          </div>
        </motion.div>

        {/* File Upload */}
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
      </div>

      {/* Animated Progress Bar */}
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
                  Upload Progress
                </h3>
                <span className="text-sm font-medium text-brand">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadProgress}%` }}
                  transition={{ type: 'spring', damping: 20 }}
                  className="h-2.5 rounded-full bg-gradient-to-r from-blue-400 to-blue-600"
                />
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-sm text-gray-500">
                <span>Uploading...</span>
                <span className="text-center">Parsing</span>
                <span className="text-right">Validating</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Process Steps */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-md"
      >
        <h3 className="text-lg font-medium mb-6 flex items-center gap-2">
          <Clock className="w-5 h-5 text-brand" />
          What happens next?
        </h3>
        
        <div className="space-y-6">
          {[
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
          ].map((step, index) => (
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
    </motion.div>
    <Footer />
    </main>
  );
}