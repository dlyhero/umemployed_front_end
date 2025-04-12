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
  const {
    fileName,
    isDragging,
    uploadProgress,
    isUploading,
    error,
    handleFileChange,
    handleDragOver,
    handleDragLeave,
    handleDrop
  } = useResumeUpload();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please sign in to upload your resume</h2>
          <button 
            onClick={() => signIn()}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-white min-h-screen">
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