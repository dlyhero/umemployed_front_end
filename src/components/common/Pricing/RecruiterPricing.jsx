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
  const [loadingTier, setLoadingTier] = useState(null); // Track which tier button is loading
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const scrollRef = useRef(null);
  const { data: session, status } = useSession();

  useEffect(() => {
    console.log('Session:', session);
    console.log('Status:', status);
    if (scrollRef.current) {
      const cardWidth = 256;
      const containerWidth = scrollRef.current.offsetWidth;
      const scrollPosition = cardWidth - (containerWidth - cardWidth) / 2;
      scrollRef.current.scrollTo({ left: scrollPosition, behavior: 'smooth' });
    }
  }, [session, status]);

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      if (status === 'authenticated' && session?.user?.user_id && session?.accessToken) {
        try {
          console.log('Fetching subscription status for user:', session.user.user_id);
          const statusResponse = await checkSubscriptionStatus(
            session.user.user_id,
            'recruiter', // Lowercase
            session.accessToken
          );
          console.log('Subscription status response:', statusResponse);
          setSubscriptionStatus(statusResponse);
        } catch (error) {
          console.error('Failed to fetch subscription status:', error);
          toast.error('Failed to check subscription status');
        }
      } else {
        console.log('Cannot fetch subscription status - Session:', session, 'Status:', status);
      }
    };
    fetchSubscriptionStatus();
  }, [session, status]);

  const handleSubscribe = useCallback(async (tier) => {
    if (status !== 'authenticated' || !session?.user?.user_id || !session?.accessToken) {
      console.log('Subscription attempt failed - Session:', session, 'Status:', status);
      toast.error('Please sign in to subscribe.');
      return;
    }

    setLoadingTier(tier);
    try {
      console.log('Checking subscription status before subscribing:', session.user.user_id);
      const statusResponse = await checkSubscriptionStatus(
        session.user.user_id,
        'recruiter', // Lowercase
        session.accessToken
      );

      if (statusResponse.has_active_subscription) {
        toast.error('You already have an active subscription.');
        return;
      }

      console.log('Creating subscription for tier:', tier);
      const sessionId = await subscribeToPlan(tier, 'recruiter', session.accessToken); // Lowercase user_type

      console.log('Redirecting to Stripe Checkout with sessionId:', sessionId);
      const stripe = await getStripe();
      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Subscription error:', error);
      const errorMessage = error.message || 'Failed to process subscription. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoadingTier(null);
    }
  }, [session, status]);

  const handleCancelSubscription = useCallback(async () => {
    if (status !== 'authenticated' || !session?.accessToken) {
      console.log('Cancel attempt failed - Session:', session, 'Status:', status);
      toast.error('Please sign in to cancel your subscription.');
      return;
    }

    setLoadingTier('cancel');
    try {
      console.log('Canceling subscription for user:', session.user.user_id);
      await cancelSubscription('recruiter', session.accessToken); // Lowercase user_type
      toast.success('Subscription canceled successfully.');
      setSubscriptionStatus(null);
    } catch (error) {
      console.error('Cancel subscription error:', error);
      const errorMessage = error.message || 'Failed to cancel subscription';
      toast.error(errorMessage);
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
            Current Plan: <span className="font-bold">{subscriptionStatus.tier}</span>
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
            monthlyPrice: 25,
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
              actionLabel={plan.title === 'Custom' ? 'Contact Sales' : 'Get Started'}
              onAction={() => plan.title !== 'Custom' && handleSubscribe(plan.title.toLowerCase())}
              isLoading={loadingTier === plan.title.toLowerCase()}
              isActive={subscriptionStatus?.has_active_subscription && subscriptionStatus.tier.toLowerCase() === plan.title.toLowerCase()}
            />
          </div>
        ))}
      </section>
    </div>
  );
};

export default RecruiterPricing;