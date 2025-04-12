import { useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

export const useResumeUpload = () => {
  const { data: session } = useSession();
  const [fileName, setFileName] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState(null);

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

  const handleFileChange = (event) => {
    if (event.target.files.length > 0) {
      startUpload(event.target.files[0]);
    }
  };

  const startUpload = async (file) => {
    if (!session?.accessToken) {
      setError("Please login to upload files");
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError("File size exceeds 5MB limit");
      return;
    }

    setFileName(file.name);
    setIsUploading(true);
    setIsComplete(false);
    setUploadProgress(0);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(
        'https://umemployed-app-afec951f7ec7.herokuapp.com/api/resume/upload-resume/',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${session.accessToken}`
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const rawProgress = (progressEvent.loaded * 95) / progressEvent.total;
              const progress = Math.min(100, Math.max(0, Math.round(rawProgress)));
              setUploadProgress(progress);
            }
          }
        }
      );
      
      // Ensure progress shows 100% before completing
      setUploadProgress(100);
      setIsComplete(true);
      setTimeout(() => setIsUploading(false), 500); // Give time for animation
      
      return response.data;
    } catch (error) {
      console.error("Upload error:", error);
      setIsUploading(false);
      setIsComplete(false);
      setUploadProgress(0);
      
      let errorMessage = "Upload failed";
      if (error.response) {
        errorMessage = error.response.data?.message || 
                      error.response.data?.error || 
                      "Server error occurred";
        if (errorMessage.length > 100) {
          errorMessage = errorMessage.substring(0, 100) + "...";
        }
      } else if (error.request) {
        errorMessage = "No response from server";
      }
      
      setError(errorMessage);
      throw error;
    }
  };

  return {
    fileName,
    isDragging,
    uploadProgress,
    isUploading,
    isComplete,
    error,
    handleFileChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    startUpload
  };
};