'use client'
import { useState, useCallback, useRef, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export const useResumeUpload = (token) => {
  const router = useRouter();
  const [state, setState] = useState({
    fileName: "",
    isDragging: false,
    uploadProgress: 0,
    isUploading: false,
    isProcessing: false,
    isComplete: false,
    feedback: null,
    error: null
  });

  const startUploadRef = useRef();

  const resetStates = () => {
    setState(prev => ({
      ...prev,
      uploadProgress: 0,
      isUploading: false,
      isProcessing: false,
      isComplete: false,
      feedback: null,
      error: null
    }));
  };

  const updateState = (updates) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const startUpload = useCallback(async (file) => {
    console.group('[DEBUG] Upload Process');
    
    if (!token) {
      console.error('Authentication token is missing');
      updateState({ error: "Authentication token is missing" });
      console.groupEnd();
      return { error: "Authentication token is missing" };
    }

    if (!file) {
      console.error('No file provided');
      updateState({ error: "No file selected" });
      console.groupEnd();
      return { error: "No file selected" };
    }

    resetStates();
    
    if (file.size > 5 * 1024 * 1024) {
      console.error('File too large');
      updateState({ error: "File size exceeds 5MB limit" });
      console.groupEnd();
      return { error: "File too large" };
    }

    updateState({ 
      fileName: file.name,
      isUploading: true 
    });

    try {
      const formData = new FormData();
      // Changed from 'resume' to 'file' to match backend expectation
      formData.append('file', file);

      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            updateState({ uploadProgress: Math.min(90, progress) });
            
            if (progress >= 90 && !state.isProcessing) {
              updateState({ isProcessing: true });
              const interval = setInterval(() => {
                updateState(prev => {
                  const newProgress = Math.min(prev.uploadProgress + 1, 100);
                  if (newProgress >= 100) clearInterval(interval);
                  return { uploadProgress: newProgress };
                });
              }, 200);
            }
          }
        },
        timeout: 30000
      };

      const response = await axios.post(
        'https://umemployed-app-afec951f7ec7.herokuapp.com/api/resume/upload-resume/',
        formData,
        config
      );

      console.log('Server response:', response);

      if (response.status === 200) {
        if (!response.data?.extracted_text?.trim()) {
          throw new Error("The uploaded file doesn't contain readable text");
        }

        updateState({
          feedback: "Resume processed successfully. Redirecting...",
          isComplete: true,
          uploadProgress: 100,
          isProcessing: false
        });

        const resumeData = encodeURIComponent(JSON.stringify(response.data?.extracted_text));

        
        setTimeout(() => router.push(`/applicant/update_profile?resume_data=${resumeData}`), 2000);
        
        console.groupEnd();
        return { success: true, data: response.data };
      }

      throw new Error("Unexpected response from server");

    } catch (error) {
      console.error('Upload error:', {
        name: error.name,
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config
      });

      let errorMessage = "Upload failed";
      
      if (error.response) {
        errorMessage = error.response.data?.message || 
                      error.response.data?.error ||
                      error.response.statusText ||
                      `Server responded with ${error.response.status}`;
      } else if (error.request) {
        errorMessage = "No response from server";
      } else if (error.message) {
        errorMessage = error.message;
      }

      updateState({ 
        error: errorMessage,
        isUploading: false,
        isProcessing: false
      });

      console.groupEnd();
      return { success: false, error: errorMessage };
    }
  }, [token, router, state.isProcessing]);

  useEffect(() => {
    startUploadRef.current = startUpload;
  }, [startUpload]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    updateState({ isDragging: true });
  }, []);

  const handleDragLeave = useCallback(() => {
    updateState({ isDragging: false });
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    updateState({ isDragging: false });
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
    ...state,
    handleFileChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    startUpload
  };
};