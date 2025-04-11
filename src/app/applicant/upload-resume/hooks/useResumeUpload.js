import { useState } from "react";
import axios from "axios";

export const useResumeUpload = () => {
  const [fileName, setFileName] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (event) => {
    if (event.target.files.length > 0) {
      startUpload(event.target.files[0]);
    }
  };

  const startUpload = async (file) => {
    setFileName(file.name);
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // Simulate upload progress (replace with actual API call)
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

      const formData = new FormData();
      formData.append('resume', file);
      const response = await axios.post(
        'https://umemployed-app-afec951f7ec7.herokuapp.com/api/resume/upload-resume/',
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(progress);
          }
        }
      );
      setIsUploading(false);
      return response.data;
    } catch (error) {
      console.error("Upload error:", error);
      setIsUploading(false);
      setUploadProgress(0);
      throw error;
    }
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

  return {
    fileName,
    isDragging,
    uploadProgress,
    isUploading,
    handleFileChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    startUpload
  };
};