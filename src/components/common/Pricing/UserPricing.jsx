'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Switch } from '@/components/ui/switch';
import PricingCard from './PricingCard';

const PricingHeader = ({ title, subtitle }) => (
  <motion.section
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="text-center mb-8"
  >
    <h2 className="text-3xl font-bold text-brand">
      {title}
    </h2>
    <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
      {subtitle}
    </p>
  </motion.section>
);

const PricingSwitch = ({ isYearly, setIsYearly }) => (
  <div className="flex justify-center items-center gap-4 mb-8">
    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Monthly</span>
    <Switch
      checked={isYearly}
      onCheckedChange={setIsYearly}
      className="data-[state=checked]:bg-brand"
    />
    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
      Yearly <span className="text-green-600 text-xs">(Save 10%)</span>
    </span>
  </div>
);

const UserPricing = () => {
  const [isYearly, setIsYearly] = useState(false);
  const scrollRef = useRef(null);

  const userPricingTiers = [
    {
      title: 'Basic',
      monthlyPrice: 0,
      yearlyPrice: 0,
      description: 'Essential features for job seekers',
      features: [
        { text: 'Apply to 5 jobs per day', available: true },
        { text: 'AI resume enhancer for shortlisted jobs', available: false },
        { text: 'Top applicant priority for shortlisted jobs', available: false },
      ],
      actionLabel: 'Get Started',
      userType: 'User',
    },
    {
      title: 'Standard',
      monthlyPrice: 10,
      yearlyPrice: 108, // 10% discount: $10 * 12 * 0.9
      description: 'Enhanced access for active job seekers',
      features: [
        { text: 'Apply to 20 jobs per day', available: true },
        { text: 'Cancel anytime', available: true },
        { text: 'AI resume enhancer for shortlisted jobs', available: false },
        { text: 'Top applicant priority for shortlisted jobs', available: false },
      ],
      actionLabel: 'Get Started',
      popular: true,
      userType: 'User',
    },
    {
      title: 'Premium',
      monthlyPrice: 50,
      yearlyPrice: 540, // 10% discount: $50 * 12 * 0.9
      description: 'Unlimited applications with AI enhancements',
      features: [
        { text: 'Unlimited job applications', available: true },
        { text: 'AI resume enhancer for shortlisted jobs', available: true },
        { text: 'Top applicant priority for shortlisted jobs', available: true },
      ],
      actionLabel: 'Get Started',
      userType: 'User',
    },
  ];

  // Center the middle card (Standard) on mount
  useEffect(() => {
    if (scrollRef.current) {
      const cardWidth = 256; // w-64 = 256px
      const containerWidth = scrollRef.current.offsetWidth;
      const scrollPosition = cardWidth - (containerWidth - cardWidth) / 2;
      scrollRef.current.scrollTo({ left: scrollPosition, behavior: 'smooth' });
    }
  }, []);

  return (
    <div className="py-8">
      <PricingHeader
        title="Pricing for Job Seekers"
        subtitle="Choose the plan that fits your job search needs"
      />
      <PricingSwitch isYearly={isYearly} setIsYearly={setIsYearly} />
      <section
        ref={scrollRef}
        className="flex sm:flex-wrap justify-start gap-6 px-4 overflow-x-auto no-scrollbar snap-x snap-mandatory sm:flex-row sm:overflow-x-visible sm:justify-center sm:px-0"
      >
        {userPricingTiers.map((plan, index) => (
          <div key={plan.title} className="snap-center flex-shrink-0 px-2 sm:px-0">
            <PricingCard {...plan} isYearly={isYearly} />
          </div>
        ))}
      </section>
    </div>
  );
};

export default UserPricing;