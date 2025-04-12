// lib/useToast.js
'use client';

import { toast } from 'sonner';

export const useToast = () => {
  return {
    success: (message) => toast.success(message),
    error: (message) => toast.error(message),
    loading: (message) => toast.loading(message),
    custom: (message, options) => toast(message, options),
  };
};