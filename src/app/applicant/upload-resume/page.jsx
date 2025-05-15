'use client';
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import Footer from "@/src/components/common/Footer/Footer";
import { useResumeUpload } from "./hooks/useResumeUpload";
import { HeroSection } from "./components/HeroSection";
import { ManualEntryOption } from "./components/ManualEntryOption";
import { FileUpload } from "./components/FileUpload";
import { ProgressBar } from "./components/ProgressBar";
import { ProcessSteps } from "./components/ProcessSteps";

export default function ResumeUploadPage() {
  const { data: session, status } = useSession();
  const token = session?.accessToken; // Added optional chaining
  const {
    fileName,
    isDragging,
    uploadProgress,
    isUploading,
    error,
    handleFileChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  } = useResumeUpload(token); // Pass token directly

  return (
    <main className="min-h-screen">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl lg:max-w-4xl mx-auto p-6"
      >
        <HeroSection />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <ManualEntryOption />
          
          <FileUpload
            fileName={fileName}
            isDragging={isDragging}
            isUploading={isUploading}
            uploadProgress={uploadProgress}
            error={error}
            handleFileChange={handleFileChange}
            handleDragOver={handleDragOver}
            handleDragLeave={handleDragLeave}
            handleDrop={handleDrop}
          />
        </div>

        <ProgressBar isUploading={isUploading} uploadProgress={uploadProgress} />
        
        <ProcessSteps />
      </motion.div>
      <Footer />
    </main>
  );
}