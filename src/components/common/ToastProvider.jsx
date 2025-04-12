// components/ToastProvider.jsx
'use client';

import { Toaster } from 'sonner';

const ToastProvider = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000, // Default duration
        style: {
          background: '#fff',
          color: '#000',
          border: '1px solid #e5e7eb',
        },
        success: {
          duration: 3000,
          style: {
            background: '#d4edda',
            color: '#155724',
          },
        },
        error: {
          duration: 5000,
          style: {
            background: '#f8d7da',
            color: '#721c24',
          },
        },
      }}
    />
  );
};

export default ToastProvider;