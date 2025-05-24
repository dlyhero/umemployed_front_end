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

const RecruiterPricing = () => {
  const [isYearly, setIsYearly] = useState(false);
  const scrollRef = useRef(null);

  const recruiterPricingTiers = [
    {
      title: 'Basic',
      monthlyPrice: 0,
      yearlyPrice: 0,
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
      yearlyPrice: 270, // 10% discount: $25 * 12 * 0.9
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
      yearlyPrice: 540, // 10% discount: $50 * 12 * 0.9
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
        title="Pricing for Recruiters"
        subtitle="Choose the plan that fits your hiring needs"
      />
      <PricingSwitch isYearly={isYearly} setIsYearly={setIsYearly} />
      <section
        ref={scrollRef}
        className="flex sm:flex-wrap justify-start gap-6 px-4 overflow-x-auto no-scrollbar snap-x snap-mandatory sm:flex-row sm:overflow-x-visible sm:justify-center sm:px-0"
      >
        {recruiterPricingTiers.map((plan, index) => (
          <div key={plan.title} className="snap-center flex-shrink-0 px-2 sm:px-0">
            <PricingCard {...plan} isYearly={isYearly} />
          </div>
        ))}
      </section>
    </div>
  );
};

export default RecruiterPricing;