"use client"
import { useState, useCallback, useRef, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export const useResumeUpload = (token) => {
  const router = useRouter();
  const [fileName, setFileName] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [error, setError] = useState(null);

  const startUploadRef = useRef();

  const resetStates = () => {
    setUploadProgress(0);
    setIsUploading(false);
    setIsProcessing(false);
    setIsComplete(false);
    setFeedback(null);
    setError(null);
  };

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const startUpload = useCallback(async (file) => {
    console.log('[DEBUG] Upload started with token:', token);
    
    if (!token) {
      console.error('[ERROR] No token provided');
      setError("Authentication token is missing");
      return { error: "Authentication token is missing" };
    }

    if (!file) {
      console.error('[ERROR] No file provided');
      setError("No file selected");
      return { error: "No file selected" };
    }

    resetStates();
    
    if (file.size > 5 * 1024 * 1024) {
      console.error('[ERROR] File too large');
      setError("File size exceeds 5MB limit");
      return { error: "File too large" };
    }

    setFileName(file.name);
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('resume', file);  // Changed from 'file' to 'resume' if your API expects that

      // Debug FormData contents
      for (let [key, value] of formData.entries()) {
        console.log(`FormData: ${key} =`, value);
      }

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const uploadPercent = (progressEvent.loaded * 90) / progressEvent.total;
            const progress = Math.min(90, Math.round(uploadPercent));
            setUploadProgress(progress);
            
            if (uploadPercent >= 90 && !isProcessing) {
              setIsProcessing(true);
              const processingInterval = setInterval(() => {
                setUploadProgress(prev => {
                  const newProgress = Math.min(prev + 1, 100);
                  if (newProgress >= 100) {
                    clearInterval(processingInterval);
                  }
                  return newProgress;
                });
              }, 200);
            }
          }
        }
      };

      console.log('[DEBUG] Request config:', config);

      // Add request interceptor for debugging
      const requestInterceptor = axios.interceptors.request.use(request => {
        console.log('[DEBUG] Outgoing request:', request);
        return request;
      });

      const response = await axios.post(
        'https://umemployed-app-afec951f7ec7.herokuapp.com/api/resume/upload-resume/',
        formData,
        config
      );

      // Remove interceptor after request
      axios.interceptors.request.eject(requestInterceptor);

      console.log('[DEBUG] Server response:', response);

      if (response.status === 200) {
        if (!response.data.extracted_text?.trim()) {
          setError("The uploaded file doesn't contain readable text. Please upload a valid CV/Resume document.");
        } else {
          setFeedback("Resume processed successfully. Redirecting...");
          setIsComplete(true);
          
          setTimeout(() => {
            router.push('/applicant/update_profile');
          }, 2000);
        }
      }

      setUploadProgress(100);
      setIsProcessing(false);
      
      return { 
        success: true,
        data: response.data
      };

    } catch (error) {
      console.error('[ERROR] Upload failed:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.config?.headers
      });

      resetStates();
      
      let errorMessage = "Upload failed";
      if (error.response) {
        errorMessage = error.response.data?.message || 
                      error.response.data?.error ||
                      error.response.statusText;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      return { 
        success: false,
        error: errorMessage 
      };
    } finally {
      setTimeout(() => setIsUploading(false), 500);
    }
  }, [token, router, isProcessing]);

  useEffect(() => {
    startUploadRef.current = startUpload;
  }, [startUpload]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.length > 0) {
      startUploadRef.current?.(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileChange = useCallback((event) => {
    if (event.target.files?.length > 0) {
      startUploadRef.current?.(event.target.files[0]);
    }
  }, []);

  return {
    fileName,
    isDragging,
    uploadProgress,
    isUploading,
    isProcessing,
    isComplete,
    error,
    feedback,
    handleFileChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    startUpload
  };
};