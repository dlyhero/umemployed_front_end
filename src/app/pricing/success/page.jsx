'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { checkSubscriptionStatus } from '@/lib/api/recruiter_subscribe';

const SuccessPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);

  useEffect(() => {
    const verifySubscription = async () => {
      if (status === 'authenticated' && session?.user?.user_id && session?.accessToken) {
        try {
          const statusResponse = await checkSubscriptionStatus(
            session.user.user_id,
            'recruiter',
            session.accessToken
          );
          setSubscriptionStatus(statusResponse);
          if (statusResponse.has_active_subscription) {
            toast.success(`Subscription activated: ${statusResponse.tier} plan!`, {
              position: 'top-right',
            });
          } else {
            toast.error('Subscription not found. Please contact support.', {
              position: 'top-right',
            });
          }
        } catch (error) {
          console.error('Failed to verify subscription:', error);
          toast.error('Failed to verify subscription. Please contact support.', {
            position: 'top-right',
          });
        }
      } else if (status === 'unauthenticated') {
        toast.error('Please sign in to continue.', {
          position: 'top-right',
        });
        router.push('/auth/signin');
      }
    };
    verifySubscription();
  }, [status, session, router]);

  const handleGoToDashboard = () => {
    setIsLoading(true);
    router.push('/dashboard');
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
          className="text-green-500 text-6xl mb-4"
        >
          ✓
        </motion.div>
        <h1 className="text-2xl font-bold text-brand mb-2">Payment Successful</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {subscriptionStatus?.has_active_subscription
            ? `Your ${subscriptionStatus.tier} plan is now active! Start hiring with your new features.`
            : 'Verifying your subscription... If this persists, please contact support.'}
        </p>
        <Button
          onClick={handleGoToDashboard}
          disabled={isLoading}
          className="bg-brand text-white hover:bg-brand-dark"
        >
          {isLoading ? 'Loading...' : 'Go to Dashboard'}
        </Button>
      </motion.div>
    </div>
  );
};

export default SuccessPage;