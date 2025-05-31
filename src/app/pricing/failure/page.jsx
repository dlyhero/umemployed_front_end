'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';

const FailurePage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (status === 'authenticated') {
      toast.error('Payment failed or was canceled. Please try again.', {
        position: 'top-right',
      });
    } else if (status === 'unauthenticated') {
      toast.error('Please sign in to continue.', {
        position: 'top-right',
      });
      router.push('/auth/signin');
    }
  }, [status, router]);

  const handleTryAgain = () => {
    setIsLoading(true);
    router.push('/pricing');
  };

  if (status === 'loading') {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 py-8">
      <Toaster />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="text-red-500 text-6xl mb-4"
        >
          ✕
        </motion.div>
        <h1 className="text-2xl font-bold text-brand mb-2">Payment Failed</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Something went wrong with your payment. Don’t worry, you haven’t been charged. Please try again or contact support.
        </p>
        <Button
          onClick={handleTryAgain}
          disabled={isLoading}
          className="bg-brand text-white hover:bg-brand-dark"
        >
          {isLoading ? 'Loading...' : 'Try Again'}
        </Button>
      </motion.div>
    </div>
  );
};

export default FailurePage;