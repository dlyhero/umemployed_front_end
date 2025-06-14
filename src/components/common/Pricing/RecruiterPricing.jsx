'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import PricingCard from './PricingCard';
import { subscribeToPlan, checkSubscriptionStatus, cancelSubscription } from '@/lib/api/recruiter_subscribe';
import getStripe from '../../../utils/stripe';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';

const PricingHeader = ({ title, subtitle }) => (
  <motion.section
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="text-center mb-8"
  >
    <h2 className="text-3xl font-bold text-brand">{title}</h2>
    <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">{subtitle}</p>
  </motion.section>
);

const RecruiterPricing = () => {
  const [loadingTier, setLoadingTier] = useState(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const scrollRef = useRef(null);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (scrollRef.current) {
      const cardWidth = 256;
      const containerWidth = scrollRef.current.offsetWidth;
      const scrollPosition = cardWidth - (containerWidth - cardWidth) / 2;
      scrollRef.current.scrollTo({ left: scrollPosition, behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      if (status === 'authenticated' && session?.user?.user_id && session?.accessToken) {
        try {
          const statusResponse = await checkSubscriptionStatus(
            session.user.user_id,
            'recruiter',
            session.accessToken
          );
          setSubscriptionStatus(statusResponse);
        } catch (error) {
          console.error('Failed to fetch subscription status:', error);
          setSubscriptionStatus({ has_active_subscription: false, error: 'Failed to check subscription status' });
          toast.error('Failed to check subscription status');
        }
      }
    };
    fetchSubscriptionStatus();
  }, [session, status]);

  const handleSubscribe = useCallback(async (tier) => {
    if (status !== 'authenticated' || !session?.user?.user_id || !session?.accessToken) {
      toast.error('Please sign in to subscribe.');
      return;
    }

    setLoadingTier(tier);
    try {
      const statusResponse = await checkSubscriptionStatus(
        session.user.user_id,
        'recruiter',
        session.accessToken
      );

      if (statusResponse.has_active_subscription) {
        toast.error(`You are already subscribed to the ${statusResponse.tier} plan.`);
        return;
      }

      const sessionId = await subscribeToPlan(tier, 'recruiter', session.accessToken);
      if (sessionId) {
        const stripe = await getStripe();
        const { error } = await stripe.redirectToCheckout({ sessionId });

        if (error) {
          throw new Error(error.message);
        }
      } else {
        toast.success(`Successfully subscribed to the ${tier} plan.`);
        setSubscriptionStatus({ has_active_subscription: true, tier });
      }
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error(error.message || 'Failed to process subscription. Please try again.');
    } finally {
      setLoadingTier(null);
    }
  }, [session, status]);

  const handleCancelSubscription = useCallback(async () => {
    if (status !== 'authenticated' || !session?.accessToken) {
      toast.error('Please sign in to cancel your subscription.');
      return;
    }

    setLoadingTier('cancel');
    try {
      await cancelSubscription('recruiter', session.accessToken);
      toast.success('Subscription canceled successfully.');
      setSubscriptionStatus({ has_active_subscription: false });
    } catch (error) {
      console.error('Cancel subscription error:', error);
      toast.error(error.message || 'Failed to cancel subscription');
    } finally {
      setLoadingTier(null);
    }
  }, [session, status]);

  if (status === 'loading') {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (status === 'unauthenticated') {
    return <div className="text-center py-8">Please sign in to view pricing.</div>;
  }

  return (
    <div className="py-8">
      <Toaster position="top-right" />
      <PricingHeader
        title="Pricing for Recruiters"
        subtitle="Choose the plan that fits your hiring needs"
      />
      {subscriptionStatus?.has_active_subscription && (
        <div className="text-center mb-8">
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Current Plan: <span className="font-bold">{subscriptionStatus.tier.charAt(0).toUpperCase() + subscriptionStatus.tier.slice(1)}</span>
          </p>
          <Button
            className="mt-4 bg-red-500 text-white hover:bg-red-600"
            onClick={handleCancelSubscription}
            disabled={loadingTier === 'cancel'}
          >
            {loadingTier === 'cancel' ? 'Processing...' : 'Cancel Subscription'}
          </Button>
        </div>
      )}
      {!subscriptionStatus?.has_active_subscription && (
        <div className="text-center mb-8">
          <p className="text-lg text-gray-600 dark:text-gray-300">
            No active subscription. Please choose a plan to start posting jobs.
          </p>
        </div>
      )}
      <section
        ref={scrollRef}
        className="flex sm:flex-wrap justify-start gap-6 px-4 overflow-x-auto no-scrollbar snap-x snap-mandatory sm:flex-row sm:overflow-x-visible sm:justify-center sm:px-0"
      >
        {[
          {
            title: 'Basic',
            monthlyPrice: 0,
            description: 'Get started with job postings',
            features: [
              { text: 'Post 1 job per day', available: true },
              { text: 'AI tailored job description', available: false },
              { text: 'Free endorsement for shortlisted candidates', available: false },
            ],
            actionLabel: 'Get Started',
            userType: 'Recruiter',
          },
          {
            title: 'Standard',
            monthlyPrice: 10,
            description: 'Ideal for small hiring teams',
            features: [
              { text: 'Post 5 jobs per day', available: true },
              { text: 'Cancel anytime', available: true },
              { text: 'AI tailored job description', available: false },
              { text: 'Free endorsement for shortlisted candidates', available: false },
            ],
            actionLabel: 'Get Started',
            popular: true,
            userType: 'Recruiter',
          },
          {
            title: 'Premium',
            monthlyPrice: 50,
            description: 'Advanced tools for large hiring teams',
            features: [
              { text: 'Post 20 jobs per day', available: true },
              { text: 'AI tailored job description', available: true },
              { text: 'Free endorsement for shortlisted candidates', available: true },
            ],
            actionLabel: 'Get Started',
            userType: 'Recruiter',
          },
          {
            title: 'Custom',
            description: 'Tailored solutions for your needs',
            features: [
              { text: 'Custom job posting limits', available: true },
              { text: 'AI tailored job description', available: true },
              { text: 'Free endorsement for shortlisted candidates', available: true },
            ],
            actionLabel: 'Contact Sales',
            exclusive: true,
            userType: 'Recruiter',
          },
        ].map((plan) => (
          <div key={plan.title} className="snap-center flex-shrink-0 px-2 sm:px-0">
            <PricingCard
              {...plan}
              actionLabel={
                plan.title.toLowerCase() === 'custom'
                  ? 'Contact Sales'
                  : subscriptionStatus?.tier?.toLowerCase() === plan.title.toLowerCase()
                  ? 'Current Plan'
                  : 'Get Started'
              }
              onAction={() => plan.title !== 'Custom' && handleSubscribe(plan.title.toLowerCase())}
              isLoading={loadingTier === plan.title.toLowerCase()}
              isActive={subscriptionStatus?.tier?.toLowerCase() === plan.title.toLowerCase()}
            />
          </div>
        ))}
      </section>
    </div>
  );
};

export default RecruiterPricing;